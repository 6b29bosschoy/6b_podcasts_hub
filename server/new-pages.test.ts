import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  getShortHighlights,
  ShortHighlightCard,
  ShortHighlightsSection,
  type ShortHighlightVideo,
} from "../client/src/components/ShortHighlightsSection";

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

  it("keeps Portal explore cards free of nested anchor markup", async () => {
    const portalSource = await readFile(new URL("../client/src/pages/Portal.tsx", import.meta.url), "utf8");

    expect(portalSource).not.toContain("<Link key={card.tag} href={card.href}>");
    expect(portalSource).toContain("<article key={card.tag}>");
    expect(portalSource).toContain("<Link\n                      href={card.href}");
  });

  it("keeps the 6B PODCASTS brand label visible in the mobile navigation", async () => {
    const navbarSource = await readFile(new URL("../client/src/components/Navbar.tsx", import.meta.url), "utf8");

    expect(navbarSource).toContain(">6B PODCASTS</div>");
    expect(navbarSource).toContain('<div className="block">');
    expect(navbarSource).not.toContain('<div className="hidden sm:block">');
    expect(navbarSource).toContain('className="container flex items-center justify-between h-14"');
    expect(navbarSource).toContain('className="flex items-center gap-2"');
    expect(navbarSource).toContain('className="lg:hidden p-2"');
  });

  it("uses 6B PODCASTS consistently in the shared footer", async () => {
    const footerSource = await readFile(new URL("../client/src/components/Footer.tsx", import.meta.url), "utf8");

    expect(footerSource).toContain(">6B PODCASTS</div>");
    expect(footerSource).not.toMatch(/6B\s+Media/);
  });

  it("mounts the short-video highlights rail on the homepage", async () => {
    const portalSource = await readFile(new URL("../client/src/pages/Portal.tsx", import.meta.url), "utf8");

    expect(portalSource).toContain("SHORT HIGHLIGHTS");
    expect(portalSource).toContain("<ShortHighlightsSection videos={allVideos} loading={videosLoading} />");
  });

  it("filters only the ordered highlight whitelist and renders each card with its external video link", () => {
    const videos: ShortHighlightVideo[] = [
      { id: "not-featured", title: "普通影片", url: "https://example.com/other", duration: "0:30" },
      { id: "UtAp2jnVePs", title: "第二條精選", url: "https://example.com/two", duration: "0:55" },
      { id: "xZOWb5stFwA", title: "第一條精選", url: "https://example.com/one", duration: "0:55" },
    ];
    const highlights = getShortHighlights(videos);

    expect(highlights.map((video) => video.id)).toEqual(["xZOWb5stFwA", "UtAp2jnVePs"]);
    const markup = renderToStaticMarkup(createElement(ShortHighlightCard, { video: highlights[0]! }));
    expect(markup).toContain('href="https://example.com/one"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('/manus-storage/xZOWb5stFwA_1e8d4bcf.webp');
    expect(highlights[0]?.reviewNote).toContain("直式安全區");
    expect(highlights.every((video) => video.cropAnchor === "50% 50%")).toBe(true);
    expect(markup).toContain("觀看精華");
    expect(markup).toContain("group-hover:scale-110");
    expect(markup).toContain("group-focus-visible:scale-110");
    expect(markup).toContain("active:scale-[0.98]");
  });

  it("renders short-highlight loading and empty states with the same single booking CTA", () => {
    const loadingMarkup = renderToStaticMarkup(createElement(ShortHighlightsSection, { videos: [], loading: true }));
    const emptyMarkup = renderToStaticMarkup(createElement(ShortHighlightsSection, { videos: [], loading: false }));

    expect(loadingMarkup).toContain('aria-label="短影音精華載入中"');
    expect(emptyMarkup).toContain("短影音精華整理中");
    expect(loadingMarkup.match(/href="\/booking"/g)).toHaveLength(1);
    expect(emptyMarkup.match(/href="\/booking"/g)).toHaveLength(1);
  });

  it("replaces fictional master details and the master directory with a neutral preparation state", async () => {
    const [detail, directory, data] = await Promise.all([
      readFile(new URL("../client/src/pages/mystic/MysticMasterDetail.tsx", import.meta.url), "utf8"),
      readFile(new URL("../client/src/pages/mystic/MysticMasters.tsx", import.meta.url), "utf8"),
      readFile(new URL("../client/src/data/mysticData.ts", import.meta.url), "utf8"),
    ]);

    expect(detail).toContain("師傅陣容準備中");
    expect(detail).toContain("noindex, nofollow");
    expect(directory).toContain("師傅陣容準備中");
    expect(data).toContain("export const MYSTIC_MASTERS: MysticMaster[] = []");
    expect(`${detail}${directory}`).not.toContain("陳天命");
  });

  it("requires a topic-style English slug in the blog submission form", async () => {
    const form = await readFile(new URL("../client/src/pages/BlogSubmit.tsx", import.meta.url), "utf8");

    expect(form).toContain('name="slug"');
    expect(form).toContain("monthly-income-dating-standard");
    expect(form).toContain("3–6 個小寫英文單詞");
  });
});
