import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";
import { notifyOwner } from "./_core/notification";
import {
  getLatestVideos,
  getChannelInfo,
  resolveChannelId,
  parseDuration,
  formatViewCount,
} from "./youtube";
import { calculateBazi, type BaziInput } from "./bazi";
import {
  savePushSubscription,
  removePushSubscription,
  sendPushToAll,
  getPushHistory,
  getPushSubscriberCount,
} from "./push";
import {
  createBlogPost,
  createBooking,
  createContact,
  createReaderSubmission,
  createSubscription,
  getAllBlogPosts,
  getAllBookings,
  getAllContacts,
  getAllSubmissions,
  getApprovedSubmissions,
  getApprovedBlogPosts,
  getBlogPostBySlug,
  likeSubmission,
  updateBlogPostStatus,
  updateBookingStatus,
  updateSubmissionStatus,
  getPublishedSubmissions,
  getYoutubeCache,
  setYoutubeCache,
  incrementBlogPostViewCount,
  getRelatedBlogPosts,
  countRelatedBlogPosts,
  getBlogPostFaq,
  updateBlogPostFaq,
  getCommentsBySlug,
  createComment,
  countCommentsBySlug,
  createHostApplication,
  getHostApplications,
  getHostApplicationById,
  updateHostApplicationStatus,
  canUseMysticToday,
  incrementMysticUsage,
  DAILY_FREE_LIMIT,
} from "./db";
import { storagePut } from "./storage";
import { generateFaqForPost } from "./faqHelper";

function generateSlug(title: string): string {
  const timestamp = Date.now();
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base}-${timestamp}`;
}

/** Resolve channel handle to ID, with 24h DB cache */
async function getCachedChannelId(handle: string): Promise<string> {
  const key = `channelId:${handle}`;
  const hit = await getYoutubeCache(key);
  if (hit) return JSON.parse(hit.data) as string;
  const id = await resolveChannelId(handle);
  await setYoutubeCache(key, id, 86400); // 24h
  return id;
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Blog ─────────────────────────────────────────────────────────────────
  blog: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).default(12), offset: z.number().min(0).default(0) }).optional())
      .query(async ({ input }) => {
        const { limit = 12, offset = 0 } = input ?? {};
        return getApprovedBlogPosts(limit, offset);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getBlogPostBySlug(input.slug);
        if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "文章不存在" });
        return post;
      }),

    incrementViewCount: publicProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        await incrementBlogPostViewCount(input.slug);
        return { success: true };
      }),

    submit: publicProcedure
      .input(z.object({
        title: z.string().min(1, "請輸入文章標題").max(255, "標題不得超過 255 個字元"),
        authorName: z.string().min(1, "請輸入你的名字").max(100),
        authorEmail: z.string().email("請輸入有效的電郵地址").optional().or(z.literal("")).transform(v => v || ""),
        authorBio: z.string().max(500).optional(),
        excerpt: z.string().max(500).optional(),
        content: z.string().min(10, "文章內容最少需要 10 個字元"),
        category: z.enum(["relationship", "fengshui", "lifestyle", "interview", "other"]),
        imageUrls: z.array(z.string().url()).max(5).optional(),
        links: z.array(z.object({ title: z.string().max(100), url: z.string().url() })).max(3).optional(),
      }))
      .mutation(async ({ input }) => {
        const slug = generateSlug(input.title);
        const { imageUrls, links, ...rest } = input;
        await createBlogPost({
          ...rest,
          slug,
          status: "approved",
          publishedAt: new Date(),
          images: JSON.stringify(imageUrls ?? []),
          links: JSON.stringify(links ?? []),
        });
        await notifyOwner({
          title: "新嘉賓投稿",
          content: `${input.authorName} 提交了新文章「${input.title}」${imageUrls?.length ? `（含 ${imageUrls.length} 張圖片）` : ""}，已自動發布至嘉賓專欄。`,
        }).catch(() => {});
        // Auto-generate FAQ in background (non-blocking)
        generateFaqForPost({
          slug,
          title: input.title,
          category: input.category,
          excerpt: input.excerpt,
          content: input.content,
        }).catch(() => {});
        return { success: true, slug };
      }),

    uploadImage: publicProcedure
      .input(z.object({
        filename: z.string().max(255),
        contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
        base64: z.string().max(3_000_000), // ~2MB base64
      }))
      .mutation(async ({ input }) => {
        const MAX_BYTES = 2 * 1024 * 1024;
        const buf = Buffer.from(input.base64, "base64");
        if (buf.byteLength > MAX_BYTES) throw new TRPCError({ code: "BAD_REQUEST", message: "圖片大小不得超過 2MB" });
        const ext = input.contentType.split("/")[1];
        const key = `blog-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { url } = await storagePut(key, buf, input.contentType);
        return { url };
      }),

    adminList: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(100).default(50), offset: z.number().min(0).default(0) }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { limit = 50, offset = 0 } = input ?? {};
        return getAllBlogPosts(limit, offset);
      }),

    updateStatus: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(["approved", "rejected"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await updateBlogPostStatus(input.id, input.status);
        // Auto-generate FAQ when admin approves a post
        if (input.status === "approved") {
          const allPosts = await getAllBlogPosts(200, 0);
          const post = allPosts.find(p => p.id === input.id);
          if (post && !post.faq) {
            generateFaqForPost({
              slug: post.slug,
              title: post.title,
              category: post.category,
              excerpt: post.excerpt,
              content: post.content,
            }).catch(() => {});
          }
        }
        return { success: true };
      }),

    getRelated: publicProcedure
      .input(z.object({
        category: z.string(),
        excludeSlug: z.string(),
        limit: z.number().min(1).max(6).default(3),
        offset: z.number().min(0).default(0),
      }))
      .query(async ({ input }) => {
        const [posts, total] = await Promise.all([
          getRelatedBlogPosts(input.category, input.excludeSlug, input.limit, input.offset),
          countRelatedBlogPosts(input.category, input.excludeSlug),
        ]);
        return { posts, total };
      }),

    getFaq: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getBlogPostFaq(input.slug);
      }),

    generateFaq: protectedProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const post = await getBlogPostBySlug(input.slug);
        if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "文章不存在" });

        const categoryLabel: Record<string, string> = {
          relationship: "兩性關係",
          fengshui: "玄學風水",
          lifestyle: "生活態度",
          interview: "嘉賓訪談",
          other: "其他",
        };

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `你係一個香港 SEO 專家，專門為文章生成 FAQ 結構化資料。
請根據文章內容，生成 2-3 個最有可能被香港讀者搜尋的問題及答案。
要求：
1. 問題用繁體中文，語氣自然，貼近香港讀者的搜尋習慣
2. 答案簡潔有力，50-120 字，直接回答問題
3. 問題應涵蓋文章核心主題，有助於 Google AI Overview 及 Perplexity 引用
4. 輸出 JSON 格式`,
            },
            {
              role: "user",
              content: `文章標題：${post.title}
文章分類：${categoryLabel[post.category] || post.category}
文章摘要：${post.excerpt || ""}
文章內容：${post.content.slice(0, 1500)}

請生成 FAQ JSON 陣列，格式如下：
[{"question": "問題一？", "answer": "答案一"}, ...]`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "faq_list",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  faqs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        answer: { type: "string" },
                      },
                      required: ["question", "answer"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["faqs"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices?.[0]?.message?.content;
        if (!content || typeof content !== "string") throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI 生成失敗" });

        const parsed = JSON.parse(content) as { faqs: { question: string; answer: string }[] };
        const faqs = parsed.faqs.slice(0, 3);
        await updateBlogPostFaq(input.slug, faqs);
        return { success: true, faqs };
      }),
  }),

  // ─── Subscriptions ────────────────────────────────────────────────────────
  subscription: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email(), name: z.string().max(100).optional() }))
      .mutation(async ({ input }) => {
        await createSubscription({ email: input.email, name: input.name });
        await notifyOwner({
          title: "新電郵訂閱",
          content: `${input.email}${input.name ? ` (${input.name})` : ""} 訂閱了電子報。`,
        }).catch(() => {});
        return { success: true };
      }),

    adminList: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return getSubscriptions();
    }),
  }),

  // ─── Bookings ─────────────────────────────────────────────────────────────
  booking: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        email: z.string().email(),
        phone: z.string().max(30).optional(),
        serviceType: z.enum(["fengshui", "bazi", "tarot", "spiritual", "course"]),
        preferredDate: z.string().max(20).optional(),
        preferredTime: z.string().max(20).optional(),
        message: z.string().max(1000).optional(),
      }))
      .mutation(async ({ input }) => {
        await createBooking({ ...input, status: "pending" });
        await notifyOwner({
          title: "新服務預約",
          content: `${input.name} (${input.email}) 預約了「${input.serviceType}」服務，日期：${input.preferredDate ?? "待定"}。`,
        }).catch(() => {});
        return { success: true };
      }),

    adminList: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return getAllBookings();
    }),

    updateStatus: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(["confirmed", "cancelled"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await updateBookingStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // ─── Contacts ─────────────────────────────────────────────────────────────
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        email: z.string().email(),
        phone: z.string().max(30).optional(),
        inquiryType: z.enum(["collaboration", "guest", "feedback", "other"]).default("other"),
        subject: z.string().min(1).max(255),
        message: z.string().min(10).max(2000),
      }))
      .mutation(async ({ input }) => {
        await createContact({ ...input });
        await notifyOwner({
          title: "新聯絡查詢",
          content: `${input.name} (${input.email}) 提交了「${input.inquiryType}」查詢：${input.subject}`,
        }).catch(() => {});
        return { success: true };
      }),

    adminList: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return getAllContacts();
      }),
  }),

  // ─── YouTube ──────────────────────────────────────────────────────────────
  // Cache strategy:
  //   - Channel IDs: DB cache 24h (costs 1 unit per resolve)
  //   - Video lists: DB cache 1h (costs ~100 units per fetch)
  //   - On quota error: return stale cache or empty list (no error thrown to client)
  youtube: router({
    getVideos: publicProcedure
      .input(
        z.object({
          channel: z.enum(["podcasts", "fengshui", "all"]).default("all"),
          limit: z.number().min(1).max(50).default(6),
        }).optional()
      )
      .query(async ({ input }) => {
        const channel = input?.channel ?? "all";
        const limit = input?.limit ?? 6;
        const videoCacheKey = `videos:${channel}:${limit}`;

        // 1. Try fresh DB cache
        const cached = await getYoutubeCache(videoCacheKey);
        if (cached) {
          return JSON.parse(cached.data) as { videos: unknown[]; fromCache?: boolean };
        }

        try {
          const [podcastsId, fengshuiId] = await Promise.all([
            getCachedChannelId("6bpodcasts"),
            getCachedChannelId("6bfengshui"),
          ]);

          let result: { videos: unknown[] };

          if (channel === "podcasts") {
            const videos = await getLatestVideos(podcastsId, limit);
            result = { videos: videos.map((v) => ({ ...v, duration: parseDuration(v.duration), viewCount: formatViewCount(v.viewCount) })) };
          } else if (channel === "fengshui") {
            const videos = await getLatestVideos(fengshuiId, limit);
            result = { videos: videos.map((v) => ({ ...v, duration: parseDuration(v.duration), viewCount: formatViewCount(v.viewCount) })) };
          } else {
            const [pVideos, fVideos] = await Promise.all([
              getLatestVideos(podcastsId, limit),
              getLatestVideos(fengshuiId, limit),
            ]);
            const merged = [...pVideos, ...fVideos]
              .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
              .slice(0, limit * 2);
            result = { videos: merged.map((v) => ({ ...v, duration: parseDuration(v.duration), viewCount: formatViewCount(v.viewCount) })) };
          }

          // 2. Store fresh result in DB cache (1h) + stale backup (7 days)
          await Promise.all([
            setYoutubeCache(videoCacheKey, result, 3600),
            setYoutubeCache(videoCacheKey + ":stale", result, 604800),
          ]);
          return result;
        } catch (err) {
          // 3. On quota/network error, return stale cache silently
          const stale = await getYoutubeCache(videoCacheKey + ":stale");
          if (stale) {
            return { ...JSON.parse(stale.data) as { videos: unknown[] }, fromCache: true };
          }
          console.warn("[YouTube] API error, returning empty:", err);
          return { videos: [], fromCache: true };
        }
      }),

    getChannels: publicProcedure.query(async () => {
      const channelsCacheKey = "channels:info";

      // 1. Try fresh DB cache (1h)
      const cached = await getYoutubeCache(channelsCacheKey);
      if (cached) return JSON.parse(cached.data) as { podcasts: unknown; fengshui: unknown };

      try {
        const [podcastsId, fengshuiId] = await Promise.all([
          getCachedChannelId("6bpodcasts"),
          getCachedChannelId("6bfengshui"),
        ]);
        const [podcasts, fengshui] = await Promise.all([
          getChannelInfo(podcastsId),
          getChannelInfo(fengshuiId),
        ]);
        const result = { podcasts, fengshui };
        await Promise.all([
          setYoutubeCache(channelsCacheKey, result, 3600),
          setYoutubeCache(channelsCacheKey + ":stale", result, 604800),
        ]);
        return result;
      } catch (err) {
        const stale = await getYoutubeCache(channelsCacheKey + ":stale");
        if (stale) return JSON.parse(stale.data) as { podcasts: unknown; fengshui: unknown };
        console.warn("[YouTube] getChannels API error:", err);
        return { podcasts: null, fengshui: null };
      }
    }),
  }),

  // ─── Web Push Notifications ─────────────────────────────────────────────
  push: router({
    /** Subscribe to push notifications */
    subscribe: publicProcedure
      .input(z.object({
        endpoint: z.string().url(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
        userAgent: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await savePushSubscription(
          { endpoint: input.endpoint, keys: input.keys },
          ctx.user?.id,
          input.userAgent
        );
        return { success: true };
      }),

    /** Unsubscribe from push notifications */
    unsubscribe: publicProcedure
      .input(z.object({ endpoint: z.string() }))
      .mutation(async ({ input }) => {
        await removePushSubscription(input.endpoint);
        return { success: true };
      }),

    /** Get subscriber count (public) */
    subscriberCount: publicProcedure.query(async () => {
      const count = await getPushSubscriberCount();
      return { count };
    }),

    /** Send push notification to all subscribers (admin only) */
    send: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(100),
        body: z.string().min(1).max(300),
        url: z.string().optional(),
        icon: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Admin only");
        }
        const result = await sendPushToAll(
          { title: input.title, body: input.body, url: input.url, icon: input.icon },
          ctx.user.id
        );
        return result;
      }),

    /** Get push notification history (admin only) */
    history: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") return [];
      return getPushHistory(30);
    }),
  }),

  // ─── Reader Submissions ────────────────────────────────────────────────────────────────────────
  submission: router({
    /** Submit a reader story / question (public) */
    submit: publicProcedure
      .input(z.object({
        nickname: z.string().min(1).max(50),
        category: z.enum(["relationship", "fengshui", "confession", "question", "other"]),
        content: z.string().min(10).max(1000),
        isAnonymous: z.boolean().default(false),
        imageUrls: z.array(z.string().url()).max(5).default([]),
      }))
      .mutation(async ({ input }) => {
        await createReaderSubmission({
          nickname: input.isAnonymous ? "匿名" : input.nickname,
          category: input.category,
          content: input.content,
          isAnonymous: input.isAnonymous,
          images: JSON.stringify(input.imageUrls),
        });
        const imgNote = input.imageUrls.length > 0 ? `（附帶 ${input.imageUrls.length} 張圖片）` : "";
        await notifyOwner({
          title: "📨 新讀者投稿",
          content: `「${input.isAnonymous ? "匿名" : input.nickname}」提交了一則「${input.category}」類別的投稿${imgNote}，請到後台審核。`,
        });
        return { success: true };
      }),

    /** Upload image to S3 (public, returns CDN URL) */
    uploadImage: publicProcedure
      .input(z.object({
        fileName: z.string().min(1).max(255),
        mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
        base64Data: z.string().min(1),
        sizeBytes: z.number().int().positive().max(2 * 1024 * 1024), // 2MB limit
      }))
      .mutation(async ({ input }) => {
        // Decode base64 to buffer
        const buffer = Buffer.from(input.base64Data, "base64");
        if (buffer.byteLength > 2 * 1024 * 1024) {
          throw new Error("圖片大小不能超過 2MB");
        }
        const ext = input.mimeType.split("/")[1] ?? "jpg";
        const randomSuffix = Math.random().toString(36).slice(2, 10);
        const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
        const key = `submissions/${Date.now()}-${randomSuffix}-${safeFileName}.${ext}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        return { url, key };
      }),

    /** List approved submissions (public) */
    listApproved: publicProcedure
      .input(z.object({
        limit: z.number().int().min(1).max(20).default(9),
        offset: z.number().int().min(0).default(0),
      }))
      .query(async ({ input }) => {
        const items = await getApprovedSubmissions(input.limit, input.offset);
        return { items };
      }),

    /** List published submissions (public, by target) */
    listPublished: publicProcedure
      .input(z.object({
        target: z.enum(["home", "blog"]).default("home"),
        limit: z.number().int().min(1).max(20).default(9),
        offset: z.number().int().min(0).default(0),
      }))
      .query(async ({ input }) => {
        const items = await getPublishedSubmissions(input.target, input.limit, input.offset);
        return { items };
      }),

    /** Like a submission (public, optimistic) */
    like: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await likeSubmission(input.id);
        return { success: true };
      }),

    /** Admin: list all submissions */
    adminList: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin only");
      const items = await getAllSubmissions(100);
      return { items };
    }),

    /** Admin: approve, reject, or publish a submission */
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number().int().positive(),
        status: z.enum(["approved", "rejected", "published"]),
        publishTarget: z.enum(["home", "blog"]).optional(),
        adminNote: z.string().max(500).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Admin only");
        await updateSubmissionStatus(input.id, input.status, {
          publishTarget: input.publishTarget,
          adminNote: input.adminNote,
        });
        return { success: true };
      }),
  }),

  // ─── AI Chatbot ────────────────────────────────────────────────────────────────────────
  chatbot: router({
    chat: publicProcedure
      .input(z.object({
        message: z.string().min(1).max(1000),
        history: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).max(20).default([]),
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `你係「路邊電台」同「路邊玄學堂」嘅 AI 助手，名叫「路邊小助」。
你嘅職責係：
1. 用廣東話回答觀眾關於節目內容、玄學知識嘅問題
2. 介紹路邊電台（6B Podcasts）同路邊玄學堂嘅節目內容
3. 回答關於風水、八字命理、塔羅牌、身心靈療癒等玄學問題
4. 推薦相關影片或服務（風水諮詢、命理分析、課程等）
5. 解答關於預約服務、嘉賓投稿、商業合作等問題

關於路邊電台（6B Podcasts）：
- YouTube：https://www.youtube.com/@6bpodcasts（20.6K 訂閱者，486 條影片）
- 主打「香港最真實人物訪談」，涵蓋兩性關係、都市情感、專家對談
- Facebook：https://www.facebook.com/6bpodcasts（16K 追蹤者）
- Instagram：https://www.instagram.com/6bpodcasts
- 每週三、日上架新節目

關於路邊玄學堂（6B Feng Shui）：
- YouTube：https://www.youtube.com/@6bfengshui（1.98K 訂閱者，90 條影片）
- 香港首個廣東話玄學文化頻道
- 涵蓋風水、八字命理、數字玄學、塔羅牌、身心靈療癒

服務預約：可在網站預約風水諮詢、八字命理、塔羅占卜、身心靈療癒、課程報名
商業合作：ktcreativefirm@gmail.com / WhatsApp: +852 9872 9990

請用輕鬆、親切嘅廣東話回答，適當加入玄學知識，並鼓勵用戶訂閱頻道或預約服務。
回答要簡潔，不要超過 200 字。`;

        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...input.history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
          { role: "user" as const, content: input.message },
        ];

        const response = await invokeLLM({ messages });
        const reply = response.choices?.[0]?.message?.content ?? "唔好意思，我而家唔係好明你嘉問題，可以再問清楚啊？";
        return { reply };
      }),
  }),

  // ─── Host Recruitment ────────────────────────────────────────────────────────────────────────────────────
  host: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1, "請輸入名字").max(100),
        interests: z.string().min(1, "請輸入興趣話題"),
        experience: z.string().optional(),
        hostType: z.enum(["host", "co-host", "guest"]),
        introduction: z.string().min(1, "請輸入介紹"),
        longTermInterest: z.boolean().default(false),
        otherShowsInterest: z.string().optional(),
        contactMethod: z.string().min(1, "請輸入聯絡方法").max(255),
        availableTime: z.string().min(1, "請輸入可用時間").max(500),
        // New fields
        availableTimeSlots: z.array(z.object({
          day: z.string(),
          timeSlot: z.string(),
        })).max(14).default([]),
        hostPhotos: z.array(z.string().url()).max(5).default([]),
        acceptCommercial: z.boolean().default(false),
        privacyConsent: z.boolean().refine(v => v === true, "必須同意隱私聲明"),
      }))
      .mutation(async ({ input }) => {
        const app = await createHostApplication({
          name: input.name,
          interests: input.interests,
          experience: input.experience || null,
          hostType: input.hostType,
          introduction: input.introduction,
          longTermInterest: input.longTermInterest,
          otherShowsInterest: input.otherShowsInterest || null,
          contactMethod: input.contactMethod,
          availableTime: input.availableTime,
          availableTimeSlots: JSON.stringify(input.availableTimeSlots),
          hostPhotos: JSON.stringify(input.hostPhotos),
          acceptCommercial: input.acceptCommercial,
          privacyConsent: input.privacyConsent,
          status: "pending",
        });
        // Notify owner of new application
        await notifyOwner({
          title: "🎙️ 新主持招募申請",
          content: `${input.name} 申請成為${input.hostType === "host" ? "主持" : input.hostType === "co-host" ? "共同主持" : "嘉賓"}\n聯絡方法：${input.contactMethod}`,
        });
        return { success: true, id: app.id };
      }),

    adminList: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin only");
      const items = await getHostApplications();
      return { items };
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Admin only");
        const app = await getHostApplicationById(input.id);
        if (!app) throw new Error("Application not found");
        return app;
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number().int().positive(),
        status: z.enum(["pending", "contacted", "rejected", "archived"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Admin only");
        await updateHostApplicationStatus(input.id, input.status);
        return { success: true };
      }),
  }),


  // ─── Mystic ─────────────────────────────────────────────────────────────────────────────────────
  mystic: router({
    // 八字命盤推算（免費）
    calculateBazi: publicProcedure
      .input(z.object({
        name: z.string(),
        gender: z.enum(["male", "female"]),
        year: z.number().int().min(1900).max(2100),
        month: z.number().int().min(1).max(12),
        day: z.number().int().min(1).max(31),
        hour: z.number().int().min(0).max(23),
        minute: z.number().int().min(0).max(59).optional(),
      }))
      .mutation(async ({ input }) => {
        const result = calculateBazi(input as BaziInput);
        return result;
      }),

    // 八字 AI 深度分析（使用 DeepSeek API）
    analyzeBazi: publicProcedure
      .input(z.object({
        baziSummary: z.string(),
        topic: z.enum(["overall", "career", "wealth", "love", "health"]),
      }))
      .mutation(async ({ input }) => {
        const topicMap: Record<string, string> = {
          overall: "整體命格及流年運勢",
          career: "事業運及工作發展",
          wealth: "財運及投資時機",
          love: "感情運及桃花運",
          health: "健康運及注意事項",
        };
        const topicName = topicMap[input.topic];
        const prompt = `你係一位精通八字命理嘅資深玄學師傅，請根據以下八字命盤資料，用廣東話提供詳細嘅${topicName}深度分析：

${input.baziSummary}

請提供約800字嘅深度分析，結構如下：

## 命格總覽
分析日主五行強弱、命格類型（身強/身弱）、格局特點

## ${topicName}詳細解讀
根據四柱天干地支、十神關係、藏干互動，深入分析${topicName}嘅具體表現

## 大運流年影響
分析目前大運對${topicName}嘅影響，以及2026年丙午年嘅具體運勢

## 開運建議
提供3-5個具體實用嘅開運方法，包括：有利顏色、方位、行業、注意事項

## 重點提示
列出3個今年最需要注意嘅事項

語氣要正面積極，用詞淺白易明，提供具體實用嘅建議。最後加入一句簡短免責聲明。`;

        // 優先使用 DeepSeek API
        const deepseekKey = ENV.deepseekApiKey;
        if (deepseekKey) {
          try {
            const dsResponse = await fetch("https://api.deepseek.com/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${deepseekKey}`,
              },
              body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                  { role: "system", content: "你係一位精通八字命理、紫微斗數、奇門遁甲嘅資深玄學師傅，擅長以淺白廣東話解釋命理，提供正面積極嘅人生指引。你嘅分析詳盡、準確、有條理。" },
                  { role: "user", content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 1500,
              }),
            });
            if (dsResponse.ok) {
              const dsData = await dsResponse.json() as { choices?: Array<{ message?: { content?: string } }> };
              const analysis = dsData.choices?.[0]?.message?.content || "分析生成失敗，請稍後再試。";
              return { analysis };
            }
          } catch {
            // Fallback to built-in LLM
          }
        }

        // Fallback: 使用內建 LLM
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "你係一位精通八字命理嘅資深玄學師傅，擅長以淺白廣東話解釋八字命理，提供正面積極嘅人生指引。" },
            { role: "user", content: prompt },
          ],
        });
        const analysis = response.choices?.[0]?.message?.content || "分析生成失敗，請稍後再試。";
        return { analysis };
      }),

    generateReport: publicProcedure
      .input(z.object({
        name: z.string().optional(),
        year: z.number().int(),
        month: z.number().int(),
        day: z.number().int(),
        hour: z.string().optional(),
        gender: z.enum(["male", "female"]),
        method: z.string(),
        topics: z.array(z.string()),
      }))
      .mutation(async ({ input }) => {
        const methodNames: Record<string, string> = {
          ziwei: "紫微斗數", qimen: "奇門遁甲", bazi: "八字命理", meihua: "梅花易數",
          fengshui: "風水流年", naming: "姓名學", astrology: "星座占星",
          numerology: "生命靈數", tarot: "塔羅牌", humandesign: "人類圖",
          "western-annual": "西洋占星流年", moon: "月亮星座分析",
        };
        const topicNames: Record<string, string> = {
          annual: "流年總運", career: "事業運", wealth: "財運", love: "感情運",
          family: "家庭運", health: "健康運", lucky: "貴人運", tips: "開運建議",
        };
        const method = methodNames[input.method] || input.method;
        const topics = input.topics.map((t) => topicNames[t] || t).join("、");
        const genderStr = input.gender === "male" ? "男" : "女";
        const birthInfo = `${input.year}年${input.month}月${input.day}日，${genderStr}性${input.hour ? `，${input.hour}出生` : ""}`;

        // Method-specific system prompts for more authentic, less AI-like responses
        const systemPrompts: Record<string, string> = {
          tarot: "你係一位有二十年經驗嘅塔羅師傅，解牌風格細膩有畫面感，唔會用罐頭句子，每次解讀都係獨一無二嘅故事。你嘅語言係廣東話，直接、真實，有時會講到令人雞皮疙瘩嘅細節。如果有唔好嘅跡象，你會直接講，唔會淨係講好聽嘅說話。",
          astrology: "你係一位擁有英國占星學院認證嘅占星師，精通本命盤、流年推運及人際合盤。你嘅解讀唔係泛泛而談，係按照真實星象位置分析，會指出具體月份嘅行星移動如何影響當事人。用廣東話解說，語氣專業但親切，唔會用過多術語。",
          numerology: "你係一位深研生命靈數超過十五年嘅靈數導師，熟悉 Pythagorean 及 Chaldean 兩套系統。你嘅分析唔只係講靈數係幾號，而係深入探討業力課題、靈魂課題同今生使命。用廣東話，語氣溫柔但直接，唔會迴避困難嘅課題。",
          humandesign: "你係一位人類圖分析師，熟悉九大能量中心、四種類型、六條爻線及十三個閘門。你嘅解讀會結合當事人嘅出生資料推算能量類型，指出策略同權威，幫助佢哋做出正確決定。用廣東話，語氣清晰，避免過多術語。",
          "western-annual": "你係一位精通太陽回歸盤及行運占星嘅占星師，擅長按月份分析流年星象。你嘅解讀係按照真實行星移動，指出每個季度嘅機遇同挑戰，唔係籠統嘅吉凶預測。用廣東話，語氣直接，提供可執行嘅建議。",
          moon: "你係一位月亮星座情感分析師，深諳月亮星座如何影響一個人嘅情感模式、安全感需求同親密關係。你嘅解讀會揭示當事人嘅情感底層邏輯，解釋點解佢哋會有某些感情模式。用廣東話，語氣溫柔細膩，有畫面感。",
        };

        const systemPrompt = systemPrompts[input.method] ||
          "你係一位精通中西玄學嘅師傅，擅長以廣東話解釋玄學概念，提供真實、有深度嘅人生指引。唔好用罐頭句子，每個分析都要針對當事人嘅具體情況，如有唔好嘅方面也要直接指出。";

        // Method-specific prompt templates
        const methodPrompts: Record<string, string> = {
          tarot: `請以塔羅師傅嘅角色，為以下人士進行流年塔羅解讀：

出生資料：${birthInfo}
分析範疇：${topics}

請用抽牌嘅形式解讀，為每個範疇各抽一張主牌，描述牌面畫面、象徵意義，再連結到當事人嘅現實情況。語言要有畫面感、情緒細膩，唔好用「此牌代表...」呢種罐頭句式。如有逆位牌或挑戰性牌面，直接說明需要注意嘅地方。約400字。最後加一句：本解讀只供靈性參考，重大決定請自行判斷。`,
          astrology: `請以占星師嘅角色，為以下人士進行流年占星分析：

出生資料：${birthInfo}
分析範疇：${topics}

請按照2026年主要行星移動（木星、土星、天王星）分析對當事人嘅影響，指出具體月份嘅機遇同挑戰。唔好只講「運勢不錯」，要說明係哪個行星進入哪個宮位帶來咩影響。約400字。最後加一句：本分析只供參考，未來由你自己創造。`,
          numerology: `請以生命靈數導師嘅角色，為以下人士進行靈數分析：

出生資料：${birthInfo}
分析範疇：${topics}

請計算生命靈數、個人年數及靈魂衝動數，分析今年嘅業力課題同靈魂課題。唔好只係講靈數係幾號，要深入探討今年嘅核心功課係乜，以及如何透過了解自己嘅靈數模式改善各範疇運勢。約400字。最後加一句：靈數係工具，唔係命運。`,
        };

        const userPrompt = methodPrompts[input.method] ||
          `請以精通${method}嘅師傅角色，為以下人士提供深入分析：

出生資料：${birthInfo}
分析範疇：${topics}

分析要求：
1. 唔好用罐頭句子，每個分析都要針對當事人嘅具體情況
2. 如有唔好嘅方面，直接指出，唔好淨係講好聽嘅說話
3. 提供具體、可執行嘅建議，唔係泛泛而談
4. 語氣真實自然，像一位有經驗嘅師傅在傾談
5. 約400字

最後加一句：本分析只供娛樂參考，並不構成任何重大決策建議。`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });
        const report = response.choices?.[0]?.message?.content || "分析生成失敗，請稍後再試。";
        return { report };
      }),

    // ─── Akashic Records ─────────────────────────────────────────────────────
    akashicReading: publicProcedure
      .input(z.object({
        personA: z.object({
          name: z.string().min(1, "請輸入姓名"),
          year: z.number().int(),
          month: z.number().int(),
          day: z.number().int(),
        }),
        personB: z.object({
          name: z.string().min(1, "請輸入姓名"),
          year: z.number().int(),
          month: z.number().int(),
          day: z.number().int(),
        }).optional(),
        readingType: z.enum(["pastLife", "soulAge", "soulMate", "energyField", "yearEnergy"]),
      }))
      .mutation(async ({ input }) => {
        const { personA, personB, readingType } = input;
        const birthA = `${personA.year}年${personA.month}月${personA.day}日`;

        const systemPrompt = `你係一位阿卡西紀錄解讀師兼靈魂契約分析師，有超過二十年嘅靈性解讀經驗。
你嘅解讀風格：溫柔細膩、具有畫面感、情緒豐富，像小說一樣有場景描述。
你唔會用「根據阿卡西紀錄顯示...」呢種罐頭句式，而係直接帶入場景，讓當事人感受到畫面。
你嘅廣東話自然流暢，有時會用到一啲詩意嘅比喻。
重要：唔好預設帳號主人就係被分析嘅對象，嚴格按照提供嘅資料分析。`;

        let userPrompt = "";

        if (readingType === "pastLife") {
          userPrompt = `請為以下人士進行阿卡西紀錄前世今生解讀：

姓名：${personA.name}
出生日期：${birthA}

請提供三段前世解讀，每段包括：
1. 前世嘅地點、時代同身分（要具體，唔好太抽象）
2. 當時嘅性格同重要關係
3. 未完成嘅課題或遺憾

最後連結到今生：呢三段前世如何塑造咗 ${personA.name} 今生嘅性格、天賦同業力課題。

語言要有畫面感，像在描述一個故事，約500字。`;
        } else if (readingType === "soulAge") {
          userPrompt = `請為以下人士分析靈魂年齡同靈魂類型：

姓名：${personA.name}
出生日期：${birthA}

請分析：
1. 靈魂年齡：係老靈魂、中年靈魂定係年輕靈魂？有幾多個輪迴？
2. 靈魂類型：療癒者、戰士、學者、創造者、服務者定係其他？
3. 今生嘅核心靈魂課題係乜？
4. ${personA.name} 容易吸引乜嘢類型嘅人事物？
5. 靈魂嘅天賦同使命

語言要有深度同畫面感，約400字。`;
        } else if (readingType === "soulMate" && personB) {
          const birthB = `${personB.year}年${personB.month}月${personB.day}日`;
          userPrompt = `請勿帶入過往任何談論經驗，也不要預設帳號主人。

請為以下兩人進行阿卡西紀錄靈魂伴侶解讀：

人物 A：${personA.name}，出生日期：${birthA}
人物 B：${personB.name}，出生日期：${birthB}

請分析：
1. 兩人嘅靈魂特質同能量
2. 前世係咪有相遇過？係乜嘢關係？
3. 前世留低咗乜嘢遺憾或約定？
4. 今生再次相遇嘅原因
5. 兩人之間嘅業力、課題同吸引力來源
6. 係靈魂伴侶、雙生火焰定係短暫緣分？
7. 兩人感情中嘅拉扯、思念同命定感來源
8. 呢段關係最需要學會嘅事
9. 最後給兩人嘅靈魂訊息

請用像小說般、有畫面感、情緒細膩嘅方式呈現，約600字。`;
        } else if (readingType === "energyField") {
          userPrompt = `請為以下人士分析能量磁場同補充建議：

姓名：${personA.name}
出生日期：${birthA}

請分析：
1. 目前嘅能量狀態（係高頻定低頻？有冇能量阻塞？）
2. 最需要補充嘅能量類型
3. 具體嘅能量補充建議：
   - 適合嘅水晶同使用方法
   - 冥想或靜心練習
   - 適合嘅顏色、香氛或音頻
   - 需要避開嘅人事物
   - 每日可以做嘅小儀式（要實際可執行）

語言要溫柔療癒，有具體可操作嘅建議，約400字。`;
        } else if (readingType === "yearEnergy") {
          userPrompt = `請為以下人士分析2026年下半年嘅能量流年：

姓名：${personA.name}
出生日期：${birthA}

請按月份或季度分析：
1. 7-8月：能量主題同重點事件
2. 9-10月：能量主題同重點事件
3. 11-12月：能量主題同重點事件

同時分析：
- 事業同財運嘅高低點
- 感情能量嘅走向
- 健康能量需要注意嘅地方
- 下半年最重要嘅靈魂功課

語言要有畫面感，按月份清晰列出，約500字。`;
        } else {
          userPrompt = `請為 ${personA.name}（${birthA}）進行阿卡西紀錄解讀，提供前世今生、靈魂課題同能量建議，約400字。`;
        }

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });
        const reading = response.choices?.[0]?.message?.content || "解讀生成失敗，請稍後再試。";
        return { reading };
      }),

    // 查詢今日剩餘使用次數（需登入）
    getUsage: protectedProcedure
      .query(async ({ ctx }) => {
        const { remaining, limit } = await canUseMysticToday(ctx.user.id);
        return { remaining, limit, used: limit - remaining };
      }),
  }),

  // ─── Comments ───────────────────────────────────────────────────────────────────────────────────
  comment: router({
    list: publicProcedure
      .input(z.object({ postSlug: z.string() }))
      .query(async ({ input }) => {
        const [items, total] = await Promise.all([
          getCommentsBySlug(input.postSlug),
          countCommentsBySlug(input.postSlug),
        ]);
        return { items, total };
      }),

    submit: publicProcedure
      .input(z.object({
        postSlug: z.string(),
        authorName: z.string().min(1, "請輸入名字").max(100),
        content: z.string().min(2, "留言內容太短").max(1000, "留言不得超過 1000 字"),
      }))
      .mutation(async ({ input }) => {
        await createComment({
          postSlug: input.postSlug,
          authorName: input.authorName,
          content: input.content,
          approved: true,
        });
        return { success: true };
      }),
  }),
});

/// Helper import needed for subscription adminList
import { getSubscriptions } from "./db";
export type AppRouter = typeof appRouter;

