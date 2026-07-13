import { useEffect } from "react";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

/**
 * JsonLd component injects Schema.org structured data as JSON-LD script tags.
 * Supports single schema objects or arrays of multiple schemas.
 * Uses useEffect to inject/clean up script tags on mount/unmount.
 */
export function JsonLd({ data, id = "json-ld" }: JsonLdProps) {
  useEffect(() => {
    const scriptId = `json-ld-${id}`;
    // Remove existing script with same id to avoid duplicates
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.text = JSON.stringify(Array.isArray(data) ? data : data);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [data, id]);

  return null;
}

// ─── Schema builder helpers ────────────────────────────────────────────────

export const SITE_URL = "https://6bpodcasts.com";
export const BRAND_NAME = "路邊電台 × 路邊玄學堂";
export const BRAND_NAME_EN = "6B Podcasts";
export const LOGO_URL =
  "https://cdn-assets.manus.space/webdev/XJagJnJEiagVDDmfVeExSL/logo-1774671882.png";

/** Organization schema – reused across pages */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    alternateName: [BRAND_NAME_EN, "路邊電台", "路邊玄學堂", "6bpodcasts"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 400,
      height: 400,
    },
    description:
      "香港最真實人物訪談平台，涵蓋兩性關係、都市感情、玄學命理等深度訪談內容。",
    foundingDate: "2020",
    founder: {
      "@type": "Person",
      name: "Ray Choy",
      jobTitle: "創辦人 / 主持人",
    },
    sameAs: [
      "https://www.youtube.com/@6bpodcasts",
      "https://www.youtube.com/@路邊玄學堂",
      "https://www.facebook.com/6bpodcasts",
      "https://www.instagram.com/6bpodcasts",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["zh-HK", "zh-TW"],
    },
  };
}

/** WebSite schema with Sitelinks Searchbox */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND_NAME,
    url: SITE_URL,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Article schema for blog posts */
export function buildArticleSchema(post: {
  title: string;
  excerpt?: string | null;
  content: string;
  authorName: string;
  authorBio?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date;
  slug: string;
  coverImage?: string | null;
  images?: string;
}) {
  const imageUrl = (() => {
    try {
      const imgs = JSON.parse(post.images || "[]");
      return imgs[0] || post.coverImage || LOGO_URL;
    } catch {
      return post.coverImage || LOGO_URL;
    }
  })();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    image: {
      "@type": "ImageObject",
      url: imageUrl,
    },
    author: {
      "@type": "Person",
      name: post.authorName,
      description: post.authorBio || undefined,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    datePublished: post.publishedAt?.toISOString() || new Date().toISOString(),
    dateModified: post.updatedAt?.toISOString() || new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    inLanguage: "zh-HK",
  };
}

/** FAQPage schema for blog post FAQ sections */
export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** PodcastSeries schema for /podcasts and /episodes pages */
export function buildPodcastSeriesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "@id": `${SITE_URL}/#podcast`,
    name: "路邊電台 6B Podcasts",
    description: "香港最真實人物訪談 Podcast，探索兩性關係、人生選擇、都市情感與香港人的內心世界。",
    url: `${SITE_URL}/podcasts`,
    image: LOGO_URL,
    inLanguage: "zh-HK",
    author: {
      "@type": "Person",
      name: "Ray Choy",
      jobTitle: "創辦人 / 主持人",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    webFeed: [
      { "@type": "DataFeed", url: "https://anchor.fm/s/6bpodcasts/podcast/rss" },
    ],
    sameAs: [
      "https://www.youtube.com/@6bpodcasts",
      "https://podcasts.apple.com/hk/podcast/id1548484952",
      "https://open.spotify.com/show/6bpodcasts",
    ],
  };
}

/** PodcastEpisode schema for individual video/episode items */
export function buildPodcastEpisodeSchema(episode: {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string | null;
  publishedAt: string;
  duration?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    "@id": episode.url,
    name: episode.title,
    description: episode.description || episode.title,
    url: episode.url,
    image: episode.thumbnail || LOGO_URL,
    datePublished: episode.publishedAt,
    duration: episode.duration || undefined,
    partOfSeries: {
      "@id": `${SITE_URL}/#podcast`,
    },
    inLanguage: "zh-HK",
  };
}

/** Person schema for mystic master profiles */
export function buildPersonSchema(master: {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  description: string;
  imageUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/mystic/masters/${master.id}#person`,
    name: master.name,
    jobTitle: master.title,
    description: master.description,
    image: master.imageUrl || LOGO_URL,
    knowsAbout: master.specialties,
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
    },
    url: `${SITE_URL}/mystic/masters/${master.id}`,
  };
}

/** Service + Offer schema for mystic services / pricing pages */
export function buildServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  price?: string;
  priceCurrency?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: {
      "@type": "Place",
      name: "Hong Kong",
    },
    inLanguage: "zh-HK",
  };
  if (service.price) {
    schema.offers = {
      "@type": "Offer",
      price: service.price,
      priceCurrency: service.priceCurrency || "HKD",
      availability: "https://schema.org/InStock",
      url: service.url,
    };
  }
  return schema;
}

/** BreadcrumbList schema helper */
export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
