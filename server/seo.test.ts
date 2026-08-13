import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  CANONICAL_ORIGIN,
  PUBLIC_SITEMAP_PATHS,
  SITE_DESCRIPTION,
  SITE_TITLE,
  getArticleParagraphs,
  getHomeRedirectTarget,
  injectSeoDocument,
  renderCrawlerFallback,
  renderSeoHead,
  resolveSeoDocument,
} from "./_core/seo";

describe("SEO server output", () => {
  it("uses the non-www canonical origin for every public sitemap route", async () => {
    expect(PUBLIC_SITEMAP_PATHS).toEqual(expect.arrayContaining(["/blog/submit", "/welcome", "/mystic/funnel"]));
    expect(PUBLIC_SITEMAP_PATHS).not.toContain("/home");
    expect(PUBLIC_SITEMAP_PATHS).not.toContain("/monetization-plan");
    expect(PUBLIC_SITEMAP_PATHS).not.toContain("/mystic/masters/master-1");
    for (const path of PUBLIC_SITEMAP_PATHS) {
      const document = await resolveSeoDocument(path);
      expect(document.canonicalUrl).toBe(`${CANONICAL_ORIGIN}${path === "/" ? "/" : path}`);
      expect(document.canonicalUrl).not.toContain("www.6bpodcasts.com");
    }
  });

  it("emits the requested home title, description, canonical, OG/Twitter URLs and two JSON-LD scripts", async () => {
    const document = await resolveSeoDocument("/");
    const head = renderSeoHead(document);

    expect(head).toContain(`<title>${SITE_TITLE}</title>`);
    expect(head).toContain(`<meta name="description" content="${SITE_DESCRIPTION}" />`);
    expect(head).toContain('<link rel="canonical" href="https://6bpodcasts.com/" />');
    expect(head).toContain('<meta property="og:url" content="https://6bpodcasts.com/" />');
    expect(head).toContain('<meta name="twitter:url" content="https://6bpodcasts.com/" />');
    expect(head).toContain('<meta property="og:title" content="6B Podcast｜香港兩性關係 Podcast・感情樹窿・玄學拆局" />');
    expect(head).toContain('<meta name="twitter:title" content="6B Podcast｜香港兩性關係 Podcast・感情樹窿・玄學拆局" />');
    expect((head.match(/application\/ld\+json/g) ?? [])).toHaveLength(2);
    expect(head).toContain('"@type":"Organization"');
    expect(head).toContain('"@type":"PodcastSeries"');
  });

  it("renders exactly one crawler-visible H1 plus all required home discovery links without JavaScript", async () => {
    const document = await resolveSeoDocument("/");
    const fallback = renderCrawlerFallback(document);

    expect((fallback.match(/<h1>/g) ?? [])).toHaveLength(1);
    expect(fallback).toContain("6B Podcast｜香港兩性關係 Podcast 平台");
    expect(fallback).toContain("路邊電台");
    expect(fallback).toContain("路邊玄學堂");
    expect(fallback).toContain("感情樹窿投稿");
  });

  it("injects a single canonical and one H1 into the HTML template", async () => {
    const template = '<html><head><!--app-head--></head><body><div id="root"><!--app-html--></div></body></html>';
    const html = injectSeoDocument(template, await resolveSeoDocument("/booking"));

    expect((html.match(/rel="canonical"/g) ?? [])).toHaveLength(1);
    expect((html.match(/<h1>/g) ?? [])).toHaveLength(1);
    expect(html).toContain('href="https://6bpodcasts.com/booking"');
  });

  it("keeps legacy mystic master URLs directly reachable as noindex placeholders without fictional personal claims", async () => {
    const document = await resolveSeoDocument("/mystic/masters/master-1");
    const head = renderSeoHead(document);

    expect(document.canonicalUrl).toBe("https://6bpodcasts.com/mystic/masters/master-1");
    expect(document.h1).toBe("師傅陣容準備中");
    expect(document.robots).toBe("noindex, nofollow");
    expect(head).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(renderCrawlerFallback(document)).not.toContain("陳天命");
  });

  it("turns blog body text into escaped crawler-visible paragraphs without JavaScript", () => {
    const document = {
      path: "/blog/monthly-income-dating-standard",
      canonicalUrl: "https://6bpodcasts.com/blog/monthly-income-dating-standard",
      title: "文章標題",
      description: "文章摘要",
      h1: "文章標題",
      intro: "文章摘要",
      bodyParagraphs: getArticleParagraphs("第一段正文\n\n第二段 <script>不可以執行</script>"),
    };
    const fallback = renderCrawlerFallback(document);

    expect(fallback).toContain("第一段正文");
    expect(fallback).toContain("第二段 &lt;script&gt;不可以執行&lt;/script&gt;");
    expect(fallback).not.toContain("<script>不可以執行</script>");
  });

  it("keeps the monetization plan directly reachable but marks its raw head as noindex, nofollow", async () => {
    const document = await resolveSeoDocument("/monetization-plan");
    const head = renderSeoHead(document);

    expect(document.canonicalUrl).toBe("https://6bpodcasts.com/monetization-plan");
    expect(document.robots).toBe("noindex, nofollow");
    expect(head).toContain('<meta name="robots" content="noindex, nofollow" />');
  });

  it("permanently normalises legacy /home requests to the canonical root while preserving query strings", () => {
    expect(getHomeRedirectTarget("/home")).toBe("/");
    expect(getHomeRedirectTarget("/home/")).toBe("/");
    expect(getHomeRedirectTarget("/home?utm_source=facebook")).toBe("/?utm_source=facebook");
    expect(getHomeRedirectTarget("/booking")).toBeNull();
  });

  it("keeps robots.txt public and points it to the non-www sitemap", async () => {
    const robots = await readFile(new URL("../client/public/robots.txt", import.meta.url), "utf8");

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://6bpodcasts.com/sitemap.xml");
    expect(robots).not.toContain("www.6bpodcasts.com");
  });
});
