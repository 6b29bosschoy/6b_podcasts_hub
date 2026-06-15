import { useEffect } from "react";
import { Link } from "wouter";

export default function Portal() {
  useEffect(() => {
    document.title = "路邊電台 × 路邊玄學堂｜選擇你的頻道";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "路邊電台 × 路邊玄學堂 — 香港最真實人物訪談 × 中西玄學分析平台。選擇你的頻道，立即收看。");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "oklch(0.08 0.02 250)" }}>
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: `oklch(${0.7 + Math.random() * 0.3} 0.05 ${Math.random() * 360})`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Logo / Brand */}
      <div className="text-center mb-12 relative z-10">
        <div className="text-xs font-bold tracking-[0.3em] mb-4" style={{ color: "oklch(0.62 0.24 25)" }}>
          CHOOSE YOUR CHANNEL
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: "oklch(0.92 0.05 80)" }}>
          路邊系列
        </h1>
        <p className="text-sm" style={{ color: "oklch(0.55 0.05 250)" }}>
          選擇你想進入的頻道
        </p>
      </div>

      {/* Two Brand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-6 relative z-10">
        {/* 路邊 Podcasts */}
        <Link href="/">
          <div
            className="group relative rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border"
            style={{
              background: "linear-gradient(135deg, oklch(0.12 0.03 25) 0%, oklch(0.15 0.05 25) 100%)",
              borderColor: "oklch(0.62 0.24 25 / 0.4)",
              boxShadow: "0 0 40px oklch(0.62 0.24 25 / 0.1)",
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.62 0.24 25 / 0.15) 0%, transparent 70%)" }}
            />

            <div className="relative z-10">
              <div className="text-5xl mb-4">🎙️</div>
              <h2 className="text-2xl font-black mb-2" style={{ color: "oklch(0.92 0.05 80)" }}>
                路邊電台
              </h2>
              <p className="text-sm mb-1 font-semibold" style={{ color: "oklch(0.62 0.24 25)" }}>
                6B Podcasts
              </p>
              <p className="text-sm mt-3" style={{ color: "oklch(0.65 0.03 250)" }}>
                香港最真實人物訪談、兩性討論、運動健身、嘉賓專欄
              </p>
              <div
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
                style={{ color: "oklch(0.62 0.24 25)" }}
              >
                立即進入 →
              </div>
            </div>
          </div>
        </Link>

        {/* 路邊玄學堂 */}
        <Link href="/mystic">
          <div
            className="group relative rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border"
            style={{
              background: "linear-gradient(135deg, oklch(0.10 0.04 290) 0%, oklch(0.13 0.06 290) 100%)",
              borderColor: "oklch(0.55 0.22 290 / 0.4)",
              boxShadow: "0 0 40px oklch(0.55 0.22 290 / 0.1)",
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.55 0.22 290 / 0.15) 0%, transparent 70%)" }}
            />

            {/* Mystic decorative elements */}
            <div className="absolute top-4 right-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">☯</div>
            <div className="absolute bottom-4 right-8 text-lg opacity-10 group-hover:opacity-30 transition-opacity">✦</div>

            <div className="relative z-10">
              <div className="text-5xl mb-4">🔮</div>
              <h2 className="text-2xl font-black mb-2" style={{ color: "oklch(0.92 0.05 80)" }}>
                路邊玄學堂
              </h2>
              <p className="text-sm mb-1 font-semibold" style={{ color: "oklch(0.75 0.20 290)" }}>
                中西玄學分析平台
              </p>
              <p className="text-sm mt-3" style={{ color: "oklch(0.65 0.03 250)" }}>
                紫微斗數、奇門遁甲、星座占星、生命靈數，流年運程分析
              </p>
              <div
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
                style={{ color: "oklch(0.75 0.20 290)" }}
              >
                立即進入 →
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer note */}
      <p className="mt-12 text-xs relative z-10" style={{ color: "oklch(0.40 0.02 250)" }}>
        © 2024 路邊電台 × 路邊玄學堂
      </p>
    </div>
  );
}
