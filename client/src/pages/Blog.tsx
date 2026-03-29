import { useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { JsonLd, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";

const CATEGORY_LABELS: Record<string, string> = {
  relationship: "兩性關係",
  fengshui: "玄學風水",
  lifestyle: "生活態度",
  interview: "嘉賓訪談",
  other: "其他",
};

const CATEGORY_COLORS: Record<string, string> = {
  relationship: "oklch(0.62 0.24 25)",
  fengshui: "oklch(0.55 0.20 250)",
  lifestyle: "oklch(0.65 0.20 145)",
  interview: "oklch(0.78 0.16 75)",
  other: "oklch(0.55 0.02 60)",
};

// Gradient placeholders for posts without images
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.18 0.04 25), oklch(0.12 0.02 260))",
  "linear-gradient(135deg, oklch(0.14 0.04 250), oklch(0.18 0.03 145))",
  "linear-gradient(135deg, oklch(0.16 0.05 75), oklch(0.12 0.02 25))",
  "linear-gradient(135deg, oklch(0.12 0.03 145), oklch(0.16 0.04 250))",
  "linear-gradient(135deg, oklch(0.18 0.03 300), oklch(0.12 0.02 25))",
];

/** Extract first image URL from a JSON string like '["url1","url2"]' */
function getFirstImage(imagesJson: string | null | undefined): string | null {
  if (!imagesJson) return null;
  try {
    const arr = JSON.parse(imagesJson);
    if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === "string") return arr[0];
  } catch {}
  return null;
}

export default function Blog() {
  useEffect(() => {
    document.title = "嘉賓專欄｜路邊電台嘉賓心得與幕後故事";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "路邊電台嘉賓專欄：嘉賓分享訪談後的心得、幕後故事與深度觀點，涉及兩性關係、玄學風水、生活態度等主題。");
    setMeta("keywords", "嘉賓專欄,路邊電台專欄,心得分享,玄學博客,兩性關係,香港Podcast專欄,訪談幕後故事");
    setMeta("og:title", "嘉賓專欄｜路邊電台 × 路邊玄學堂", true);
    setMeta("og:description", "嘉賓分享訪談後的心得、幕後故事與深度觀點，涉及兩性關係、玄學風水、生活態度等主題。", true);
    return () => { document.title = "路邊電台 × 路邊玄學堂｜香港最真實人物訪談"; };
  }, []);

  const { data: posts, isLoading } = trpc.blog.list.useQuery({ limit: 20, offset: 0 });

  const blogSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "嘉賓專欄｜路邊電台",
      description: "路邊電台嘉賓專欄：嘉賓分享訪談後的心得、幕後故事與深度觀點，涵蓋兩性關係、玄學風水、生活態度等主題。",
      url: `${SITE_URL}/blog`,
      publisher: {
        "@type": "Organization",
        name: "路邊電台 × 路邊玄學堂",
        url: SITE_URL,
      },
      inLanguage: "zh-HK",
    },
    buildBreadcrumbSchema([
      { name: "首頁", url: SITE_URL },
      { name: "嘉賓專欄", url: `${SITE_URL}/blog` },
    ]),
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <JsonLd data={blogSchemas} id="blog" />

      {/* Page header */}
      <div className="py-12 text-center" style={{ background: "oklch(0.10 0.01 260)", borderBottom: "1px solid oklch(0.18 0.02 260)" }}>
        <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>GUEST COLUMN</div>
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>嘉賓專欄</h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: "oklch(0.55 0.02 60)" }}>
          嘉賓訪談後的深度心得、幕後故事，以及各界人士的真實分享
        </p>
        <div className="mt-6">
          <Link
            href="/blog/submit"
            className="inline-block px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}
          >
            投稿分享你的故事 →
          </Link>
        </div>
      </div>

      <div className="container py-12">
        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden animate-pulse">
                <div className="w-full" style={{ aspectRatio: "16/9", background: "oklch(0.16 0.02 260)" }} />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-3 rounded" style={{ background: "oklch(0.20 0.02 260)", width: "40%" }} />
                  <div className="h-5 rounded" style={{ background: "oklch(0.20 0.02 260)" }} />
                  <div className="h-4 rounded" style={{ background: "oklch(0.18 0.02 260)", width: "80%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "oklch(0.75 0.01 60)" }}>暫時未有文章</h3>
            <p className="text-sm mb-6" style={{ color: "oklch(0.50 0.02 60)" }}>成為第一位投稿的嘉賓！</p>
            <Link
              href="/blog/submit"
              className="inline-block px-6 py-2.5 rounded-lg font-bold text-sm"
              style={{ background: "oklch(0.60 0.22 25)", color: "white" }}
            >
              立即投稿
            </Link>
          </div>
        ) : (
          /* Article grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => {
              const coverImage = getFirstImage((post as { images?: string }).images);
              const catColor = CATEGORY_COLORS[post.category] ?? "oklch(0.55 0.02 60)";
              const placeholderBg = PLACEHOLDER_GRADIENTS[idx % PLACEHOLDER_GRADIENTS.length];

              return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="glass-card rounded-xl overflow-hidden group transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full flex flex-col">

                    {/* ── Cover image / placeholder ─────────────────── */}
                    <div
                      className="w-full overflow-hidden flex-shrink-0 relative"
                      style={{ aspectRatio: "16/9" }}
                    >
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        /* Gradient placeholder with category icon */
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: placeholderBg }}
                        >
                          <span className="text-4xl opacity-40 select-none">
                            {post.category === "relationship" ? "💕"
                              : post.category === "fengshui" ? "🔮"
                              : post.category === "lifestyle" ? "🌿"
                              : post.category === "interview" ? "🎙️"
                              : "✍️"}
                          </span>
                        </div>
                      )}

                      {/* Category badge overlay */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded backdrop-blur-sm"
                          style={{
                            background: `color-mix(in oklch, ${catColor} 20%, oklch(0 0 0 / 0.55))`,
                            color: catColor,
                            border: `1px solid color-mix(in oklch, ${catColor} 40%, transparent)`,
                          }}
                        >
                          {CATEGORY_LABELS[post.category] ?? post.category}
                        </span>
                      </div>

                      {/* Image count badge (only if > 1 image) */}
                      {(() => {
                        try {
                          const imgs = JSON.parse((post as { images?: string }).images ?? "[]");
                          if (Array.isArray(imgs) && imgs.length > 1) {
                            return (
                              <div
                                className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-bold"
                                style={{ background: "oklch(0 0 0 / 0.60)", color: "white" }}
                              >
                                📷 {imgs.length}
                              </div>
                            );
                          }
                        } catch {}
                        return null;
                      })()}
                    </div>

                    {/* ── Card body ─────────────────────────────────── */}
                    <div className="p-5 flex flex-col flex-1">
                      <h2
                        className="font-black text-base leading-snug mb-2 line-clamp-2"
                        style={{ color: "oklch(0.90 0.01 60)" }}
                      >
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p
                          className="text-sm leading-relaxed mb-4 line-clamp-2 flex-1"
                          style={{ color: "oklch(0.55 0.02 60)" }}
                        >
                          {post.excerpt}
                        </p>
                      )}

                      <div
                        className="flex items-center justify-between mt-auto pt-3"
                        style={{ borderTop: "1px solid oklch(0.20 0.02 260)" }}
                      >
                        <div>
                          <div className="text-xs font-bold" style={{ color: "oklch(0.75 0.01 60)" }}>
                            {post.authorName}
                          </div>
                          <div className="text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("zh-HK") : ""}
                          </div>
                        </div>
                        <span className="text-xs font-medium" style={{ color: "oklch(0.62 0.24 25)" }}>
                          閱讀全文 →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
