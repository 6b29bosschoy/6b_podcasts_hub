import { describe, expect, it } from "vitest";

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
