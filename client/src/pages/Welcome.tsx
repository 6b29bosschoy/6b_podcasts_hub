import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { JsonLd, buildBreadcrumbSchema, buildOrganizationSchema, SITE_URL, LOGO_URL, BRAND_NAME } from "@/components/JsonLd";
import { Play, ChevronRight, Star, Users, Youtube, Instagram, Facebook, Mic, Sparkles, ExternalLink, Volume2, PenLine, Send, CheckCircle2, Loader2 } from "lucide-react";
import ImageUploader, { type UploadedImage } from "@/components/ImageUploader";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const QUOTES = [
  { text: "感情嘅問題，唔係對錯，係你有冇勇氣面對自己。", author: "Ray Choy", role: "主持人" },
  { text: "風水改變唔到命運，但可以幫你走得更順。", author: "路邊玄學堂", role: "玄學師傅" },
  { text: "每一段關係都係一面鏡，照出你自己。", author: "嘉賓語錄", role: "訪談精華" },
  { text: "唔係所有問題都有答案，但每個問題都值得被聆聽。", author: "Ray Choy", role: "主持人" },
];

const SERVICES = [
  { icon: "🧭", title: "風水諮詢", desc: "家居 / 辦公室佈局分析", href: "/booking", color: "var(--gold)" },
  { icon: "🔮", title: "八字命理", desc: "個人運程深度解析", href: "/booking", color: "var(--red)" },
  { icon: "🃏", title: "塔羅占卜", desc: "人生問題指引解讀", href: "/booking", color: "var(--gold)" },
  { icon: "🎬", title: "品牌合作", desc: "YouTube 訪談 / 廣告置入", href: "/partnership", color: "var(--gold)" },
];

const SOCIAL_LINKS = [
  { icon: Youtube, label: "YouTube", sub: "路邊電台", href: "https://www.youtube.com/@6bpodcasts", color: "var(--red)", bg: "var(--red)" },
  { icon: Facebook, label: "Facebook", sub: "路邊電台", href: "https://www.facebook.com/6bpodcasts", color: "var(--gold)", bg: "rgba(201,164,92,0.12)" },
  { icon: Instagram, label: "Instagram", sub: "@6bpodcasts", href: "https://www.instagram.com/6bpodcasts", color: "var(--red)", bg: "var(--red)" },
  { icon: Mic, label: "Podcast", sub: "Apple / Spotify", href: "/podcasts", color: "var(--gold)", bg: "rgba(201,164,92,0.12)" },
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
        background: "var(--bg-card)",
        border: "1px solid var(--line)",
        opacity: fade ? 1 : 0,
      }}
    >
      <div className="text-2xl mb-4" style={{ color: "var(--gold)" }}>"</div>
      <p className="text-base md:text-lg font-medium leading-relaxed mb-4" style={{ color: "var(--text)" }}>
        {q.text}
      </p>
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm font-bold" style={{ color: "var(--gold)" }}>{q.author}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--gold)", color: "var(--gold)" }}>{q.role}</span>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 400); }}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{ background: i === idx ? "var(--gold)" : "var(--text-3)" }}
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
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--gold)" : "var(--line)"}`,
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 12px 32px rgba(13,12,10,0.4)" : "none",
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
          style={{ background: "rgba(13,12,10,0.35)", opacity: hovered ? 1 : 0 }}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--red)" }}>
            <Play size={20} fill="white" color="white" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(13,12,10,0.75)", color: "white" }}>
          {video.duration}
        </div>
        {featured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: "var(--red)", color: "white" }}>
            <Star size={10} fill="white" /> 最新
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold leading-snug line-clamp-2 mb-2" style={{ color: "var(--text)" }}>
          {video.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-3)" }}>{video.viewCount} 次觀看</span>
          <ExternalLink size={12} style={{ color: "var(--text-3)" }} />
        </div>
      </div>
    </a>
  );
}

// ─── Category config ─────────────────────────────────────────────────────────

type SubmitCategory = "relationship" | "fengshui" | "confession" | "question" | "other";

const SUBMIT_CATEGORIES: { value: SubmitCategory; label: string; emoji: string; color: string }[] = [
  { value: "relationship", label: "感情故事", emoji: "💕", color: "var(--red)" },
  { value: "fengshui",     label: "玄學奇遇", emoji: "🔮", color: "var(--gold)" },
  { value: "confession",   label: "心底話",   emoji: "💬", color: "var(--gold)" },
  { value: "question",     label: "問題想問", emoji: "🙋", color: "var(--gold)" },
  { value: "other",        label: "其他",     emoji: "✨", color: "var(--gold)" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Welcome() {
  // UTM source detection
  const [utmSource, setUtmSource] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // ── Submission form state ────────────────────────────────────────────────
  const [submitCategory, setSubmitCategory] = useState<SubmitCategory>("relationship");
  const [submitContent, setSubmitContent] = useState("");
  const [submitNickname, setSubmitNickname] = useState("");
  const [submitAnonymous, setSubmitAnonymous] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [submitImages, setSubmitImages] = useState<UploadedImage[]>([]);

  const submitMutation = trpc.submission.submit.useMutation({
    onSuccess: () => {
      setSubmitDone(true);
      setSubmitContent("");
      setSubmitNickname("");
      setSubmitAnonymous(false);
      setSubmitCategory("relationship");
      setSubmitImages([]);
    },
    onError: (err) => {
      toast.error("投稿失敗，請稍後再試", { description: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitContent.trim().length < 10) {
      toast.error("內容太短", { description: "請輸入至少 10 個字" });
      return;
    }
    submitMutation.mutate({
      nickname: submitAnonymous ? "匿名" : submitNickname.trim() || "讀者",
      category: submitCategory,
      content: submitContent.trim(),
      isAnonymous: submitAnonymous,
      imageUrls: submitImages.map((img) => img.url),
    });
  };

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
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <JsonLd data={welcomeSchemas} id="welcome" />

      {/* ── Sticky Top Bar ─────────────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: "var(--bg)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <img src={LOGO_URL} alt="路邊電台" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <div className="text-xs font-black leading-none" style={{ color: "var(--text)" }}>路邊電台</div>
            <div className="text-xs leading-none" style={{ color: "var(--text-3)" }}>× 路邊玄學堂</div>
          </div>
        </Link>
        <Link
          href="/booking"
          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-90"
          style={{ background: "var(--red)", color: "white" }}
        >
          立即預約玄學服務
        </Link>
      </div>

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-16 pb-16 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, var(--bg) 0%, var(--bg) 60%, var(--bg) 100%)",
        }}
      >
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: "var(--red)", filter: "blur(100px)" }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8" style={{ background: "var(--gold)", filter: "blur(80px)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5" style={{ background: "var(--gold)", filter: "blur(60px)" }} />
        </div>

        <div className="container relative">
          {/* Source badge */}
          {sourceLabel && (
            <div className="flex justify-center mb-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(201,164,92,0.15)", border: "1px solid rgba(201,164,92,0.4)", color: "var(--gold)" }}
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
                  style={{ boxShadow: "none" }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "var(--red)" }}
                >
                  <Volume2 size={12} color="white" />
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--gold)" }}>
              🎙️ 香港最真實人物訪談 Podcast
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight" style={{ color: "var(--text)" }}>
              路邊電台
              <br />
              <span style={{ color: "var(--gold)" }}>× 路邊玄學堂</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8" style={{ color: "var(--text-2)" }}>
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
                  <div className="text-2xl md:text-3xl font-black" style={{ color: "var(--gold)" }}>{s.num}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#videos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "white", boxShadow: "0 4px 20px var(--red)" }}
              >
                <Play size={16} fill="white" />
                立即收看最新影片
              </a>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "var(--bg-raise)", border: "1px solid var(--text-3)", color: "var(--text)" }}
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
              <div className="text-xs font-bold tracking-widest mb-1" style={{ color: "var(--red)" }}>LATEST VIDEOS</div>
              <h2 className="text-xl md:text-2xl font-black" style={{ color: "var(--text)" }}>最新影片</h2>
            </div>
            <a
              href="https://www.youtube.com/@6bpodcasts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-80"
              style={{ background: "var(--red)", border: "1px solid var(--red)", color: "var(--red)" }}
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
                <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: "var(--bg-card)" }}>
                  <div className="aspect-video" style={{ background: "var(--line)" }} />
                  <div className="p-3 space-y-2">
                    <div className="h-4 rounded" style={{ background: "var(--line)" }} />
                    <div className="h-3 w-2/3 rounded" style={{ background: "var(--line)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12" style={{ color: "var(--text-3)" }}>
              <Youtube size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">暫時無法載入影片，請直接前往 YouTube 收看</p>
              <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm font-bold" style={{ color: "var(--red)" }}>
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
        style={{ background: "linear-gradient(180deg, var(--bg) 0%, var(--bg) 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--gold)" }}>OUR SERVICES</div>
            <h2 className="text-xl md:text-2xl font-black mb-2" style={{ color: "var(--text)" }}>我哋可以幫到你</h2>
            <p className="text-sm" style={{ color: "var(--text-3)" }}>從玄學諮詢到品牌合作，一站式服務</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group flex flex-col items-center text-center p-4 rounded-xl transition-all hover:scale-105"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--line)",
                }}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{s.title}</div>
                <div className="text-xs" style={{ color: "var(--text-3)" }}>{s.desc}</div>
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
              background: "var(--bg-card)",
              border: "1px solid rgba(58,52,38,0.6)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, var(--red) 0%, transparent 70%)" }} />
            <div className="relative">
              <div className="text-3xl mb-3">🔮</div>
              <h3 className="text-lg md:text-xl font-black mb-2" style={{ color: "var(--text)" }}>
                想知道你嘅運程？
              </h3>
              <p className="text-sm mb-5 max-w-md mx-auto" style={{ color: "var(--text-2)" }}>
                路邊玄學堂提供風水諮詢、八字命理、塔羅占卜，專業師傅為你解答人生疑問。
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "white", boxShadow: "0 4px 20px var(--red)" }}
              >
                <Sparkles size={15} />
                立即預約玄學服務
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Share Your Story ─────────────────────────────────────────────────── */}
      <section
        id="share"
        className="py-14 px-4"
        style={{
          background: "var(--bg-card)",
          scrollMarginTop: "64px",
        }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--red)" }}>SHARE YOUR STORY</div>
            <h2 className="text-xl md:text-2xl font-black mb-2" style={{ color: "var(--text)" }}>
              分享你嘅故事
            </h2>
            <p className="text-sm" style={{ color: "var(--text-3)" }}>
              每一個故事都值得被聆聽，精選投稿將展示喺首頁，有機會喺節目中被討論
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--line)",
              boxShadow: "0 8px 40px rgba(13,12,10,0.3)",
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at top left, var(--red) 0%, transparent 60%)" }}
            />

            {submitDone ? (
              /* ── Success state ── */
              <div className="relative text-center py-6">
                <CheckCircle2
                  size={48}
                  className="mx-auto mb-4"
                  style={{ color: "var(--gold)" }}
                />
                <h3 className="text-lg font-black mb-2" style={{ color: "var(--text)" }}>
                  投稿成功！🎉
                </h3>
                <p className="text-sm mb-6" style={{ color: "var(--text-3)" }}>
                  感謝你嘅分享，我哋會盡快審核。<br />
                  精選投稿將展示喺路邊電台首頁。
                </p>
                <button
                  onClick={() => setSubmitDone(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{
                    background: "var(--gold)",
                    border: "1px solid var(--gold)",
                    color: "var(--gold)",
                  }}
                >
                  <PenLine size={14} />
                  再投一個故事
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} className="relative space-y-5">
                {/* Category pills */}
                <div>
                  <div className="text-xs font-bold mb-2" style={{ color: "var(--text-2)" }}>選擇類別</div>
                  <div className="flex flex-wrap gap-2">
                    {SUBMIT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setSubmitCategory(cat.value)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                        style={{
                          background: submitCategory === cat.value ? `${cat.color}20` : "var(--bg-raise)",
                          border: `1px solid ${submitCategory === cat.value ? `${cat.color}60` : "var(--line)"}`,
                          color: submitCategory === cat.value ? cat.color : "var(--text-3)",
                          transform: submitCategory === cat.value ? "scale(1.05)" : "scale(1)",
                        }}
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-xs font-bold" style={{ color: "var(--text-2)" }}>你嘅故事 / 問題</div>
                    <div className="text-xs" style={{ color: "var(--text-3)" }}>{submitContent.length}/1000</div>
                  </div>
                  <textarea
                    value={submitContent}
                    onChange={(e) => setSubmitContent(e.target.value.slice(0, 1000))}
                    placeholder="盡情分享你嘅感情故事、玄學奇遇、心底話，或者想問路邊電台嘅問題…（最少 10 字）"
                    rows={4}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
                    style={{
                      background: "var(--bg-card)",
                      border: `1px solid ${submitContent.length > 0 ? "var(--text-3)" : "var(--line)"}`,
                      color: "var(--text)",
                    }}
                  />
                </div>

                {/* Image upload */}
                <div>
                  <div className="text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>
                    附上圖片 <span style={{ color: "var(--text-3)", fontWeight: 400 }}>（可選，最多 5 張，每張 ≤ 2MB）</span>
                  </div>
                  <ImageUploader
                    images={submitImages}
                    onImagesChange={setSubmitImages}
                    disabled={submitMutation.isPending}
                    dark={true}
                  />
                </div>

                {/* Nickname row */}
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <div className="text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>你嘅名字（花名都得）</div>
                    <input
                      type="text"
                      value={submitNickname}
                      onChange={(e) => setSubmitNickname(e.target.value.slice(0, 50))}
                      placeholder={submitAnonymous ? "匿名投稿" : "例如：小明、Coco…"}
                      disabled={submitAnonymous}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--line)",
                        color: "var(--text)",
                        opacity: submitAnonymous ? 0.5 : 1,
                      }}
                    />
                  </div>
                  <div className="flex-shrink-0 pt-5">
                    <button
                      type="button"
                      onClick={() => setSubmitAnonymous((v) => !v)}
                      className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: submitAnonymous ? "rgba(201,164,92,0.2)" : "var(--bg-raise)",
                        border: `1px solid ${submitAnonymous ? "rgba(201,164,92,0.5)" : "var(--line)"}`,
                        color: submitAnonymous ? "var(--gold)" : "var(--text-3)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {submitAnonymous ? "🙈 匿名中" : "匿名"}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitMutation.isPending || submitContent.trim().length < 10}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, var(--red), var(--gold))",
                    color: "white",
                    boxShadow: submitContent.trim().length >= 10 ? "0 4px 20px var(--red)" : "none",
                  }}
                >
                  {submitMutation.isPending ? (
                    <><Loader2 size={15} className="animate-spin" /> 提交中…</>
                  ) : (
                    <><Send size={15} /> 立即投稿 ✉️{submitImages.length > 0 && ` (+${submitImages.length}📷)`}</>
                  )}
                </button>

                <p className="text-center text-xs" style={{ color: "var(--text-3)" }}>
                  投稿內容將由我哋團隊審核，通過後展示喺首頁
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Social Follow ────────────────────────────────────────────────────── */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--gold)" }}>FOLLOW US</div>
            <h2 className="text-xl md:text-2xl font-black mb-2" style={{ color: "var(--text)" }}>追蹤我哋，唔好錯過</h2>
            <p className="text-sm" style={{ color: "var(--text-3)" }}>每週新影片上架，第一時間收到通知</p>
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
                  <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{s.sub}</div>
                </Wrapper>
              );
            })}
          </div>

          {/* Push notification opt-in hint */}
          <div
            className="mt-6 rounded-xl p-4 flex items-center gap-3"
            style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
          >
            <div className="text-2xl flex-shrink-0">🔔</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold" style={{ color: "var(--text)" }}>開啟網站通知</div>
              <div className="text-xs" style={{ color: "var(--text-3)" }}>新影片上架即時通知，唔再錯過精彩內容</div>
            </div>
            <Link
              href="/"
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-80"
              style={{ background: "rgba(201,164,92,0.2)", border: "1px solid rgba(201,164,92,0.4)", color: "var(--gold)" }}
            >
              開啟
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-4 text-center"
        style={{ borderTop: "1px solid var(--bg-raise)" }}
      >
        <img src={LOGO_URL} alt="路邊電台" className="w-10 h-10 rounded-xl mx-auto mb-3 object-cover" />
        <div className="text-sm font-bold mb-1" style={{ color: "var(--text-2)" }}>路邊電台 × 路邊玄學堂</div>
        <div className="text-xs mb-4" style={{ color: "var(--text-3)" }}>香港最真實人物訪談 Podcast</div>
        <div className="flex justify-center gap-4 text-xs" style={{ color: "var(--text-3)" }}>
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
