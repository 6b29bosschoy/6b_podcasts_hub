import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { JsonLd, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";
import { useSEO } from "@/hooks/useSEO";

const CATEGORY_LABELS: Record<string, string> = {
  relationship: "兩性關係",
  fengshui: "玄學風水",
  lifestyle: "生活態度",
  interview: "嘉賓訪談",
  other: "其他",
};

const CATEGORY_COLORS: Record<string, string> = {
  relationship: "var(--red)",
  fengshui: "var(--gold)",
  lifestyle: "var(--gold)",
  interview: "var(--gold)",
  other: "var(--text-3)",
};

// Gradient placeholders for posts without images
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, var(--line), var(--bg-card))",
  "linear-gradient(135deg, var(--bg-raise), var(--line))",
  "linear-gradient(135deg, var(--bg-card), var(--bg-card))",
  "linear-gradient(135deg, var(--bg-card), var(--bg-raise))",
  "linear-gradient(135deg, var(--line), var(--bg-card))",
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
  useSEO({
    title: "嘉賓專欄｜路邊電台嘉賓心得、幕後故事與深度觀點",
    description: "路邊電台嘉賓專欄：嘉賓分享訪談後的心得、幕後故事與深度觀點，涉及兩性關係、玄學風水、生活態度等主題。由路邊電台嘉賓親自撰寫。",
    keywords: "嘉賓專欄,路邊電台專欄,心得分享,玄學博客,兩性關係,香港 Podcast 專欄,訪談幕後故事",
    ogTitle: "嘉賓專欄｜路邊電台嘉賓心得、幕後故事與深度觀點",
    ogDescription: "嘉賓分享訪談後的心得、幕後故事與深度觀點，涉及兩性關係、玄學風水、生活態度等主題。",
    ogUrl: "https://www.6bpodcasts.com/blog",
    canonical: "https://www.6bpodcasts.com/blog",
  });

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
      <div className="py-12 text-center" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--line)" }}>
        <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--red)" }}>GUEST COLUMN</div>
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--text)" }}>嘉賓專欄</h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--text-3)" }}>
          嘉賓訪談後的深度心得、幕後故事，以及各界人士的真實分享
        </p>
        <div className="mt-6">
          <Link
            href="/blog/submit"
            className="inline-block px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "white" }}
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
                <div className="w-full" style={{ aspectRatio: "16/9", background: "var(--bg-raise)" }} />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-3 rounded" style={{ background: "var(--line)", width: "40%" }} />
                  <div className="h-5 rounded" style={{ background: "var(--line)" }} />
                  <div className="h-4 rounded" style={{ background: "var(--line)", width: "80%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-2)" }}>暫時未有文章</h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-3)" }}>成為第一位投稿的嘉賓！</p>
            <Link
              href="/blog/submit"
              className="inline-block px-6 py-2.5 rounded-lg font-bold text-sm"
              style={{ background: "var(--red)", color: "white" }}
            >
              立即投稿
            </Link>
          </div>
        ) : (
          /* Article grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => {
              const coverImage = getFirstImage((post as { images?: string }).images);
              const catColor = CATEGORY_COLORS[post.category] ?? "var(--text-3)";
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
                            background: `color-mix(in oklch, ${catColor} 20%, rgba(13,12,10,0.55))`,
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
                                style={{ background: "rgba(13,12,10,0.6)", color: "white" }}
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
                        style={{ color: "var(--text)" }}
                      >
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p
                          className="text-sm leading-relaxed mb-4 line-clamp-2 flex-1"
                          style={{ color: "var(--text-3)" }}
                        >
                          {post.excerpt}
                        </p>
                      )}

                      <div
                        className="flex items-center justify-between mt-auto pt-3"
                        style={{ borderTop: "1px solid var(--line)" }}
                      >
                        <div>
                          <div className="text-xs font-bold" style={{ color: "var(--text-2)" }}>
                            {post.authorName}
                          </div>
                          <div className="text-xs" style={{ color: "var(--text-3)" }}>
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("zh-HK") : ""}
                          </div>
                        </div>
                        <span className="text-xs font-medium" style={{ color: "var(--red)" }}>
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
