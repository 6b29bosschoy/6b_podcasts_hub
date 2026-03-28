import { useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

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

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="py-12 text-center" style={{ background: "oklch(0.10 0.01 260)", borderBottom: "1px solid oklch(0.18 0.02 260)" }}>
        <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>GUEST COLUMN</div>
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>嘉賓專欄</h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: "oklch(0.55 0.02 60)" }}>
          嘉賓訪談後的深度心得、幕後故事，以及各界人士的真實分享
        </p>
        <div className="mt-6">
          <Link href="/blog/submit"
            className="inline-block px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}>
            投稿分享你的故事 →
          </Link>
        </div>
      </div>

      <div className="container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "oklch(0.75 0.01 60)" }}>暫時未有文章</h3>
            <p className="text-sm mb-6" style={{ color: "oklch(0.50 0.02 60)" }}>成為第一位投稿的嘉賓！</p>
            <Link href="/blog/submit"
              className="inline-block px-6 py-2.5 rounded-lg font-bold text-sm"
              style={{ background: "oklch(0.60 0.22 25)", color: "white" }}>
              立即投稿
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="glass-card rounded-xl overflow-hidden group transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full flex flex-col">
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${CATEGORY_COLORS[post.category] ?? "oklch(0.55 0.02 60)"} / 0.15`, color: CATEGORY_COLORS[post.category] ?? "oklch(0.55 0.02 60)" }}>
                        {CATEGORY_LABELS[post.category] ?? post.category}
                      </span>
                    </div>
                    <h2 className="font-black text-base leading-snug mb-3 line-clamp-2 flex-1" style={{ color: "oklch(0.90 0.01 60)" }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: "oklch(0.55 0.02 60)" }}>
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid oklch(0.20 0.02 260)" }}>
                      <div>
                        <div className="text-xs font-bold" style={{ color: "oklch(0.75 0.01 60)" }}>{post.authorName}</div>
                        <div className="text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("zh-HK") : ""}
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: "oklch(0.62 0.24 25)" }}>閱讀全文 →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
