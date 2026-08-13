import { useEffect } from "react";

const SITE_NAME = "6B Podcast";
const SITE_URL = "https://6bpodcasts.com";
const DEFAULT_OG_IMAGE = "https://6bpodcasts.com/manus-storage/og-image-main_4e62cddd.jpg";
const DEFAULT_TITLE = "6B Podcast｜香港兩性關係 Podcast・感情樹窿・玄學拆局";

function normaliseSiteUrl(url: string): string {
  return url.replace(/^https?:\/\/www\.6bpodcasts\.com(?=\/|$)/, SITE_URL);
}

interface SEOOptions {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export function useSEO(options: SEOOptions) {
  useEffect(() => {
    const {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage = DEFAULT_OG_IMAGE,
      ogUrl,
      canonical,
      twitterTitle,
      twitterDescription,
    } = options;

    // Set document title
    document.title = title;

    // Helper to set/create meta tags
    const setMeta = (name: string, content: string, isProp = false) => {
      const attr = isProp ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Helper to set/create link tags
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    const currentUrl = `${SITE_URL}${window.location.pathname}${window.location.search}`;

    // Standard meta tags
    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);

    // Open Graph
    setMeta("og:type", "website", true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:title", ogTitle || title, true);
    setMeta("og:description", ogDescription || description, true);
    const resolvedImage = normaliseSiteUrl(ogImage);
    setMeta("og:image", resolvedImage, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("og:locale", "zh_HK", true);
    const resolvedUrl = normaliseSiteUrl(ogUrl || canonical || currentUrl);
    setMeta("og:url", resolvedUrl, true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", twitterTitle || ogTitle || title);
    setMeta("twitter:description", twitterDescription || ogDescription || description);
    setMeta("twitter:image", resolvedImage);
    setMeta("twitter:url", resolvedUrl);

    // Canonical
    setLink("canonical", normaliseSiteUrl(canonical || resolvedUrl));

    // Cleanup: restore default title on unmount
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [
    options.title,
    options.description,
    options.keywords,
    options.ogTitle,
    options.ogDescription,
    options.ogImage,
    options.ogUrl,
    options.canonical,
  ]);
}

export { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE };
