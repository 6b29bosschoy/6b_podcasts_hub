import { useEffect } from "react";

export const SITE_NAME = "路邊電台 × 路邊玄學堂";
export const SITE_URL = "https://6bpodcasts.com";
export const DEFAULT_OG_IMAGE =
  "https://cdn-assets.manus.space/webdev/XJagJnJEiagVDDmfVeExSL/logo-1774671882.png";

interface SeoMetaOptions {
  title: string;
  description: string;
  /** Full URL of the OG image (1200×630 recommended). Falls back to logo. */
  ogImage?: string;
  /** Canonical path, e.g. "/blog/my-post". Defaults to current pathname. */
  canonicalPath?: string;
  /** og:type – defaults to "website" */
  ogType?: "website" | "article";
  /** Article published time (ISO string) */
  publishedTime?: string;
  /** Article author name */
  author?: string;
}

function setMetaTag(
  selector: string,
  attr: string,
  value: string,
  attrType: "name" | "property" = "name"
) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrType, attr);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLinkTag(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * useSeoMeta – sets page title, meta description, Open Graph, Twitter Card,
 * and canonical link on mount; restores defaults on unmount.
 */
export function useSeoMeta(opts: SeoMetaOptions) {
  useEffect(() => {
    const {
      title,
      description,
      ogImage = DEFAULT_OG_IMAGE,
      canonicalPath,
      ogType = "website",
      publishedTime,
      author,
    } = opts;

    const fullTitle = `${title}｜${SITE_NAME}`;
    const canonicalUrl = `${SITE_URL}${canonicalPath ?? window.location.pathname}`;

    // ── Document title ──────────────────────────────────────────────────────
    const prevTitle = document.title;
    document.title = fullTitle;

    // ── Meta description ────────────────────────────────────────────────────
    setMetaTag('meta[name="description"]', "description", description);

    // ── Canonical ───────────────────────────────────────────────────────────
    setLinkTag("canonical", canonicalUrl);

    // ── Open Graph ──────────────────────────────────────────────────────────
    setMetaTag('meta[property="og:title"]', "og:title", fullTitle, "property");
    setMetaTag('meta[property="og:description"]', "og:description", description, "property");
    setMetaTag('meta[property="og:url"]', "og:url", canonicalUrl, "property");
    setMetaTag('meta[property="og:type"]', "og:type", ogType, "property");
    setMetaTag('meta[property="og:image"]', "og:image", ogImage, "property");
    setMetaTag('meta[property="og:image:width"]', "og:image:width", "1200", "property");
    setMetaTag('meta[property="og:image:height"]', "og:image:height", "630", "property");
    setMetaTag('meta[property="og:locale"]', "og:locale", "zh_HK", "property");
    setMetaTag('meta[property="og:site_name"]', "og:site_name", SITE_NAME, "property");

    // Article-specific OG tags
    if (ogType === "article" && publishedTime) {
      setMetaTag('meta[property="article:published_time"]', "article:published_time", publishedTime, "property");
    }
    if (ogType === "article" && author) {
      setMetaTag('meta[property="article:author"]', "article:author", author, "property");
    }

    // ── Twitter Card ────────────────────────────────────────────────────────
    setMetaTag('meta[name="twitter:card"]', "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "twitter:title", fullTitle);
    setMetaTag('meta[name="twitter:description"]', "twitter:description", description);
    setMetaTag('meta[name="twitter:image"]', "twitter:image", ogImage);

    // ── Cleanup: restore defaults on unmount ────────────────────────────────
    return () => {
      document.title = prevTitle || `${SITE_NAME}｜香港最真實人物訪談`;
      setMetaTag('meta[name="description"]', "description",
        "路邊電台係香港最真實人物訪談節目，探討兩性關係、都市感情與玄學命理。每位嘉賓講真話，呈現最真實內心世界。");
      setLinkTag("canonical", SITE_URL + "/");
      setMetaTag('meta[property="og:image"]', "og:image", DEFAULT_OG_IMAGE, "property");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.title, opts.description, opts.ogImage, opts.canonicalPath]);
}
