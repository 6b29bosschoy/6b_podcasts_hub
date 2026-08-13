import { useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ShortHighlightsSection } from "@/components/ShortHighlightsSection";
import { Play, ChevronRight, Youtube, Calendar, ArrowDown } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/hero-new-main-3ptD2DHC6jMTxZHCYKJLcE.webp";
const HERO_BG_MOBILE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/hero-new-mobile-WybngLNmW22rmhrdvNB7xw.webp";

const EXPLORE_CARDS = [
  {
    emoji: "🎙️",
    tag: "路邊電台",
    title: "聽真實故事",
    desc: "人物訪談、兩性討論、都市情感。每週更新，香港人說香港事。",
    href: "/podcasts",
    ytHref: "https://www.youtube.com/@6bpodcasts",
    primary: true,
  },
  {
    emoji: "💬",
    tag: "兩性故事",
    title: "看懂感情",
    desc: "讀者故事、關係分析、自我成長。從別人的故事，找到自己的答案。",
    href: "/blog",
    ytHref: null,
    primary: false,
  },
  {
    emoji: "✨",
    tag: "路邊玄學堂",
    title: "尋找人生方向",
    desc: "八字、紫微、風水、塔羅。中西玄學，讓你看懂自己的命運格局。",
    href: "/mystic",
    ytHref: "https://www.youtube.com/@6bfengshui",
    primary: false,
  },
];

type VideoItem = {
  id: string;
  title: string;
  thumbnail: string | null;
  url: string;
  viewCount: string;
  publishedAt: string;
  duration: string | null;
  channelTitle?: string | null;
  channelId?: string | null;
};

function VideoCard({ v }: { v: VideoItem }) {
  const isMystic =
    v.channelTitle?.includes("玄學") || v.channelId?.includes("fengshui");
  return (
    <div
      className="group cursor-pointer overflow-hidden"
      style={{
        background: "var(--bg-raise)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "var(--line)",
        borderRadius: "var(--radius)",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-dim)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
      }}
      onClick={() => window.open(v.url, "_blank", "noopener,noreferrer")}
    >
      <div
        className="aspect-video relative overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {v.thumbnail ? (
          <img
            src={v.thumbnail}
            alt={v.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-8 h-8" style={{ color: "var(--text-3)" }} />
          </div>
        )}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(13,9,9,0.45)" }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "rgba(200,169,106,0.9)" }}
          >
            <Play className="w-4 h-4 ml-0.5" style={{ color: "#0d0909" }} />
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span
            className="text-xs px-2 py-0.5 font-medium"
            style={{
              background: isMystic
                ? "rgba(200,169,106,0.88)"
                : "rgba(139,46,46,0.88)",
              color: isMystic ? "#0d0909" : "#f0e6df",
              borderRadius: "var(--radius)",
              letterSpacing: "0.04em",
            }}
          >
            {isMystic ? "玄學堂" : "路邊電台"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3
          className="text-sm font-medium leading-snug line-clamp-2 mb-2"
          style={{ color: "var(--text)", fontFamily: "'Noto Sans TC', sans-serif" }}
        >
          {v.title}
        </h3>
        <div
          className="flex items-center gap-3 text-xs"
          style={{ color: "var(--text-3)" }}
        >
          {v.viewCount && (
            <span>{parseInt(v.viewCount).toLocaleString()} 次觀看</span>
          )}
          <span>
            {new Date(v.publishedAt).toLocaleDateString("zh-HK", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Portal() {
  const videoQueryInput = useMemo(
    () => ({ channel: "all" as const, limit: 12 }),
    []
  );
  const { data: videosData, isLoading: videosLoading } =
    trpc.youtube.getVideos.useQuery(videoQueryInput, {
      staleTime: 5 * 60 * 1000,
    });
  const { data: channelsData } = trpc.youtube.getChannels.useQuery(undefined, {
    staleTime: 30 * 60 * 1000,
  });

  type ChannelInfo = { subscriberCount?: string | number; id?: string; title?: string };
  const podcastsChannel = channelsData?.podcasts as ChannelInfo | null | undefined;
  const fengshuiChannel = channelsData?.fengshui as ChannelInfo | null | undefined;

  const formatSubs = (s?: string | number | null) => {
    if (!s) return "";
    const n = typeof s === "number" ? s : parseInt(String(s).replace(/,/g, ""));
    if (isNaN(n)) return String(s);
    if (n >= 10000) return `${(n / 10000).toFixed(1)}萬`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(s);
  };

  const podcastsSubs = formatSubs(podcastsChannel?.subscriberCount);
  const fengshuiSubs = formatSubs(fengshuiChannel?.subscriberCount);

  const allVideos = (videosData?.videos ?? []) as VideoItem[];

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet={HERO_BG_MOBILE} />
            <img
              src={HERO_BG}
              alt=""
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 40%" }}
              fetchPriority="high"
            />
          </picture>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,9,9,0.55) 0%, rgba(13,9,9,0.35) 35%, rgba(13,9,9,0.75) 70%, rgba(13,9,9,0.97) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6 pt-28 pb-32">
          {/* Eyebrow */}
          <p
            className="text-xs mb-6 tracking-widest uppercase"
            style={{
              color: "var(--gold)",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.25em",
            }}
          >
            Hong Kong · Podcast · Mystic Arts
          </p>

          {/* Headline */}
          <h1
            className="mb-5"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              fontWeight: 700,
              fontSize: "clamp(2.4rem, 6.5vw, 4.2rem)",
              lineHeight: 1.2,
              color: "#f0e6df",
              textShadow: "0 2px 24px rgba(13,9,9,0.55)",
            }}
          >
            聽見關係，
            <br />
            <span style={{ color: "var(--gold)" }}>看懂自己。</span>
          </h1>

          {/* Sub */}
          <p
            className="max-w-xl mx-auto mb-10 text-sm sm:text-base leading-relaxed"
            style={{ color: "rgba(240,230,223,0.78)", fontWeight: 300 }}
          >
            兩性故事、真實人物訪談與玄學人生指引，
            <br className="hidden sm:block" />
            陪你在每一次選擇之前，更了解自己。
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="btn-gold"
              onClick={() => {
                document
                  .getElementById("explore")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <ArrowDown className="w-4 h-4" /> 開始探索
            </button>
            <Link href="/booking" className="btn-ghost">
              <Calendar className="w-4 h-4" /> 預約玄學諮詢
            </Link>
          </div>

          {/* Subscriber stats */}
          {(podcastsSubs || fengshuiSubs) && (
            <div className="flex items-center justify-center gap-6 mt-12">
              {podcastsSubs && (
                <div className="text-center">
                  <div
                    className="text-xl font-bold"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "var(--gold)",
                    }}
                  >
                    {podcastsSubs}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{
                      color: "rgba(240,230,223,0.5)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    路邊電台訂閱
                  </div>
                </div>
              )}
              {podcastsSubs && fengshuiSubs && (
                <div
                  style={{
                    width: 1,
                    height: 32,
                    background: "rgba(200,169,106,0.3)",
                  }}
                />
              )}
              {fengshuiSubs && (
                <div className="text-center">
                  <div
                    className="text-xl font-bold"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "var(--gold)",
                    }}
                  >
                    {fengshuiSubs}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{
                      color: "rgba(240,230,223,0.5)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    玄學堂訂閱
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
          <div
            style={{
              width: 1,
              height: 36,
              background: "linear-gradient(to bottom, var(--gold), transparent)",
            }}
          />
        </div>
      </section>

      {/* ── EXPLORE CARDS ── */}
      <section
        id="explore"
        style={{
          background: "var(--bg-raise)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="container py-16">
          <div className="mb-10">
            <p
              className="text-xs mb-3 tracking-widest uppercase"
              style={{
                color: "var(--gold)",
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.2em",
              }}
            >
              Explore
            </p>
            <h2
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Noto Serif TC', serif",
                color: "var(--text)",
              }}
            >
              你今天想探索甚麼？
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {EXPLORE_CARDS.map((card) => (
              <article key={card.tag}>
                <div
                  className="group h-full flex flex-col p-6 cursor-pointer transition-all duration-200"
                  style={{
                    background: card.primary ? "rgba(139,46,46,0.08)" : "var(--bg-card)",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: card.primary ? "rgba(139,46,46,0.35)" : "var(--line)",
                    borderRadius: "var(--radius)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      card.primary ? "rgba(139,46,46,0.7)" : "var(--gold-dim)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      card.primary ? "rgba(139,46,46,0.35)" : "var(--line)";
                  }}
                >
                  {/* Icon + tag */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{card.emoji}</span>
                    <span
                      className="text-xs font-medium px-2 py-0.5"
                      style={{
                        color: card.primary ? "var(--red-bright)" : "var(--gold)",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: card.primary
                          ? "rgba(139,46,46,0.5)"
                          : "var(--gold-dim)",
                        borderRadius: "var(--radius)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {card.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{
                      fontFamily: "'Noto Serif TC', serif",
                      color: "var(--text)",
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Desc */}
                  <p
                    className="text-sm leading-relaxed flex-1 mb-5"
                    style={{ color: "var(--text-2)" }}
                  >
                    {card.desc}
                  </p>

                  {/* Footer links */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={card.href}
                      className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
                      style={{ color: card.primary ? "var(--red-bright)" : "var(--gold)" }}
                    >
                      進入 {card.tag}{" "}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    {card.ytHref && (
                      <a
                        href={card.ytHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs transition-colors duration-200"
                        style={{ color: "var(--text-3)" }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--gold)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--text-3)";
                        }}
                      >
                        <Youtube className="w-3.5 h-3.5" /> YouTube 頻道
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHORT HIGHLIGHTS ── */}
      <ShortHighlightsSection videos={allVideos} loading={videosLoading} />

      {/* ── LATEST VIDEOS ── */}
      <section className="container py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p
              className="text-xs mb-3 tracking-widest uppercase"
              style={{
                color: "var(--gold)",
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.2em",
              }}
            >
              Latest Episodes
            </p>
            <h2
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Noto Serif TC', serif",
                color: "var(--text)",
              }}
            >
              最新節目
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.youtube.com/@6bpodcasts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-colors duration-200"
              style={{ color: "var(--text-3)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
              }}
            >
              <Youtube className="w-3.5 h-3.5" /> 路邊電台
              {podcastsSubs && (
                <span style={{ color: "var(--text-3)" }}>
                  {" "}
                  {podcastsSubs} 訂閱
                </span>
              )}
            </a>
            <span style={{ color: "var(--line)", fontSize: "10px" }}>|</span>
            <a
              href="https://www.youtube.com/@6bfengshui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-colors duration-200"
              style={{ color: "var(--text-3)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
              }}
            >
              <Youtube className="w-3.5 h-3.5" /> 玄學堂
              {fengshuiSubs && (
                <span style={{ color: "var(--text-3)" }}>
                  {" "}
                  {fengshuiSubs} 訂閱
                </span>
              )}
            </a>
          </div>
        </div>

        {videosLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-raise)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="aspect-video"
                  style={{ background: "var(--bg)" }}
                />
                <div className="p-4 space-y-2">
                  <div
                    className="h-4 rounded"
                    style={{ background: "var(--bg)", width: "80%" }}
                  />
                  <div
                    className="h-3 rounded"
                    style={{ background: "var(--bg)", width: "50%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : allVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allVideos.slice(0, 6).map((v) => (
              <VideoCard key={v.id} v={v} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-16"
            style={{ color: "var(--text-3)" }}
          >
            <Youtube className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">暫無影片</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
            style={{ color: "var(--text-3)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--gold)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
            }}
          >
            查看所有節目 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── BRAND STRIP ── */}
      <section
        style={{
          background: "var(--bg-raise)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div className="container py-12 text-center">
          <p
            className="text-base leading-loose"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              fontWeight: 400,
              color: "var(--text-2)",
              fontStyle: "italic",
            }}
          >
            「我們不急著給你答案。先陪你，聽見心裡真正的聲音。」
          </p>
          <p
            className="mt-4 text-xs"
            style={{
              color: "var(--text-3)",
              letterSpacing: "0.2em",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            6B PODCASTS · 路邊電台 · 路邊玄學堂
          </p>
        </div>
      </section>
    </div>
  );
}
