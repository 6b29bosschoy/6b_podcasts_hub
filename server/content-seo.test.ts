import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderSeoHead } from "./_core/seo";

const root = join(__dirname, "..");
const source = (path: string) => readFileSync(join(root, "client/src", path), "utf-8");

describe("內容呈現與節目 SEO", () => {
  it("文章正文使用統一的 GFM Markdown renderer，不再逐行把語法當純文字輸出", () => {
    const article = source("pages/BlogPost.tsx");
    expect(article).toContain('import ReactMarkdown from "react-markdown"');
    expect(article).toContain('import remarkGfm from "remark-gfm"');
    expect(article).toContain("remarkPlugins={[remarkGfm]}");
    expect(article).toContain("strong:");
    expect(article).toContain("ul:");
    expect(article).toContain("ol:");
    expect(article).not.toContain('post.content.split("\\n").map');
  });

  it("節目頁使用真實影片與文章來源建立相關內容，並包含嘉賓、時間軸及完整 VideoObject", () => {
    const episode = source("pages/EpisodeDetail.tsx");
    expect(episode).toContain('trpc.youtube.getVideos.useQuery({ channel: "all", limit: 6 })');
    expect(episode).toContain("trpc.blog.relatedToEpisode.useQuery");
    expect(episode).toContain("episodeReference");
    expect(episode).toContain("嘉賓介紹");
    expect(episode).toContain("時間軸");
    expect(episode).toContain("function relevanceScore");
    expect(episode).toContain("item.channelTitle === video.channelTitle ? 2 : 0");
    expect(episode).toContain("score: relevanceScore(reference");
    expect(episode).toContain("YouTube 描述列明嘅嘉賓");
    ["name: video.title", "description: summary", "thumbnailUrl: video.thumbnail", "uploadDate: video.publishedAt", "duration: durationToIso(video.duration)", "embedUrl:"].forEach((field) => expect(episode).toContain(field));
  });

  it("核心內容頁不再以 lazy chunk 延後載入", () => {
    const app = source("App.tsx");
    ["import Blog from", "import BlogPost from", "import Episodes from", "import EpisodeDetail from"].forEach((importStatement) => expect(app).toContain(importStatement));
    ["const Blog = lazy", "const BlogPost = lazy", "const Episodes = lazy", "const EpisodeDetail = lazy"].forEach((lazyStatement) => expect(app).not.toContain(lazyStatement));
  });

  it("伺服器端可輸出完整 VideoObject 頭部資料", () => {
    const head = renderSeoHead({
      path: "/episodes/example-video",
      canonicalUrl: "https://6bpodcasts.com/episodes/example-video",
      title: "節目標題｜路邊電台節目",
      description: "節目摘要",
      h1: "節目標題",
      intro: "節目摘要",
      structuredData: [{
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: "節目標題",
        description: "節目摘要",
        thumbnailUrl: "https://i.ytimg.com/example.jpg",
        uploadDate: "2026-08-01T00:00:00Z",
        duration: "PT12M30S",
        embedUrl: "https://www.youtube.com/embed/example-video",
      }],
    });
    ["VideoObject", "thumbnailUrl", "uploadDate", "duration", "embedUrl"].forEach((field) => expect(head).toContain(field));
  });
});
