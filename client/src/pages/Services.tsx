import { useEffect } from "react";
import { Link } from "wouter";
import { JsonLd, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";

const SERVICES = [
  {
    icon: "🎬",
    title: "品牌訪談／節目贊助",
    desc: "以真誠對話將品牌放入人物、兩性與都市情感節目，讓合作訊息有合適嘅內容位置，而唔係硬性置入。",
    features: [
      "節目主題策劃與腳本撰寫",
      "嘉賓及品牌訊息整合",
      "長片及精華片發布規劃",
      "合作後成效摘要",
    ],
    color: "var(--red)",
  },
  {
    icon: "📣",
    title: "長短片內容製作",
    desc: "由訪談構思、錄影到剪輯，將一個清晰故事拆成長片、精華片同社交平台素材，方便品牌持續使用。",
    features: [
      "Podcast／訪談長片製作",
      "9:16 精華片剪輯",
      "字幕及封面版本",
      "發布格式整理",
    ],
    color: "var(--gold)",
  },
  {
    icon: "🎙️",
    title: "Podcast 場地製作",
    desc: "提供適合人物訪談及 Podcast 錄影嘅場地與基本製作配套，減少品牌自行處理器材、燈光同收音嘅時間。",
    features: [
      "訪談場景及燈光配置",
      "基本收音及錄影支援",
      "按時段安排拍攝",
      "可加配剪輯服務",
    ],
    color: "var(--gold)",
  },
  {
    icon: "💬",
    title: "社交平台內容合作",
    desc: "按品牌目標設計 Facebook、IG、Threads 或 YouTube 內容合作，重點放喺能引起觀眾互動同分享嘅內容角度。",
    features: [
      "社交平台內容主題規劃",
      "KOL／嘉賓合作配合",
      "短片、圖文及 caption 建議",
      "月度內容節奏整理",
    ],
    color: "var(--gold)",
  },
];

const STATS = [
  { value: "23K+", label: "YouTube 訂閱者" },
  { value: "535+", label: "節目集數" },
  { value: "4", label: "核心合作服務" },
  { value: "4.2K+", label: "Instagram 追蹤者" },
];

export default function Services() {
  useEffect(() => {
    document.title = "服務項目｜品牌訪談、內容製作、Podcast 場地及社交合作";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "6B PODCASTS 提供品牌訪談及節目贊助、長短片內容製作、Podcast 場地製作與社交平台內容合作，按品牌需要度身訂造合作安排。");
    setMeta("keywords", "品牌訪談,節目贊助,長短片內容製作,Podcast場地製作,社交平台內容合作,香港Podcast錄影,6B PODCASTS");
    setMeta("og:title", "服務項目｜路邊電台 × 路邊玄學堂", true);
    setMeta("og:description", "品牌訪談、節目贊助、長短片內容製作、Podcast 場地製作及社交平台內容合作。", true);
    return () => { document.title = "路邊電台 × 路邊玄學堂｜香港最真實人物訪談"; };
  }, []);
  const servicesSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "路邊電台服務項目",
      description: "路邊電台提供品牌訪談及節目贊助、長短片內容製作、Podcast 場地製作與社交平台內容合作",
      url: `${SITE_URL}/services`,
      numberOfItems: SERVICES.length,
      itemListElement: SERVICES.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.title,
          description: s.desc,
          provider: {
            "@type": "Organization",
            name: "路邊電台 × 路邊玄學堂",
            url: SITE_URL,
          },
          areaServed: {
            "@type": "Place",
            name: "香港",
          },
          serviceType: s.title,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "路邊電台提供哪些服務？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "路邊電台提供品牌訪談及節目贊助、長短片內容製作、Podcast 場地製作及社交平台內容合作，按品牌目標度身訂造。",
          },
        },
        {
          "@type": "Question",
          name: "如何與路邊電台洽談合作？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "可透過「合作洽談」頁面提交詢問表單，或直接 WhatsApp 聯絡 Ray Choy，我們會在 24 小時內回覆。",
          },
        },
        {
          "@type": "Question",
          name: "場地租用有哪些設備？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "場地適合 Podcast 錄影及人物訪談，可按拍攝時段和製作需要安排基本燈光、收音及剪輯配套。",
          },
        },
      ],
    },
    buildBreadcrumbSchema([
      { name: "首頁", url: SITE_URL },
      { name: "服務項目", url: `${SITE_URL}/services` },
    ]),
  ];

  return (
    <div className="min-h-screen pt-20">
      <JsonLd data={servicesSchemas} id="services" />
      {/* Hero */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(180deg, var(--bg) 0%, var(--bg) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/3 w-72 h-72 rounded-full opacity-5" style={{ background: "var(--gold)", filter: "blur(80px)" }} />
        </div>
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6" style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--gold)" }}>
            SERVICES
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "var(--text)" }}>
            服務項目
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-2)" }}>
            專注品牌訪談、內容製作、Podcast 場地同社交平台合作。由故事角度出發，再按品牌目標度身訂造交付安排。
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-6 text-center">
                <div className="text-3xl font-black mb-1 gradient-text">{s.value}</div>
                <div className="text-xs" style={{ color: "var(--text-3)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20" style={{ background: "var(--bg-card)" }}>
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
                      <h3 className="text-xl font-black" style={{ color: "var(--text)" }}>{s.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-2)" }}>{s.desc}</p>
                    <Link
                      href="/partnership"
                      className="inline-block px-5 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                      style={{ background: `color-mix(in oklch, ${s.color} 20%, transparent)`, border: `1px solid color-mix(in oklch, ${s.color} 40%, transparent)`, color: s.color }}
                    >
                      查詢此服務 →
                    </Link>
                  </div>
                  <div className="flex-shrink-0 w-full md:w-64">
                    <div className="glass-card rounded-xl p-5" style={{ background: "var(--bg)" }}>
                      <div className="text-xs font-bold mb-3" style={{ color: s.color }}>服務包含</div>
                      <ul className="space-y-2">
                        {s.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-2)" }}>
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
      <section className="py-20" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="glass-card rounded-2xl p-10 md:p-14 text-center" style={{ border: "1px solid var(--red)" }}>
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--red)" }}>GET STARTED</div>
            <h2 className="text-3xl font-black mb-4" style={{ color: "var(--text)" }}>想傾下你嘅品牌內容方向？</h2>
            <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: "var(--text-3)" }}>
              無論係單次訪談、節目贊助，定係長短片內容合作，都可以先講低目標同預算範圍。
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/partnership"
                className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "white" }}
              >
                開始合作 →
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "var(--line)", border: "1px solid var(--text-3)", color: "var(--text)" }}
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
