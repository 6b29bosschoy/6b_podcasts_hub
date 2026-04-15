import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Eye, ChevronDown, ChevronUp } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import ShareButtons from "@/components/ShareButtons";
import { JsonLd, buildArticleSchema, buildFAQSchema } from "@/components/JsonLd";

const CATEGORY_LABELS: Record<string, string> = {
  relationship: "兩性關係",
  fengshui: "玄學風水",
  lifestyle: "生活態度",
  interview: "嘉賓訪談",
  other: "其他",
};

export default function BlogPost({ slug }: { slug: string }) {
  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery({ slug });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const incrementViewMutation = trpc.blog.incrementViewCount.useMutation();

  const [relatedOffset, setRelatedOffset] = useState(0);
  const RELATED_LIMIT = 3;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const { data: faqData } = trpc.blog.getFaq.useQuery(
    { slug },
    { enabled: !!slug }
  );
  const faqs = faqData ?? [];

  const { data: relatedData } = trpc.blog.getRelated.useQuery(
    { category: post?.category ?? "other", excludeSlug: slug, limit: RELATED_LIMIT, offset: relatedOffset },
    { enabled: !!post?.category }
  );

  const relatedPosts = relatedData?.posts ?? [];
  const relatedTotal = relatedData?.total ?? 0;
  const hasMore = relatedTotal > RELATED_LIMIT;

  const handleNextBatch = () => {
    const nextOffset = relatedOffset + RELATED_LIMIT;
    setRelatedOffset(nextOffset >= relatedTotal ? 0 : nextOffset);
  };

  // Increment view count when article loads
  useEffect(() => {
    if (post?.slug && !incrementViewMutation.isPending) {
      incrementViewMutation.mutate({ slug: post.slug });
    }
  }, [post?.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: "oklch(0.62 0.24 25)" }} />
          <p className="text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "oklch(0.75 0.01 60)" }}>文章不存在</h2>
          <Link href="/blog" className="text-sm" style={{ color: "oklch(0.62 0.24 25)" }}>← 返回嘉賓專欄</Link>
        </div>
      </div>
    );
  }

  // Parse images and links from JSON strings
  const images: string[] = (() => {
    try { return JSON.parse(post.images || "[]"); } catch { return []; }
  })();
  const links: { title: string; url: string }[] = (() => {
    try { return JSON.parse(post.links || "[]"); } catch { return []; }
  })();

  // Build structured data schemas
  const articleSchema = buildArticleSchema({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    authorName: post.authorName,
    authorBio: post.authorBio,
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
    updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined,
    slug: post.slug,
    coverImage: post.coverImage,
    images: post.images,
  });
  const faqSchema = faqs.length > 0 ? buildFAQSchema(faqs) : null;

  const openLightbox = (idx: number) => { setLightboxIndex(idx); setLightboxOpen(true); };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Structured Data JSON-LD */}
      <JsonLd data={articleSchema} id={`article-${slug}`} />
      {faqSchema && <JsonLd data={faqSchema} id={`faq-${slug}`} />}

      <div className="container max-w-3xl mx-auto py-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-80 transition-opacity" style={{ color: "oklch(0.62 0.24 25)" }}>
          <ArrowLeft size={16} />
          返回嘉賓專欄
        </Link>

        <article>
          <div className="mb-6">
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "oklch(0.62 0.24 25 / 0.15)", color: "oklch(0.62 0.24 25)" }}>
              {CATEGORY_LABELS[post.category] ?? post.category}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black mb-6 leading-tight" style={{ color: "oklch(0.92 0.01 60)" }}>
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-8 pb-8" style={{ borderBottom: "1px solid oklch(0.20 0.02 260)" }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm" style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}>
                {post.authorName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: "oklch(0.85 0.01 60)" }}>{post.authorName}</div>
                {post.authorBio && <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{post.authorBio}</div>}
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs" style={{ color: "oklch(0.55 0.02 60)" }}>
              <div>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("zh-HK") : ""}</div>
              <div className="flex items-center gap-1.5">
                <Eye size={14} />
                <span>{post.viewCount ?? 0} 人閱讀</span>
              </div>
            </div>
          </div>

          {post.excerpt && (
            <p className="text-base italic mb-8 p-4 rounded-lg" style={{ background: "oklch(0.12 0.015 260)", borderLeft: "3px solid oklch(0.62 0.24 25)", color: "oklch(0.70 0.01 60)" }}>
              {post.excerpt}
            </p>
          )}

          {/* ── Image Gallery ──────────────────────────────────────── */}
          {images.length > 0 && (
            <div className="mb-8 rounded-xl overflow-hidden" style={{ background: "oklch(0.11 0.015 260)" }}>
              {/* Main image with carousel */}
              <div className="relative" style={{ aspectRatio: "16/9" }}>
                <img
                  src={images[carouselIndex]}
                  alt={`圖片 ${carouselIndex + 1}`}
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={() => openLightbox(carouselIndex)}
                  title="點擊放大"
                />

                {/* Prev / Next arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCarouselIndex((i) => Math.max(0, i - 1))}
                      disabled={carouselIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all disabled:opacity-30 hover:opacity-80"
                      style={{ background: "oklch(0 0 0 / 0.55)" }}
                    >
                      <ChevronLeft size={20} style={{ color: "white" }} />
                    </button>
                    <button
                      onClick={() => setCarouselIndex((i) => Math.min(images.length - 1, i + 1))}
                      disabled={carouselIndex === images.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all disabled:opacity-30 hover:opacity-80"
                      style={{ background: "oklch(0 0 0 / 0.55)" }}
                    >
                      <ChevronRight size={20} style={{ color: "white" }} />
                    </button>
                  </>
                )}

                {/* Counter badge */}
                {images.length > 1 && (
                  <div
                    className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "oklch(0 0 0 / 0.6)", color: "white" }}
                  >
                    {carouselIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className="rounded-lg overflow-hidden flex-shrink-0 transition-all"
                      style={{
                        width: 60,
                        height: 60,
                        border: idx === carouselIndex ? "2px solid oklch(0.62 0.24 25)" : "2px solid transparent",
                        opacity: idx === carouselIndex ? 1 : 0.55,
                      }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Article content ──────────────────────────────────── */}
          <div className="prose prose-invert max-w-none" style={{ color: "oklch(0.75 0.01 60)", lineHeight: "1.9" }}>
            {post.content.split("\n").map((para, i) =>
              para.trim() ? (
                <p key={i} className="mb-4" style={{ color: "oklch(0.75 0.01 60)" }}>{para}</p>
              ) : <br key={i} />
            )}
          </div>

          {/* ── Related Links ─────────────────────────────────────── */}
          {links.length > 0 && (
            <div className="mt-8 p-5 rounded-xl" style={{ background: "oklch(0.12 0.015 260)", border: "1px solid oklch(0.20 0.02 260)" }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: "oklch(0.70 0.01 60)" }}>相關連結</h3>
              <div className="flex flex-col gap-2">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity group"
                    style={{ color: "oklch(0.62 0.18 200)" }}
                  >
                    <ExternalLink size={14} className="flex-shrink-0" />
                    <span className="underline underline-offset-2 group-hover:no-underline">{link.title || link.url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* ── FAQ Section ──────────────────────────────────── */}
        {faqs.length > 0 && (
          <div className="mt-10 rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.22 0.02 260)" }}>
            <div className="px-5 py-4" style={{ background: "oklch(0.13 0.015 260)" }}>
              <h2 className="text-sm font-black tracking-widest uppercase" style={{ color: "oklch(0.62 0.24 25)" }}>常見問題 FAQ</h2>
            </div>
            <div className="divide-y" style={{ borderColor: "oklch(0.20 0.02 260)" }}>
              {faqs.map((faq, idx) => (
                <div key={idx}>
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:opacity-80 transition-opacity"
                    style={{ background: "oklch(0.11 0.015 260)" }}
                  >
                    <span className="text-sm font-bold" style={{ color: "oklch(0.88 0.01 60)" }}>{faq.question}</span>
                    {openFaqIndex === idx
                      ? <ChevronUp size={16} style={{ color: "oklch(0.62 0.24 25)", flexShrink: 0 }} />
                      : <ChevronDown size={16} style={{ color: "oklch(0.50 0.02 60)", flexShrink: 0 }} />}
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-5 py-4" style={{ background: "oklch(0.10 0.012 260)", borderTop: "1px solid oklch(0.18 0.02 260)" }}>
                      <p className="text-sm leading-relaxed" style={{ color: "oklch(0.70 0.01 60)" }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Share Buttons ─────────────────────────────────── */}
        <ShareButtons
          url={typeof window !== "undefined" ? window.location.href : `https://6bpodcasts.com/blog/${slug}`}
          title={post.title}
          excerpt={post.excerpt ?? undefined}
        />

        {/* ── Related Articles ──────────────────────────────── */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-10" style={{ borderTop: "1px solid oklch(0.20 0.02 260)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: "oklch(0.22 0.02 260)" }} />
              <h2 className="text-sm font-black tracking-widest uppercase" style={{ color: "oklch(0.62 0.24 25)" }}>相關文章</h2>
              <div className="h-px flex-1" style={{ background: "oklch(0.22 0.02 260)" }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => {
                const relatedImages: string[] = (() => { try { return JSON.parse(related.images || "[]"); } catch { return []; } })();
                return (
                  <Link key={related.slug} href={`/blog/${related.slug}`}
                    className="group rounded-xl overflow-hidden flex flex-col hover:opacity-90 transition-opacity"
                    style={{ background: "oklch(0.12 0.015 260)", border: "1px solid oklch(0.20 0.02 260)" }}
                  >
                    {/* Cover */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                      {relatedImages.length > 0 ? (
                        <img src={relatedImages[0]} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : related.coverImage ? (
                        <img src={related.coverImage} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, oklch(0.18 0.03 260), oklch(0.22 0.05 300))" }}>
                          {CATEGORY_LABELS[related.category] === "兩性關係" ? "💕" : CATEGORY_LABELS[related.category] === "玄學風水" ? "✨" : "📝"}
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "oklch(0.62 0.24 25 / 0.85)", color: "white" }}>
                          {CATEGORY_LABELS[related.category] ?? related.category}
                        </span>
                      </div>
                    </div>
                    {/* Text */}
                    <div className="p-3 flex flex-col gap-1.5 flex-1">
                      <h3 className="text-sm font-bold leading-snug line-clamp-2" style={{ color: "oklch(0.88 0.01 60)" }}>{related.title}</h3>
                      <div className="flex items-center justify-between mt-auto pt-1">
                        <span className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{related.authorName}</span>
                        <span className="text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>
                          {related.publishedAt ? new Date(related.publishedAt).toLocaleDateString("zh-HK") : ""}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {/* 換一批按鈕 */}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextBatch}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all hover:opacity-80 active:scale-95"
                  style={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(0.30 0.03 260)", color: "oklch(0.70 0.01 60)" }}
                >
                  <span style={{ fontSize: "1rem" }}>🔄</span>
                  換一批
                  <span className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>({relatedTotal} 篇同類文章)</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-8" style={{ borderTop: "1px solid oklch(0.20 0.02 260)" }}>
          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-sm mb-4" style={{ color: "oklch(0.55 0.02 60)" }}>喜歡這篇文章？追蹤路邊電台獲取更多內容！</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: "oklch(0.60 0.22 25)", color: "white" }}>
                訂閱 YouTube
              </a>
              <Link href="/blog" className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(0.28 0.02 260)", color: "oklch(0.85 0.01 60)" }}>
                更多文章
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, i - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(images.length - 1, i + 1))}
        />
      )}
    </div>
  );
}
