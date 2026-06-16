import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { JsonLd, buildOrganizationSchema, buildWebSiteSchema } from "@/components/JsonLd";
import { Play, ChevronRight, Mic, Star, Users, Youtube, Radio, Sparkles, Handshake, Instagram, Facebook, Music, MessageCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

// ── Constants ──────────────────────────────────────────────────────────────────
const MYSTIC_METHODS = [
  { icon: "☯", label: "八字命理" }, { icon: "🌟", label: "紫微斗數" },
  { icon: "🔮", label: "塔羅占卜" }, { icon: "♈", label: "星座占星" },
  { icon: "🌙", label: "月亮星座" }, { icon: "🔢", label: "生命靈數" },
  { icon: "🧬", label: "人類圖" }, { icon: "🏠", label: "風水流年" },
  { icon: "✨", label: "阿卡西紀錄" }, { icon: "🌀", label: "奇門遁甲" },
];

const SOCIAL_PLATFORMS = [
  { name: "YouTube 路邊電台", href: "https://www.youtube.com/@6bpodcasts", descKey: "podcasts" as const, fallbackDesc: "訂閱頻道", color: "oklch(0.62 0.24 25)", Icon: Youtube },
  { name: "YouTube 路邊玄學堂", href: "https://www.youtube.com/@6bfengshui", descKey: "fengshui" as const, fallbackDesc: "訂閱頻道", color: "oklch(0.55 0.20 250)", Icon: Youtube },
  { name: "Facebook", href: "https://www.facebook.com/6bpodcasts", descKey: null, fallbackDesc: "16K 追蹤者", color: "oklch(0.50 0.18 255)", Icon: Facebook },
  { name: "Instagram", href: "https://www.instagram.com/6bpodcasts", descKey: null, fallbackDesc: "@6bpodcasts", color: "oklch(0.60 0.20 330)", Icon: Instagram },
  { name: "Threads", href: "https://www.threads.net/@6bpodcasts", descKey: null, fallbackDesc: "@6bpodcasts", color: "oklch(0.80 0.01 260)", Icon: MessageCircle },
  { name: "Apple Podcast", href: "https://apple.co/3nhSxy8", descKey: null, fallbackDesc: "免費收聽", color: "oklch(0.65 0.15 290)", Icon: Music },
  { name: "Spotify", href: "https://spoti.fi/30EQPOT", descKey: null, fallbackDesc: "免費收聽", color: "oklch(0.65 0.20 145)", Icon: Music },
];

// ── VideoCard ──────────────────────────────────────────────────────────────────
function VideoCard({ v, isFengshui }: {
  v: { id: string; title: string; thumbnail: string | null; url: string; viewCount: string; publishedAt: string; duration: string | null; channelTitle?: string | null };
  isFengshui: boolean;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      style={{ background: "oklch(0.12 0.015 260 / 0.9)", border: "1px solid oklch(0.22 0.02 260)", boxShadow: "0 4px 24px oklch(0 0 0 / 0.3)" }}
      onClick={() => window.open(v.url, "_blank", "noopener,noreferrer")}
    >
      <div className="aspect-video relative overflow-hidden" style={{ background: "oklch(0.10 0.01 260)" }}>
        {v.thumbnail ? (
          <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-10 h-10 opacity-30" style={{ color: "oklch(0.62 0.24 25)" }} />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "oklch(0 0 0 / 0.5)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: isFengshui ? "oklch(0.55 0.20 250 / 0.95)" : "oklch(0.62 0.24 25 / 0.95)", boxShadow: `0 0 30px ${isFengshui ? "oklch(0.55 0.20 250 / 0.6)" : "oklch(0.62 0.24 25 / 0.6)"}` }}>
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold z-10"
          style={{ background: isFengshui ? "oklch(0.55 0.20 250 / 0.92)" : "oklch(0.62 0.24 25 / 0.92)", color: "white", backdropFilter: "blur(4px)" }}>
          {isFengshui ? "🔮 玄學堂" : "🎙️ 路邊電台"}
        </div>
        {v.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono z-10"
            style={{ background: "oklch(0 0 0 / 0.75)", color: "white" }}>
            {v.duration}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "oklch(0.92 0.01 260)" }}>{v.title}</p>
        <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>
          {v.viewCount && <span className="flex items-center gap-1"><Play className="w-3 h-3" />{v.viewCount}</span>}
          <span>{new Date(v.publishedAt).toLocaleDateString("zh-HK", { month: "short", day: "numeric" })}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Home() {
  useSEO({
    title: "6B Podcast｜香港真實人物訪談、兩性關係、中西玄學內容平台",
    description: "6B Podcast 是香港本地內容平台，集合真實人物訪談、兩性關係、都市情感、中西玄學、風水命理、身心靈及 YouTube 節目內容。",
    keywords: "6B Podcast,路邊電台,路邊玄學堂,香港 Podcast,香港 YouTube 訪談,兩性關係 Podcast,香港玄學,風水命理,八字分析,紫微斗數,塔羅占卜,生命靈數,身心靈香港",
    ogTitle: "6B Podcast｜香港真實人物訪談、兩性關係、中西玄學內容平台",
    ogDescription: "6B Podcast 是香港本地內容平台，集合真實人物訪談、兩性關係、中西玄學、風水命理、身心靈及 YouTube 節目內容。",
    ogUrl: "https://www.6bpodcasts.com/home",
    canonical: "https://www.6bpodcasts.com/home",
  });
  const { user } = useAuth();
  const [videoFilter, setVideoFilter] = useState<"all" | "podcasts" | "fengshui">("all");
  const videoQueryInput = useMemo(() => ({ channel: "all" as const, limit: 9 }), []);
  const { data: videosData, isLoading: videosLoading } = trpc.youtube.getVideos.useQuery(videoQueryInput, { staleTime: 5 * 60 * 1000 });
  const { data: channelsData } = trpc.youtube.getChannels.useQuery(undefined, { staleTime: 30 * 60 * 1000 });
  const { data: blogData } = trpc.blog.list.useQuery({ limit: 3, offset: 0 }, { staleTime: 5 * 60 * 1000 });

  type VideoItem = { id: string; title: string; thumbnail: string | null; url: string; viewCount: string; publishedAt: string; duration: string | null; channelTitle?: string | null; channelId?: string | null };
  const allVideos = (videosData?.videos ?? []) as VideoItem[];
  const filteredVideos = useMemo(() => {
    if (videoFilter === "all") return allVideos.slice(0, 9);
    return allVideos.filter(v => videoFilter === "fengshui"
      ? (v.channelTitle?.includes("玄學") || v.channelId?.includes("fengshui"))
      : (!v.channelTitle?.includes("玄學") && !v.channelId?.includes("fengshui"))
    ).slice(0, 9);
  }, [allVideos, videoFilter]);

  type ChannelInfo = { subscriberCount?: string; id?: string; title?: string };
  const podcastsChannel = channelsData?.podcasts as ChannelInfo | null | undefined;
  const fengshuiChannel = channelsData?.fengshui as ChannelInfo | null | undefined;
  const podcastsSubs = podcastsChannel?.subscriberCount ?? "";
  const fengshuiSubs = fengshuiChannel?.subscriberCount ?? "";
  const totalSubsNum = [podcastsSubs, fengshuiSubs].reduce((acc, s) => acc + (parseInt(s.replace(/,/g, "")) || 0), 0);
  const totalSubs = totalSubsNum > 0 ? String(totalSubsNum) : "";

  const formatSubs = (s: string) => {
    if (!s) return "";
    const n = parseInt(s.replace(/,/g, ""));
    if (isNaN(n)) return s;
    if (n >= 10000) return `${(n / 10000).toFixed(1)}萬`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return s;
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0.01 260)", color: "oklch(0.92 0.01 260)" }}>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebSiteSchema()} />

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-16">
        {/* Background image */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "url('/manus-storage/hero-main_12cca13c.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }} />
        {/* Dark overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "oklch(0.08 0.01 260 / 0.75)" }} />
        {/* Background grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(oklch(0.22 0.02 260 / 0.10) 1px, transparent 1px), linear-gradient(90deg, oklch(0.22 0.02 260 / 0.10) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "oklch(0.62 0.24 25 / 0.12)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "oklch(0.55 0.20 250 / 0.12)" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
            style={{ background: "oklch(0.62 0.24 25 / 0.12)", border: "1px solid oklch(0.62 0.24 25 / 0.3)", color: "oklch(0.75 0.15 25)" }}>
            <Radio className="w-3.5 h-3.5" />
            香港原創 Podcast 內容平台
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            <span style={{ color: "oklch(0.92 0.01 260)" }}>6B Podcast</span>
            <br />
            <span style={{
              background: "linear-gradient(135deg, oklch(0.75 0.20 25), oklch(0.70 0.18 330), oklch(0.65 0.20 250))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>
              香港真實人物、關係、玄學
            </span>
            <br />
            <span style={{ color: "oklch(0.92 0.01 260)" }}>與生活文化內容平台</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "oklch(0.65 0.02 260)" }}>
            由真實訪談出發，探索兩性關係、人生選擇、中西玄學、身心靈與香港人的內心世界。
          </p>

          {/* Stats row */}
          {totalSubs && (
            <div className="flex items-center justify-center gap-6 mb-10 flex-wrap">
              {podcastsSubs && (
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "oklch(0.75 0.20 25)" }}>{formatSubs(podcastsSubs)}</div>
                  <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.02 260)" }}>路邊電台訂閱</div>
                </div>
              )}
              <div className="w-px h-10" style={{ background: "oklch(0.25 0.02 260)" }} />
              {fengshuiSubs && (
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "oklch(0.65 0.20 250)" }}>{formatSubs(fengshuiSubs)}</div>
                  <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.02 260)" }}>路邊玄學堂訂閱</div>
                </div>
              )}
              <div className="w-px h-10" style={{ background: "oklch(0.25 0.02 260)" }} />
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "oklch(0.85 0.05 260)" }}>{formatSubs(totalSubs)}</div>
                <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.02 260)" }}>總訂閱人數</div>
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 hover:brightness-110"
              style={{ background: "oklch(0.62 0.24 25)", color: "white", boxShadow: "0 4px 20px oklch(0.62 0.24 25 / 0.4)" }}>
              <Youtube className="w-5 h-5" />
              觀看最新節目
            </a>
            <Link href="/mystic"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
              style={{ background: "oklch(0.55 0.20 250 / 0.15)", border: "1px solid oklch(0.55 0.20 250 / 0.4)", color: "oklch(0.75 0.15 250)" }}>
              <Sparkles className="w-5 h-5" />
              進入路邊玄學堂
            </Link>
            <Link href="/partnership"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
              style={{ background: "transparent", border: "1px solid oklch(0.30 0.02 260)", color: "oklch(0.65 0.02 260)" }}>
              <Handshake className="w-5 h-5" />
              查詢合作
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 rounded-full" style={{ background: "linear-gradient(to bottom, transparent, oklch(0.62 0.24 25))" }} />
        </div>
      </section>

      {/* ── 2. THREE ENTRY CARDS ──────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: 路邊電台 */}
            <Link href="/podcasts" className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{ border: "1px solid oklch(0.22 0.02 260)", boxShadow: "0 4px 24px oklch(0 0 0 / 0.4)" }}>
              {/* Card image */}
              <div className="relative h-44 overflow-hidden">
                <img src="/manus-storage/card-podcasts_635bb2ff.jpg" alt="路邊電台 - 香港真實人物訪談 Podcast" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, oklch(0.10 0.015 260 / 0.9))" }} />
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "oklch(0.62 0.24 25 / 0.9)", color: "white" }}>🎙️ Podcast</span>
                </div>
              </div>
              <div className="p-5" style={{ background: "oklch(0.12 0.015 260 / 0.95)" }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: "oklch(0.92 0.01 260)" }}>路邊電台</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.60 0.02 260)" }}>
                  真實人物訪談、兩性關係、都市情感、人生故事
                </p>
                <div className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all duration-200"
                  style={{ color: "oklch(0.75 0.20 25)" }}>
                  觀看節目 <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Card 2: 路邊玄學堂 */}
            <Link href="/mystic" className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{ border: "1px solid oklch(0.22 0.02 260)", boxShadow: "0 4px 24px oklch(0 0 0 / 0.4)" }}>
              {/* Card image */}
              <div className="relative h-44 overflow-hidden">
                <img src="/manus-storage/card-mystic_655df03c.jpg" alt="路邊玄學堂 - 香港中西玄學內容平台" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, oklch(0.10 0.015 260 / 0.9))" }} />
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "oklch(0.45 0.18 280 / 0.9)", color: "white" }}>🔮 玄學</span>
                </div>
              </div>
              <div className="p-5" style={{ background: "oklch(0.12 0.015 260 / 0.95)" }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: "oklch(0.92 0.01 260)" }}>路邊玄學堂</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.60 0.02 260)" }}>
                  風水、八字、紫微斗數、塔羅、星座、生命靈數、身心靈
                </p>
                <div className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all duration-200"
                  style={{ color: "oklch(0.70 0.18 250)" }}>
                  探索玄學內容 <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Card 3: 商業合作 */}
            <Link href="/partnership" className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{ border: "1px solid oklch(0.22 0.02 260)", boxShadow: "0 4px 24px oklch(0 0 0 / 0.4)" }}>
              {/* Card image */}
              <div className="relative h-44 overflow-hidden">
                <img src="/manus-storage/card-partnership_7db8dac3.jpg" alt="6B Podcast 商業合作 - 品牌訪談、節目贊助" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, oklch(0.10 0.015 260 / 0.9))" }} />
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "oklch(0.55 0.12 80 / 0.9)", color: "white" }}>💼 商業</span>
                </div>
              </div>
              <div className="p-5" style={{ background: "oklch(0.12 0.015 260 / 0.95)" }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: "oklch(0.92 0.01 260)" }}>商業合作</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.60 0.02 260)" }}>
                  品牌訪談、節目製作、嘉賓曝光、贊助合作
                </p>
                <div className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all duration-200"
                  style={{ color: "oklch(0.78 0.15 80)" }}>
                  查詢合作方案 <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. LATEST YOUTUBE VIDEOS ──────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid oklch(0.15 0.01 260)" }}>
        <div className="max-w-6xl mx-auto">
          {/* 區塊標題 */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "oklch(0.92 0.01 260)" }}>最新 YouTube 影片</h2>
            <p className="text-sm" style={{ color: "oklch(0.55 0.02 260)" }}>路邊電台 × 路邊玄學堂，兩個頻道分開展示</p>
          </div>

          {/* 路邊電台區塊 */}
          <div className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full" style={{ background: "oklch(0.62 0.24 25)" }} />
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "oklch(0.88 0.05 25)" }}>🎙️ 路邊電台</h3>
                  <p className="text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>兩性關係、人物訪談、都市情感、人生故事</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href="https://www.youtube.com/@6bpodcasts?sub_confirmation=1" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.45 0.20 25))", color: "white", textDecoration: "none" }}>
                  <Youtube className="w-3.5 h-3.5" /> 訂閱路邊電台
                </a>
                <Link href="/episodes"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: "oklch(0.13 0.02 260)", border: "1px solid oklch(0.25 0.04 25)", color: "oklch(0.75 0.15 25)", textDecoration: "none" }}>
                  查看全部 <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            {videosLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: "oklch(0.12 0.01 260)" }}>
                    <div className="aspect-video" style={{ background: "oklch(0.15 0.01 260)" }} />
                    <div className="p-3 space-y-2">
                      <div className="h-3 rounded" style={{ background: "oklch(0.18 0.01 260)", width: "80%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allVideos.filter(v => !v.channelTitle?.includes("玄學") && !v.channelId?.includes("fengshui")).slice(0, 3).map(v => (
                  <VideoCard key={v.id} v={v} isFengshui={false} />
                ))}
              </div>
            )}
          </div>

          {/* 路邊玄學堂區塊 */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full" style={{ background: "oklch(0.65 0.22 290)" }} />
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "oklch(0.85 0.10 290)" }}>🔮 路邊玄學堂</h3>
                  <p className="text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>風水、八字、紫微斗數、塔羅、星座、身心靈</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href="https://www.youtube.com/@6bfengshui?sub_confirmation=1" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 290), oklch(0.45 0.20 290))", color: "white", textDecoration: "none" }}>
                  <Youtube className="w-3.5 h-3.5" /> 訂閱玄學頻道
                </a>
                <Link href="/mystic/videos"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: "oklch(0.13 0.02 260)", border: "1px solid oklch(0.25 0.06 290)", color: "oklch(0.75 0.16 290)", textDecoration: "none" }}>
                  查看全部 <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            {videosLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: "oklch(0.12 0.01 260)" }}>
                    <div className="aspect-video" style={{ background: "oklch(0.15 0.01 260)" }} />
                    <div className="p-3 space-y-2">
                      <div className="h-3 rounded" style={{ background: "oklch(0.18 0.01 260)", width: "80%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allVideos.filter(v => v.channelTitle?.includes("玄學") || v.channelId?.includes("fengshui")).slice(0, 3).map(v => (
                  <VideoCard key={v.id} v={v} isFengshui={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. PROGRAMME CATEGORIES ───────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid oklch(0.15 0.01 260)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "oklch(0.92 0.01 260)" }}>熱門節目分類</h2>
            <p className="text-sm" style={{ color: "oklch(0.55 0.02 260)" }}>多元內容線，總有一個適合你</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "💑", label: "兩性關係", desc: "愛情、分手、婚姻真相", color: "oklch(0.62 0.24 25)" },
              { icon: "🎤", label: "人物訪談", desc: "真實人生故事", color: "oklch(0.60 0.22 330)" },
              { icon: "🏙️", label: "都市情感", desc: "香港人的感情困境", color: "oklch(0.55 0.18 200)" },
              { icon: "💼", label: "商業人生", desc: "創業、職場、人生選擇", color: "oklch(0.65 0.15 80)" },
            ].map(cat => (
              <Link href="/podcasts" key={cat.label}
                className="group rounded-xl p-5 text-center transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                style={{ background: "oklch(0.12 0.015 260 / 0.8)", border: "1px solid oklch(0.20 0.02 260)" }}>
                <div className="text-3xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-sm mb-1" style={{ color: cat.color }}>{cat.label}</div>
                <div className="text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>{cat.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. MYSTIC HIGHLIGHT ───────────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid oklch(0.15 0.01 260)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, oklch(0.12 0.03 260), oklch(0.10 0.04 280))", border: "1px solid oklch(0.25 0.05 270)" }}>
            <div className="p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row gap-10 items-center">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5"
                    style={{ background: "oklch(0.55 0.20 250 / 0.15)", border: "1px solid oklch(0.55 0.20 250 / 0.3)", color: "oklch(0.70 0.15 250)" }}>
                    <Sparkles className="w-3 h-3" /> 路邊玄學堂精選
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: "oklch(0.92 0.01 260)" }}>
                    AI 玄學分析
                    <span className="block text-lg font-normal mt-1" style={{ color: "oklch(0.65 0.02 260)" }}>
                      10 種中西派別，一次輸入，反覆解讀
                    </span>
                  </h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "oklch(0.60 0.02 260)" }}>
                    只需輸入出生日期，即可獲得八字命理、紫微斗數、塔羅占卜、西洋占星、生命靈數等多種玄學派別的 AI 深度分析報告。現正限時免費體驗。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {MYSTIC_METHODS.map(m => (
                      <span key={m.label} className="px-3 py-1 rounded-full text-xs"
                        style={{ background: "oklch(0.55 0.20 250 / 0.10)", border: "1px solid oklch(0.55 0.20 250 / 0.2)", color: "oklch(0.70 0.12 250)" }}>
                        {m.icon} {m.label}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {user ? (
                      <Link href="/mystic/analysis"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                        style={{ background: "oklch(0.55 0.20 250)", color: "white", boxShadow: "0 4px 20px oklch(0.55 0.20 250 / 0.4)" }}>
                        <Sparkles className="w-4 h-4" /> 立即免費分析
                      </Link>
                    ) : (
                      <a href={getLoginUrl()}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                        style={{ background: "oklch(0.55 0.20 250)", color: "white", boxShadow: "0 4px 20px oklch(0.55 0.20 250 / 0.4)" }}>
                        <Sparkles className="w-4 h-4" /> 登入免費體驗
                      </a>
                    )}
                    <Link href="/mystic"
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                      style={{ background: "transparent", border: "1px solid oklch(0.35 0.05 270)", color: "oklch(0.70 0.10 260)" }}>
                      了解更多 <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                {/* Right visual */}
                <div className="hidden lg:flex flex-col items-center gap-3">
                  <div className="grid grid-cols-3 gap-3">
                    {MYSTIC_METHODS.map(m => (
                      <div key={m.label} className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-110"
                        style={{ background: "oklch(0.15 0.04 270 / 0.8)", border: "1px solid oklch(0.28 0.06 270)" }}>
                        <span className="text-2xl">{m.icon}</span>
                        <span className="text-xs text-center leading-tight" style={{ color: "oklch(0.65 0.08 260)" }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. MYSTIC SERVICE CTA ─────────────────────────────────────────────── */}
      <section className="py-12 px-4" style={{ borderTop: "1px solid oklch(0.15 0.01 260)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link href="/mystic/services"
              className="group flex items-center gap-5 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "oklch(0.12 0.015 260 / 0.8)", border: "1px solid oklch(0.22 0.02 260)" }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "oklch(0.55 0.20 250 / 0.15)", border: "1px solid oklch(0.55 0.20 250 / 0.3)" }}>
                <Star className="w-7 h-7" style={{ color: "oklch(0.70 0.18 250)" }} />
              </div>
              <div>
                <div className="font-bold mb-1" style={{ color: "oklch(0.92 0.01 260)" }}>預約玄學服務</div>
                <div className="text-sm" style={{ color: "oklch(0.55 0.02 260)" }}>師傅一對一諮詢、命盤解讀、風水勘察</div>
                <div className="flex items-center gap-1 text-xs mt-2 font-medium" style={{ color: "oklch(0.70 0.18 250)" }}>
                  立即預約 <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
            <Link href="/mystic/pricing"
              className="group flex items-center gap-5 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "oklch(0.12 0.015 260 / 0.8)", border: "1px solid oklch(0.22 0.02 260)" }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "oklch(0.65 0.15 80 / 0.15)", border: "1px solid oklch(0.65 0.15 80 / 0.3)" }}>
                <Users className="w-7 h-7" style={{ color: "oklch(0.78 0.15 80)" }} />
              </div>
              <div>
                <div className="font-bold mb-1" style={{ color: "oklch(0.92 0.01 260)" }}>會員訂閱方案</div>
                <div className="text-sm" style={{ color: "oklch(0.55 0.02 260)" }}>無限 AI 分析、專屬報告、優先服務</div>
                <div className="flex items-center gap-1 text-xs mt-2 font-medium" style={{ color: "oklch(0.78 0.15 80)" }}>
                  查看方案 <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. GUEST COLUMN / BLOG ────────────────────────────────────────────── */}
      {blogData && blogData.length > 0 && (
        <section className="py-16 px-4" style={{ borderTop: "1px solid oklch(0.15 0.01 260)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "oklch(0.92 0.01 260)" }}>嘉賓專欄</h2>
                <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.02 260)" }}>精選文章、節目延伸內容、人物故事</p>
              </div>
              <Link href="/blog" className="flex items-center gap-1 text-sm font-medium transition-all duration-200 hover:gap-2"
                style={{ color: "oklch(0.62 0.24 25)" }}>
                全部文章 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {blogData.slice(0, 3).map(post => (
                <Link href={`/blog/${post.slug}`} key={post.id}
                  className="group block rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "oklch(0.12 0.015 260 / 0.8)", border: "1px solid oklch(0.20 0.02 260)" }}>
                  {post.coverImage && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-xs mb-2 px-2 py-0.5 rounded-full inline-block"
                      style={{ background: "oklch(0.62 0.24 25 / 0.12)", color: "oklch(0.75 0.15 25)" }}>
                      {post.authorName}
                    </div>
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2" style={{ color: "oklch(0.88 0.01 260)" }}>{post.title}</h3>
                    {post.excerpt && <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "oklch(0.55 0.02 260)" }}>{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. PARTNERSHIP ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid oklch(0.15 0.01 260)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-8 sm:p-12 text-center" style={{ background: "oklch(0.11 0.015 260)", border: "1px solid oklch(0.20 0.02 260)" }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "oklch(0.65 0.15 80 / 0.15)", border: "1px solid oklch(0.65 0.15 80 / 0.3)" }}>
              <Handshake className="w-7 h-7" style={{ color: "oklch(0.78 0.15 80)" }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "oklch(0.92 0.01 260)" }}>商業合作</h2>
            <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8" style={{ color: "oklch(0.60 0.02 260)" }}>
              品牌訪談、節目製作、嘉賓曝光、贊助合作。我們為品牌提供真實、有深度的內容合作方案，觸達香港真實受眾。
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {["品牌訪談", "節目贊助", "嘉賓曝光", "活動合作"].map(item => (
                <div key={item} className="rounded-xl py-3 px-4 text-sm font-medium"
                  style={{ background: "oklch(0.65 0.15 80 / 0.08)", border: "1px solid oklch(0.65 0.15 80 / 0.2)", color: "oklch(0.78 0.12 80)" }}>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/partnership"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{ background: "oklch(0.65 0.15 80)", color: "oklch(0.10 0.01 80)", boxShadow: "0 4px 20px oklch(0.65 0.15 80 / 0.3)" }}>
              立即查詢合作方案 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. SOCIAL FOLLOW ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid oklch(0.15 0.01 260)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "oklch(0.92 0.01 260)" }}>追蹤我們</h2>
          <p className="text-sm mb-10" style={{ color: "oklch(0.55 0.02 260)" }}>在你最常用的平台上追蹤路邊電台，不錯過任何新內容</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SOCIAL_PLATFORMS.map(p => {
              const subsText = p.descKey
                ? (p.descKey === "podcasts" ? (podcastsSubs ? formatSubs(podcastsSubs) + " 訂閱" : p.fallbackDesc) : (fengshuiSubs ? formatSubs(fengshuiSubs) + " 訂閱" : p.fallbackDesc))
                : p.fallbackDesc;
              return (
                <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:scale-[1.03]"
                  style={{ background: "oklch(0.12 0.015 260 / 0.8)", border: "1px solid oklch(0.20 0.02 260)" }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${p.color} / 0.15`.replace(" / ", " / "), backgroundColor: `color-mix(in oklch, ${p.color} 15%, transparent)`, border: `1px solid color-mix(in oklch, ${p.color} 30%, transparent)` }}>
                    <p.Icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium" style={{ color: "oklch(0.85 0.01 260)" }}>{p.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.02 260)" }}>{subsText}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 10. FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-4" style={{ borderTop: "1px solid oklch(0.15 0.01 260)", background: "oklch(0.07 0.01 260)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">
            <div className="sm:col-span-2">
              <div className="text-xl font-bold mb-3" style={{ color: "oklch(0.92 0.01 260)" }}>6B Podcasts</div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.50 0.02 260)" }}>
                香港原創 Podcast 內容平台。路邊電台 × 路邊玄學堂，探索真實人物、兩性關係與中西玄學。
              </p>
              <div className="flex items-center gap-3">
                {[
                  { href: "https://www.youtube.com/@6bpodcasts", Icon: Youtube },
                  { href: "https://www.facebook.com/6bpodcasts", Icon: Facebook },
                  { href: "https://www.instagram.com/6bpodcasts", Icon: Instagram },
                ].map(({ href, Icon }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ background: "oklch(0.15 0.01 260)", border: "1px solid oklch(0.22 0.02 260)", color: "oklch(0.60 0.02 260)" }}>
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-3" style={{ color: "oklch(0.75 0.02 260)" }}>內容頻道</div>
              <div className="space-y-2">
                {[
                  { href: "/podcasts", label: "路邊電台" },
                  { href: "/mystic", label: "路邊玄學堂" },
                  { href: "/episodes", label: "最新節目" },
                  { href: "/blog", label: "嘉賓專欄" },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="block text-sm transition-colors hover:opacity-80"
                    style={{ color: "oklch(0.50 0.02 260)" }}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-3" style={{ color: "oklch(0.75 0.02 260)" }}>更多資訊</div>
              <div className="space-y-2">
                {[
                  { href: "/mystic/services", label: "玄學服務" },
                  { href: "/partnership", label: "商業合作" },
                  { href: "/about", label: "關於 6B" },
                  { href: "/contact", label: "聯絡我們" },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="block text-sm transition-colors hover:opacity-80"
                    style={{ color: "oklch(0.50 0.02 260)" }}>{l.label}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6" style={{ borderTop: "1px solid oklch(0.13 0.01 260)" }}>
            <div className="text-xs" style={{ color: "oklch(0.40 0.02 260)" }}>
              © 2024 6B Podcasts. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs transition-colors hover:opacity-80" style={{ color: "oklch(0.40 0.02 260)" }}>私隱政策</Link>
              <Link href="/terms" className="text-xs transition-colors hover:opacity-80" style={{ color: "oklch(0.40 0.02 260)" }}>使用條款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
