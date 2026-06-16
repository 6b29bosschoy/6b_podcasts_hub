import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Play, Clock, Eye, Youtube, ExternalLink, ArrowRight } from "lucide-react";

// ─── 玄學 7 大分類 ────────────────────────────────────────────────
const MYSTIC_CATEGORIES = [
  { key: "all",      label: "全部",     icon: "🔮", color: "oklch(0.65 0.22 290)" },
  { key: "fengshui", label: "風水",     icon: "🏠", color: "oklch(0.60 0.18 185)" },
  { key: "bazi",     label: "八字",     icon: "☯️", color: "oklch(0.78 0.16 75)" },
  { key: "ziwei",    label: "紫微斗數", icon: "⭐", color: "oklch(0.72 0.18 55)" },
  { key: "tarot",    label: "塔羅",     icon: "🃏", color: "oklch(0.62 0.22 330)" },
  { key: "astro",    label: "星座",     icon: "♈", color: "oklch(0.65 0.20 220)" },
  { key: "numerology", label: "生命靈數", icon: "🔢", color: "oklch(0.68 0.18 145)" },
  { key: "spiritual",  label: "身心靈",  icon: "🌿", color: "oklch(0.62 0.15 160)" },
];

// 關鍵字分類映射
const MYSTIC_KEYWORDS: Record<string, string[]> = {
  fengshui:   ["風水", "家居", "辦公室", "方位", "佈局", "旺財", "催財", "桃花位", "文昌"],
  bazi:       ["八字", "命盤", "命理", "四柱", "大運", "流年", "天干", "地支", "五行"],
  ziwei:      ["紫微", "斗數", "命宮", "夫妻宮", "財帛", "官祿", "遷移"],
  tarot:      ["塔羅", "牌陣", "大阿爾克那", "小阿爾克那", "占卜", "抽牌"],
  astro:      ["星座", "白羊", "金牛", "雙子", "巨蟹", "獅子", "處女", "天秤", "天蠍", "射手", "摩羯", "水瓶", "雙魚", "上升", "月亮"],
  numerology: ["靈數", "生命數字", "命數", "數字能量"],
  spiritual:  ["身心靈", "冥想", "療癒", "能量", "水晶", "脈輪", "靈魂", "吸引力法則"],
};

function classifyMysticVideo(title: string): string {
  const t = title.toLowerCase();
  for (const [cat, keywords] of Object.entries(MYSTIC_KEYWORDS)) {
    if (keywords.some(kw => t.includes(kw))) return cat;
  }
  return "fengshui"; // 預設
}

// 相關服務連結
const MYSTIC_RELATED: Record<string, { label: string; href: string }> = {
  fengshui:   { label: "預約風水服務", href: "/booking" },
  bazi:       { label: "預約八字分析", href: "/booking" },
  ziwei:      { label: "預約紫微分析", href: "/booking" },
  tarot:      { label: "預約塔羅解讀", href: "/booking" },
  astro:      { label: "查看星座內容", href: "/mystic" },
  numerology: { label: "了解生命靈數", href: "/mystic/funnel" },
  spiritual:  { label: "身心靈療癒", href: "/mystic/funnel" },
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

// ─── 影片卡 ───────────────────────────────────────────────────────
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

function MysticVideoCard({ video }: { video: VideoItem }) {
  const [hovered, setHovered] = useState(false);
  const catInfo = MYSTIC_CATEGORIES.find(c => c.key === video.category) ?? MYSTIC_CATEGORIES[1];
  const related = MYSTIC_RELATED[video.category];

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300 flex flex-col"
      style={{
        background: "oklch(0.10 0.03 290)",
        border: `1px solid ${hovered ? catInfo.color + "55" : "oklch(0.20 0.06 290)"}`,
        boxShadow: hovered ? `0 8px 32px oklch(0 0 0 / 0.4), 0 0 0 1px ${catInfo.color}22` : "none",
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
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, oklch(0.15 0.08 290), oklch(0.10 0.04 290))" }}>
            <span className="text-4xl">{catInfo.icon}</span>
          </div>
        )}
        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ background: "oklch(0 0 0 / 0.45)", opacity: hovered ? 1 : 0 }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: catInfo.color }}>
            <Play size={22} fill="white" style={{ color: "white", marginLeft: 3 }} />
          </div>
        </div>
        {/* Duration */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono font-bold"
            style={{ background: "oklch(0 0 0 / 0.85)", color: "white" }}>
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
            style={{ color: hovered ? catInfo.color : "oklch(0.88 0.05 290)" }}
          >
            {video.title}
          </h3>
        </a>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs" style={{ color: "oklch(0.48 0.04 290)" }}>
            <span className="flex items-center gap-1">
              <Eye size={11} /> {formatViewCount(video.viewCount)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {timeAgo(video.publishedAt)}
            </span>
          </div>
          {related && (
            <Link
              href={related.href}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all hover:opacity-90 flex-shrink-0"
              style={{ background: catInfo.color + "22", color: catInfo.color, textDecoration: "none" }}
            >
              🔮 {related.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 主頁面 ───────────────────────────────────────────────────────
export default function MysticVideos() {
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    document.title = "玄學影片｜路邊玄學堂";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "瀏覽路邊玄學堂最新玄學影片，包括風水、八字命理、紫微斗數、塔羅占卜、星座分析、生命靈數及身心靈療癒。");
    setMeta("og:title", "玄學影片｜路邊玄學堂", true);
    return () => { document.title = "路邊電台 × 路邊玄學堂｜香港最真實人物訪談"; };
  }, []);

  const { data: videosData, isLoading } = trpc.youtube.getVideos.useQuery(
    { channel: "fengshui", limit: 50 },
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: channelsData } = trpc.youtube.getChannels.useQuery();
  const fengshuiChannel = channelsData?.fengshui as { subscriberCount?: string; videoCount?: string; title?: string } | null | undefined;

  // 為每條影片分配分類
  const categorizedVideos = useMemo(() => {
    const raw = videosData?.videos ?? videosData ?? [];
    return (raw as Array<{ id: string; title: string; thumbnail: string | null; url: string; duration: string | null; viewCount: string; publishedAt: string }>).map(v => ({
      ...v,
      category: classifyMysticVideo(v.title),
    }));
  }, [videosData]);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "all") return categorizedVideos;
    return categorizedVideos.filter(v => v.category === activeCategory);
  }, [categorizedVideos, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: categorizedVideos.length };
    for (const v of categorizedVideos) {
      counts[v.category] = (counts[v.category] ?? 0) + 1;
    }
    return counts;
  }, [categorizedVideos]);

  const activeCatInfo = MYSTIC_CATEGORIES.find(c => c.key === activeCategory) ?? MYSTIC_CATEGORIES[0];

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: "oklch(0.07 0.02 280)" }}>

      {/* ── Hero ── */}
      <section
        className="py-14 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, oklch(0.11 0.04 290) 0%, oklch(0.07 0.02 280) 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-8"
            style={{ background: "oklch(0.65 0.22 290)", filter: "blur(120px)" }} />
        </div>
        <div className="container relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: "oklch(0.65 0.22 290 / 0.15)", border: "1px solid oklch(0.65 0.22 290 / 0.3)", color: "oklch(0.78 0.16 290)" }}>
                🔮 路邊玄學堂
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "oklch(0.92 0.05 290)" }}>
                玄學影片
              </h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "oklch(0.60 0.04 270)" }}>
                從風水、八字、紫微斗數到塔羅、星座與生命靈數，用貼地方式理解命運、關係、事業與人生選擇。
              </p>
              {fengshuiChannel && (
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-xs" style={{ color: "oklch(0.50 0.04 270)" }}>
                    訂閱人數：<strong style={{ color: "oklch(0.78 0.16 290)" }}>
                      {parseInt(fengshuiChannel.subscriberCount || "0").toLocaleString()}
                    </strong>
                  </span>
                  <span className="text-xs" style={{ color: "oklch(0.50 0.04 270)" }}>
                    影片數：<strong style={{ color: "oklch(0.78 0.16 290)" }}>
                      {parseInt(fengshuiChannel.videoCount || "0").toLocaleString()}
                    </strong>
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 flex-shrink-0 flex-wrap">
              <a
                href="https://www.youtube.com/@6bfengshui?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 290), oklch(0.45 0.20 290))", color: "white", textDecoration: "none" }}
              >
                <Youtube size={16} /> 訂閱玄學頻道
              </a>
              <Link
                href="/booking"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ background: "oklch(0.13 0.04 290)", border: "1px solid oklch(0.25 0.06 290)", color: "oklch(0.78 0.16 290)", textDecoration: "none" }}
              >
                預約服務 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 分類篩選（sticky） ── */}
      <div
        className="sticky top-16 z-20 py-4"
        style={{ background: "oklch(0.07 0.02 280 / 0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid oklch(0.18 0.04 290)" }}
      >
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {MYSTIC_CATEGORIES.map(cat => {
              const count = categoryCounts[cat.key] ?? 0;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                  style={{
                    background: isActive ? cat.color : "oklch(0.12 0.04 290)",
                    color: isActive ? "white" : "oklch(0.65 0.04 270)",
                    border: `1px solid ${isActive ? cat.color : "oklch(0.22 0.06 290)"}`,
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
              <h2 className="text-lg font-black" style={{ color: "oklch(0.88 0.05 290)" }}>
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
                <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: "oklch(0.12 0.04 290)" }}>
                  <div className="aspect-video" style={{ background: "oklch(0.16 0.04 290)" }} />
                  <div className="p-4 space-y-2">
                    <div className="h-4 rounded" style={{ background: "oklch(0.16 0.04 290)" }} />
                    <div className="h-3 w-2/3 rounded" style={{ background: "oklch(0.16 0.04 290)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Video grid */}
          {!isLoading && filteredVideos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map(video => (
                <MysticVideoCard key={video.id} video={video} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredVideos.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">{activeCatInfo.icon}</div>
              <p className="mb-4" style={{ color: "oklch(0.50 0.04 270)" }}>此分類暫時未有影片</p>
              <button
                onClick={() => setActiveCategory("all")}
                className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ background: "oklch(0.65 0.22 290 / 0.15)", color: "oklch(0.65 0.22 290)", border: "1px solid oklch(0.65 0.22 290 / 0.3)" }}
              >
                查看全部玄學影片
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 底部 CTA ── */}
      {!isLoading && (
        <section className="py-12" style={{ background: "oklch(0.10 0.04 290)" }}>
          <div className="container space-y-4">
            {/* 訂閱 + 預約 CTA */}
            <div
              className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ background: "linear-gradient(135deg, oklch(0.14 0.08 290), oklch(0.10 0.04 290))", border: "1px solid oklch(0.65 0.22 290 / 0.2)" }}
            >
              <div>
                <h3 className="text-lg font-black mb-1" style={{ color: "oklch(0.92 0.05 290)" }}>
                  想了解自己的命盤或家居風水？
                </h3>
                <p className="text-sm" style={{ color: "oklch(0.60 0.04 270)" }}>
                  訂閱玄學頻道，或立即預約一對一玄學分析服務。
                </p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center flex-shrink-0">
                <a
                  href="https://www.youtube.com/@6bfengshui?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 290), oklch(0.45 0.20 290))", color: "white", textDecoration: "none" }}
                >
                  <Youtube size={16} /> 訂閱 @6bfengshui
                </a>
                <Link
                  href="/booking"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: "oklch(0.13 0.04 290)", border: "1px solid oklch(0.30 0.08 290)", color: "oklch(0.78 0.16 290)", textDecoration: "none" }}
                >
                  🔮 預約玄學服務
                </Link>
                <Link
                  href="/mystic/funnel"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: "oklch(0.13 0.04 290)", border: "1px solid oklch(0.30 0.08 290)", color: "oklch(0.78 0.16 290)", textDecoration: "none" }}
                >
                  查看服務方案 <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* 社交媒體追蹤 */}
            <div className="rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: "oklch(0.09 0.02 260)", border: "1px solid oklch(0.18 0.02 260)" }}>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: "oklch(0.85 0.02 60)" }}>
                  追蹤路邊玄學堂社交媒體
                </p>
                <p className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>
                  每日玄學貼士、開運資訊及最新節目通知
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <a href="https://www.instagram.com/6bfengshui" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: "oklch(0.12 0.02 260)", border: "1px solid oklch(0.22 0.02 260)", color: "oklch(0.80 0.02 60)", textDecoration: "none" }}>
                  <ExternalLink size={12} /> IG @6bfengshui
                </a>
                <a href="https://www.facebook.com/6bfengshui" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: "oklch(0.12 0.02 260)", border: "1px solid oklch(0.22 0.02 260)", color: "oklch(0.80 0.02 60)", textDecoration: "none" }}>
                  <ExternalLink size={12} /> Facebook
                </a>
              </div>
            </div>

            {/* 路邊電台導流 */}
            <div className="rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: "oklch(0.09 0.03 25)", border: "1px solid oklch(0.20 0.06 25)" }}>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: "oklch(0.88 0.10 25)" }}>
                  想看人物訪談及兩性關係內容？
                </p>
                <p className="text-xs" style={{ color: "oklch(0.55 0.04 25)" }}>
                  路邊電台提供香港最真實的人物故事及情感討論
                </p>
              </div>
              <Link
                href="/episodes"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.45 0.20 25))", color: "white", textDecoration: "none" }}
              >
                進入路邊電台 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
