import { useState, useEffect } from "react";
import { useLocation } from "wouter";

type Side = "podcasts" | "mystic" | null;

export default function Portal() {
  const [hovered, setHovered] = useState<Side>(null);
  const [selected, setSelected] = useState<Side>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "路邊系列｜選擇你的頻道";
  }, []);

  // After door-open animation completes, navigate
  useEffect(() => {
    if (!selected) return;
    const timer = setTimeout(() => {
      if (selected === "podcasts") navigate("/home");
      else navigate("/mystic");
    }, 900);
    return () => clearTimeout(timer);
  }, [selected, navigate]);

  const handleSelect = (side: Side) => {
    if (selected) return;
    setSelected(side);
  };

  // Width percentages
  const leftW =
    selected === "podcasts"
      ? "100%"
      : selected === "mystic"
      ? "0%"
      : hovered === "podcasts"
      ? "62%"
      : hovered === "mystic"
      ? "38%"
      : "50%";

  const rightW =
    selected === "mystic"
      ? "100%"
      : selected === "podcasts"
      ? "0%"
      : hovered === "mystic"
      ? "62%"
      : hovered === "podcasts"
      ? "38%"
      : "50%";

  return (
    <div
      className="fixed inset-0 flex overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* ── LEFT: 路邊電台 ─────────────────────────────── */}
      <div
        className="relative flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        style={{
          width: leftW,
          transition: "width 0.65s cubic-bezier(0.77,0,0.18,1)",
          flexShrink: 0,
        }}
        onMouseEnter={() => !selected && setHovered("podcasts")}
        onMouseLeave={() => !selected && setHovered(null)}
        onClick={() => handleSelect("podcasts")}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.08 0.03 25) 0%, oklch(0.14 0.06 25) 50%, oklch(0.10 0.02 40) 100%)",
          }}
        />
        {/* Neon glow blob */}
        <div
          className="absolute"
          style={{
            width: "60%",
            height: "60%",
            top: "20%",
            left: "20%",
            background: "radial-gradient(circle, oklch(0.62 0.24 25 / 0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
            transition: "opacity 0.4s",
            opacity: hovered === "podcasts" || selected === "podcasts" ? 1 : 0.4,
          }}
        />
        {/* Door panel line (right edge) */}
        {selected !== "mystic" && (
          <div
            className="absolute right-0 top-0 bottom-0"
            style={{
              width: "2px",
              background:
                "linear-gradient(to bottom, transparent, oklch(0.62 0.24 25 / 0.8), transparent)",
              boxShadow: "0 0 12px oklch(0.62 0.24 25 / 0.6)",
            }}
          />
        )}
        {/* Content */}
        <div
          className="relative z-10 flex flex-col items-center text-center px-8 select-none"
          style={{
            opacity: selected === "mystic" ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        >
          {/* Icon */}
          <div
            className="text-6xl md:text-8xl mb-4 transition-transform duration-500"
            style={{
              transform:
                hovered === "podcasts" || selected === "podcasts"
                  ? "scale(1.15) translateY(-4px)"
                  : "scale(1)",
              filter:
                hovered === "podcasts" || selected === "podcasts"
                  ? "drop-shadow(0 0 24px oklch(0.62 0.24 25))"
                  : "none",
            }}
          >
            🎙️
          </div>
          <h2
            className="text-3xl md:text-5xl font-black mb-2 leading-tight"
            style={{
              color: "oklch(0.92 0.05 60)",
              textShadow:
                hovered === "podcasts" || selected === "podcasts"
                  ? "0 0 30px oklch(0.62 0.24 25 / 0.8)"
                  : "none",
              transition: "text-shadow 0.4s",
            }}
          >
            路邊電台
          </h2>
          <p
            className="text-sm md:text-base font-semibold mb-4"
            style={{ color: "oklch(0.62 0.24 25)" }}
          >
            6B Podcasts
          </p>
          <p
            className="text-xs md:text-sm leading-relaxed max-w-xs"
            style={{ color: "oklch(0.65 0.03 60)" }}
          >
            香港最真實人物訪談
            <br />
            兩性討論 · 運動健身 · 嘉賓專欄
          </p>
          {/* CTA arrow */}
          <div
            className="mt-8 flex items-center gap-2 text-sm font-bold transition-all duration-400"
            style={{
              color: "oklch(0.62 0.24 25)",
              opacity: hovered === "podcasts" || selected === "podcasts" ? 1 : 0,
              transform:
                hovered === "podcasts" || selected === "podcasts"
                  ? "translateX(0)"
                  : "translateX(-8px)",
              transition: "opacity 0.35s, transform 0.35s",
            }}
          >
            <span>立即進入</span>
            <span style={{ fontSize: "1.2em" }}>→</span>
          </div>
        </div>
        {/* Door open overlay (white flash) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "oklch(1 0 0)",
            opacity: selected === "podcasts" ? 0.15 : 0,
            transition: "opacity 0.5s",
          }}
        />
      </div>

      {/* ── DIVIDER label ───────────────────────────────── */}
      <div
        className="absolute top-1/2 left-1/2 z-20 flex flex-col items-center"
        style={{
          transform: "translate(-50%, -50%)",
          opacity: selected ? 0 : 1,
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }}
      >
        <div
          className="px-3 py-1.5 rounded-full text-xs font-black tracking-widest"
          style={{
            background: "oklch(0.08 0.01 260 / 0.9)",
            border: "1px solid oklch(0.35 0.04 260 / 0.6)",
            color: "oklch(0.55 0.03 260)",
            backdropFilter: "blur(8px)",
            whiteSpace: "nowrap",
          }}
        >
          選擇頻道
        </div>
      </div>

      {/* ── RIGHT: 路邊玄學堂 ─────────────────────────────── */}
      <div
        className="relative flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        style={{
          width: rightW,
          transition: "width 0.65s cubic-bezier(0.77,0,0.18,1)",
          flexShrink: 0,
        }}
        onMouseEnter={() => !selected && setHovered("mystic")}
        onMouseLeave={() => !selected && setHovered(null)}
        onClick={() => handleSelect("mystic")}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.07 0.04 290) 0%, oklch(0.13 0.08 290) 50%, oklch(0.09 0.03 270) 100%)",
          }}
        />
        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: (i % 3) + 1 + "px",
                height: (i % 3) + 1 + "px",
                left: ((i * 37) % 100) + "%",
                top: ((i * 53) % 100) + "%",
                background: `oklch(${0.7 + (i % 3) * 0.1} 0.08 ${260 + (i % 5) * 20})`,
                opacity: 0.3 + (i % 4) * 0.15,
                animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${(i % 5) * 0.4}s`,
              }}
            />
          ))}
        </div>
        {/* Neon glow blob */}
        <div
          className="absolute"
          style={{
            width: "60%",
            height: "60%",
            top: "20%",
            left: "20%",
            background: "radial-gradient(circle, oklch(0.55 0.22 290 / 0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
            transition: "opacity 0.4s",
            opacity: hovered === "mystic" || selected === "mystic" ? 1 : 0.4,
          }}
        />
        {/* Door panel line (left edge) */}
        {selected !== "podcasts" && (
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: "2px",
              background:
                "linear-gradient(to bottom, transparent, oklch(0.55 0.22 290 / 0.8), transparent)",
              boxShadow: "0 0 12px oklch(0.55 0.22 290 / 0.6)",
            }}
          />
        )}
        {/* Content */}
        <div
          className="relative z-10 flex flex-col items-center text-center px-8 select-none"
          style={{
            opacity: selected === "podcasts" ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        >
          <div
            className="text-6xl md:text-8xl mb-4 transition-transform duration-500"
            style={{
              transform:
                hovered === "mystic" || selected === "mystic"
                  ? "scale(1.15) translateY(-4px)"
                  : "scale(1)",
              filter:
                hovered === "mystic" || selected === "mystic"
                  ? "drop-shadow(0 0 24px oklch(0.55 0.22 290))"
                  : "none",
            }}
          >
            🔮
          </div>
          <h2
            className="text-3xl md:text-5xl font-black mb-2 leading-tight"
            style={{
              color: "oklch(0.92 0.05 80)",
              textShadow:
                hovered === "mystic" || selected === "mystic"
                  ? "0 0 30px oklch(0.55 0.22 290 / 0.8)"
                  : "none",
              transition: "text-shadow 0.4s",
            }}
          >
            路邊玄學堂
          </h2>
          <p
            className="text-sm md:text-base font-semibold mb-4"
            style={{ color: "oklch(0.75 0.20 290)" }}
          >
            中西玄學分析平台
          </p>
          <p
            className="text-xs md:text-sm leading-relaxed max-w-xs"
            style={{ color: "oklch(0.65 0.04 270)" }}
          >
            紫微斗數 · 奇門遁甲 · 星座占星
            <br />
            塔羅 · 生命靈數 · 流年運程分析
          </p>
          {/* CTA arrow */}
          <div
            className="mt-8 flex items-center gap-2 text-sm font-bold"
            style={{
              color: "oklch(0.75 0.20 290)",
              opacity: hovered === "mystic" || selected === "mystic" ? 1 : 0,
              transform:
                hovered === "mystic" || selected === "mystic"
                  ? "translateX(0)"
                  : "translateX(8px)",
              transition: "opacity 0.35s, transform 0.35s",
            }}
          >
            <span>立即進入</span>
            <span style={{ fontSize: "1.2em" }}>→</span>
          </div>
        </div>
        {/* Door open overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "oklch(0.55 0.22 290)",
            opacity: selected === "mystic" ? 0.12 : 0,
            transition: "opacity 0.5s",
          }}
        />
      </div>

      {/* ── Global CSS for twinkle animation ── */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
