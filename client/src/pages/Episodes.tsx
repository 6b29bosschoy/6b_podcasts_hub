import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Play, Clock, Eye, Filter } from "lucide-react";

const CHANNEL_TABS = [
  { key: "all", label: "全部節目" },
  { key: "podcasts", label: "路邊電台" },
  { key: "fengshui", label: "路邊玄學堂" },
];

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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "今天";
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 週前`;
  if (days < 365) return `${Math.floor(days / 30)} 個月前`;
  return `${Math.floor(days / 365)} 年前`;
}

export default function Episodes() {
  const [channelFilter, setChannelFilter] = useState<"all" | "podcasts" | "fengshui">("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "最新節目｜路邊電台 × 路邊玄學堂";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "瀏覽路邊電台及路邊玄學堂的最新 YouTube 節目，包括人物訪談、兩性關係、玄學分析等精彩內容。");
  }, []);

  const channel = channelFilter === "all" ? undefined : channelFilter;
  const { data, isLoading } = trpc.youtube.getVideos.useQuery(
    { channel, limit: 50 },
    { staleTime: 5 * 60 * 1000 }
  );

  type VideoItem = { id: string; title: string; thumbnail: string | null; url: string; viewCount: string; publishedAt: string; duration: string | null; channelTitle?: string | null };
  const videos = (data?.videos ?? []) as VideoItem[];

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: "oklch(0.07 0.01 260)" }}>
      {/* Page Header */}
      <div
        className="py-12 px-4 text-center"
        style={{
          background: "linear-gradient(180deg, oklch(0.10 0.02 260) 0%, oklch(0.07 0.01 260) 100%)",
          borderBottom: "1px solid oklch(0.18 0.02 260)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{ background: "oklch(0.62 0.24 25 / 0.15)", color: "oklch(0.75 0.20 25)", border: "1px solid oklch(0.62 0.24 25 / 0.3)" }}>
            <Play size={12} /> 最新節目
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>
            全部節目
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>
            路邊電台 × 路邊玄學堂 — 香港最真實的人物訪談與玄學內容
          </p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Channel Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter size={14} style={{ color: "oklch(0.55 0.02 60)" }} />
          {CHANNEL_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setChannelFilter(tab.key as typeof channelFilter)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: channelFilter === tab.key
                  ? "linear-gradient(135deg, oklch(0.62 0.24 25), oklch(0.75 0.15 75))"
                  : "oklch(0.13 0.02 260)",
                color: channelFilter === tab.key ? "white" : "oklch(0.65 0.02 60)",
                border: channelFilter === tab.key
                  ? "1px solid transparent"
                  : "1px solid oklch(0.22 0.02 260)",
              }}
            >
              {tab.label}
            </button>
          ))}
          {!isLoading && (
            <span className="ml-auto text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>
              共 {videos.length} 集
            </span>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: "oklch(0.12 0.02 260)" }}>
                <div className="aspect-video" style={{ background: "oklch(0.16 0.02 260)" }} />
                <div className="p-4 space-y-2">
                  <div className="h-4 rounded" style={{ background: "oklch(0.16 0.02 260)" }} />
                  <div className="h-3 w-2/3 rounded" style={{ background: "oklch(0.16 0.02 260)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map(video => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "oklch(0.11 0.02 260)",
                  border: "1px solid oklch(0.18 0.02 260)",
                  boxShadow: hoveredId === video.id ? "0 8px 32px oklch(0 0 0 / 0.5)" : "none",
                }}
                onMouseEnter={() => setHoveredId(video.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, oklch(0.15 0.04 270), oklch(0.12 0.02 260))" }}>
                      <Play size={32} style={{ color: "oklch(0.40 0.02 260)" }} />
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "oklch(0 0 0 / 0.4)" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "oklch(0.62 0.24 25 / 0.9)" }}>
                      <Play size={20} fill="white" style={{ color: "white", marginLeft: 2 }} />
                    </div>
                  </div>
                  {/* Duration badge */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono font-bold"
                      style={{ background: "oklch(0 0 0 / 0.8)", color: "white" }}>
                      {formatDuration(video.duration)}
                    </div>
                  )}
                  {/* Channel badge */}
                  {video.channelTitle && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: video.channelTitle.includes("玄學") || video.channelTitle.includes("fengshui")
                          ? "oklch(0.55 0.18 280 / 0.9)"
                          : "oklch(0.62 0.24 25 / 0.9)",
                        color: "white",
                      }}>
                      {video.channelTitle.includes("玄學") || video.channelTitle.includes("fengshui") ? "玄學堂" : "路邊電台"}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-amber-400 transition-colors duration-200"
                    style={{ color: "oklch(0.88 0.01 60)" }}>
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "oklch(0.48 0.02 60)" }}>
                    <span className="flex items-center gap-1">
                      <Eye size={11} /> {video.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {timeAgo(video.publishedAt)}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && videos.length === 0 && (
          <div className="text-center py-20">
            <Play size={48} className="mx-auto mb-4" style={{ color: "oklch(0.35 0.02 260)" }} />
            <p style={{ color: "oklch(0.50 0.02 60)" }}>暫時未有影片</p>
          </div>
        )}
      </div>
    </div>
  );
}
