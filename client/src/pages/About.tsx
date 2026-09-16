import { Link } from "wouter";
import { JsonLd, buildOrganizationSchema, buildBreadcrumbSchema, SITE_URL, LOGO_URL } from "@/components/JsonLd";
import { useSEO } from "@/hooks/useSEO";

const CORE_VALUES = [
  {
    icon: "🏆",
    title: "專業至上",
    desc: "從策劃到執行，每個環節都追求卓越，確保每一個作品都達到最高標準。",
  },
  {
    icon: "💬",
    title: "真誠溝通",
    desc: "我們相信真誠的對話能建立信任，用心傾聽每個嘉賓與觀眾的需求與願景。",
  },
  {
    icon: "💡",
    title: "創新思維",
    desc: "不斷探索新的表達方式與技術，為觀眾創造獨特且具有競爭力的內容。",
  },
  {
    icon: "📊",
    title: "成果導向",
    desc: "以數據為依據，持續優化策略，確保每個節目都能達成最大影響力。",
  },
];

const WHY_US = [
  {
    icon: "🎬",
    title: "豐富製作經驗",
    desc: "多年的媒體製作與行銷經驗，深諳如何打造吸引人的訪談內容。",
  },
  {
    icon: "🎯",
    title: "量身定制內容",
    desc: "根據每一位嘉賓的獨特故事，提供客製化的訪談方向與呈現方式。",
  },
  {
    icon: "🔄",
    title: "全程製作支援",
    desc: "從前期策劃到後期推廣，提供一站式的專業服務與支援。",
  },
];

export default function About() {
  useSEO({
    title: "關於 6B｜路邊電台 × 路邊玄學堂—香港內容平台品牌故事",
    description: "認識 6B Podcast 路邊電台與路邊玄學堂的品牌故事、創作理念與核心價値。香港原創人物訪談與中西玄學內容平台背後的故事。",
    keywords: "6B Podcast,路邊電台,路邊玄學堂,品牌故事,香港 Podcast,創作理念,訪談節目",
    ogTitle: "關於 6B｜路邊電台 × 路邊玄學堂—香港內容平台品牌故事",
    ogDescription: "認識 6B Podcast 路邊電台與路邊玄學堂的品牌故事、創作理念與核心價値。",
    ogUrl: "https://www.6bpodcasts.com/about",
    canonical: "https://www.6bpodcasts.com/about",
  });
  const aboutSchemas = [
    buildOrganizationSchema(),
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${SITE_URL}/#ray-choy`,
      name: "Ray Choy",
      jobTitle: "創辦人 / 主持人",
      description: "路邊電台創辦人 Ray Choy，香港訪談節目主持人，擅長兩性關係、都市感情與玄學命理訪談。",
      image: LOGO_URL,
      url: `${SITE_URL}/about`,
      sameAs: [
        "https://www.youtube.com/@6bpodcasts",
        "https://www.facebook.com/6bpodcasts",
        "https://www.instagram.com/6bpodcasts",
      ],
      worksFor: {
        "@type": "Organization",
        name: "路邊 PODCASTS",
      },
    },
    buildBreadcrumbSchema([
      { name: "首頁", url: SITE_URL },
      { name: "關於我們", url: `${SITE_URL}/about` },
    ]),
  ];

  return (
    <div className="min-h-screen pt-20">
      <JsonLd data={aboutSchemas} id="about" />
      {/* Hero */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(180deg, var(--bg) 0%, var(--bg) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full opacity-5" style={{ background: "var(--red)", filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-1/4 w-56 h-56 rounded-full opacity-5" style={{ background: "var(--gold)", filter: "blur(60px)" }} />
        </div>
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6" style={{ background: "var(--red)", border: "1px solid var(--red)", color: "var(--red)" }}>
            ABOUT US
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "var(--text)" }}>
            關於我們
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-2)" }}>
            路邊 PODCASTS 是一間香港內容公司，專注以真實對話、人物故事與玄學人生指引，陪觀眾整理關係、生活與每一次選擇。
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "var(--red)" }}>OUR STORY</div>
              <h2 className="text-3xl font-black" style={{ color: "var(--text)" }}>我們的故事</h2>
            </div>
            <div className="glass-card rounded-2xl p-8 md:p-10 space-y-5" style={{ border: "1px solid var(--red)" }}>
              <p className="leading-relaxed" style={{ color: "var(--text-2)" }}>
                路邊 PODCASTS 由一集又一集的真實對話起步。由感情故事、人物訪談到人生轉捩點，我哋相信願意講真話，先有機會聽見真正值得理解的事。
              </p>
              <p className="leading-relaxed" style={{ color: "var(--text-2)" }}>
                作為一間香港內容公司，路邊 PODCASTS 以兩性關係作入口，再從玄學與生活觀察提供另一個拆局角度；內容不急著替人下結論，而是留出空間讓觀眾整理自己的下一步。
              </p>
              <p className="leading-relaxed" style={{ color: "var(--text-2)" }}>
                我哋亦會為合作品牌、嘉賓和創作者策劃對話與內容製作。每次合作都由實際目標、受眾與故事本身出發，建立有延續性的內容關係。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20" style={{ background: "var(--bg-card)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "var(--gold)" }}>CORE VALUES</div>
            <h2 className="text-3xl font-black" style={{ color: "var(--text)" }}>核心價值</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((v) => (
              <div key={v.title} className="glass-card rounded-xl p-6 text-center transition-all duration-200 hover:scale-[1.02]">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-black text-lg mb-3" style={{ color: "var(--text)" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "var(--red)" }}>FOUNDER</div>
            <h2 className="text-3xl font-black" style={{ color: "var(--text)" }}>創辦人介紹</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-8 md:p-10" style={{ border: "1px solid var(--gold)" }}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Founder Photo */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="relative">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/ray-choy_49c64651.webp"
                      alt="Ray Choy 蔡力泓"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover object-top"
                      style={{ border: "2px solid var(--red)", boxShadow: "none" }}
                    />
                    <div
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "white" }}
                    >
                      創
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-1">
                    <span className="text-xs font-bold tracking-widest" style={{ color: "var(--red)" }}>FOUNDER / 創辦人</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4" style={{ color: "var(--text)" }}>Ray Choy 蔡力泓</h3>
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                      Ray Choy 是「路邊 PODCASTS」創辦人及主持人。從第一集節目開始，他就明白一個真實的故事能夠深刻觸動人心，而這份感動正是平台與觀眾建立連結的起點。
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                      Ray 相信，好的內容不止要有討論價值，也要令觀眾感到被理解。路邊 PODCASTS 會繼續由真實故事出發，透過對話陪大家整理關係、人生和眼前的選擇。
                    </p>
                  </div>
                  {/* Contact info */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="https://wa.me/85298729990"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                      style={{ background: "var(--gold)", color: "white" }}
                    >
                      📱 WhatsApp 聯絡
                    </a>
                    <a
                      href="mailto:hello@6bpodcasts.com"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                      style={{ background: "var(--line)", border: "1px solid var(--text-3)", color: "var(--text)" }}
                    >
                      ✉️ 電郵聯絡
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20" style={{ background: "var(--bg-card)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "var(--gold)" }}>WHY CHOOSE US</div>
            <h2 className="text-3xl font-black mb-4" style={{ color: "var(--text)" }}>為什麼選擇我們？</h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--text-3)" }}>
              我們不僅提供服務，更是您品牌成長路上的夥伴。從內容策劃到推廣執行，以專業的態度、創新的思維，確保每個專案都能超越期待。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {WHY_US.map((w) => (
              <div key={w.title} className="glass-card rounded-xl p-6 text-center">
                <div className="text-3xl mb-4">{w.icon}</div>
                <h3 className="font-bold text-base mb-2" style={{ color: "var(--text)" }}>{w.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>{w.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center flex flex-wrap gap-4 justify-center">
            <Link
              href="/services"
              className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "white" }}
            >
              了解服務項目 →
            </Link>
            <Link
              href="/partnership"
              className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
              style={{ background: "var(--line)", border: "1px solid var(--text-3)", color: "var(--text)" }}
            >
              開始合作洽談
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
