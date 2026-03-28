import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { JsonLd, buildBreadcrumbSchema, buildOrganizationSchema, SITE_URL, LOGO_URL, BRAND_NAME } from "@/components/JsonLd";
import { Play, ChevronRight, Star, Users, Youtube, Instagram, Facebook, Mic, Sparkles, ExternalLink, Volume2 } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const QUOTES = [
  { text: "感情嘅問題，唔係對錯，係你有冇勇氣面對自己。", author: "Ray Choy", role: "主持人" },
  { text: "風水改變唔到命運，但可以幫你走得更順。", author: "路邊玄學堂", role: "玄學師傅" },
  { text: "每一段關係都係一面鏡，照出你自己。", author: "嘉賓語錄", role: "訪談精華" },
  { text: "唔係所有問題都有答案，但每個問題都值得被聆聽。", author: "Ray Choy", role: "主持人" },
];

const SERVICES = [
  { icon: "🧭", title: "風水諮詢", desc: "家居 / 辦公室佈局分析", href: "/booking", color: "oklch(0.78 0.16 75)" },
  { icon: "🔮", title: "八字命理", desc: "個人運程深度解析", href: "/booking", color: "oklch(0.62 0.24 25)" },
  { icon: "🃏", title: "塔羅占卜", desc: "人生問題指引解讀", href: "/booking", color: "oklch(0.55 0.20 250)" },
  { icon: "🎬", title: "品牌合作", desc: "YouTube 訪談 / 廣告置入", href: "/partnership", color: "oklch(0.65 0.20 145)" },
];

const SOCIAL_LINKS = [
  { icon: Youtube, label: "YouTube", sub: "路邊電台", href: "https://www.youtube.com/@6bpodcasts", color: "oklch(0.60 0.22 25)", bg: "oklch(0.60 0.22 25 / 0.12)" },
  { icon: Facebook, label: "Facebook", sub: "路邊電台", href: "https://www.facebook.com/6bpodcasts", color: "oklch(0.55 0.20 250)", bg: "oklch(0.55 0.20 250 / 0.12)" },
  { icon: Instagram, label: "Instagram", sub: "@6bpodcasts", href: "https://www.instagram.com/6bpodcasts", color: "oklch(0.62 0.24 25)", bg: "oklch(0.62 0.24 25 / 0.12)" },
  { icon: Mic, label: "Podcast", sub: "Apple / Spotify", href: "/podcasts", color: "oklch(0.65 0.15 290)", bg: "oklch(0.65 0.15 290 / 0.12)" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuoteCarousel() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % QUOTES.length);
        setFade(true);
      }, 400);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const q = QUOTES[idx];
  return (
    <div
      className="relative rounded-2xl p-6 md:p-8 text-center transition-opacity duration-400"
      style={{
        background: "oklch(0.13 0.018 260)",
        border: "1px solid oklch(0.22 0.025 260)",
        opacity: fade ? 1 : 0,
      }}
    >
      <div className="text-2xl mb-4" style={{ color: "oklch(0.78 0.16 75)" }}>"</div>
      <p className="text-base md:text-lg font-medium leading-relaxed mb-4" style={{ color: "oklch(0.88 0.01 60)" }}>
        {q.text}
      </p>
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm font-bold" style={{ color: "oklch(0.78 0.16 75)" }}>{q.author}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.78 0.16 75 / 0.15)", color: "oklch(0.78 0.16 75)" }}>{q.role}</span>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 400); }}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{ background: i === idx ? "oklch(0.78 0.16 75)" : "oklch(0.30 0.02 260)" }}
          />
        ))}
      </div>
    </div>
  );
}

type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  viewCount: string;
  duration: string;
  publishedAt: string;
  channelTitle?: string;
};

function VideoCard({ video, featured = false }: { video: VideoItem; featured?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden transition-transform duration-200"
      style={{
        background: "oklch(0.13 0.018 260)",
        border: `1px solid ${hovered ? "oklch(0.78 0.16 75 / 0.5)" : "oklch(0.20 0.02 260)"}`,
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 12px 32px oklch(0 0 0 / 0.4)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
          loading="lazy"
        />
        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ background: "oklch(0 0 0 / 0.35)", opacity: hovered ? 1 : 0 }}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "oklch(0.60 0.22 25)" }}>
            <Play size={20} fill="white" color="white" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: "oklch(0 0 0 / 0.75)", color: "white" }}>
          {video.duration}
        </div>
        {featured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: "oklch(0.60 0.22 25)", color: "white" }}>
            <Star size={10} fill="white" /> 最新
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold leading-snug line-clamp-2 mb-2" style={{ color: "oklch(0.88 0.01 60)" }}>
          {video.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{video.viewCount} 次觀看</span>
          <ExternalLink size={12} style={{ color: "oklch(0.45 0.02 60)" }} />
        </div>
      </div>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Welcome() {
  // UTM source detection
  const [utmSource, setUtmSource] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const src = params.get("utm_source") || params.get("ref");
    setUtmSource(src);

    // ── SEO & OG meta for FB/IG sharing ──────────────────────────────────
    const prevTitle = document.title;
    document.title = "歡迎來到路邊電台 × 路邊玄學堂｜香港最真實人物訪談 Podcast";

    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };

    const ogImg = "https://cdn-assets.manus.space/webdev/XJagJnJEiagVDDmfVeExSL/logo-1774671882.png";
    const pageUrl = "https://6bpodcasts.com/welcome";
    const desc = "香港最真實訪談 Podcast，探討兩性關係、都市感情、玄學命理。486+ 集精彩內容完全免費，立即收看！";

    setMeta("name", "description", desc);
    setMeta("name", "keywords", "路邊電台,路邊玄學堂,香港Podcast,人物訪談,兩性關係,玄學,風水,命理,6B Podcasts");

    // Open Graph – critical for FB/IG link preview
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "路邊電台 × 路邊玄學堂");
    setMeta("property", "og:title", "歡迎來到路邊電台 × 路邊玄學堂｜香港最真實人物訪談 Podcast");
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:image", ogImg);
    setMeta("property", "og:image:width", "400");
    setMeta("property", "og:image:height", "400");
    setMeta("property", "og:image:alt", "路邊電台 × 路邊玄學堂");
    setMeta("property", "og:locale", "zh_HK");

    // Twitter / X Card
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", "歡迎來到路邊電台 × 路邊玄學堂");
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", ogImg);

    // Canonical for this page
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    const prevCanonical = canonical.href;
    canonical.href = pageUrl;

    return () => {
      document.title = prevTitle;
      if (canonical) canonical.href = prevCanonical;
    };
  }, []);

  // Fetch latest videos (6 from all channels)
  const { data: videosData, isLoading: videosLoading } = trpc.youtube.getVideos.useQuery(
    { channel: "all", limit: 6 },
    { staleTime: 1000 * 60 * 30 }
  );

  // Fetch channel stats
  const { data: channelsData } = trpc.youtube.getChannels.useQuery(undefined, {
    staleTime: 1000 * 60 * 60,
  });

  const videos = (videosData?.videos ?? []) as VideoItem[];

  // Compute total subscribers display
  const podcastsSubs = (channelsData?.podcasts as { subscriberCount?: string } | null)?.subscriberCount;
  const fengshuiSubs = (channelsData?.fengshui as { subscriberCount?: string } | null)?.subscriberCount;
  const totalSubsNum =
    (parseInt(podcastsSubs ?? "0") || 0) + (parseInt(fengshuiSubs ?? "0") || 0);
  const totalSubs =
    totalSubsNum >= 1000
      ? `${(totalSubsNum / 1000).toFixed(1)}K`
      : totalSubsNum > 0
      ? String(totalSubsNum)
      : "16K+";

  // Landing page schemas
  const welcomeSchemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema([
      { name: "首頁", url: SITE_URL },
      { name: "歡迎來到路邊電台", url: `${SITE_URL}/welcome` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `歡迎來到${BRAND_NAME}`,
      description: "香港最真實人物訪談 Podcast 平台，探討兩性關係、玄學命理、都市感情。立即收看最新影片或預約玄學服務。",
      url: `${SITE_URL}/welcome`,
      image: LOGO_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ];

  const sourceLabel =
    utmSource === "facebook" || utmSource === "fb"
      ? "Facebook"
      : utmSource === "instagram" || utmSource === "ig"
      ? "Instagram"
      : null;

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0.01 260)" }}>
      <JsonLd data={welcomeSchemas} id="welcome" />

      {/* ── Sticky Top Bar ─────────────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: "oklch(0.08 0.01 260 / 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.18 0.02 260)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <img src={LOGO_URL} alt="路邊電台" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <div className="text-xs font-black leading-none" style={{ color: "oklch(0.92 0.01 60)" }}>路邊電台</div>
            <div className="text-xs leading-none" style={{ color: "oklch(0.55 0.02 60)" }}>× 路邊玄學堂</div>
          </div>
        </Link>
        <Link
          href="/booking"
          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-90"
          style={{ background: "oklch(0.60 0.22 25)", color: "white" }}
        >
          立即預約玄學服務
        </Link>
      </div>

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-16 pb-16 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, oklch(0.10 0.018 260) 0%, oklch(0.07 0.01 260) 60%, oklch(0.09 0.015 25) 100%)",
        }}
      >
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: "oklch(0.60 0.22 25)", filter: "blur(100px)" }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8" style={{ background: "oklch(0.55 0.20 250)", filter: "blur(80px)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5" style={{ background: "oklch(0.78 0.16 75)", filter: "blur(60px)" }} />
        </div>

        <div className="container relative">
          {/* Source badge */}
          {sourceLabel && (
            <div className="flex justify-center mb-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "oklch(0.55 0.20 250 / 0.15)", border: "1px solid oklch(0.55 0.20 250 / 0.4)", color: "oklch(0.75 0.15 250)" }}
              >
                <Sparkles size={12} />
                你係從 {sourceLabel} 過嚟！歡迎認識我哋 👋
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={LOGO_URL}
                  alt="路邊電台"
                  className="w-20 h-20 rounded-2xl object-cover"
                  style={{ boxShadow: "0 0 40px oklch(0.60 0.22 25 / 0.4)" }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.60 0.22 25)" }}
                >
                  <Volume2 size={12} color="white" />
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: "oklch(0.78 0.16 75 / 0.12)", border: "1px solid oklch(0.78 0.16 75 / 0.3)", color: "oklch(0.78 0.16 75)" }}>
              🎙️ 香港最真實人物訪談 Podcast
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight" style={{ color: "oklch(0.92 0.01 60)" }}>
              路邊電台
              <br />
              <span style={{ color: "oklch(0.78 0.16 75)" }}>× 路邊玄學堂</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8" style={{ color: "oklch(0.60 0.02 60)" }}>
              探討兩性關係、都市感情、玄學命理<br />
              每一位嘉賓都係講真話，呈現最真實嘅內心世界
            </p>

            {/* Stats row */}
            <div className="flex justify-center gap-6 md:gap-10 mb-8">
              {[
                { num: totalSubs, label: "YouTube 訂閱" },
                { num: "486+", label: "集精彩內容" },
                { num: "5年+", label: "訪談經驗" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-black" style={{ color: "oklch(0.78 0.16 75)" }}>{s.num}</div>
                  <div className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.02 60)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#videos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white", boxShadow: "0 4px 20px oklch(0.60 0.22 25 / 0.4)" }}
              >
                <Play size={16} fill="white" />
                立即收看最新影片
              </a>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "oklch(0.15 0.02 260)", border: "1px solid oklch(0.30 0.03 260)", color: "oklch(0.88 0.01 60)" }}
              >
                <Sparkles size={16} />
                預約玄學服務
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote Carousel ──────────────────────────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <QuoteCarousel />
        </div>
      </section>

      {/* ── Latest Videos ───────────────────────────────────────────────────── */}
      <section id="videos" className="py-12 px-4" style={{ scrollMarginTop: "64px" }}>
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-bold tracking-widest mb-1" style={{ color: "oklch(0.60 0.22 25)" }}>LATEST VIDEOS</div>
              <h2 className="text-xl md:text-2xl font-black" style={{ color: "oklch(0.92 0.01 60)" }}>最新影片</h2>
            </div>
            <a
              href="https://www.youtube.com/@6bpodcasts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-80"
              style={{ background: "oklch(0.60 0.22 25 / 0.15)", border: "1px solid oklch(0.60 0.22 25 / 0.3)", color: "oklch(0.75 0.20 25)" }}
            >
              <Youtube size={14} />
              全部影片
              <ChevronRight size={12} />
            </a>
          </div>

          {/* Video grid */}
          {videosLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: "oklch(0.13 0.018 260)" }}>
                  <div className="aspect-video" style={{ background: "oklch(0.18 0.02 260)" }} />
                  <div className="p-3 space-y-2">
                    <div className="h-4 rounded" style={{ background: "oklch(0.20 0.02 260)" }} />
                    <div className="h-3 w-2/3 rounded" style={{ background: "oklch(0.18 0.02 260)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12" style={{ color: "oklch(0.50 0.02 60)" }}>
              <Youtube size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">暫時無法載入影片，請直接前往 YouTube 收看</p>
              <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm font-bold" style={{ color: "oklch(0.60 0.22 25)" }}>
                前往 YouTube →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((v, i) => (
                <VideoCard key={v.id} video={v} featured={i === 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Services CTA ────────────────────────────────────────────────────── */}
      <section
        className="py-14 px-4"
        style={{ background: "linear-gradient(180deg, oklch(0.08 0.01 260) 0%, oklch(0.10 0.015 260) 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.78 0.16 75)" }}>OUR SERVICES</div>
            <h2 className="text-xl md:text-2xl font-black mb-2" style={{ color: "oklch(0.92 0.01 60)" }}>我哋可以幫到你</h2>
            <p className="text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>從玄學諮詢到品牌合作，一站式服務</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group flex flex-col items-center text-center p-4 rounded-xl transition-all hover:scale-105"
                style={{
                  background: "oklch(0.13 0.018 260)",
                  border: "1px solid oklch(0.20 0.02 260)",
                }}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-sm font-bold mb-1" style={{ color: "oklch(0.88 0.01 60)" }}>{s.title}</div>
                <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{s.desc}</div>
                <div className="mt-2 text-xs font-bold flex items-center gap-0.5" style={{ color: s.color }}>
                  了解更多 <ChevronRight size={10} />
                </div>
              </Link>
            ))}
          </div>

          {/* Big booking CTA */}
          <div
            className="rounded-2xl p-6 md:p-8 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, oklch(0.13 0.025 25) 0%, oklch(0.12 0.020 260) 100%)",
              border: "1px solid oklch(0.25 0.04 25 / 0.6)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, oklch(0.60 0.22 25 / 0.08) 0%, transparent 70%)" }} />
            <div className="relative">
              <div className="text-3xl mb-3">🔮</div>
              <h3 className="text-lg md:text-xl font-black mb-2" style={{ color: "oklch(0.92 0.01 60)" }}>
                想知道你嘅運程？
              </h3>
              <p className="text-sm mb-5 max-w-md mx-auto" style={{ color: "oklch(0.60 0.02 60)" }}>
                路邊玄學堂提供風水諮詢、八字命理、塔羅占卜，專業師傅為你解答人生疑問。
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white", boxShadow: "0 4px 20px oklch(0.60 0.22 25 / 0.35)" }}
              >
                <Sparkles size={15} />
                立即預約玄學服務
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Follow ────────────────────────────────────────────────────── */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.55 0.20 250)" }}>FOLLOW US</div>
            <h2 className="text-xl md:text-2xl font-black mb-2" style={{ color: "oklch(0.92 0.01 60)" }}>追蹤我哋，唔好錯過</h2>
            <p className="text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>每週新影片上架，第一時間收到通知</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SOCIAL_LINKS.map((s) => {
              const Icon = s.icon;
              const isInternal = s.href.startsWith("/");
              const Wrapper = isInternal
                ? ({ children, ...p }: React.ComponentPropsWithoutRef<"a"> & { children: React.ReactNode }) => <Link href={s.href} {...(p as object)}>{children}</Link>
                : ({ children, ...p }: React.ComponentPropsWithoutRef<"a"> & { children: React.ReactNode }) => <a href={s.href} target="_blank" rel="noopener noreferrer" {...p}>{children}</a>;
              return (
                <Wrapper
                  key={s.label}
                  className="flex flex-col items-center text-center p-4 rounded-xl transition-all hover:scale-105 cursor-pointer"
                  style={{ background: s.bg, border: `1px solid ${s.color}30` }}
                >
                  <Icon size={28} style={{ color: s.color }} className="mb-2" />
                  <div className="text-sm font-bold" style={{ color: "oklch(0.88 0.01 60)" }}>{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.02 60)" }}>{s.sub}</div>
                </Wrapper>
              );
            })}
          </div>

          {/* Push notification opt-in hint */}
          <div
            className="mt-6 rounded-xl p-4 flex items-center gap-3"
            style={{ background: "oklch(0.13 0.018 260)", border: "1px solid oklch(0.20 0.02 260)" }}
          >
            <div className="text-2xl flex-shrink-0">🔔</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold" style={{ color: "oklch(0.88 0.01 60)" }}>開啟網站通知</div>
              <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>新影片上架即時通知，唔再錯過精彩內容</div>
            </div>
            <Link
              href="/"
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-80"
              style={{ background: "oklch(0.55 0.20 250 / 0.2)", border: "1px solid oklch(0.55 0.20 250 / 0.4)", color: "oklch(0.75 0.15 250)" }}
            >
              開啟
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-4 text-center"
        style={{ borderTop: "1px solid oklch(0.15 0.02 260)" }}
      >
        <img src={LOGO_URL} alt="路邊電台" className="w-10 h-10 rounded-xl mx-auto mb-3 object-cover" />
        <div className="text-sm font-bold mb-1" style={{ color: "oklch(0.70 0.01 60)" }}>路邊電台 × 路邊玄學堂</div>
        <div className="text-xs mb-4" style={{ color: "oklch(0.40 0.01 60)" }}>香港最真實人物訪談 Podcast</div>
        <div className="flex justify-center gap-4 text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>
          <Link href="/" className="hover:opacity-80">首頁</Link>
          <Link href="/about" className="hover:opacity-80">關於我們</Link>
          <Link href="/services" className="hover:opacity-80">服務項目</Link>
          <Link href="/booking" className="hover:opacity-80">玄學預約</Link>
          <Link href="/contact" className="hover:opacity-80">聯絡我們</Link>
        </div>
      </footer>
    </div>
  );
}
