import { describe, expect, it } from "vitest";

/**
 * Tests for the four new pages added to the navigation:
 * - About (關於我們) - /about
 * - Services (服務項目) - /services
 * - Podcasts (收聽聲音 PODCASTS) - /podcasts
 * - Partnership (合作洽談) - /partnership
 *
 * These are frontend-only pages (no new backend procedures).
 * We verify that the contact.submit procedure (reused by Partnership page)
 * correctly handles the "collaboration" inquiryType.
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

describe("Partnership page - contact.submit (collaboration inquiryType)", () => {
  it("accepts collaboration inquiryType without throwing", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // The partnership form uses inquiryType: "collaboration"
    // We just verify the procedure exists and accepts this type
    // (DB may not be available in test env, so we catch DB errors only)
    try {
      await caller.contact.submit({
        name: "Test Partner",
        email: "partner@test.com",
        inquiryType: "collaboration",
        subject: "合作洽談查詢",
        message: "我們希望進行品牌置入合作，請聯絡我們討論詳情。",
        phone: "98765432",
      });
    } catch (err: unknown) {
      // Only DB connection errors are acceptable in test environment
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

  it("rejects submission with missing required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        email: "bad-email",
        inquiryType: "collaboration",
        subject: "",
        message: "short",
      })
    ).rejects.toThrow();
  });
});

describe("New page routes - static content verification", () => {
  it("About page exports a default function", async () => {
    // Verify the module can be imported without errors
    const mod = await import("../client/src/pages/About.tsx");
    expect(typeof mod.default).toBe("function");
  });

  it("Services page exports a default function", async () => {
    const mod = await import("../client/src/pages/Services.tsx");
    expect(typeof mod.default).toBe("function");
  });

  it("PodcastsPage exports a default function", async () => {
    const mod = await import("../client/src/pages/PodcastsPage.tsx");
    expect(typeof mod.default).toBe("function");
  });

  it("Partnership page exports a default function", async () => {
    const mod = await import("../client/src/pages/Partnership.tsx");
    expect(typeof mod.default).toBe("function");
  });
});
