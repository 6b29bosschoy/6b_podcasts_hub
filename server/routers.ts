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
  getApprovedBlogPosts,
  getApprovedSubmissions,
  getBlogPostBySlug,
  likeSubmission,
  updateBlogPostStatus,
  updateBookingStatus,
  updateSubmissionStatus,
  getYoutubeCache,
  setYoutubeCache,
} from "./db";

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

    submit: publicProcedure
      .input(z.object({
        title: z.string().min(5).max(255),
        authorName: z.string().min(1).max(100),
        authorEmail: z.string().email(),
        authorBio: z.string().max(500).optional(),
        excerpt: z.string().max(500).optional(),
        content: z.string().min(50),
        category: z.enum(["relationship", "fengshui", "lifestyle", "interview", "other"]),
      }))
      .mutation(async ({ input }) => {
        const slug = generateSlug(input.title);
        await createBlogPost({ ...input, slug, status: "pending" });
        await notifyOwner({
          title: "新嘉賓投稿",
          content: `${input.authorName} 提交了新文章「${input.title}」，請前往管理後台審核。`,
        }).catch(() => {});
        return { success: true, slug };
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
        return { success: true };
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
      }))
      .mutation(async ({ input }) => {
        await createReaderSubmission({
          nickname: input.isAnonymous ? "匿名" : input.nickname,
          category: input.category,
          content: input.content,
          isAnonymous: input.isAnonymous,
        });
        await notifyOwner({
          title: "📨 新讀者投稿",
          content: `「${input.isAnonymous ? "匿名" : input.nickname}」提交了一則「${input.category}」類別的投稿，請到後台審核。`,
        });
        return { success: true };
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

    /** Admin: approve or reject a submission */
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number().int().positive(),
        status: z.enum(["approved", "rejected"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Admin only");
        await updateSubmissionStatus(input.id, input.status);
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
