import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import {
  getLatestVideos,
  getChannelInfo,
  resolveChannelId,
  parseDuration,
  formatViewCount,
} from "./youtube";
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
          limit: z.number().min(1).max(12).default(6),
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
        const reply = response.choices?.[0]?.message?.content ?? "唔好意思，我而家唔係好明你嘅問題，可以再問清楚啲嗎？";
        return { reply };
      }),
  }),
});

// Helper import needed for subscription adminList
import { getSubscriptions } from "./db";

export type AppRouter = typeof appRouter;
