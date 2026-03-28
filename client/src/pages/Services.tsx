import { useEffect } from "react";
import { Link } from "wouter";

const SERVICES = [
  {
    icon: "🎬",
    title: "YouTube 訪問製作",
    desc: "專業的訪談節目策劃、拍攝與後期製作，打造高質量的內容體驗。我們深知如何透過鏡頭捕捉最真實的故事，讓每一集節目都成為觀眾心中的經典。",
    features: [
      "節目主題策劃與腳本撰寫",
      "專業攝影與燈光設備",
      "高質量後期剪輯與特效",
      "字幕製作與多語言支援",
    ],
    color: "oklch(0.62 0.24 25)",
  },
  {
    icon: "📣",
    title: "宣傳與推廣",
    desc: "量身定制的宣傳策略，透過多元渠道擴大您的品牌影響力。我們運用數據分析與創意思維，確保每一次推廣都能精準觸達目標受眾。",
    features: [
      "社群媒體內容策劃與發布",
      "跨平台整合行銷方案",
      "KOL / 網紅合作媒合",
      "品牌形象建立與維護",
    ],
    color: "oklch(0.78 0.16 75)",
  },
  {
    icon: "📈",
    title: "市場行銷",
    desc: "數據驅動的行銷方案，精準觸達目標受眾，提升品牌價值。我們結合市場洞察與創意執行，為您打造具有競爭力的行銷策略。",
    features: [
      "市場調研與受眾分析",
      "品牌定位與差異化策略",
      "數位廣告投放與優化",
      "成效追蹤與數據報告",
    ],
    color: "oklch(0.55 0.20 250)",
  },
  {
    icon: "▶️",
    title: "影片流量優化",
    desc: "運用 SEO 與演算法優化技術，大幅提升影片觀看次數與互動率。我們深入研究平台演算法，確保您的內容能獲得最大曝光。",
    features: [
      "YouTube SEO 優化（標題、描述、標籤）",
      "縮圖設計與 A/B 測試",
      "觀眾留存率分析與改善",
      "演算法友好的內容策略",
    ],
    color: "oklch(0.60 0.20 330)",
  },
  {
    icon: "🎙️",
    title: "場地租用",
    desc: "提供專業的播客錄影場地，配備完善的攝影設備與舒適的環境。無論是節目錄制、訪談拍攝還是內容創作，我們的場地都能滿足您的需求。",
    features: [
      "專業攝影棚與燈光設備",
      "舒適的訪談區域與休息空間",
      "高速網路與音響設備",
      "彈性租用時段（按小時 / 半天 / 全天）",
    ],
    color: "oklch(0.65 0.20 145)",
  },
];

const STATS = [
  { value: "20.6K+", label: "YouTube 訂閱者" },
  { value: "486+", label: "節目集數" },
  { value: "35%", label: "年均觀眾增長" },
  { value: "4.2K+", label: "Instagram 追蹤者" },
];

export default function Services() {
  useEffect(() => {
    document.title = "服務項目｜YouTube訪談製作、宣傳推廣、場地租用";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "路邊電台提供 YouTube 訪談製作、品牌宣傳推廣、場地租用及流量優化服務，為你的品牌建立最強大的內容行销策略。");
    setMeta("keywords", "YouTube訪談製作,場地租用,品牌宣傳,內容行销,香港Podcast制作,流量優化,路邊電台服務");
    setMeta("og:title", "服務項目｜路邊電台 × 路邊玄學堂", true);
    setMeta("og:description", "YouTube 訪談製作、宣傳推廣、場地租用及流量優化服務一站式提供。", true);
    return () => { document.title = "路邊電台 × 路邊玄學堂｜香港最真實人物訪談"; };
  }, []);
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(180deg, oklch(0.10 0.015 260) 0%, oklch(0.08 0.01 260) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/3 w-72 h-72 rounded-full opacity-5" style={{ background: "oklch(0.78 0.16 75)", filter: "blur(80px)" }} />
        </div>
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6" style={{ background: "oklch(0.78 0.16 75 / 0.15)", border: "1px solid oklch(0.78 0.16 75 / 0.3)", color: "oklch(0.78 0.16 75)" }}>
            SERVICES
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "oklch(0.92 0.01 60)" }}>
            服務項目
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "oklch(0.60 0.02 60)" }}>
            我們提供全方位的媒體製作與行銷服務，從內容創作到流量優化，助您在數位時代建立強大的品牌影響力。
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12" style={{ background: "oklch(0.08 0.01 260)" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-6 text-center">
                <div className="text-3xl font-black mb-1 gradient-text">{s.value}</div>
                <div className="text-xs" style={{ color: "oklch(0.55 0.02 60)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20" style={{ background: "oklch(0.10 0.01 260)" }}>
        <div className="container">
          <div className="space-y-8">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="glass-card rounded-2xl p-8 md:p-10 transition-all duration-200 hover:scale-[1.01]"
                style={{ border: `1px solid color-mix(in oklch, ${s.color} 20%, transparent)` }}
              >
                <div className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-start`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: `color-mix(in oklch, ${s.color} 15%, transparent)`, border: `1px solid color-mix(in oklch, ${s.color} 30%, transparent)` }}
                      >
                        {s.icon}
                      </div>
                      <h3 className="text-xl font-black" style={{ color: "oklch(0.92 0.01 60)" }}>{s.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: "oklch(0.65 0.02 60)" }}>{s.desc}</p>
                    <Link
                      href="/partnership"
                      className="inline-block px-5 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                      style={{ background: `color-mix(in oklch, ${s.color} 20%, transparent)`, border: `1px solid color-mix(in oklch, ${s.color} 40%, transparent)`, color: s.color }}
                    >
                      查詢此服務 →
                    </Link>
                  </div>
                  <div className="flex-shrink-0 w-full md:w-64">
                    <div className="glass-card rounded-xl p-5" style={{ background: "oklch(0.08 0.01 260 / 0.5)" }}>
                      <div className="text-xs font-bold mb-3" style={{ color: s.color }}>服務包含</div>
                      <ul className="space-y-2">
                        {s.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "oklch(0.65 0.02 60)" }}>
                            <span className="mt-0.5 flex-shrink-0" style={{ color: s.color }}>✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "oklch(0.08 0.01 260)" }}>
        <div className="container">
          <div className="glass-card rounded-2xl p-10 md:p-14 text-center" style={{ border: "1px solid oklch(0.62 0.24 25 / 0.2)" }}>
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: "oklch(0.62 0.24 25)" }}>GET STARTED</div>
            <h2 className="text-3xl font-black mb-4" style={{ color: "oklch(0.92 0.01 60)" }}>準備好提升您的品牌影響力了嗎？</h2>
            <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: "oklch(0.55 0.02 60)" }}>
              無論您需要單一服務或全方位的解決方案，我們都能為您量身打造最適合的策略。
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/partnership"
                className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}
              >
                開始合作 →
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(0.30 0.03 260)", color: "oklch(0.85 0.01 60)" }}
              >
                聯絡我們
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
