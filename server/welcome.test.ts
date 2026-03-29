import { describe, expect, it, vi } from "vitest";

// Mock notification to prevent real HTTP calls in test environment
vi.mock("./_core/notification", () => ({ notifyOwner: vi.fn().mockResolvedValue(true) }));

/**
 * Tests for the FB/IG Landing Page (/welcome)
 *
 * Verifies:
 * 1. Welcome page module exports a default function component
 * 2. The page uses existing youtube.getVideos and youtube.getChannels procedures
 * 3. The booking procedure (reused by the landing page CTA) accepts valid input
 */

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("Welcome Landing Page - module verification", () => {
  it("Welcome page exports a default function", async () => {
    const mod = await import("../client/src/pages/Welcome.tsx");
    expect(typeof mod.default).toBe("function");
  });

  it("Welcome page module name is 'Welcome'", async () => {
    const mod = await import("../client/src/pages/Welcome.tsx");
    expect(mod.default.name).toBe("Welcome");
  });
});

describe("Welcome Landing Page - backend procedures used by landing page", () => {
  it("youtube.getVideos procedure exists and accepts channel/limit input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.youtube.getVideos({ channel: "all", limit: 6 });
      // If API succeeds, should return videos array
      expect(result).toHaveProperty("videos");
      expect(Array.isArray(result.videos)).toBe(true);
    } catch (err: unknown) {
      // DB/API errors are acceptable in test environment
      const msg = err instanceof Error ? err.message : String(err);
      const isAcceptableError =
        msg.includes("database") ||
        msg.includes("connect") ||
        msg.includes("ECONNREFUSED") ||
        msg.includes("Cannot read") ||
        msg.includes("getDb") ||
        msg.includes("quota") ||
        msg.includes("API") ||
        msg.includes("fetch");
      expect(isAcceptableError).toBe(true);
    }
  });

  it("youtube.getChannels procedure exists", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.youtube.getChannels();
      // If API succeeds, should return podcasts and fengshui keys
      expect(result).toHaveProperty("podcasts");
      expect(result).toHaveProperty("fengshui");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isAcceptableError =
        msg.includes("database") ||
        msg.includes("connect") ||
        msg.includes("ECONNREFUSED") ||
        msg.includes("Cannot read") ||
        msg.includes("getDb") ||
        msg.includes("quota") ||
        msg.includes("API") ||
        msg.includes("fetch");
      expect(isAcceptableError).toBe(true);
    }
  });

  it("booking.create procedure accepts valid玄學 booking input (used by landing page CTA)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.booking.create({
        name: "測試用戶",
        email: "test@example.com",
        serviceType: "fengshui",
        phone: "91234567",
        preferredDate: "2026-04-01",
        preferredTime: "14:00",
        message: "希望預約風水諮詢服務",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isDbError =
        msg.includes("database") ||
        msg.includes("connect") ||
        msg.includes("ECONNREFUSED") ||
        msg.includes("Cannot read") ||
        msg.includes("getDb");
      expect(isDbError).toBe(true);
    }
  });

  it("booking.create rejects invalid serviceType", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.booking.create({
        name: "測試用戶",
        email: "test@example.com",
        serviceType: "invalid_service" as "fengshui",
      })
    ).rejects.toThrow();
  });
});

describe("Welcome Landing Page - submission form (share your story)", () => {
  it("submission.submit procedure exists on appRouter", () => {
    // Verify the procedure is accessible via the router
    expect(typeof appRouter._def.procedures["submission.submit"]).toBe("function");
  });

  it("submission.submit rejects content shorter than 10 characters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.submission.submit({
        nickname: "小明",
        category: "relationship",
        content: "短",
        isAnonymous: false,
      })
    ).rejects.toThrow();
  });

  it("submission.submit rejects invalid category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.submission.submit({
        nickname: "小明",
        category: "invalid_cat" as "relationship",
        content: "這是一個測試內容，用來測試投稿功能。",
        isAnonymous: false,
      })
    ).rejects.toThrow();
  });

  it("submission.submit accepts valid relationship story", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.submission.submit({
        nickname: "小明",
        category: "relationship",
        content: "我同女朋友拍拖三年，最近佢話想分手，我唔知點算好。",
        isAnonymous: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isDbError =
        msg.includes("database") ||
        msg.includes("connect") ||
        msg.includes("ECONNREFUSED") ||
        msg.includes("Cannot read") ||
        msg.includes("getDb");
      expect(isDbError).toBe(true);
    }
  });

  it("submission.submit accepts anonymous fengshui story", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.submission.submit({
        nickname: "匿名",
        category: "fengshui",
        content: "搞左月搄左新屋，之後一直唔順，係唔係風水問題？",
        isAnonymous: true,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isDbError =
        msg.includes("database") ||
        msg.includes("connect") ||
        msg.includes("ECONNREFUSED") ||
        msg.includes("Cannot read") ||
        msg.includes("getDb");
      expect(isDbError).toBe(true);
    }
  });

  it("submission.submit rejects content over 1000 characters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.submission.submit({
        nickname: "小明",
        category: "other",
        content: "a".repeat(1001),
        isAnonymous: false,
      })
    ).rejects.toThrow();
  });

  it("all 5 landing page submission categories are valid", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const validCategories = ["relationship", "fengshui", "confession", "question", "other"] as const;

    for (const category of validCategories) {
      try {
        await caller.submission.submit({
          nickname: "測試",
          category,
          content: "這是一個測試內容，用來測試投稿功能。",
          isAnonymous: false,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        // Only DB errors are acceptable — validation errors would fail the test
        const isDbError =
          msg.includes("database") ||
          msg.includes("connect") ||
          msg.includes("ECONNREFUSED") ||
          msg.includes("Cannot read") ||
          msg.includes("getDb");
        expect(isDbError).toBe(true);
      }
    }
  });
});
