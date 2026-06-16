import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getApprovedBlogPosts, getBlogPostBySlug } from "../db";
import mysticStreamRouter from "../mysticStream";

// Estimate token count (rough approximation: 1 token ≈ 4 chars)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Send markdown response with proper headers
function sendMarkdown(res: express.Response, content: string): void {
  const tokens = estimateTokens(content);
  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("x-markdown-tokens", String(tokens));
  res.setHeader("Vary", "Accept");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(content);
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Storage proxy for /manus-storage/* paths
  registerStorageProxy(app);
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // ── RFC 8288 Link Headers (Agent Discovery) ──────────────────────────────────
  app.use((_req, res, next) => {
    res.setHeader(
      "Link",
      [
        '</.well-known/api-catalog>; rel="api-catalog"',
        '</.well-known/agent-skills/index.json>; rel="agent-skills"',
        '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
        '</llms.txt>; rel="describedby"; type="text/plain"',
      ].join(", ")
    );
    next();
  });

  // ── Markdown Negotiation (Accept: text/markdown) ─────────────────────────────
  // Handles all page paths: /, /blog, /blog/:slug
  app.use(async (req, res, next) => {
    const accept = req.headers["accept"] || "";
    if (!accept.includes("text/markdown")) return next();

    const path = req.path;

    // Home page
    if (path === "/") {
      const md = `# 路邊電台 × 路邊玄學堂 (6B Podcasts)

> 路邊電台係香港最真實嘅人物訪談 Podcast，由 Ray Choy 創辦，探討兩性關係、都市感情、玄學命理，每一位嘉賓都係講真話，呈現最真實嘅內心世界。

## 主要功能

- 官方網站: https://6bpodcasts.com
- YouTube: https://www.youtube.com/@6bpodcasts
- 嘉賓專欄: https://6bpodcasts.com/blog
- 玄學服務預約: https://6bpodcasts.com/booking
- AI 資訊: https://6bpodcasts.com/llms.txt
- 完整 AI 文件: https://6bpodcasts.com/llms-full.txt
`;
      return sendMarkdown(res, md);
    }

    // Blog listing page
    if (path === "/blog") {
      try {
        const posts = await getApprovedBlogPosts(20, 0);
        const lines = [
          "# 嘉賓專欄 — 路邊電台",
          "",
          "> 路邊電台嘉賓及觀眾投稿文章，分享真實故事與心得。",
          "",
          "## 最新文章",
          "",
        ];
        for (const post of posts.slice(0, 20)) {
          const date = post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : "";
          lines.push(`### [${post.title}](https://6bpodcasts.com/blog/${post.slug})`);
          if (post.category) lines.push(`**分類**: ${post.category}`);
          if (date) lines.push(`**發布日期**: ${date}`);
          if (post.excerpt) lines.push(`\n${post.excerpt}`);
          lines.push("");
        }
        return sendMarkdown(res, lines.join("\n"));
      } catch {
        return next();
      }
    }

    // Individual blog post
    const blogMatch = path.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) {
      try {
        const slug = blogMatch[1];
        const post = await getBlogPostBySlug(slug);
        if (!post) return next();
        const date = post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : "";
        const faqItems: Array<{ q: string; a: string }> = post.faq
          ? (typeof post.faq === "string" ? JSON.parse(post.faq) : post.faq)
          : [];
        const lines = [
          `# ${post.title}`,
          "",
          `**作者**: ${post.authorName || "路邊電台"}`,
          date ? `**發布日期**: ${date}` : "",
          post.category ? `**分類**: ${post.category}` : "",
          "",
          post.excerpt ? `> ${post.excerpt}\n` : "",
          post.content || "",
        ];
        if (faqItems.length > 0) {
          lines.push("", "## 常見問題", "");
          for (const item of faqItems) {
            lines.push(`**Q: ${item.q}**`, "", `A: ${item.a}`, "");
          }
        }
        return sendMarkdown(res, lines.filter(l => l !== undefined).join("\n"));
      } catch {
        return next();
      }
    }

    next();
  });

  // ── /.well-known/ JSON Endpoints (Agent Readiness) ──────────────────────────
  app.get("/.well-known/api-catalog", (_req, res) => {
    res.setHeader("Content-Type", "application/linkset+json");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.json({
      linkset: [
        {
          anchor: "https://6bpodcasts.com/api/trpc",
          "service-doc": [{ href: "https://6bpodcasts.com/llms.txt", type: "text/plain" }],
          "service-desc": [{ href: "https://6bpodcasts.com/.well-known/api-catalog", type: "application/linkset+json" }],
          status: [{ href: "https://6bpodcasts.com/api/health" }],
        },
      ],
    });
  });

  app.get("/.well-known/oauth-authorization-server", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.json({
      issuer: "https://6bpodcasts.com",
      authorization_endpoint: "https://6bpodcasts.com/api/oauth/callback",
      token_endpoint: "https://6bpodcasts.com/api/trpc/auth.me",
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code"],
      subject_types_supported: ["public"],
      scopes_supported: ["openid", "profile"],
      service_documentation: "https://6bpodcasts.com/llms.txt",
    });
  });

  app.get("/.well-known/oauth-protected-resource", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.json({
      resource: "https://6bpodcasts.com",
      authorization_servers: ["https://6bpodcasts.com"],
      scopes_supported: ["openid", "profile"],
      bearer_methods_supported: ["header", "cookie"],
      resource_documentation: "https://6bpodcasts.com/llms.txt",
    });
  });

  app.get("/.well-known/mcp/server-card.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.json({
      schema_version: "1.0",
      serverInfo: {
        name: "6B Podcasts Hub",
        version: "1.0.0",
        description: "路邊電台 × 路邊玄學堂官方網站 API — 提供嘉賓專欄文章、玄學服務預約、Podcast 節目資訊及讀者互動功能。",
        homepage: "https://6bpodcasts.com",
        contact: "https://6bpodcasts.com/contact",
      },
      transport: { type: "http", endpoint: "https://6bpodcasts.com/api/trpc" },
      capabilities: { tools: true, resources: true, prompts: false, sampling: false },
      tools: [
        { name: "list_articles", description: "列出嘉賓專欄文章，可按分類篩選" },
        { name: "get_article", description: "取得指定文章的完整內容，包括 FAQ 問答" },
        { name: "list_podcasts", description: "取得路邊電台最新 YouTube Podcast 節目列表" },
      ],
      legal: {
        privacy_policy: "https://6bpodcasts.com/privacy",
        terms_of_service: "https://6bpodcasts.com/terms",
        content_signals: "ai-train=no, search=yes, ai-input=no",
      },
    });
  });

  app.get("/.well-known/agent-skills/index.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.json({
      $schema: "https://agentskills.io/schema/v0.2.0/index.json",
      skills: [
        {
          name: "mcp-server-card",
          type: "mcp",
          description: "MCP Server Card for 6B Podcasts Hub.",
          url: "https://6bpodcasts.com/.well-known/mcp/server-card.json",
          sha256: "c6ab10e323a5db52155e7c257c1fb37e5ed26c8fd848b19c6d632db4c863b7fa",
        },
        {
          name: "api-catalog",
          type: "api",
          description: "API Catalog (RFC 9727) for 6B Podcasts Hub.",
          url: "https://6bpodcasts.com/.well-known/api-catalog",
          sha256: "7cf0233915dbd2a1ac3515f6bde371a88932d3a07541b166e2d649e831b1a69f",
        },
        {
          name: "llms-txt",
          type: "llms-txt",
          description: "LLMs.txt — AI-readable summary of 6B Podcasts Hub.",
          url: "https://6bpodcasts.com/llms.txt",
          sha256: "8c468f3f24c89a6e40ee76705706b243fc70da39ddac42ae81ad1571e857edbd",
        },
      ],
    });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "6B Podcasts Hub", timestamp: new Date().toISOString() });
  });

  // ── llms.txt (AI Search Engine Optimization) ────────────────────────────────
  const llmsTxtContent = `# 路邊電台 × 路邊玄學堂 (6B Podcasts)

> 路邊電台係香港最真實嘅人物訪談 Podcast，由 Ray Choy 創辦，探討兩性關係、都市感情、玄學命理，每一位嘉賓都係講真話，呈現最真實嘅內心世界。路邊玄學堂提供風水諮詢、八字命理、塔羅占卜等玄學服務。

路邊電台自 2019 年開始，已訪問超過 486 位嘉賓，YouTube 頻道擁有超過 10 萬訂閱者。節目涵蓋真實感情故事、職場困境、人生抉擇等主題，以廣東話（粵語）為主要語言，面向香港及全球粵語觀眾。

重要資訊：
- 創辦人：Ray Choy（路邊電台）
- 成立年份：2019 年
- 主要語言：廣東話（粵語）
- 服務地區：香港（線上服務可服務全球）
- YouTube 頻道：路邊電台 6B Podcasts（@6bpodcasts）
- 官方網站：https://6bpodcasts.com
- 聯絡電郵：hello@6bpodcasts.com

## 主要頁面

- [首頁](https://6bpodcasts.com/): 路邊電台品牌介紹、最新 YouTube 影片、社群追蹤連結
- [關於我們](https://6bpodcasts.com/about): Ray Choy 創辦人介紹、路邊電台品牌故事、發展歷程
- [服務項目](https://6bpodcasts.com/services): YouTube 訪談製作、品牌宣傳推廣、場地租用服務
- [玄學服務預約](https://6bpodcasts.com/booking): 風水諮詢、八字命理、塔羅占卜線上預約
- [嘉賓專欄](https://6bpodcasts.com/blog): 嘉賓投稿文章、真實故事分享、觀眾投稿精選
- [收聽 Podcasts](https://6bpodcasts.com/podcasts): Apple Podcasts、Spotify、YouTube 收聽連結
- [合作洽談](https://6bpodcasts.com/partnership): 品牌置入廣告、內容共創、整合行銷合作
- [聯絡我們](https://6bpodcasts.com/contact): 商業合作、嘉賓邀請、觀眾反饋聯絡表單

## 社群平台

- [YouTube 頻道](https://www.youtube.com/@6bpodcasts): 路邊電台主頻道，超過 486 集訪談影片
- [Facebook 專頁](https://www.facebook.com/6bpodcasts): 路邊電台 Facebook 社群
- [Instagram](https://www.instagram.com/6bpodcasts): @6bpodcasts 日常動態
- [Apple Podcasts](https://podcasts.apple.com/hk/podcast/id1234567890): 路邊電台音頻版本
- [Spotify](https://open.spotify.com/show/6bpodcasts): Spotify 收聽

## 玄學服務

- [風水諮詢](https://6bpodcasts.com/booking): 家居/辦公室風水分析，HKD 800 起
- [八字命理](https://6bpodcasts.com/booking): 個人命盤分析、流年運勢，HKD 600 起
- [塔羅占卜](https://6bpodcasts.com/booking): 感情、事業、人生方向，HKD 400 起
- [紫微斗數](https://6bpodcasts.com/booking): 詳細命盤分析，HKD 1000 起

## Optional

- [FB/IG 專屬 Landing Page](https://6bpodcasts.com/welcome): 針對社交媒體流量的歡迎頁面，含最新影片及玄學服務入口
- [Sitemap](https://6bpodcasts.com/sitemap.xml): 完整網站地圖
`;

  app.get("/llms.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(llmsTxtContent);
  });

  // ── llms-full.txt (Complete AI documentation) ─────────────────────────────────
  const llmsFullTxtContent = `# 路邊電台 × 路邊玄學堂 (6B Podcasts) — 完整資料

> 路邊電台係香港最真實嘅人物訪談 Podcast，由 Ray Choy 創辦，探討兩性關係、都市感情、玄學命理，每一位嘉賓都係講真話，呈現最真實嘅內心世界。路邊玄學堂提供風水諮詢、八字命理、塔羅占卜等玄學服務。

## 品牌資訊

**路邊電台**（英文：6B Podcasts）係由 Ray Choy 於 2019 年創辦嘅香港 Podcast 節目。節目以廣東話（粵語）進行，主要面向香港及全球粵語觀眾。

- 官方網站：https://6bpodcasts.com
- YouTube：https://www.youtube.com/@6bpodcasts
- Facebook：https://www.facebook.com/6bpodcasts
- Instagram：https://www.instagram.com/6bpodcasts (@6bpodcasts)
- 聯絡電郵：hello@6bpodcasts.com
- 成立年份：2019 年
- 訪談集數：超過 486 集
- YouTube 訂閱：超過 10 萬

## 節目主題

路邊電台涵蓋以下主題：
1. 兩性關係與感情故事（最受歡迎類別）
2. 都市感情困境與出軌、分手故事
3. 玄學命理（風水、八字、塔羅、紫微斗數）
4. 職場困境與人生抉擇
5. 香港社會議題
6. 名人訪談與KOL故事

## 路邊玄學堂服務

路邊玄學堂係路邊電台旗下嘅玄學服務品牌，提供以下服務：

| 服務 | 說明 | 價格 |
|------|------|------|
| 風水諮詢 | 家居/辦公室風水分析，改善運勢 | HKD 800 起 |
| 八字命理 | 個人命盤分析、流年運勢預測 | HKD 600 起 |
| 塔羅占卜 | 感情、事業、人生方向指引 | HKD 400 起 |
| 紫微斗數 | 詳細命盤分析，一生運程 | HKD 1000 起 |

預約方式：https://6bpodcasts.com/booking

## 商業合作服務

路邊電台提供以下商業合作服務：

1. **YouTube 訪談製作**：邀請品牌代表或 KOL 接受訪談，製作高品質影片內容
2. **品牌置入廣告**：在節目中自然融入品牌訊息，觸及忠實受眾
3. **內容共創**：與品牌合作製作專題內容系列
4. **場地租用**：專業錄音/錄影場地租用
5. **整合行銷**：跨平台（YouTube + FB + IG + Podcast）整合推廣方案

洽談合作：https://6bpodcasts.com/partnership

## 嘉賓投稿

路邊電台歡迎觀眾及嘉賓投稿：
- **觀眾投稿**：分享個人真實故事（感情、職場、人生），可匿名，支援圖片上傳
- **嘉賓文章**：嘉賓可投稿部落格文章，分享心得與幕後故事
- 投稿入口：https://6bpodcasts.com/blog/submit

## 收聽方式

- YouTube：https://www.youtube.com/@6bpodcasts
- Apple Podcasts：搜尋「路邊電台」
- Spotify：搜尋「路邊電台 6B Podcasts」
- 官網收聽頁：https://6bpodcasts.com/podcasts

## 常見問題

**Q: 路邊電台係咩節目？**
A: 路邊電台係香港最真實嘅人物訪談 Podcast，由 Ray Choy 主持，每集邀請不同嘉賓分享真實故事，主題涵蓋感情、玄學、職場等。

**Q: 點樣預約玄學服務？**
A: 可以到 https://6bpodcasts.com/booking 填寫預約表格，或聯絡 hello@6bpodcasts.com。

**Q: 點樣成為路邊電台嘉賓？**
A: 可以到 https://6bpodcasts.com/contact 填寫聯絡表格，說明你嘅故事及背景。

**Q: 路邊電台係免費收聽嗎？**
A: 係，所有 YouTube 影片及 Podcast 音頻均免費收聽。

**Q: 路邊電台有冇 Instagram？**
A: 有，Instagram 帳號係 @6bpodcasts（https://www.instagram.com/6bpodcasts）。
`;

  app.get("/llms-full.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(llmsFullTxtContent);
  });

  // ── Sitemap ──────────────────────────────────────────────────────────────────
  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://6bpodcasts.com";
    const now = new Date().toISOString().split("T")[0];
    const pages = [
      { loc: "/",           changefreq: "daily",   priority: "1.0" },
      { loc: "/about",      changefreq: "monthly",  priority: "0.8" },
      { loc: "/services",   changefreq: "monthly",  priority: "0.8" },
      { loc: "/booking",    changefreq: "weekly",   priority: "0.9" },
      { loc: "/blog",       changefreq: "daily",   priority: "0.9" },
      { loc: "/podcasts",   changefreq: "weekly",   priority: "0.8" },
      { loc: "/partnership",changefreq: "monthly",  priority: "0.7" },
      { loc: "/contact",    changefreq: "monthly",  priority: "0.6" },
    ];
    const urls = pages
      .map(
        (p) =>
          `  <url>\n    <loc>${baseUrl}${p.loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
      )
      .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  });

  // ── Mystic Stream SSE
  app.use("/api/mystic", mysticStreamRouter);

  // ── tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
