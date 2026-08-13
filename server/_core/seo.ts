import { getBlogPostBySlug } from "../db";
import { MYSTIC_MASTERS } from "../../client/src/data/mysticData";

export const CANONICAL_ORIGIN = "https://6bpodcasts.com";
export const SITE_TITLE = "6B Podcast｜香港兩性關係 Podcast・感情樹窿・玄學拆局";
export const SITE_DESCRIPTION = "香港最敢講感情真相嘅 Podcast。真實感情投稿、兩性關係訪談、玄學角度拆解感情難題。有嘢想講？匿名投稿感情樹窿。";
export const OG_IMAGE = `${CANONICAL_ORIGIN}/manus-storage/og-image-main_4e62cddd.jpg`;

const STATIC_SITEMAP_PATHS = [
  "/",
  "/about",
  "/services",
  "/podcasts",
  "/episodes",
  "/partnership",
  "/blog",
  "/blog/submit",
  "/booking",
  "/contact",
  "/host-recruitment",
  "/investors",
  "/welcome",
  "/mystic",
  "/mystic/analysis",
  "/mystic/masters",
  "/mystic/videos",
  "/mystic/articles",
  "/mystic/pricing",
  "/mystic/bazi",
  "/mystic/services",
  "/mystic/funnel",
] as const;

export const PUBLIC_SITEMAP_PATHS: readonly string[] = [
  ...STATIC_SITEMAP_PATHS,
  ...MYSTIC_MASTERS.map((master) => `/mystic/masters/${master.id}`),
];

type SeoPage = {
  title: string;
  description: string;
  h1: string;
  intro: string;
};

export type SeoDocument = SeoPage & {
  path: string;
  canonicalUrl: string;
  robots?: "index, follow" | "noindex, nofollow";
};

const FALLBACK_PAGE: SeoPage = {
  title: "6B Podcasts｜香港 Podcast、兩性關係與玄學內容平台",
  description: "6B Podcasts 提供香港 Podcast、兩性關係、都市情感及玄學內容。",
  h1: "6B Podcasts｜香港 Podcast、兩性關係與玄學內容平台",
  intro: "路邊電台以廣東話分享真實人物訪談、兩性關係與都市情感故事；路邊玄學堂則從風水、命理與人生選擇角度，陪觀眾整理眼前的問題。",
};

const PAGE_SEO: Record<string, SeoPage> = {
  "/": {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    h1: "6B Podcast｜香港兩性關係 Podcast 平台",
    intro: "6B Podcast 係香港兩性關係內容平台，以真實人物訪談、感情樹窿投稿同玄學拆局，陪你由別人的故事看清自己的關係困局。無論你想聽真實對話、匿名講出心事，定係按自己個案了解一對一安排，呢度都有清楚入口。",
  },
  "/home": {
    title: "首頁｜6B Podcasts 路邊電台",
    description: "6B Podcasts 路邊電台首頁，集合香港兩性關係、人物訪談與玄學內容。",
    h1: "6B Podcasts 路邊電台首頁",
    intro: "瀏覽路邊電台與路邊玄學堂的最新節目、感情故事、玄學內容與一對一服務入口。",
  },
  "/about": {
    title: "關於 6B Podcasts｜路邊電台與路邊玄學堂",
    description: "認識 6B Podcasts、路邊電台與路邊玄學堂的品牌故事與內容方向。",
    h1: "關於 6B Podcasts 路邊電台",
    intro: "了解路邊電台如何以人物訪談與兩性故事連接香港觀眾，並以玄學角度提供另一種整理關係與人生問題的方法。",
  },
  "/services": {
    title: "服務項目｜6B Podcasts",
    description: "6B Podcasts 提供 Podcast、品牌內容與玄學相關服務項目。",
    h1: "6B Podcasts 服務項目",
    intro: "查看路邊電台的節目製作、品牌合作、內容推廣及相關服務安排。",
  },
  "/podcasts": {
    title: "路邊電台｜香港兩性關係 Podcast 節目",
    description: "收聽路邊電台的香港兩性關係、都市情感與人物訪談 Podcast 節目。",
    h1: "路邊電台香港 Podcast 節目",
    intro: "在 YouTube、Apple Podcasts 與 Spotify 收聽路邊電台的真實人物訪談、兩性關係與都市情感節目。",
  },
  "/episodes": {
    title: "最新節目｜路邊電台 6B Podcasts",
    description: "瀏覽路邊電台最新 YouTube 節目與精選人物訪談。",
    h1: "路邊電台最新節目",
    intro: "查看路邊電台最新人物訪談、兩性關係與都市情感影片節目。",
  },
  "/partnership": {
    title: "商業合作｜6B Podcasts",
    description: "與 6B Podcasts 洽談品牌內容、節目贊助與合作方案。",
    h1: "6B Podcasts 商業合作",
    intro: "認識路邊電台的品牌內容合作、節目贊助及內容共創安排。",
  },
  "/monetization-plan": {
    title: "點樣合作與預約｜6B Podcasts",
    description: "了解 6B Podcasts 的師傅轉介與品牌內容合作運作方式。",
    h1: "6B Podcasts 師傅轉介與品牌合作",
    intro: "由兩性內容出發，了解一對一安排、師傅轉介與品牌內容合作的清楚流程。",
  },
  "/blog": {
    title: "感情樹窿與嘉賓專欄｜路邊電台",
    description: "閱讀路邊電台的感情故事、嘉賓專欄與都市情感內容。",
    h1: "路邊電台感情樹窿與嘉賓專欄",
    intro: "閱讀真實感情故事、嘉賓分享與關係觀點；有想講的心事，也可匿名投稿。",
  },
  "/blog/submit": {
    title: "感情樹窿匿名投稿｜路邊電台",
    description: "向路邊電台匿名投稿感情故事與都市情感心事。",
    h1: "路邊電台感情樹窿匿名投稿",
    intro: "有些感情問題未必方便同身邊人講；你可以匿名投稿，讓故事成為更多人整理關係的入口。",
  },
  "/booking": {
    title: "預約一對一｜路邊玄學堂",
    description: "了解路邊玄學堂的一對一服務與預約安排。",
    h1: "路邊玄學堂一對一預約",
    intro: "如你想按自己的感情或人生問題深入整理，可先了解一對一服務與預約流程。",
  },
  "/contact": {
    title: "聯絡我們｜6B Podcasts",
    description: "聯絡 6B Podcasts 洽談合作、嘉賓邀請或觀眾查詢。",
    h1: "聯絡 6B Podcasts",
    intro: "可透過聯絡頁面查詢商業合作、嘉賓邀請、節目建議或一般觀眾問題。",
  },
  "/host-recruitment": {
    title: "主持招募｜6B Podcasts",
    description: "了解 6B Podcasts 的主持招募資訊。",
    h1: "6B Podcasts 主持招募",
    intro: "歡迎有想法、有故事感的創作者了解路邊電台的主持招募安排。",
  },
  "/investors": {
    title: "投資者關係｜6B Podcasts",
    description: "了解 6B Podcasts 的內容平台與投資者關係資訊。",
    h1: "6B Podcasts 投資者關係",
    intro: "了解 6B Podcasts 的內容定位、平台方向與合作發展資訊。",
  },
  "/welcome": {
    title: "歡迎來到 6B Podcasts｜路邊電台",
    description: "歡迎瀏覽 6B Podcasts 的香港兩性關係、人物訪談與玄學內容。",
    h1: "歡迎來到 6B Podcasts 路邊電台",
    intro: "由真實故事、人物訪談與兩性關係內容開始，認識路邊電台與路邊玄學堂。",
  },
  "/mystic": {
    title: "路邊玄學堂｜感情與人生拆局",
    description: "路邊玄學堂以中西玄學角度整理感情與人生問題。",
    h1: "路邊玄學堂感情與人生拆局",
    intro: "以風水、命理、塔羅與關係觀察，從另一個角度整理眼前的感情與人生選擇。",
  },
  "/mystic/analysis": {
    title: "玄學分析｜路邊玄學堂",
    description: "使用路邊玄學堂的玄學分析工具與內容。",
    h1: "路邊玄學堂玄學分析",
    intro: "探索不同玄學分析工具與內容，作為整理關係與人生方向的參考。",
  },
  "/mystic/masters": {
    title: "玄學師傅｜路邊玄學堂",
    description: "認識路邊玄學堂的玄學師傅與服務方向。",
    h1: "路邊玄學堂玄學師傅",
    intro: "了解不同師傅的專長與服務方向，再按自己的需要選擇下一步。",
  },
  "/mystic/videos": {
    title: "玄學影片｜路邊玄學堂",
    description: "瀏覽路邊玄學堂的玄學影片內容。",
    h1: "路邊玄學堂玄學影片",
    intro: "觀看與感情、風水、命理及人生選擇相關的玄學影片內容。",
  },
  "/mystic/articles": {
    title: "玄學文章｜路邊玄學堂",
    description: "閱讀路邊玄學堂的玄學文章與關係拆局內容。",
    h1: "路邊玄學堂玄學文章",
    intro: "閱讀從玄學角度整理感情、人際關係與人生選擇的文章內容。",
  },
  "/mystic/pricing": {
    title: "玄學服務收費｜路邊玄學堂",
    description: "查看路邊玄學堂的一對一服務收費與安排。",
    h1: "路邊玄學堂服務收費",
    intro: "查看玄學服務的收費、內容範圍與預約前需要了解的安排。",
  },
  "/mystic/bazi": {
    title: "八字分析｜路邊玄學堂",
    description: "了解路邊玄學堂的八字分析內容與工具。",
    h1: "路邊玄學堂八字分析",
    intro: "從八字命理角度整理個人性格、關係互動與人生節奏。",
  },
  "/mystic/services": {
    title: "玄學服務｜路邊玄學堂",
    description: "了解路邊玄學堂提供的玄學服務。",
    h1: "路邊玄學堂玄學服務",
    intro: "查看路邊玄學堂的服務內容，按需要了解適合自己的下一步。",
  },
  "/mystic/funnel": {
    title: "玄學服務流程｜路邊玄學堂",
    description: "了解路邊玄學堂的服務流程與預約方向。",
    h1: "路邊玄學堂服務流程",
    intro: "認識由問題整理、服務了解至預約安排的玄學服務流程。",
  },
};

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "6B Podcast 路邊電台",
    alternateName: ["路邊Podcasts", "路邊玄學堂"],
    url: "https://6bpodcasts.com/",
    logo: "https://6bpodcasts.com/manus-storage/og-image-main_4e62cddd.jpg",
    description: "香港本地內容平台，集合真實人物訪談、兩性關係、都市情感、中西玄學及風水命理內容。",
    sameAs: ["https://www.youtube.com/@6bpodcasts", "https://www.youtube.com/@6bfengshui"],
  },
  {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: "路邊電台",
    url: "https://6bpodcasts.com/",
    inLanguage: "zh-HK",
    description: "香港最敢講感情真相嘅 Podcast，兩性關係、都市情感真實訪談。",
  },
];

const fallbackLinks = [
  { href: "/podcasts", label: "路邊電台" },
  { href: "/mystic", label: "路邊玄學堂" },
  { href: "/blog/submit", label: "感情樹窿投稿" },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalisePath(pathname: string): string {
  const clean = pathname.split("?")[0].replace(/\/+$/, "") || "/";
  return clean.startsWith("/") ? clean : `/${clean}`;
}

export function getHomeRedirectTarget(originalUrl: string): string | null {
  const queryIndex = originalUrl.indexOf("?");
  const pathname = queryIndex === -1 ? originalUrl : originalUrl.slice(0, queryIndex);
  if (normalisePath(pathname) !== "/home") return null;
  return `/${queryIndex === -1 ? "" : originalUrl.slice(queryIndex)}`;
}

export async function resolveSeoDocument(pathname: string): Promise<SeoDocument> {
  const path = normalisePath(pathname);
  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  const masterMatch = path.match(/^\/mystic\/masters\/([^/]+)$/);

  if (masterMatch) {
    const master = MYSTIC_MASTERS.find((candidate) => candidate.id === masterMatch[1]);
    if (master) {
      return {
        path,
        canonicalUrl: `${CANONICAL_ORIGIN}${path}`,
        title: `${master.name}｜路邊玄學堂`,
        description: master.bio,
        h1: master.name,
        intro: master.bio,
      };
    }
  }

  if (blogMatch && blogMatch[1] !== "submit") {
    try {
      const post = await getBlogPostBySlug(blogMatch[1]);
      if (post) {
        const title = post.title?.trim() || "路邊電台嘉賓專欄";
        const description = post.excerpt?.trim() || "路邊電台嘉賓專欄文章，分享真實故事與觀點。";
        return {
          path,
          canonicalUrl: `${CANONICAL_ORIGIN}${path}`,
          title: `${title}｜路邊電台嘉賓專欄`,
          description,
          h1: title,
          intro: description,
        };
      }
    } catch (error) {
      console.warn("[SEO] Could not load blog post metadata", error);
    }
  }

  const page = PAGE_SEO[path] ?? FALLBACK_PAGE;
  return {
    ...page,
    path,
    canonicalUrl: `${CANONICAL_ORIGIN}${path === "/" ? "/" : path}`,
    robots: path === "/monetization-plan" ? "noindex, nofollow" : "index, follow",
  };
}

export function renderSeoHead(document: SeoDocument): string {
  const title = escapeHtml(document.title);
  const description = escapeHtml(document.description);
  const canonicalUrl = escapeHtml(document.canonicalUrl);
  const jsonLd = document.path === "/"
    ? homeJsonLd.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`).join("\n")
    : "";

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${document.robots ?? "index, follow"}" />`,
    `<meta name="author" content="路邊電台 6B Podcasts" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<link rel="alternate" hreflang="zh-HK" href="${canonicalUrl}" />`,
    `<link rel="alternate" hreflang="zh-Hant" href="${canonicalUrl}" />`,
    `<link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="6B Podcast 路邊電台" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:locale" content="zh_HK" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="6B Podcast 路邊電台 × 路邊玄學堂—香港內容平台" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:url" content="${canonicalUrl}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    jsonLd,
  ].filter(Boolean).join("\n");
}

export function renderCrawlerFallback(document: SeoDocument): string {
  const links = fallbackLinks
    .map((link) => `<a href="${CANONICAL_ORIGIN}${link.href}">${escapeHtml(link.label)}</a>`)
    .join(" · ");
  return `<main id="seo-content" data-seo-fallback><h1>${escapeHtml(document.h1)}</h1><p>${escapeHtml(document.intro)}</p><nav aria-label="主要欄目">${links}</nav></main>`;
}

export function injectSeoDocument(template: string, document: SeoDocument): string {
  return template
    .replace("<!--app-head-->", () => renderSeoHead(document))
    .replace("<!--app-html-->", () => renderCrawlerFallback(document));
}
