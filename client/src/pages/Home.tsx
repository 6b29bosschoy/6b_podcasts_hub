import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { JsonLd, buildOrganizationSchema, buildWebSiteSchema } from "@/components/JsonLd";
import { Play, ChevronRight, Mic, Star, Users, Youtube, Radio, Sparkles, Handshake, Instagram, Facebook, Music, MessageCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

// ── Constants ──────────────────────────────────────────────────────────────────
const MYSTIC_CHARS = [
  { char: "命", label: "八字命理" }, { char: "紫", label: "紫微斗數" },
  { char: "塔", label: "塔羅占卜" }, { char: "星", label: "星座占星" },
  { char: "月", label: "月亮星座" }, { char: "數", label: "生命靈數" },
  { char: "圖", label: "人類圖" },   { char: "風", label: "風水流年" },
  { char: "阿", label: "阿卡西紀錄" }, { char: "奇", label: "奇門遁甲" },
];

const SOCIAL_PLATFORMS = [
  { name: "YouTube 路邊電台", href: "https://www.youtube.com/@6bpodcasts", descKey: "podcasts" as const, fallbackDesc: "訂閱頻道", Icon: Youtube },
  { name: "YouTube 路邊玄學堂", href: "https://www.youtube.com/@6bfengshui", descKey: "fengshui" as const, fallbackDesc: "訂閱頻道", Icon: Youtube },
  { name: "Facebook", href: "https://www.facebook.com/6bpodcasts", descKey: null, fallbackDesc: "16K 追蹤者", Icon: Facebook },
  { name: "Instagram", href: "https://www.instagram.com/6bpodcasts", descKey: null, fallbackDesc: "@6bpodcasts", Icon: Instagram },
  { name: "Threads", href: "https://www.threads.net/@6bpodcasts", descKey: null, fallbackDesc: "@6bpodcasts", Icon: MessageCircle },
  { name: "Apple Podcast", href: "https://apple.co/3nhSxy8", descKey: null, fallbackDesc: "免費收聽", Icon: Music },
  { name: "Spotify", href: "https://spoti.fi/30EQPOT", descKey: null, fallbackDesc: "免費收聽", Icon: Music },
];

// ── Bagua SVG (decorative, no text) ───────────────────────────────────────────
function BaguaSVG() {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full bagua-rotate" aria-hidden="true">
      <circle cx="120" cy="120" r="118" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="120" cy="120" r="95" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="120" cy="120" r="72" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="120" cy="120" r="48" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="120" cy="120" r="24" stroke="currentColor" strokeWidth="0.5" />
      {/* 8 radial lines */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x1 = 120 + 24 * Math.cos(angle);
        const y1 = 120 + 24 * Math.sin(angle);
        const x2 = 120 + 118 * Math.cos(angle);
        const y2 = 120 + 118 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5" />;
      })}
      {/* Tick marks on outer ring */}
      {Array.from({ length: 64 }).map((_, i) => {
        const angle = (i * (360 / 64) * Math.PI) / 180;
        const r1 = i % 8 === 0 ? 108 : i % 4 === 0 ? 112 : 115;
        const x1 = 120 + r1 * Math.cos(angle);
        const y1 = 120 + r1 * Math.sin(angle);
        const x2 = 120 + 118 * Math.cos(angle);
        const y2 = 120 + 118 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.4" />;
      })}
    </svg>
  );
}

// ── VideoCard ──────────────────────────────────────────────────────────────────
function VideoCard({ v, isFengshui }: {
  v: { id: string; title: string; thumbnail: string | null; url: string; viewCount: string; publishedAt: string; duration: string | null; channelTitle?: string | null };
  isFengshui: boolean;
}) {
  return (
    <div
      className="card-line group cursor-pointer"
      onClick={() => window.open(v.url, "_blank", "noopener,noreferrer")}
    >
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden" style={{ background: "var(--bg-raise)" }}>
        {v.thumbnail ? (
          <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-8 h-8" style={{ color: "var(--text-3)" }} />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--gold)", color: "#141210" }}>
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
        {/* Channel tag */}
        <div className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 ${isFengshui ? "channel-tag-gold" : "channel-tag-red"}`}
          style={{ background: "rgba(13,12,10,0.75)", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
          {isFengshui ? "玄學堂" : "路邊電台"}
        </div>
        {/* Duration */}
        {v.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs" style={{ background: "rgba(0,0,0,0.75)", color: "var(--text-2)", fontFamily: "'Cormorant Garamond', serif" }}>
            {v.duration}
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm leading-snug line-clamp-2 mb-2" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 600, color: "var(--text)" }}>{v.title}</p>
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-3)" }}>
          {v.viewCount && <span className="flex items-center gap-1"><Play className="w-3 h-3" />{v.viewCount}</span>}
          <span style={{ fontFamily: "'Cormorant Garamond', serif" }}>{new Date(v.publishedAt).toLocaleDateString("zh-HK", { month: "short", day: "numeric" })}</span>
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

  const podcastVideos = allVideos.filter(v => !v.channelTitle?.includes("玄學") && !v.channelId?.includes("fengshui")).slice(0, 3);
  const fengshuiVideos = allVideos.filter(v => v.channelTitle?.includes("玄學") || v.channelId?.includes("fengshui")).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebSiteSchema()} />

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-20">
        {/* Bagua decoration — right side, very faint */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[480px] h-[480px] opacity-[0.07] pointer-events-none hidden lg:block"
          style={{ color: "var(--gold)" }}>
          <BaguaSVG />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Kicker */}
          <p className="kicker mb-6">HONG KONG · VOICES &amp; FORTUNE</p>

          {/* Ray placeholder — replace with real photo when available */}
          {/* 【待 Ray 提供錄音室現場相片，建議 2-3 張，放喺 Hero 右側或背景層】 */}

          {/* H1 */}
          <h1 className="mb-6" style={{
            fontFamily: "'Noto Serif TC', serif",
            fontWeight: 900,
            fontSize: "clamp(2.25rem, 6vw, 4rem)",
            lineHeight: 1.2,
            color: "var(--text)",
          }}>
            <span style={{ color: "var(--gold)" }}>486 個人</span>喺呢度講咗真話。
            <br />
            到你。
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto mb-10 text-base leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>
            聽真人故事（免費）・搵師傅拆局（預約）
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            {/* Primary: gold solid */}
            <Link href="/mystic/analysis" className="btn-gold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              免費睇吓你個盤
            </Link>
            {/* Secondary: ghost */}
            <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
              聽吓人哋嘅故事
            </a>
          </div>

          {/* Stats row */}
          <hr className="divider mb-8 max-w-md mx-auto" />
          {totalSubs && (
            <div className="flex items-end justify-center gap-10 flex-wrap">
              {podcastsSubs && (
                <div className="text-center">
                  <div className="stat-num">{formatSubs(podcastsSubs)}</div>
                  <div className="text-xs mt-1 tracking-widest uppercase" style={{ color: "var(--text-3)", fontFamily: "'Noto Sans TC', sans-serif", letterSpacing: "0.12em" }}>路邊電台訂閱</div>
                </div>
              )}
              {fengshuiSubs && (
                <div className="text-center">
                  <div className="stat-num">{formatSubs(fengshuiSubs)}</div>
                  <div className="text-xs mt-1 tracking-widest uppercase" style={{ color: "var(--text-3)", fontFamily: "'Noto Sans TC', sans-serif", letterSpacing: "0.12em" }}>路邊玄學堂訂閱</div>
                </div>
              )}
              <div className="text-center">
                <div className="stat-num">{formatSubs(totalSubs)}</div>
                <div className="text-xs mt-1 tracking-widest uppercase" style={{ color: "var(--text-3)", fontFamily: "'Noto Sans TC', sans-serif", letterSpacing: "0.12em" }}>總訂閱人數</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 2. THREE ENTRY CARDS ──────────────────────────────────────────────── */}
      <section className="px-4 pb-16" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ border: "1px solid var(--line)" }}>

            {/* Card 1: 路邊電台 */}
            <Link href="/podcasts" className="group block p-8 transition-all duration-300" style={{ borderRight: "1px solid var(--line)", background: "var(--bg-card)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raise)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; }}>
              {/* Icon */}
              <div className="w-11 h-11 rounded-full flex items-center justify-center mb-5" style={{ border: "1px solid var(--gold-dim)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
              <p className="kicker mb-2">THE RADIO</p>
              <h3 className="text-xl mb-2" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>路邊電台</h3>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>真實人物訪談、兩性關係、都市情感、人生故事</p>
              <span className="text-sm font-medium transition-colors" style={{ color: "var(--gold)" }}>
                觀看影片 →
              </span>
            </Link>

            {/* Card 2: 路邊玄學堂 */}
            <Link href="/mystic" className="group block p-8 transition-all duration-300" style={{ borderRight: "1px solid var(--line)", background: "var(--bg-card)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raise)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center mb-5" style={{ border: "1px solid var(--gold-dim)" }}>
                {/* Taiji line icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><path d="M12 2a5 5 0 0 1 0 10 5 5 0 0 0 0 10"/><circle cx="12" cy="7" r="1" fill="var(--gold)" stroke="none"/><circle cx="12" cy="17" r="1" fill="var(--gold)" stroke="none"/>
                </svg>
              </div>
              <p className="kicker mb-2">THE MYSTIC</p>
              <h3 className="text-xl mb-2" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>路邊玄學堂</h3>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>風水、八字、紫微斗數、塔羅、星座、生命靈數、身心靈</p>
              <span className="text-sm font-medium transition-colors" style={{ color: "var(--gold)" }}>
                探索玄學 →
              </span>
            </Link>

            {/* Card 3: 商業合作 */}
            <Link href="/partnership" className="group block p-8 transition-all duration-300" style={{ background: "var(--bg-card)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raise)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center mb-5" style={{ border: "1px solid var(--gold-dim)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <p className="kicker mb-2">PARTNERSHIP</p>
              <h3 className="text-xl mb-2" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>商業合作</h3>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>品牌訪談、節目製作、嘉賓曝光、贊助合作</p>
              <span className="text-sm font-medium transition-colors" style={{ color: "var(--gold)" }}>
                查詢方案 →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. LATEST YOUTUBE VIDEOS ──────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto">
          {/* 路邊電台 */}
          <div className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <p className="kicker mb-1">LATEST VIDEOS</p>
                <h2 className="text-xl" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>
                  <span className="channel-tag-red mr-2" style={{ fontSize: "0.75rem" }}>路邊電台</span>
                  最新影片
                </h2>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href="https://www.youtube.com/@6bpodcasts?sub_confirmation=1" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-all"
                  style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "var(--line)", color: "var(--text-2)", borderRadius: "var(--radius)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}>
                  <Youtube className="w-3.5 h-3.5" /> 訂閱頻道
                </a>
                <Link href="/episodes"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-all"
                  style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "var(--line)", color: "var(--text-2)", borderRadius: "var(--radius)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}>
                  查看全部 <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            {videosLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse" style={{ background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}>
                    <div className="aspect-video" style={{ background: "var(--bg-raise)" }} />
                    <div className="p-3 space-y-2">
                      <div className="h-3 rounded" style={{ background: "var(--line)", width: "80%" }} />
                      <div className="h-3 rounded" style={{ background: "var(--line)", width: "50%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {podcastVideos.map(v => <VideoCard key={v.id} v={v} isFengshui={false} />)}
              </div>
            )}
          </div>

          {/* 路邊玄學堂 */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <p className="kicker mb-1">MYSTIC CHANNEL</p>
                <h2 className="text-xl" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>
                  <span className="channel-tag-gold mr-2" style={{ fontSize: "0.75rem" }}>路邊玄學堂</span>
                  最新影片
                </h2>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href="https://www.youtube.com/@6bfengshui?sub_confirmation=1" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-all"
                  style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "var(--line)", color: "var(--text-2)", borderRadius: "var(--radius)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}>
                  <Youtube className="w-3.5 h-3.5" /> 訂閱頻道
                </a>
                <Link href="/mystic/videos"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-all"
                  style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "var(--line)", color: "var(--text-2)", borderRadius: "var(--radius)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}>
                  查看全部 <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            {videosLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse" style={{ background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}>
                    <div className="aspect-video" style={{ background: "var(--bg-raise)" }} />
                    <div className="p-3 space-y-2">
                      <div className="h-3 rounded" style={{ background: "var(--line)", width: "80%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fengshuiVideos.map(v => <VideoCard key={v.id} v={v} isFengshui={true} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. MYSTIC METHODS (10 characters grid) ───────────────────────────── */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="kicker mb-2">CHINESE & WESTERN METAPHYSICS</p>
            <h2 className="text-2xl" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>十種玄學方法</h2>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10" style={{ border: "1px solid var(--line)" }}>
            {MYSTIC_CHARS.map((m, i) => (
              <div key={m.label} className="mystic-cell" style={{ borderRight: i < 9 ? "1px solid var(--line)" : "none" }}>
                <span className="char">{m.char}</span>
                <span className="label">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Link href="/mystic/analysis" className="btn-gold text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              免費命盤分析
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. MYSTIC AI HIGHLIGHT ────────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="card-line p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-1">
                <p className="kicker mb-4">AI METAPHYSICS ANALYSIS</p>
                <h2 className="text-2xl sm:text-3xl mb-4" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>
                  AI 玄學分析
                  <span className="block text-base font-normal mt-2" style={{ color: "var(--text-2)", fontFamily: "'Noto Sans TC', sans-serif", fontWeight: 300 }}>
                    10 種中西派別，一次輸入，反覆解讀
                  </span>
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-2)", fontWeight: 300 }}>
                  只需輸入出生日期，即可獲得八字命理、紫微斗數、塔羅占卜、西洋占星、生命靈數等多種玄學派別的 AI 深度分析報告。現正限時免費體驗。
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {user ? (
                  <Link href="/mystic/analysis" className="btn-gold">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      免費睇吓你個盤
                    </Link>
                  ) : (
                    <a href={getLoginUrl()} className="btn-gold">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      登入先免費試吓
                    </a>
                  )}
                  <Link href="/mystic" className="btn-ghost">
                    睇吓玄學堂 <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              {/* Right: character grid */}
              <div className="hidden lg:grid grid-cols-5 gap-0 flex-shrink-0" style={{ width: "220px", border: "1px solid var(--line)" }}>
                {MYSTIC_CHARS.map((m, i) => (
                  <div key={m.label} className="flex flex-col items-center justify-center py-3 px-1"
                    style={{ borderRight: i % 5 !== 4 ? "1px solid var(--line)" : "none", borderBottom: i < 5 ? "1px solid var(--line)" : "none" }}>
                    <span style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, fontSize: "1.125rem", color: "var(--gold)", lineHeight: 1 }}>{m.char}</span>
                    <span style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: "0.25rem", textAlign: "center" }}>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. MYSTIC SERVICE CTA ─────────────────────────────────────────────── */}
      <section className="py-12 px-4" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0" style={{ border: "1px solid var(--line)" }}>
            <Link href="/mystic/services"
              className="group flex items-center gap-5 p-6 transition-all duration-200"
              style={{ borderRight: "1px solid var(--line)", background: "var(--bg-card)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raise)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "1px solid var(--gold-dim)" }}>
                <Star className="w-5 h-5" style={{ color: "var(--gold)" }} strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-semibold mb-1" style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)" }}>搵師傅傾吓</div>
                <div className="text-sm" style={{ color: "var(--text-2)", fontWeight: 300 }}>一對一命盤解讀、風水上門、感情事業分析</div>
                <div className="flex items-center gap-1 text-xs mt-2" style={{ color: "var(--gold)" }}>
                  WhatsApp 問吓先 <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
            <Link href="/mystic/pricing"
              className="group flex items-center gap-5 p-6 transition-all duration-200"
              style={{ background: "var(--bg-card)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raise)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "1px solid var(--gold-dim)" }}>
                <Users className="w-5 h-5" style={{ color: "var(--gold)" }} strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-semibold mb-1" style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)" }}>會員方案</div>
                <div className="text-sm" style={{ color: "var(--text-2)", fontWeight: 300 }}>一日三蚊，睇清楚成個月點行</div>
                <div className="flex items-center gap-1 text-xs mt-2" style={{ color: "var(--gold)" }}>
                  睇吓方案 <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. GUEST COLUMN / BLOG ────────────────────────────────────────────── */}
      {blogData && blogData.length > 0 && (
        <section className="py-16 px-4" style={{ borderTop: "1px solid var(--line)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="kicker mb-2">GUEST COLUMN</p>
                <h2 className="text-2xl" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>嘉賓專欄</h2>
              </div>
              <Link href="/blog" className="text-sm transition-colors" style={{ color: "var(--gold)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                全部文章 →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0" style={{ border: "1px solid var(--line)" }}>
              {blogData.slice(0, 3).map((post, i) => (
                <Link href={`/blog/${post.slug}`} key={post.id}
                  className="group block transition-all duration-200"
                  style={{ borderRight: i < 2 ? "1px solid var(--line)" : "none", background: "var(--bg-card)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raise)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; }}>
                  {post.coverImage && (
                    <div className="aspect-video overflow-hidden" style={{ borderBottom: "1px solid var(--line)" }}>
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-85" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="text-xs mb-2" style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}>{post.authorName}</div>
                    <h3 className="text-sm leading-snug line-clamp-2 mb-2" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 600, color: "var(--text)" }}>{post.title}</h3>
                    {post.excerpt && <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "var(--text-3)", fontWeight: 300 }}>{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. PARTNERSHIP ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="card-line p-8 sm:p-12 text-center">
            <p className="kicker mb-4">BUSINESS COLLABORATION</p>
            <h2 className="text-2xl sm:text-3xl mb-3" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>商業合作</h2>
            <p className="text-sm leading-relaxed max-w-xl mx-auto mb-8" style={{ color: "var(--text-2)", fontWeight: 300 }}>
              想你個品牌出現喺真實香港人嘅對話入面？我哋唔係硬銷，係幫你搵到真正有共鳴嘅受眾。
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 mb-8" style={{ border: "1px solid var(--line)" }}>
              {["品牌訪談", "節目贊助", "嘉賓曝光", "活動合作"].map((item, i) => (
                <div key={item} className="py-3 px-4 text-sm text-center"
                  style={{ borderRight: i < 3 ? "1px solid var(--line)" : "none", color: "var(--text-2)", fontWeight: 300 }}>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/partnership" className="btn-gold">
              WhatsApp 問吓先 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. SOCIAL FOLLOW ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="kicker mb-2">FOLLOW US</p>
            <h2 className="text-2xl" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>追蹤我們</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0" style={{ border: "1px solid var(--line)" }}>
            {SOCIAL_PLATFORMS.map((p, i) => {
              const subsText = p.descKey
                ? (p.descKey === "podcasts" ? (podcastsSubs ? formatSubs(podcastsSubs) + " 訂閱" : p.fallbackDesc) : (fengshuiSubs ? formatSubs(fengshuiSubs) + " 訂閱" : p.fallbackDesc))
                : p.fallbackDesc;
              return (
                <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 transition-all duration-200"
                  style={{
                    borderBottom: i < SOCIAL_PLATFORMS.length - 2 ? "1px solid var(--line)" : "none",
                    borderRight: i % 2 === 0 ? "1px solid var(--line)" : "none",
                    background: "var(--bg-card)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raise)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "1px solid var(--line)" }}>
                    <p.Icon className="w-4 h-4" style={{ color: "var(--gold)" }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{p.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-3)", fontFamily: "'Cormorant Garamond', serif" }}>{subsText}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
