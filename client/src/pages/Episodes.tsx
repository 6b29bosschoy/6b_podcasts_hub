import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import { JsonLd, buildPodcastSeriesSchema, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";
import {
  Play, Clock, Eye, Youtube, ExternalLink,
  Heart, Users, Briefcase, Coffee, Mic,
  ChevronRight, ArrowRight,
} from "lucide-react";

// ─── 分類定義 ────────────────────────────────────────────────────
const PODCAST_CATEGORIES = [
  { key: "all",       label: "全部節目",   icon: "🎙️", color: "var(--red)" },
  { key: "romance",   label: "兩性關係",   icon: "💕", color: "var(--text-2)" },
  { key: "interview", label: "人物訪談",   icon: "🎤", color: "var(--gold)" },
  { key: "emotion",   label: "都市情感",   icon: "☕", color: "var(--gold)" },
  { key: "story",     label: "人生故事",   icon: "📖", color: "var(--gold)" },
  { key: "career",    label: "職場與生活", icon: "💼", color: "var(--gold)" },
];

// 關鍵字分類映射（根據影片標題自動分類）
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  romance:   ["感情", "戀愛", "分手", "拍拖", "出軌", "婚姻", "男友", "女友", "約會", "關係", "兩性", "愛情", "前度", "交往"],
  interview: ["訪談", "嘉賓", "專訪", "對談", "分享", "故事", "人物", "主持", "訪問"],
  emotion:   ["情緒", "孤獨", "焦慮", "壓力", "心理", "心情", "傷心", "開心", "都市", "失落"],
  story:     ["人生", "選擇", "後悔", "改變", "成長", "經歷", "回憶", "決定", "轉變"],
  career:    ["工作", "職場", "創業", "老闆", "上司", "同事", "薪水", "升職", "生活", "事業"],
};

function classifyVideo(title: string): string {
  const t = title.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => t.includes(kw))) return cat;
  }
  return "interview"; // 預設分類
}

// 相關服務映射
const CATEGORY_RELATED: Record<string, { label: string; href: string; icon: string }> = {
  romance:   { label: "感情分析", href: "/booking", icon: "💕" },
  interview: { label: "嘉賓專欄", href: "/blog", icon: "✍️" },
  emotion:   { label: "身心靈療癒", href: "/mystic/funnel", icon: "🌿" },
  story:     { label: "人生分析", href: "/mystic/bazi", icon: "🔮" },
  career:    { label: "事業財運", href: "/booking", icon: "💼" },
};

// ─── 工具函數 ─────────────────────────────────────────────────────
function formatDuration(d: string | null | undefined) {
  if (!d) return "";
  const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return d;
  const h = parseInt(m[1] || "0");
  const min = parseInt(m[2] || "0");
  const sec = parseInt(m[3] || "0");
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

function formatViewCount(v: string) {
  const n = parseInt(v || "0");
  if (n >= 10000) return `${(n / 10000).toFixed(1)}萬`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "今天";
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 週前`;
  if (days < 365) return `${Math.floor(days / 30)} 個月前`;
  return `${Math.floor(days / 365)} 年前`;
}

// ─── 影片卡元件 ───────────────────────────────────────────────────
type VideoItem = {
  id: string;
  title: string;
  thumbnail: string | null;
  url: string;
  duration: string | null;
  viewCount: string;
  publishedAt: string;
  category: string;
};

function VideoCard({ video }: { video: VideoItem }) {
  const [hovered, setHovered] = useState(false);
  const catInfo = PODCAST_CATEGORIES.find(c => c.key === video.category) ?? PODCAST_CATEGORIES[1];
  const related = CATEGORY_RELATED[video.category];

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300 flex flex-col"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? catInfo.color + "55" : "var(--line)"}`,
        boxShadow: hovered ? `0 8px 32px rgba(13,12,10,0.4)` : "none",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <a href={video.url} target="_blank" rel="noopener noreferrer" className="block relative aspect-video overflow-hidden flex-shrink-0">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--bg-raise), var(--bg-card))" }}>
            <Play size={32} style={{ color: "var(--text-3)" }} />
          </div>
        )}
        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ background: "rgba(13,12,10,0.45)", opacity: hovered ? 1 : 0 }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: catInfo.color }}>
            <Play size={22} fill="white" style={{ color: "white", marginLeft: 3 }} />
          </div>
        </div>
        {/* Duration */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono font-bold"
            style={{ background: "rgba(13,12,10,0.85)", color: "white" }}>
            {formatDuration(video.duration)}
          </div>
        )}
        {/* Category badge */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: catInfo.color + "dd", color: "white" }}
        >
          {catInfo.icon} {catInfo.label}
        </div>
      </a>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="block mb-3 flex-1">
          <h3
            className="text-sm font-semibold leading-snug line-clamp-2 transition-colors duration-200"
            style={{ color: hovered ? catInfo.color : "var(--text)" }}
          >
            {video.title}
          </h3>
        </a>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-3)" }}>
            <span className="flex items-center gap-1">
              <Eye size={11} /> {formatViewCount(video.viewCount)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {timeAgo(video.publishedAt)}
            </span>
          </div>
          {/* Related service link */}
          {related && (
            <Link
              href={related.href}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all hover:opacity-90 flex-shrink-0"
              style={{ background: catInfo.color + "22", color: catInfo.color, textDecoration: "none" }}
            >
              {related.icon} {related.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 主頁面 ───────────────────────────────────────────────────────
export default function Episodes() {
  const [activeCategory, setActiveCategory] = useState("all");

  useSEO({
    title: "最新節目｜路邊電台 YouTube 影片全集",
    description: "瀏覽路邊電台最新 YouTube 節目，包括兩性關係、人物訪談、都市情感、人生故事及職場生活等精彩內容。訂閱 @6bpodcasts 不错過任何新集。",
    keywords: "路邊電台,香港 Podcast,兩性關係,人物訪談,都市情感,YouTube 節目,香港訪談",
    ogTitle: "最新節目｜路邊電台 YouTube 影片全集",
    ogDescription: "兩性關係、人物訪談、都市情感、人生故事、職場生活——路邊電台最新 YouTube 內容全集。",
    ogUrl: "https://www.6bpodcasts.com/episodes",
    canonical: "https://www.6bpodcasts.com/episodes",
  });

  const { data: videosData, isLoading } = trpc.youtube.getVideos.useQuery(
    { channel: "podcasts", limit: 50 },
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: channelsData } = trpc.youtube.getChannels.useQuery();
  const podcastsChannel = channelsData?.podcasts as { subscriberCount?: string; videoCount?: string; title?: string } | null | undefined;

  // 為每條影片分配分類
  const categorizedVideos = useMemo(() => {
    const raw = videosData?.videos ?? videosData ?? [];
    return (raw as Array<{ id: string; title: string; thumbnail: string | null; url: string; duration: string | null; viewCount: string; publishedAt: string }>).map(v => ({
      ...v,
      category: classifyVideo(v.title),
    }));
  }, [videosData]);

  // 根據分類篩選
  const filteredVideos = useMemo(() => {
    if (activeCategory === "all") return categorizedVideos;
    return categorizedVideos.filter(v => v.category === activeCategory);
  }, [categorizedVideos, activeCategory]);

  // 各分類計數
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: categorizedVideos.length };
    for (const v of categorizedVideos) {
      counts[v.category] = (counts[v.category] ?? 0) + 1;
    }
    return counts;
  }, [categorizedVideos]);

  const activeCatInfo = PODCAST_CATEGORIES.find(c => c.key === activeCategory) ?? PODCAST_CATEGORIES[0];
  const _unusedIcons = { Heart, Users, Briefcase, Coffee, Mic }; // suppress unused import warnings
  void _unusedIcons;

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: "var(--bg)" }}>
      <JsonLd
        id="episodes-schema"
        data={[
          buildPodcastSeriesSchema(),
          buildBreadcrumbSchema([
            { name: "首頁", url: SITE_URL },
            { name: "最新節目", url: `${SITE_URL}/episodes` },
          ]),
        ]}
      />

      {/* ── Hero ── */}
      <section
        className="py-14 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--bg-card) 0%, var(--bg) 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5"
            style={{ background: "var(--red)", filter: "blur(100px)" }} />
        </div>
        <div className="container relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: "var(--red)", border: "1px solid var(--red)", color: "var(--red)" }}>
                🎙️ 路邊電台
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--text)" }}>
                最新節目
              </h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-2)" }}>
                香港最真實的人物訪談、兩性關係討論、都市情感故事。每週更新，直播不設限。
              </p>
              {podcastsChannel && (
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>
                    訂閱人數：<strong style={{ color: "var(--gold)" }}>
                      {parseInt(podcastsChannel.subscriberCount || "0").toLocaleString()}
                    </strong>
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>
                    影片數：<strong style={{ color: "var(--gold)" }}>
                      {parseInt(podcastsChannel.videoCount || "0").toLocaleString()}
                    </strong>
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 flex-shrink-0 flex-wrap">
              <a
                href="https://www.youtube.com/@6bpodcasts?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "var(--red)", color: "white", textDecoration: "none" }}
              >
                <Youtube size={16} /> 訂閱頻道
              </a>
              <Link
                href="/mystic/videos"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)", textDecoration: "none" }}
              >
                玄學影片 <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 分類篩選（sticky） ── */}
      <div
        className="sticky top-16 z-20 py-4"
        style={{ background: "var(--bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--bg-raise)" }}
      >
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {PODCAST_CATEGORIES.map(cat => {
              const count = categoryCounts[cat.key] ?? 0;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                  style={{
                    background: isActive ? cat.color : "var(--bg-card)",
                    color: isActive ? "white" : "var(--text-2)",
                    border: `1px solid ${isActive ? cat.color : "var(--line)"}`,
                    boxShadow: isActive ? `0 0 16px ${cat.color}44` : "none",
                  }}
                >
                  {cat.icon} {cat.label}
                  {count > 0 && (
                    <span
                      className="px-1.5 py-0.5 rounded-full text-xs leading-none"
                      style={{ background: isActive ? "white" : cat.color + "33", color: isActive ? cat.color : cat.color }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 影片網格 ── */}
      <section className="py-10">
        <div className="container">
          {/* 分類標題 */}
          {activeCategory !== "all" && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full" style={{ background: activeCatInfo.color }} />
              <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>
                {activeCatInfo.icon} {activeCatInfo.label}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: activeCatInfo.color + "22", color: activeCatInfo.color }}>
                {filteredVideos.length} 條影片
              </span>
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: "var(--bg-card)" }}>
                  <div className="aspect-video" style={{ background: "var(--bg-raise)" }} />
                  <div className="p-4 space-y-2">
                    <div className="h-4 rounded" style={{ background: "var(--bg-raise)" }} />
                    <div className="h-3 w-2/3 rounded" style={{ background: "var(--bg-raise)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Video grid */}
          {!isLoading && filteredVideos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredVideos.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎙️</div>
              <p className="mb-4" style={{ color: "var(--text-3)" }}>此分類暫時未有影片</p>
              <button
                onClick={() => setActiveCategory("all")}
                className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ background: "var(--red)", color: "var(--red)", border: "1px solid var(--red)" }}
              >
                查看全部節目
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 底部 CTA ── */}
      {!isLoading && (
        <section className="py-12" style={{ background: "var(--bg-card)" }}>
          <div className="container space-y-4">
            {/* 訂閱 CTA */}
            <div
              className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ background: "linear-gradient(135deg, var(--bg-card), var(--bg-card))", border: "1px solid var(--red)" }}
            >
              <div>
                <h3 className="text-lg font-black mb-1" style={{ color: "var(--text)" }}>
                  喜歡路邊電台的內容？
                </h3>
                <p className="text-sm" style={{ color: "var(--text-2)" }}>
                  訂閱 YouTube 頻道，第一時間收到最新節目通知。
                </p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center flex-shrink-0">
                <a
                  href="https://www.youtube.com/@6bpodcasts?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                  style={{ background: "var(--red)", color: "white", textDecoration: "none" }}
                >
                  <Youtube size={16} /> 訂閱 @6bpodcasts
                </a>
                <a
                  href="https://www.instagram.com/6bpodcasts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)", textDecoration: "none" }}
                >
                  <ExternalLink size={14} /> IG @6bpodcasts
                </a>
                <a
                  href="https://www.threads.net/@6bpodcasts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)", textDecoration: "none" }}
                >
                  <ExternalLink size={14} /> Threads
                </a>
              </div>
            </div>

            {/* 玄學堂導流 */}
            <div
              className="rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
            >
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>
                  想了解更多玄學內容？
                </p>
                <p className="text-xs" style={{ color: "var(--text-2)" }}>
                  路邊玄學堂提供風水、八字、塔羅等玄學分析影片
                </p>
              </div>
              <Link
                href="/mystic/videos"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 flex-shrink-0"
                style={{ background: "var(--bg-card)", color: "white", textDecoration: "none" }}
              >
                進入玄學影片 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
