import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import SubscribeBox from "@/components/SubscribeBox";
import ReaderSubmissions from "@/components/ReaderSubmissions";
import { trpc } from "@/lib/trpc";
import { Play, Eye, Clock, ChevronRight, Mic, Star, Users, Youtube } from "lucide-react";
import { JsonLd, buildOrganizationSchema, buildWebSiteSchema, SITE_URL } from "@/components/JsonLd";

const SOCIAL_PLATFORMS = [
  { name: "YouTube 路邊電台", descKey: "podcasts" as const, fallbackDesc: "訂閱頻道", href: "https://www.youtube.com/@6bpodcasts", color: "oklch(0.62 0.24 25)", icon: "▶" },
  { name: "YouTube 路邊玄學堂", descKey: "fengshui" as const, fallbackDesc: "訂閱頻道", href: "https://www.youtube.com/@6bfengshui", color: "oklch(0.55 0.20 250)", icon: "☯" },
  { name: "Facebook", descKey: null, fallbackDesc: "16K 追蹤者", href: "https://www.facebook.com/6bpodcasts", color: "oklch(0.50 0.18 255)", icon: "f" },
  { name: "Instagram", descKey: null, fallbackDesc: "@6bpodcasts", href: "https://www.instagram.com/6bpodcasts", color: "oklch(0.60 0.20 330)", icon: "◎" },
  { name: "Apple Podcast", descKey: null, fallbackDesc: "免費收聽", href: "https://apple.co/3nhSxy8", color: "oklch(0.65 0.15 290)", icon: "♪" },
  { name: "Spotify", descKey: null, fallbackDesc: "免費收聽", href: "https://spoti.fi/30EQPOT", color: "oklch(0.65 0.20 145)", icon: "♫" },
];

type ChannelFilter = "all" | "podcasts" | "fengshui";

function VideoCard({ v, isFengshui }: {
  v: { id: string; title: string; thumbnail: string | null; url: string; viewCount: string; publishedAt: string; duration: string | null; channelTitle?: string | null; channelId?: string | null };
  isFengshui: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleMouseEnter = () => { timerRef.current = setTimeout(() => setHovered(true), 350); };
  const handleMouseLeave = () => { if (timerRef.current) clearTimeout(timerRef.current); setHovered(false); };
  return (
    <div
      className="rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      style={{ background: "oklch(0.12 0.015 260 / 0.9)", border: "1px solid oklch(0.22 0.02 260)", boxShadow: "0 4px 24px oklch(0 0 0 / 0.3)" }}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      onClick={() => window.open(v.url, "_blank", "noopener,noreferrer")}
    >
      <div className="aspect-video relative overflow-hidden" style={{ background: "oklch(0.10 0.01 260)" }}>
        {hovered ? (
          <iframe src={`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
            title={v.title} allow="autoplay; encrypted-media" allowFullScreen
            className="absolute inset-0 w-full h-full" style={{ border: "none" }}
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <>
            {v.thumbnail ? (
              <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-10 h-10 opacity-30" style={{ color: "oklch(0.62 0.24 25)" }} />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "oklch(0 0 0 / 0.5)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "oklch(0.62 0.24 25 / 0.95)", boxShadow: "0 0 30px oklch(0.62 0.24 25 / 0.6)" }}>
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
            </div>
          </>
        )}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold z-10"
          style={{ background: isFengshui ? "oklch(0.55 0.20 250 / 0.92)" : "oklch(0.62 0.24 25 / 0.92)", color: "white", backdropFilter: "blur(4px)" }}>
          {isFengshui ? "🔮 玄學堂" : "🎙️ 路邊電台"}
        </div>
        {!hovered && v.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono font-bold z-10" style={{ background: "oklch(0 0 0 / 0.85)", color: "white" }}>
            {v.duration}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold leading-snug mb-2 line-clamp-2" style={{ color: "oklch(0.90 0.01 60)" }}>{v.title}</h3>
        <div className="flex items-center gap-3 text-xs" style={{ color: "oklch(0.48 0.02 60)" }}>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{v.viewCount}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatRelativeTime(v.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}

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
  if (n >= 10000) return `${(n / 10000).toFixed(1)}萬`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <span className="text-2xl md:text-3xl font-black" style={{ color: "oklch(0.95 0.01 60)" }}>{value}</span>
      </div>
      <div className="text-xs font-medium" style={{ color: "oklch(0.52 0.02 60)" }}>{label}</div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = "路邊電台 × 路邊玄學堂｜香港最真實人物訪談 Podcast";
    const desc = document.querySelector("meta[name='description']");
    if (desc) desc.setAttribute("content", "路邊電台係香港最真實人物訪談節目，探討兩性關係、都市感情與玄學命理。每位嘉賓講真話，呈現最真實內心世界。立即收看 YouTube 影片，預約風水命理服務。");
    const kw = document.querySelector("meta[name='keywords']");
    if (kw) kw.setAttribute("content", "路邊電台,路邊玄學堂,香港Podcast,人物訪談,兩性關係,玄學,風水,命理,八字,塔羅,香港YouTube,6B Podcasts");
  }, []);

  const [activeChannel, setActiveChannel] = useState<ChannelFilter>("all");
  const { data: videosData, isLoading: videosLoading, error: videosError } = trpc.youtube.getVideos.useQuery(
    { channel: activeChannel, limit: 6 }, { staleTime: 10 * 60 * 1000 }
  );
  const { data: channelsData } = trpc.youtube.getChannels.useQuery(undefined, { staleTime: 30 * 60 * 1000 });

  type VideoItem = { id: string; title: string; thumbnail: string | null; url: string; viewCount: string; publishedAt: string; duration: string | null; channelTitle?: string | null; channelId?: string | null };
  type ChannelInfo = { subscriberCount: string; id: string };
  const videos = (videosData?.videos ?? []) as VideoItem[];
  const podcastsSubs = channelsData?.podcasts ? formatSubscriberCount((channelsData.podcasts as ChannelInfo).subscriberCount) : "—";
  const fengshuiSubs = channelsData?.fengshui ? formatSubscriberCount((channelsData.fengshui as ChannelInfo).subscriberCount) : "—";

  const homeSchemas = [buildOrganizationSchema(), buildWebSiteSchema(), {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "首頁", item: SITE_URL }],
  }];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.07 0.01 260)" }}>
      <JsonLd data={homeSchemas} id="home" />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/hero-bg-studio_6c62da39.webp')`,
          backgroundSize: "cover", backgroundPosition: "center top",
        }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, oklch(0.07 0.01 260 / 0.55) 0%, oklch(0.07 0.01 260 / 0.78) 60%, oklch(0.07 0.01 260) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute" style={{ top: "15%", left: "5%", width: "40%", height: "50%", background: "radial-gradient(ellipse, oklch(0.62 0.24 25 / 0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div className="absolute" style={{ top: "20%", right: "5%", width: "35%", height: "45%", background: "radial-gradient(ellipse, oklch(0.55 0.20 250 / 0.10) 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>
        <div className="container relative z-10 py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 tracking-wider"
              style={{ background: "oklch(0.62 0.24 25 / 0.18)", border: "1px solid oklch(0.62 0.24 25 / 0.45)", color: "oklch(0.82 0.16 55)", backdropFilter: "blur(8px)" }}>
              <Mic className="w-3 h-3" />
              香港最真實人物訪談節目
            </div>
            <h1 className="font-black leading-none mb-4" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>
              <span className="gradient-text neon-flicker">路邊電台</span>
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-shrink-0" style={{ background: "oklch(0.62 0.24 25 / 0.5)", width: "60px" }} />
              <span className="text-lg md:text-xl font-bold" style={{ color: "oklch(0.75 0.15 75)" }}>× 路邊玄學堂</span>
            </div>
            <p className="text-lg md:text-xl mb-4 leading-relaxed font-medium max-w-2xl" style={{ color: "oklch(0.88 0.02 60)" }}>
              探討兩性關係 · 都市感情 · 玄學命理
            </p>
            <p className="text-base mb-10 leading-relaxed max-w-xl" style={{ color: "oklch(0.62 0.02 60)" }}>
              每一位嘉賓都係講真話，呈現最真實嘅內心世界。<br />
              中西玄學 AI 分析，解讀你嘅命運密碼。
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 hover:brightness-110"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.24 25), oklch(0.75 0.15 75))", color: "white", boxShadow: "0 4px 20px oklch(0.62 0.24 25 / 0.4)" }}>
                <Youtube className="w-4 h-4" />
                立即收看
              </a>
              <Link href="/mystic"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                style={{ background: "oklch(0.14 0.03 290 / 0.9)", border: "1px solid oklch(0.55 0.22 290 / 0.6)", color: "oklch(0.80 0.18 290)", backdropFilter: "blur(8px)", boxShadow: "0 4px 20px oklch(0.55 0.22 290 / 0.2)" }}>
                🔮 玄學分析
              </Link>
              <Link href="/booking"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                style={{ background: "oklch(0.14 0.02 260 / 0.9)", border: "1px solid oklch(0.30 0.03 260 / 0.6)", color: "oklch(0.75 0.02 60)", backdropFilter: "blur(8px)" }}>
                預約服務
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-8 mt-12 pt-8" style={{ borderTop: "1px solid oklch(0.22 0.02 260 / 0.5)" }}>
              <StatCard icon={<Youtube className="w-4 h-4" />} value={podcastsSubs} label="路邊電台訂閱" color="oklch(0.62 0.24 25)" />
              <StatCard icon={<Star className="w-4 h-4" />} value={fengshuiSubs} label="路邊玄學堂訂閱" color="oklch(0.55 0.20 250)" />
              <StatCard icon={<Mic className="w-4 h-4" />} value="200+" label="嘉賓訪談" color="oklch(0.75 0.15 75)" />
              <StatCard icon={<Users className="w-4 h-4" />} value="5年+" label="製作經驗" color="oklch(0.65 0.20 145)" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TWO CHANNELS ─────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "oklch(0.09 0.01 260)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "oklch(0.62 0.24 25)" }}>OUR CHANNELS</div>
            <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "oklch(0.93 0.01 60)" }}>兩大頻道，一個世界</h2>
            <p className="text-sm max-w-lg mx-auto" style={{ color: "oklch(0.52 0.02 60)" }}>真實人物故事 × 中西玄學智慧，從不同角度探索人生</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Podcasts channel */}
            <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{ minHeight: "280px", background: "linear-gradient(135deg, oklch(0.10 0.02 25) 0%, oklch(0.15 0.04 25) 100%)", border: "1px solid oklch(0.62 0.24 25 / 0.25)", boxShadow: "0 8px 40px oklch(0.62 0.24 25 / 0.10)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.62 0.24 25 / 0.15) 0%, transparent 70%)" }} />
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4">🎙️</div>
                  <h3 className="text-2xl font-black mb-2" style={{ color: "oklch(0.93 0.01 60)" }}>路邊電台</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.60 0.02 60)" }}>
                    香港最真實人物訪談節目。探討兩性關係、都市感情、人生故事。每位嘉賓都係講真話，呈現最真實嘅內心世界。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["兩性關係", "都市感情", "人物故事", "真實訪談"].map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: "oklch(0.62 0.24 25 / 0.15)", color: "oklch(0.80 0.16 55)", border: "1px solid oklch(0.62 0.24 25 / 0.25)" }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div>
                    <div className="text-xl font-black" style={{ color: "oklch(0.93 0.01 60)" }}>{podcastsSubs}</div>
                    <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>YouTube 訂閱</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold transition-all duration-200 group-hover:gap-3" style={{ color: "oklch(0.80 0.16 55)" }}>
                    立即收看 <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
            {/* Mystic channel */}
            <Link href="/mystic"
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{ minHeight: "280px", background: "linear-gradient(135deg, oklch(0.08 0.04 290) 0%, oklch(0.14 0.08 290) 100%)", border: "1px solid oklch(0.55 0.22 290 / 0.25)", boxShadow: "0 8px 40px oklch(0.55 0.22 290 / 0.10)" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="absolute rounded-full"
                    style={{ width: (i % 2) + 1 + "px", height: (i % 2) + 1 + "px", left: ((i * 47) % 100) + "%", top: ((i * 53) % 100) + "%",
                      background: `oklch(0.75 0.08 ${260 + (i % 5) * 20})`, opacity: 0.2 + (i % 4) * 0.15,
                      animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`, animationDelay: `${(i % 5) * 0.4}s` }} />
                ))}
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.55 0.22 290 / 0.18) 0%, transparent 70%)" }} />
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4">🔮</div>
                  <h3 className="text-2xl font-black mb-2" style={{ color: "oklch(0.93 0.01 60)" }}>路邊玄學堂</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.60 0.02 60)" }}>
                    中西玄學 AI 智能分析平台。紫微斗數、奇門遁甲、塔羅占卜、西洋占星，一次輸入出生資料，解讀你的命運密碼。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["八字命理", "塔羅占卜", "西洋占星", "AI 分析"].map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: "oklch(0.55 0.22 290 / 0.15)", color: "oklch(0.78 0.18 290)", border: "1px solid oklch(0.55 0.22 290 / 0.25)" }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div>
                    <div className="text-xl font-black" style={{ color: "oklch(0.93 0.01 60)" }}>{fengshuiSubs}</div>
                    <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>YouTube 訂閱</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold transition-all duration-200 group-hover:gap-3" style={{ color: "oklch(0.78 0.18 290)" }}>
                    進入玄學堂 <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MYSTIC AI CTA ─────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "oklch(0.07 0.01 260)" }}>
        <div className="container">
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
            style={{ background: "linear-gradient(135deg, oklch(0.10 0.05 290) 0%, oklch(0.12 0.04 270) 50%, oklch(0.10 0.03 250) 100%)", border: "1px solid oklch(0.55 0.22 290 / 0.30)" }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute" style={{ top: "-20%", right: "10%", width: "50%", height: "80%", background: "radial-gradient(ellipse, oklch(0.55 0.22 290 / 0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{ background: "oklch(0.55 0.22 290 / 0.20)", border: "1px solid oklch(0.55 0.22 290 / 0.40)", color: "oklch(0.78 0.18 290)" }}>
                  ✨ 限時免費體驗
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: "oklch(0.93 0.01 60)" }}>
                  AI 玄學分析<br />
                  <span style={{ color: "oklch(0.78 0.18 290)" }}>12 種中西派別</span>一次過解讀
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "oklch(0.60 0.02 60)" }}>
                  輸入一次出生資料，即可切換八字命理、紫微斗數、奇門遁甲、塔羅占卜、西洋占星、生命靈數、阿卡西紀錄等 12 種派別，每日 10 次免費分析。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/mystic/analysis"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                    style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 290), oklch(0.45 0.18 270))", color: "white", boxShadow: "0 4px 20px oklch(0.55 0.22 290 / 0.35)" }}>
                    🔮 立即免費分析
                  </Link>
                  <Link href="/mystic/bazi"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                    style={{ background: "oklch(0.14 0.03 290 / 0.8)", border: "1px solid oklch(0.55 0.22 290 / 0.40)", color: "oklch(0.78 0.18 290)" }}>
                    八字命盤
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0 grid grid-cols-2 gap-3 md:w-64">
                {[{ icon: "☯️", label: "八字命理" }, { icon: "⭐", label: "紫微斗數" }, { icon: "🃏", label: "塔羅占卜" }, { icon: "♈", label: "西洋占星" }, { icon: "🔢", label: "生命靈數" }, { icon: "💫", label: "阿卡西紀錄" }].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs font-medium" style={{ color: "oklch(0.70 0.03 60)" }}>
                    <span>{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST VIDEOS ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "oklch(0.09 0.01 260)" }}>
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>LATEST CONTENT</div>
              <h2 className="text-2xl md:text-3xl font-black" style={{ color: "oklch(0.93 0.01 60)" }}>最新影片</h2>
            </div>
            <div className="flex gap-2">
              {(["all", "podcasts", "fengshui"] as ChannelFilter[]).map((ch) => (
                <button key={ch} onClick={() => setActiveChannel(ch)}
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                  style={activeChannel === ch
                    ? { background: "oklch(0.62 0.24 25)", color: "white" }
                    : { background: "oklch(0.14 0.015 260)", border: "1px solid oklch(0.22 0.02 260)", color: "oklch(0.55 0.02 60)" }}>
                  {ch === "all" ? "全部" : ch === "podcasts" ? "🎙️ 路邊電台" : "🔮 玄學堂"}
                </button>
              ))}
            </div>
          </div>
          {videosLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ background: "oklch(0.12 0.015 260)", border: "1px solid oklch(0.18 0.02 260)" }}>
                  <div className="aspect-video" style={{ background: "oklch(0.14 0.015 260)", animation: "shimmer 2s infinite" }} />
                  <div className="p-4 space-y-2">
                    <div className="h-3 rounded" style={{ background: "oklch(0.16 0.015 260)", width: "90%" }} />
                    <div className="h-3 rounded" style={{ background: "oklch(0.16 0.015 260)", width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {videosError && !videosLoading && (
            <div className="text-center py-16 rounded-xl" style={{ background: "oklch(0.11 0.015 260)", border: "1px solid oklch(0.20 0.02 260)" }}>
              <p className="text-sm mb-4" style={{ color: "oklch(0.52 0.02 60)" }}>暫時無法載入影片，請直接前往 YouTube 頻道收看。</p>
              <div className="flex gap-3 justify-center">
                <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-bold" style={{ background: "oklch(0.62 0.24 25)", color: "white" }}>路邊電台 ↗</a>
                <a href="https://www.youtube.com/@6bfengshui" target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-bold" style={{ background: "oklch(0.55 0.20 250)", color: "white" }}>路邊玄學堂 ↗</a>
              </div>
            </div>
          )}
          {!videosLoading && !videosError && videos.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((v) => {
                  const isFengshui = v.channelTitle?.includes("玄學") || v.channelId === (channelsData?.fengshui as ChannelInfo | null | undefined)?.id;
                  return <VideoCard key={v.id} v={v} isFengshui={!!isFengshui} />;
                })}
              </div>
              <div className="text-center mt-10">
                <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105"
                  style={{ background: "oklch(0.14 0.015 260)", border: "1px solid oklch(0.25 0.02 260)", color: "oklch(0.70 0.02 60)" }}>
                  <Youtube className="w-4 h-4" />查看更多影片<ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </>
          )}
          {!videosLoading && !videosError && videos.length === 0 && (
            <div className="text-center py-16"><p className="text-sm" style={{ color: "oklch(0.48 0.02 60)" }}>暫時沒有影片</p></div>
          )}
        </div>
      </section>

      {/* ── SOCIAL PLATFORMS ─────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "oklch(0.07 0.01 260)" }}>
        <div className="container">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>FOLLOW US</div>
            <h2 className="text-2xl font-black mb-2" style={{ color: "oklch(0.93 0.01 60)" }}>追蹤我們</h2>
            <p className="text-sm" style={{ color: "oklch(0.50 0.02 60)" }}>在你喜歡的平台上關注路邊電台</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SOCIAL_PLATFORMS.map((p) => {
              let desc = p.fallbackDesc;
              if (p.descKey === "podcasts" && channelsData?.podcasts) {
                desc = formatSubscriberCount((channelsData.podcasts as ChannelInfo).subscriberCount) + " 訂閱";
              } else if (p.descKey === "fengshui" && channelsData?.fengshui) {
                desc = formatSubscriberCount((channelsData.fengshui as ChannelInfo).subscriberCount) + " 訂閱";
              }
              return (
                <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer"
                  className="rounded-xl p-5 text-center transition-all duration-200 hover:scale-105 group"
                  style={{ background: "oklch(0.11 0.015 260)", border: "1px solid oklch(0.20 0.02 260)" }}>
                  <div className="w-11 h-11 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold transition-all duration-200 group-hover:scale-110"
                    style={{ background: `color-mix(in oklch, ${p.color} 18%, transparent)`, color: p.color, border: `1px solid color-mix(in oklch, ${p.color} 28%, transparent)` }}>
                    {p.icon}
                  </div>
                  <div className="text-xs font-bold mb-1 leading-tight" style={{ color: "oklch(0.82 0.01 60)" }}>{p.name}</div>
                  <div className="text-xs" style={{ color: "oklch(0.48 0.02 60)" }}>{desc}</div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "oklch(0.09 0.01 260)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "oklch(0.78 0.16 75)" }}>SERVICES</div>
            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: "oklch(0.93 0.01 60)" }}>玄學服務</h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: "oklch(0.52 0.02 60)" }}>由專業玄學師傅提供，助你解惑人生疑問</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { icon: "🧭", title: "風水諮詢", desc: "家居、辦公室風水佈局分析，改善運勢與財運" },
              { icon: "🔮", title: "八字命理", desc: "根據生辰八字分析個人運程、事業、感情走向" },
              { icon: "🃏", title: "塔羅占卜", desc: "塔羅牌解讀，為你的人生問題提供指引" },
              { icon: "🌿", title: "身心靈療癒", desc: "能量療癒、冥想指導，平衡身心靈狀態" },
            ].map((s) => (
              <div key={s.title} className="rounded-xl p-6 text-center transition-all duration-200 hover:scale-[1.02]"
                style={{ background: "oklch(0.11 0.015 260)", border: "1px solid oklch(0.20 0.02 260)" }}>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: "oklch(0.90 0.01 60)" }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.52 0.02 60)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg, oklch(0.75 0.15 75), oklch(0.62 0.24 25))", color: "white", boxShadow: "0 4px 20px oklch(0.62 0.24 25 / 0.30)" }}>
              立即預約<ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BLOG CTA ─────────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "oklch(0.07 0.01 260)" }}>
        <div className="container">
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
            style={{ background: "oklch(0.11 0.015 260)", border: "1px solid oklch(0.78 0.16 75 / 0.20)" }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute" style={{ bottom: "-10%", left: "5%", width: "40%", height: "60%", background: "radial-gradient(ellipse, oklch(0.78 0.16 75 / 0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "oklch(0.78 0.16 75)" }}>GUEST COLUMN</div>
                <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: "oklch(0.93 0.01 60)" }}>嘉賓專欄</h2>
                <p className="text-sm leading-relaxed mb-6 max-w-lg" style={{ color: "oklch(0.55 0.02 60)" }}>
                  閱讀嘉賓訪談後的深度心得，或分享你的故事，成為路邊電台的嘉賓作者。每一個故事都值得被聽見。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                    style={{ background: "oklch(0.14 0.02 260)", border: "1px solid oklch(0.25 0.02 260)", color: "oklch(0.82 0.01 60)" }}>
                    閱讀文章
                  </Link>
                  <Link href="/blog/submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, oklch(0.75 0.15 75), oklch(0.62 0.24 25))", color: "white" }}>
                    投稿分享<ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="text-6xl md:text-8xl opacity-20 select-none">✍️</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── READER SUBMISSIONS ───────────────────────────────────────────── */}
      <div id="submissions" style={{ background: "oklch(0.09 0.01 260)" }}>
        <ReaderSubmissions />
      </div>

      {/* ── SUBSCRIBE ────────────────────────────────────────────────────── */}
      <SubscribeBox />

      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.4); } }
        @keyframes shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
