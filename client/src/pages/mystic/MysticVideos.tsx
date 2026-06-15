import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

interface Video {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
  channelTitle?: string;
}

const CATEGORIES = [
  { key: "all", label: "全部", icon: "🔮" },
  { key: "fengshui", label: "風水命理", icon: "🏠" },
  { key: "tarot", label: "塔羅靈數", icon: "🃏" },
  { key: "shorts", label: "Shorts", icon: "⚡" },
];

function isShortVideo(v: Video) {
  // Shorts are typically under 60s or tagged with #
  const durationStr = String(v.duration);
  if (durationStr === "Shorts") return true;
  // Check if duration is less than 1 minute (e.g. "0:45" or "PT45S")
  const match = durationStr.match(/^(\d+):(\d+)$/);
  if (match) {
    const mins = parseInt(match[1]);
    return mins === 0;
  }
  return false;
}

function VideoCard({ video, compact = false }: { video: Video; compact?: boolean }) {
  const short = isShortVideo(video);
  const publishDate = new Date(video.publishedAt).toLocaleDateString("zh-HK", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      style={{
        background: "oklch(0.12 0.04 290)",
        border: "1px solid oklch(0.22 0.06 290)",
      }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: short ? "9/16" : "16/9" }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Duration badge */}
        <div
          className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-bold"
          style={{ background: "oklch(0.05 0.02 260 / 0.85)", color: "oklch(0.90 0.02 80)" }}
        >
          {short ? "Shorts" : video.duration}
        </div>
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "oklch(0.05 0.02 260 / 0.45)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "oklch(0.55 0.22 290 / 0.9)" }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      {!compact && (
        <div className="p-3 space-y-1.5">
          <h3 className="text-sm font-bold leading-snug line-clamp-2"
            style={{ color: "oklch(0.88 0.03 80)" }}>
            {video.title}
          </h3>
          <div className="flex items-center justify-between text-xs"
            style={{ color: "oklch(0.50 0.03 260)" }}>
            <span>👁 {video.viewCount}</span>
            <span>{publishDate}</span>
          </div>
        </div>
      )}
    </a>
  );
}

export default function MysticVideos() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [displayLimit, setDisplayLimit] = useState(12);

  useEffect(() => {
    document.title = "玄學影片專區｜路邊玄學堂";
  }, []);

  const { data, isLoading, error } = trpc.youtube.getVideos.useQuery({
    channel: "fengshui",
    limit: 50,
  });

  const allVideos = (data?.videos ?? []) as Video[];

  // Client-side category filter
  const filteredVideos = allVideos.filter(v => {
    if (activeCategory === "all") return true;
    if (activeCategory === "shorts") return isShortVideo(v);
    if (activeCategory === "fengshui") {
      return !isShortVideo(v) && !!v.title.match(/風水|命理|八字|命盤|生肖|運程|財神|師傅|Jim Sir|靈數|外遇/);
    }
    if (activeCategory === "tarot") {
      return !!v.title.match(/塔羅|占星|星座|水晶|能量|靈數|生命靈數/);
    }
    return true;
  });

  const regularVideos = allVideos.filter(v => !isShortVideo(v));
  const shortVideos = allVideos.filter(v => isShortVideo(v));

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.07 0.04 290)" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: "oklch(0.08 0.04 290 / 0.95)", borderBottom: "1px solid oklch(0.20 0.04 290)", backdropFilter: "blur(8px)" }}>
        <Link href="/mystic">
          <span className="text-sm cursor-pointer transition-colors hover:opacity-70" style={{ color: "oklch(0.55 0.03 260)" }}>← 返回</span>
        </Link>
        <h1 className="text-lg font-black" style={{ color: "oklch(0.92 0.05 80)" }}>🎬 玄學影片專區</h1>
        <a
          href="https://www.youtube.com/@6bfengshui"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs px-3 py-1.5 rounded-full font-bold transition-all hover:scale-105"
          style={{ background: "oklch(0.55 0.22 290 / 0.2)", color: "oklch(0.75 0.20 290)", border: "1px solid oklch(0.55 0.22 290 / 0.4)" }}
        >
          訂閱頻道 ↗
        </a>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Channel Info Banner */}
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, oklch(0.12 0.06 290), oklch(0.10 0.04 290))", border: "1px solid oklch(0.30 0.10 290 / 0.5)" }}>
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0"
            style={{ border: "2px solid oklch(0.55 0.22 290 / 0.6)" }}>
            <img
              src="https://yt3.ggpht.com/MR3_HY5ogG3NJmgfJaPC6HTGjpQUR0FYs5VpBJ1NmeHGqkbHmFx3nFB91NdXTn1f1triBfVr=s240-c-k-c0x00ffffff-no-rj"
              alt="路邊玄學堂"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-base" style={{ color: "oklch(0.92 0.05 80)" }}>路邊玄學堂</div>
            <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.03 260)" }}>
              香港首個廣東話玄學文化頻道 · 風水命理 · 塔羅占卜 · 能量水晶
            </div>
            {!isLoading && allVideos.length > 0 && (
              <div className="text-xs mt-1 font-bold" style={{ color: "oklch(0.65 0.15 290)" }}>
                {allVideos.length} 條影片
              </div>
            )}
          </div>
          <a
            href="https://www.youtube.com/@6bfengshui?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
            style={{
              background: "oklch(0.55 0.22 290)",
              color: "oklch(0.95 0.02 80)",
              boxShadow: "0 2px 12px oklch(0.55 0.22 290 / 0.4)",
            }}
          >
            訂閱
          </a>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setDisplayLimit(12); }}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: activeCategory === cat.key ? "oklch(0.55 0.22 290)" : "oklch(0.12 0.04 290)",
                color: activeCategory === cat.key ? "oklch(0.95 0.02 80)" : "oklch(0.55 0.03 260)",
                border: activeCategory === cat.key ? "1px solid transparent" : "1px solid oklch(0.22 0.06 290)",
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse"
                style={{ background: "oklch(0.12 0.04 290)", border: "1px solid oklch(0.18 0.04 290)" }}>
                <div className="aspect-video" style={{ background: "oklch(0.16 0.04 290)" }} />
                <div className="p-3 space-y-2">
                  <div className="h-3 rounded" style={{ background: "oklch(0.18 0.04 290)", width: "80%" }} />
                  <div className="h-3 rounded" style={{ background: "oklch(0.16 0.04 290)", width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-16" style={{ color: "oklch(0.55 0.03 260)" }}>
            <div className="text-4xl mb-3">😔</div>
            <div>載入影片時出錯，請稍後再試</div>
          </div>
        )}

        {/* All category: split into regular + shorts */}
        {!isLoading && !error && activeCategory === "all" && (
          <>
            {/* Regular videos */}
            {regularVideos.length > 0 && (
              <div>
                <div className="text-sm font-bold mb-3" style={{ color: "oklch(0.75 0.20 290)" }}>
                  📹 最新影片
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {regularVideos.slice(0, displayLimit).map(v => (
                    <VideoCard key={v.videoId} video={v} />
                  ))}
                </div>
                {regularVideos.length > displayLimit && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setDisplayLimit(l => l + 8)}
                      className="px-8 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
                      style={{
                        background: "oklch(0.12 0.04 290)",
                        color: "oklch(0.75 0.20 290)",
                        border: "1px solid oklch(0.55 0.22 290 / 0.4)",
                      }}
                    >
                      載入更多影片
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Shorts section */}
            {shortVideos.length > 0 && (
              <div>
                <div className="text-sm font-bold mb-3" style={{ color: "oklch(0.75 0.20 290)" }}>
                  ⚡ Shorts 速學玄學
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {shortVideos.slice(0, 12).map(v => (
                    <VideoCard key={v.videoId} video={v} compact />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Filtered category */}
        {!isLoading && !error && activeCategory !== "all" && (
          <>
            {filteredVideos.length === 0 ? (
              <div className="text-center py-16" style={{ color: "oklch(0.55 0.03 260)" }}>
                <div className="text-4xl mb-3">🔍</div>
                <div>暫時未有此分類影片</div>
              </div>
            ) : (
              <>
                <div className={activeCategory === "shorts"
                  ? "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
                  : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
                  {filteredVideos.slice(0, displayLimit).map(v => (
                    <VideoCard key={v.videoId} video={v} compact={activeCategory === "shorts"} />
                  ))}
                </div>
                {filteredVideos.length > displayLimit && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setDisplayLimit(l => l + 12)}
                      className="px-8 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
                      style={{
                        background: "oklch(0.12 0.04 290)",
                        color: "oklch(0.75 0.20 290)",
                        border: "1px solid oklch(0.55 0.22 290 / 0.4)",
                      }}
                    >
                      載入更多
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Footer note */}
        {!isLoading && allVideos.length > 0 && (
          <div className="text-center text-xs pt-2" style={{ color: "oklch(0.40 0.03 260)" }}>
            更多影片請到{" "}
            <a href="https://www.youtube.com/@6bfengshui" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: "oklch(0.55 0.15 290)" }}>
              YouTube 頻道 @6bfengshui
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
