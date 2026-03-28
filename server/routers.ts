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
  createBlogPost,
  createBooking,
  createContact,
  createSubscription,
  getAllBlogPosts,
  getAllBookings,
  getAllContacts,
  getApprovedBlogPosts,
  getBlogPostBySlug,
  updateBlogPostStatus,
  updateBookingStatus,
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
          title: `新嘉賓投稿：${input.title}`,
          content: `${input.authorName} (${input.authorEmail}) 提交了新文章「${input.title}」，請前往管理後台審核。`,
        });
        return { success: true };
      }),

    // Admin only
    adminList: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return getAllBlogPosts(100, 0);
      }),

    approve: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(["approved", "rejected"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await updateBlogPostStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // ─── Subscription ─────────────────────────────────────────────────────────
  subscription: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().max(100).optional(),
      }))
      .mutation(async ({ input }) => {
        await createSubscription({ email: input.email, name: input.name });
        await notifyOwner({
          title: `新訂閱者：${input.email}`,
          content: `${input.name ?? "訪客"} (${input.email}) 已訂閱電子報。`,
        });
        return { success: true };
      }),

    adminList: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { getSubscriptions } = await import("./db");
        return getSubscriptions();
      }),
  }),

  // ─── Booking ──────────────────────────────────────────────────────────────
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
        const serviceLabels: Record<string, string> = {
          fengshui: "風水諮詢",
          bazi: "八字命理",
          tarot: "塔羅占卜",
          spiritual: "身心靈療癒",
          course: "課程報名",
        };
        await createBooking(input);
        await notifyOwner({
          title: `新預約：${serviceLabels[input.serviceType] ?? input.serviceType}`,
          content: `${input.name} (${input.email}) 預約了「${serviceLabels[input.serviceType]}」服務，希望時間：${input.preferredDate ?? "未指定"} ${input.preferredTime ?? ""}。`,
        });
        return { success: true };
      }),

    adminList: protectedProcedure
      .query(async ({ ctx }) => {
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

  // ─── Contact ──────────────────────────────────────────────────────────────
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        email: z.string().email(),
        phone: z.string().max(30).optional(),
        inquiryType: z.enum(["collaboration", "guest", "feedback", "other"]),
        subject: z.string().min(1).max(255),
        message: z.string().min(10).max(2000),
      }))
      .mutation(async ({ input }) => {
        const typeLabels: Record<string, string> = {
          collaboration: "商業合作",
          guest: "嘉賓邀請",
          feedback: "觀眾反饋",
          other: "其他",
        };
        await createContact(input);
        await notifyOwner({
          title: `新聯絡查詢：${typeLabels[input.inquiryType]} — ${input.subject}`,
          content: `${input.name} (${input.email}) 發送了「${typeLabels[input.inquiryType]}」查詢：${input.message.slice(0, 200)}`,
        });
        return { success: true };
      }),

    adminList: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return getAllContacts();
      }),
  }),

  // ─── YouTube ──────────────────────────────────────────────────────────────
  youtube: router({
    /**
     * Returns latest videos from both channels.
     * Results are cached in-memory for 10 minutes to avoid burning API quota.
     */
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

        // Resolve channel handles to IDs (cached per process)
        const [podcastsId, fengshuiId] = await Promise.all([
          resolveChannelId("6bpodcasts"),
          resolveChannelId("6bfengshui"),
        ]);

        if (channel === "podcasts") {
          const videos = await getLatestVideos(podcastsId, limit);
          return { videos: videos.map((v) => ({ ...v, duration: parseDuration(v.duration), viewCount: formatViewCount(v.viewCount) })) };
        }
        if (channel === "fengshui") {
          const videos = await getLatestVideos(fengshuiId, limit);
          return { videos: videos.map((v) => ({ ...v, duration: parseDuration(v.duration), viewCount: formatViewCount(v.viewCount) })) };
        }

        // "all" — fetch both in parallel, interleave by date
        const [pVideos, fVideos] = await Promise.all([
          getLatestVideos(podcastsId, limit),
          getLatestVideos(fengshuiId, limit),
        ]);
        const merged = [...pVideos, ...fVideos]
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, limit * 2);
        return {
          videos: merged.map((v) => ({ ...v, duration: parseDuration(v.duration), viewCount: formatViewCount(v.viewCount) })),
        };
      }),

    getChannels: publicProcedure.query(async () => {
      const [podcastsId, fengshuiId] = await Promise.all([
        resolveChannelId("6bpodcasts"),
        resolveChannelId("6bfengshui"),
      ]);
      const [podcasts, fengshui] = await Promise.all([
        getChannelInfo(podcastsId),
        getChannelInfo(fengshuiId),
      ]);
      return { podcasts, fengshui };
    }),
  }),

  // ─── AI Chatbot ───────────────────────────────────────────────────────────
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

export type AppRouter = typeof appRouter;
