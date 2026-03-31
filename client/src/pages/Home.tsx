import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import SubscribeBox from "@/components/SubscribeBox";
import ReaderSubmissions from "@/components/ReaderSubmissions";
import { trpc } from "@/lib/trpc";
import { Loader2, Play, Eye, Clock } from "lucide-react";
import { JsonLd, buildOrganizationSchema, buildWebSiteSchema, SITE_URL } from "@/components/JsonLd";
import IgFeedEmbed from "@/components/IgFeedEmbed";

const SOCIAL_PLATFORMS = [
  {
    name: "YouTube 路邊電台",
    descKey: "podcasts" as const,
    fallbackDesc: "訂閱頻道",
    href: "https://www.youtube.com/@6bpodcasts",
    color: "oklch(0.55 0.22 25)",
    icon: "▶",
  },
  {
    name: "YouTube 路邊玄學堂",
    descKey: "fengshui" as const,
    fallbackDesc: "訂閱頻道",
    href: "https://www.youtube.com/@6bfengshui",
    color: "oklch(0.55 0.20 250)",
    icon: "☯",
  },
  {
    name: "Facebook",
    descKey: null,
    fallbackDesc: "16K 追蹤者",
    href: "https://www.facebook.com/6bpodcasts",
    color: "oklch(0.50 0.18 255)",
    icon: "f",
  },
  {
    name: "Instagram",
    descKey: null,
    fallbackDesc: "@6bpodcasts",
    href: "https://www.instagram.com/6bpodcasts",
    color: "oklch(0.60 0.20 330)",
    icon: "◎",
  },
  {
    name: "Apple Podcast",
    descKey: null,
    fallbackDesc: "免費收聽",
    href: "https://apple.co/3nhSxy8",
    color: "oklch(0.65 0.15 290)",
    icon: "♪",
  },
  {
    name: "Spotify",
    descKey: null,
    fallbackDesc: "免費收聽",
    href: "https://spoti.fi/30EQPOT",
    color: "oklch(0.65 0.20 145)",
    icon: "♫",
  },
];

const SERVICES = [
  { icon: "🧭", title: "風水諮詢", desc: "家居、辦公室風水佈局分析，改善運勢與財運" },
  { icon: "🔮", title: "八字命理", desc: "根據生辰八字分析個人運程、事業、感情走向" },
  { icon: "🃏", title: "塔羅占卜", desc: "塔羅牌解讀，為你的人生問題提供指引" },
  { icon: "🌿", title: "身心靈療癒", desc: "能量療癒、冥想指導，平衡身心靈狀態" },
];

type ChannelFilter = "all" | "podcasts" | "fengshui";

// ── VideoCard: hover to play YouTube inline ──────────────────────────────────
function VideoCard({
  v,
  isFengshui,
}: {
  v: { id: string; title: string; thumbnail: string | null; url: string; viewCount: string; publishedAt: string; duration: string | null; channelTitle?: string | null; channelId?: string | null };
  isFengshui: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    // small delay so fast mouse-overs don't trigger
    timerRef.current = setTimeout(() => setHovered(true), 350);
  };
  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHovered(false);
  };

  return (
    <div
      className="glass-card rounded-xl overflow-hidden group transition-all duration-200 hover:scale-[1.02] cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => window.open(v.url, "_blank", "noopener,noreferrer")}
    >
      {/* Thumbnail / Player area */}
      <div className="aspect-video relative overflow-hidden" style={{ background: "oklch(0.15 0.015 260)" }}>
        {/* YouTube iframe — shown only on hover */}
        {hovered ? (
          <iframe
            src={`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=0`}
            title={v.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            {/* Thumbnail */}
            {v.thumbnail ? (
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-10 h-10 opacity-30" style={{ color: "oklch(0.62 0.24 25)" }} />
              </div>
            )}
            {/* Play overlay hint */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "oklch(0 0 0 / 0.45)" }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2" style={{ background: "oklch(0.62 0.24 25 / 0.92)", boxShadow: "0 0 20px oklch(0.62 0.24 25 / 0.5)" }}>
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </div>
              <span className="text-xs font-bold text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>預覽播放</span>
            </div>
          </>
        )}
        {/* Channel badge */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold z-10"
          style={{ background: isFengshui ? "oklch(0.55 0.20 250 / 0.9)" : "oklch(0.62 0.24 25 / 0.9)", color: "white" }}
        >
          {isFengshui ? "路邊玄學堂" : "路邊電台"}
        </div>
        {/* Duration badge — hide when playing */}
        {!hovered && v.duration && (
          <div
            className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono font-bold z-10"
            style={{ background: "oklch(0 0 0 / 0.8)", color: "white" }}
          >
            {v.duration}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold leading-snug mb-2 line-clamp-2" style={{ color: "oklch(0.88 0.01 60)" }}>
          {v.title}
        </h3>
        <div className="flex items-center gap-3 text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {v.viewCount}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(v.publishedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}週前`;
  if (days < 365) return `${Math.floor(days / 30)}個月前`;
  return `${Math.floor(days / 365)}年前`;
}

function formatSubscriberCount(count: string): string {
  const n = parseInt(count, 10);
  if (isNaN(n)) return "";
  if (n >= 10000) return `${(n / 10000).toFixed(1)}萬 訂閱`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K 訂閱`;
  return `${n} 訂閱`;
}

export default function Home() {
  // SEO: set document title and meta description dynamically
  useEffect(() => {
    document.title = "路邊電台 × 路邊玄學堂｜香港最真實人物訪談";
    const desc = document.querySelector("meta[name='description']");
    if (desc) {
      desc.setAttribute("content", "路邊電台係香港最真實人物訪談節目，探討兩性關係、都市感情與玄學命理。每位嘉賓講真話，呈現最真實內心世界。立即收看 YouTube 影片，預約風水命理服務。");
    }
    const kw = document.querySelector("meta[name='keywords']");
    if (kw) {
      kw.setAttribute("content", "路邊電台,路邊玄學堂,香港Podcast,人物訪談,兩性關係,玄學,風水,命理,八字,塔羅,香港YouTube,6B Podcasts");
    }
  }, []);

  const [activeChannel, setActiveChannel] = useState<ChannelFilter>("all");

  const { data: videosData, isLoading: videosLoading, error: videosError } = trpc.youtube.getVideos.useQuery(
    { channel: activeChannel, limit: 6 },
    { staleTime: 10 * 60 * 1000 } // cache 10 minutes
  );

  const { data: channelsData } = trpc.youtube.getChannels.useQuery(undefined, {
    staleTime: 30 * 60 * 1000, // cache 30 minutes
  });

  type VideoItem = { id: string; title: string; thumbnail: string | null; url: string; viewCount: string; publishedAt: string; duration: string | null; channelTitle?: string | null; channelId?: string | null };
  const videos = (videosData?.videos ?? []) as VideoItem[];

  const homeSchemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首頁", item: SITE_URL },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <JsonLd data={homeSchemas} id="home" />
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: "oklch(0.62 0.24 25)", filter: "blur(60px)" }} />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full opacity-5" style={{ background: "oklch(0.55 0.20 250)", filter: "blur(40px)" }} />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6" style={{ background: "oklch(0.62 0.24 25 / 0.15)", border: "1px solid oklch(0.62 0.24 25 / 0.3)", color: "oklch(0.62 0.24 25)" }}>
              🎙️ 香港最真實人物訪談
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight neon-flicker">
              <span className="gradient-text">路邊電台</span>
            </h1>
            <p className="text-lg md:text-xl font-medium mb-3" style={{ color: "oklch(0.75 0.15 75)" }}>
              × 路邊玄學堂
            </p>
            <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: "oklch(0.60 0.02 60)" }}>
              探討兩性關係 × 都市感情 × 玄學命理<br />
              每一位嘉賓都係講真話，呈現最真實嘅內心世界
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://www.youtube.com/@6bpodcasts"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}
              >
                ▶ 立即收看
              </a>
              <Link
                href="/booking"
                className="px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:opacity-90"
                style={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(0.30 0.03 260)", color: "oklch(0.85 0.01 60)" }}
              >
                預約玄學服務
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Platforms */}
      <section className="py-16" style={{ background: "oklch(0.10 0.01 260)" }}>
        <div className="container">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>FOLLOW US</div>
            <h2 className="text-2xl font-black" style={{ color: "oklch(0.92 0.01 60)" }}>追蹤我們的平台</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SOCIAL_PLATFORMS.map((p) => {
              // Inject live subscriber count for YouTube channels
              let desc = p.fallbackDesc;
              type ChannelInfo = { subscriberCount: string; id: string };
              if (p.descKey === "podcasts" && channelsData?.podcasts) {
                desc = formatSubscriberCount((channelsData.podcasts as ChannelInfo).subscriberCount);
              } else if (p.descKey === "fengshui" && channelsData?.fengshui) {
                desc = formatSubscriberCount((channelsData.fengshui as ChannelInfo).subscriberCount);
              }
              return (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 group"
                >
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold"
                    style={{ background: `color-mix(in oklch, ${p.color} 20%, transparent)`, color: p.color, border: `1px solid color-mix(in oklch, ${p.color} 30%, transparent)` }}
                  >
                    {p.icon}
                  </div>
                  <div className="text-xs font-bold mb-1" style={{ color: "oklch(0.85 0.01 60)" }}>{p.name}</div>
                  <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{desc}</div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Videos */}
      <section className="py-16" style={{ background: "oklch(0.08 0.01 260)" }}>
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>LATEST CONTENT</div>
              <h2 className="text-2xl font-black" style={{ color: "oklch(0.92 0.01 60)" }}>最新影片</h2>
            </div>
            {/* Channel filter tabs */}
            <div className="flex gap-2">
              {(["all", "podcasts", "fengshui"] as ChannelFilter[]).map((ch) => {
                const labels: Record<ChannelFilter, string> = { all: "全部", podcasts: "路邊電台", fengshui: "路邊玄學堂" };
                const isActive = activeChannel === ch;
                return (
                  <button
                    key={ch}
                    onClick={() => setActiveChannel(ch)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                    style={
                      isActive
                        ? { background: "oklch(0.62 0.24 25)", color: "white" }
                        : { background: "oklch(0.15 0.015 260)", border: "1px solid oklch(0.25 0.02 260)", color: "oklch(0.60 0.02 60)" }
                    }
                  >
                    {labels[ch]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading state */}
          {videosLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "oklch(0.62 0.24 25)" }} />
              <span className="ml-3 text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>載入最新影片中…</span>
            </div>
          )}

          {/* Error state */}
          {videosError && !videosLoading && (
            <div className="text-center py-16 glass-card rounded-xl">
              <p className="text-sm mb-4" style={{ color: "oklch(0.55 0.02 60)" }}>暫時無法載入影片，請直接前往 YouTube 頻道收看。</p>
              <div className="flex gap-3 justify-center">
                <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-bold" style={{ background: "oklch(0.62 0.24 25)", color: "white" }}>
                  路邊電台 ↗
                </a>
                <a href="https://www.youtube.com/@6bfengshui" target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-bold" style={{ background: "oklch(0.55 0.20 250)", color: "white" }}>
                  路邊玄學堂 ↗
                </a>
              </div>
            </div>
          )}

          {/* Video grid */}
          {!videosLoading && !videosError && videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((v) => {
                type ChannelInfo2 = { id: string };
                const isFengshui = v.channelTitle?.includes("玄學") || v.channelId === (channelsData?.fengshui as ChannelInfo2 | null | undefined)?.id;
                return (
                  <VideoCard key={v.id} v={v} isFengshui={isFengshui} />
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!videosLoading && !videosError && videos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm" style={{ color: "oklch(0.50 0.02 60)" }}>暫時沒有影片</p>
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-16" style={{ background: "oklch(0.10 0.01 260)" }}>
        <div className="container">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.78 0.16 75)" }}>SERVICES</div>
            <h2 className="text-2xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>玄學服務</h2>
            <p className="text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>由專業玄學師傅提供，助你解惑人生疑問</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {SERVICES.map((s) => (
              <div key={s.title} className="glass-card rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: "oklch(0.88 0.01 60)" }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.02 60)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/booking"
              className="inline-block px-8 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{ background: "linear-gradient(135deg, oklch(0.75 0.15 75), oklch(0.60 0.22 25))", color: "white" }}
            >
              立即預約 →
            </Link>
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-16" style={{ background: "oklch(0.08 0.01 260)" }}>
        <div className="container">
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center" style={{ border: "1px solid oklch(0.78 0.16 75 / 0.2)" }}>
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "oklch(0.78 0.16 75)" }}>GUEST COLUMN</div>
            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>嘉賓專欄</h2>
            <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: "oklch(0.55 0.02 60)" }}>
              閱讀嘉賓訪談後的深度心得，或分享你的故事，成為路邊電台的嘉賓作者。
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/blog" className="px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(0.30 0.03 260)", color: "oklch(0.85 0.01 60)" }}>
                閱讀文章
              </Link>
              <Link href="/blog/submit" className="px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, oklch(0.75 0.15 75), oklch(0.60 0.22 25))", color: "white" }}>
                投稿分享
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reader Submissions */}
      <div id="submissions">
        <ReaderSubmissions />
      </div>

      {/* IG Feed */}
      <IgFeedEmbed />
      {/* Subscribe */}
      <SubscribeBox />
    </div>
  );
}
