import { useEffect, useState } from "react";
import { Link } from "wouter";
import { MYSTIC_VIDEOS, VIDEO_CATEGORIES } from "@/data/mysticData";

export default function MysticVideos() {
  const [category, setCategory] = useState("全部");

  useEffect(() => {
    document.title = "玄學影片專區｜路邊玄學堂";
  }, []);

  const filtered = category === "全部" ? MYSTIC_VIDEOS : MYSTIC_VIDEOS.filter((v) => v.category === category);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "oklch(0.08 0.02 270)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.75 0.20 290)" }}>VIDEOS</p>
          <h1 className="text-3xl font-black" style={{ color: "oklch(0.92 0.05 80)" }}>玄學影片專區</h1>
          <p className="mt-2 text-sm" style={{ color: "oklch(0.60 0.03 250)" }}>精選玄學家分析影片，深入了解中西玄學</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {VIDEO_CATEGORIES.map((c) => (
            <button
              key={c}
              className="px-3 py-1.5 rounded-full text-sm border transition-all"
              style={{
                background: category === c ? "oklch(0.55 0.22 290)" : "oklch(0.11 0.03 270)",
                borderColor: category === c ? "oklch(0.55 0.22 290)" : "oklch(0.55 0.22 290 / 0.3)",
                color: category === c ? "oklch(0.95 0.02 80)" : "oklch(0.70 0.03 250)",
              }}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((v) => (
            <div key={v.id} className="rounded-xl overflow-hidden border cursor-pointer transition-all hover:scale-105 hover:shadow-xl" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
              <div className="relative aspect-video flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg, oklch(0.13 0.05 290), oklch(0.10 0.04 310))" }}>
                🎬
                {v.isPremium && (
                  <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.65 0.20 60)", color: "oklch(0.10 0.02 60)" }}>
                    👑 VIP
                  </div>
                )}
                <div className="absolute bottom-2 right-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "oklch(0.05 0.02 270 / 0.8)", color: "oklch(0.80 0.03 250)" }}>
                  {v.duration}
                </div>
                {v.isPremium && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "oklch(0.05 0.02 270 / 0.5)" }}>
                    <span className="text-2xl">🔒</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.55 0.22 290 / 0.15)", color: "oklch(0.75 0.20 290)" }}>{v.category}</span>
                </div>
                <h3 className="text-sm font-bold leading-snug line-clamp-2 mb-2" style={{ color: "oklch(0.88 0.03 80)" }}>{v.title}</h3>
                <div className="flex items-center justify-between text-xs" style={{ color: "oklch(0.50 0.03 250)" }}>
                  <Link href={`/mystic/masters/${v.masterId}`}>
                    <span className="cursor-pointer hover:underline" style={{ color: "oklch(0.65 0.15 290)" }}>{v.masterName}</span>
                  </Link>
                  <span>{(v.views / 1000).toFixed(1)}K</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA */}
        <div className="mt-10 text-center p-6 rounded-2xl border" style={{ background: "oklch(0.12 0.05 290)", borderColor: "oklch(0.55 0.22 290 / 0.3)" }}>
          <p className="font-bold mb-2" style={{ color: "oklch(0.88 0.03 80)" }}>🔒 VIP 影片需要 Premium 會員才可觀看</p>
          <Link href="/mystic/pricing">
            <span
              className="inline-block mt-3 px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, oklch(0.65 0.20 60), oklch(0.70 0.18 50))", color: "oklch(0.10 0.02 60)" }}
            >
              👑 升級 Premium
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
