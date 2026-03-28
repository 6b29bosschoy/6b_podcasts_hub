import { useEffect } from "react";
import { JsonLd, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";

const PODCAST_PLATFORMS = [
  {
    name: "Apple Music / Apple Podcasts",
    icon: "🎵",
    desc: "在 Apple Music 或 Apple Podcasts 上收聽「路邊電台 - 最真實香港 Podcast」，體驗高品質的音訊內容，隨時隨地掌握最新節目。",
    href: "https://apple.co/3nhSxy8",
    color: "oklch(0.65 0.15 290)",
    btnText: "在 Apple Podcasts 上收聽",
    embedType: "apple",
  },
  {
    name: "Spotify",
    icon: "🎧",
    desc: "在 Spotify 上收聽「路邊電台」，享受無縫的音樂與播客體驗。無論您在通勤、運動或休息時，都能隨時隨地收聽最真實的香港故事與深度訪談。",
    href: "https://spoti.fi/30EQPOT",
    color: "oklch(0.65 0.20 145)",
    btnText: "在 Spotify 上收聽",
    embedType: "spotify",
  },
];

const FEATURES = [
  {
    icon: "🎙️",
    title: "真實訪談",
    desc: "每一位嘉賓都係講真話，呈現最真實嘅內心世界與個人觀點。",
  },
  {
    icon: "🔄",
    title: "影片同步上架",
    desc: "「路邊 PODCASTS」與 YouTube 影片同步上架，隨時隨地以音訊形式收聽。",
  },
  {
    icon: "📱",
    title: "隨時隨地收聽",
    desc: "無論您在通勤、運動或休息時，都能收聽最真實的香港故事與深度訪談。",
  },
  {
    icon: "🆓",
    title: "完全免費",
    desc: "所有節目完全免費，無需訂閱，立即收聽超過 486 集精彩內容。",
  },
];

export default function PodcastsPage() {
  useEffect(() => {
    document.title = "收聽聲音 PODCASTS｜ Apple Podcasts 及 Spotify 收聽";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "在 Apple Podcasts、Spotify 收聽「路邊電台」香港最真實訪談 Podcast，隨時隨地收聽兩性關係、玄學命理、都市感情等精彩內容。");
    setMeta("keywords", "Apple Podcasts,Spotify收聽,路邊電台Podcast,香港Podcast,兩性關係節目,玄學訪談,香港訪談節目");
    setMeta("og:title", "收聽聲音 PODCASTS｜路邊電台 × 路邊玄學堂", true);
    setMeta("og:description", "在 Apple Podcasts、Spotify 收聽香港最真實訪談 Podcast，隨時隨地收聽兩性關係、玄學命理等精彩內容。", true);
    return () => { document.title = "路邊電台 × 路邊玄學堂｜香港最真實人物訪談"; };
  }, []);
  const podcastSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "PodcastSeries",
      name: "路邊電台 - 最真實香港 Podcast",
      description: "香港最真實訪談 Podcast，探討兩性關係、都市感情、玄學命理，超過 486 集精彩內容完全免費收聴。",
      url: `${SITE_URL}/podcasts`,
      webFeed: [
        {
          "@type": "DataFeed",
          name: "Apple Podcasts",
          url: "https://apple.co/3nhSxy8",
        },
        {
          "@type": "DataFeed",
          name: "Spotify",
          url: "https://spoti.fi/30EQPOT",
        },
      ],
      author: {
        "@type": "Person",
        name: "Ray Choy",
      },
      publisher: {
        "@type": "Organization",
        name: "路邊電台 × 路邊玄學堂",
        url: SITE_URL,
      },
      inLanguage: "zh-HK",
      genre: ["訪談", "兩性關係", "玄學命理", "都市生活"],
    },
    buildBreadcrumbSchema([
      { name: "首頁", url: SITE_URL },
      { name: "收聽 Podcasts", url: `${SITE_URL}/podcasts` },
    ]),
  ];

  return (
    <div className="min-h-screen pt-20">
      <JsonLd data={podcastSchemas} id="podcasts" />
      {/* Hero */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(180deg, oklch(0.10 0.015 260) 0%, oklch(0.08 0.01 260) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-1/3 w-72 h-72 rounded-full opacity-5" style={{ background: "oklch(0.65 0.15 290)", filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-1/4 w-56 h-56 rounded-full opacity-5" style={{ background: "oklch(0.65 0.20 145)", filter: "blur(60px)" }} />
        </div>
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6" style={{ background: "oklch(0.65 0.15 290 / 0.15)", border: "1px solid oklch(0.65 0.15 290 / 0.3)", color: "oklch(0.65 0.15 290)" }}>
            🎧 PODCASTS
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "oklch(0.92 0.01 60)" }}>
            收聽聲音 PODCASTS
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "oklch(0.60 0.02 60)" }}>
            「路邊 PODCASTS」與影片同步上架，是一個很好的宣傳平台。無論您在通勤、運動或休息時，都能隨時隨地收聽最真實的香港故事與深度訪談。
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16" style={{ background: "oklch(0.08 0.01 260)" }}>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: "oklch(0.88 0.01 60)" }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.02 60)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast Platforms */}
      <section className="py-20" style={{ background: "oklch(0.10 0.01 260)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "oklch(0.62 0.24 25)" }}>LISTEN NOW</div>
            <h2 className="text-3xl font-black" style={{ color: "oklch(0.92 0.01 60)" }}>選擇你的收聽平台</h2>
          </div>

          <div className="space-y-10 max-w-3xl mx-auto">
            {PODCAST_PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="glass-card rounded-2xl overflow-hidden"
                style={{ border: `1px solid color-mix(in oklch, ${p.color} 25%, transparent)` }}
              >
                {/* Platform header */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: `color-mix(in oklch, ${p.color} 15%, transparent)`, border: `1px solid color-mix(in oklch, ${p.color} 30%, transparent)` }}
                    >
                      {p.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-black" style={{ color: "oklch(0.92 0.01 60)" }}>{p.name}</h3>
                      <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.02 60)" }}>{p.desc}</p>
                    </div>
                  </div>

                  {/* Embed placeholder with visual style */}
                  <div
                    className="rounded-xl p-8 mb-5 flex flex-col items-center justify-center gap-4"
                    style={{ background: "oklch(0.08 0.01 260)", border: `1px dashed color-mix(in oklch, ${p.color} 30%, transparent)`, minHeight: "120px" }}
                  >
                    <div className="text-4xl">{p.icon}</div>
                    <p className="text-sm text-center" style={{ color: "oklch(0.55 0.02 60)" }}>
                      點擊下方按鈕，在 {p.name.split(" / ")[0]} 上收聽完整節目
                    </p>
                  </div>

                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
                    style={{ background: p.color, color: "white" }}
                  >
                    {p.icon} {p.btnText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube CTA */}
      <section className="py-20" style={{ background: "oklch(0.08 0.01 260)" }}>
        <div className="container">
          <div className="glass-card rounded-2xl p-10 md:p-14 text-center" style={{ border: "1px solid oklch(0.62 0.24 25 / 0.2)" }}>
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: "oklch(0.62 0.24 25)" }}>WATCH ON YOUTUBE</div>
            <h2 className="text-3xl font-black mb-4" style={{ color: "oklch(0.92 0.01 60)" }}>想睇完整影片版本？</h2>
            <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: "oklch(0.55 0.02 60)" }}>
              前往我們的 YouTube 頻道，收看完整訪談影片，包含嘉賓的表情、反應與現場互動，體驗更完整的「路邊電台」。
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://www.youtube.com/@6bpodcasts"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}
              >
                ▶ 路邊電台 YouTube
              </a>
              <a
                href="https://www.youtube.com/@6bfengshui"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(0.55 0.20 250 / 0.5)", color: "oklch(0.65 0.15 250)" }}
              >
                ☯ 路邊玄學堂 YouTube
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
