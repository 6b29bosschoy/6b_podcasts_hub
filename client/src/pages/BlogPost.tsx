import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import ShareButtons from "@/components/ShareButtons";
import { useSeoMeta, SITE_URL } from "@/hooks/useSeoMeta";
import { trackFbEvent } from "@/components/FacebookPixel";

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

  // SEO meta for this article – images parsed here for OG image
  const seoImages: string[] = (() => { try { return JSON.parse(post?.images || "[]"); } catch { return []; } })();
  useSeoMeta({
    title: post?.title ?? "嘉賓專欄",
    description: post?.excerpt ?? post?.content?.slice(0, 120) ?? "路邊電台嘉賓心得與幕後故事",
    ogImage: seoImages[0] ?? undefined,
    canonicalPath: `/blog/${slug}`,
    ogType: "article",
    publishedTime: post?.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    author: post?.authorName ?? undefined,
  });

  // Track article view in FB Pixel
  useEffect(() => {
    if (post) {
      trackFbEvent("ViewContent", { content_name: post.title, content_category: post.category });
    }
  }, [post?.id]);

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

  const openLightbox = (idx: number) => { setLightboxIndex(idx); setLightboxOpen(true); };

  return (
    <div className="min-h-screen pt-24 pb-16">
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

          <div className="flex items-center gap-4 mb-8 pb-8" style={{ borderBottom: "1px solid oklch(0.20 0.02 260)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm" style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}>
              {post.authorName.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "oklch(0.85 0.01 60)" }}>{post.authorName}</div>
              {post.authorBio && <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{post.authorBio}</div>}
            </div>
            <div className="ml-auto text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("zh-HK") : ""}
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

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid oklch(0.20 0.02 260)" }}>
          {/* Share buttons */}
          <div className="glass-card rounded-xl p-6 mb-4">
            <ShareButtons
              url={`${SITE_URL}/blog/${slug}`}
              title={post?.title}
              description={post?.excerpt ?? post?.content?.slice(0, 80)}
              label="分享這篇文章"
            />
          </div>
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
