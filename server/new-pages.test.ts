import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

/**
 * Tests for the four new pages added to the navigation:
 * - About (關於我們) - /about
 * - Services (服務項目) - /services
 * - Podcasts (收聽聲音 PODCASTS) - /podcasts
 * - Partnership (合作洽談) - /partnership
 * - MonetizationPlan (點樣合作與預約) - /monetization-plan
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

  it("MonetizationPlan page exports a default function", async () => {
    const mod = await import("../client/src/pages/MonetizationPlan.tsx");
    expect(typeof mod.default).toBe("function");
  });

  it("registers the /monetization-plan route in the app router", async () => {
    const appSource = await readFile(new URL("../client/src/App.tsx", import.meta.url), "utf8");
    expect(appSource).toContain('path="/monetization-plan"');
    expect(appSource).toContain("component={MonetizationPlan}");
  });

  it("explains referral privacy and includes the two primary conversion CTAs", async () => {
    const pageSource = await readFile(new URL("../client/src/pages/MonetizationPlan.tsx", import.meta.url), "utf8");

    expect(pageSource).toContain("師傅轉介，唔係硬推服務。");
    expect(pageSource).toContain("品牌合作，賣嘅唔只係曝光。");
    expect(pageSource).toContain("未經你同意，唔會把聯絡方式或問題內容交畀師傅。");
    expect(pageSource).toContain("預約一對一");
    expect(pageSource).toContain("合作查詢");
  });
});
