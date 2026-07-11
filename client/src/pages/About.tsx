import { Link } from "wouter";
import { JsonLd, buildOrganizationSchema, buildBreadcrumbSchema, SITE_URL, LOGO_URL } from "@/components/JsonLd";
import { useSEO } from "@/hooks/useSEO";

const CORE_VALUES = [
  {
    icon: "",
    title: "真實人物",
    desc: "每一集都是真實訪談，唔就劇本、唔就小天使。我們相信真實的故事最有力量。",
  },
  {
    icon: "",
    title: "廣東話文化",
    desc: "我們用廣東話講香港人的故事，保留最原汁的本地聲音與表達方式。",
  },
  {
    icon: "",
    title: "深度訪談",
    desc: "不做表面文章，每集都有備戦、有深度，讓嘉賓真正講出心裡話。",
  },
  {
    icon: "",
    title: "玻璃心制作",
    desc: "從剪輯到封面設計，每個細節都認真對待，因為我們知道觀眾值得最好的。",
  },
];

const WHY_US = [
  {
    icon: "",
    title: "22,700+ 訂閱者",
    desc: "香港原創訪談內容，持續有真實觀眾居安訂閱。",
  },
  {
    icon: "",
    title: "一對一訪談",
    desc: "每一集都是獨家深度訪談，唔就剩料、唔就廣告。",
  },
  {
    icon: "",
    title: "玄學內容生態",
    desc: "路邊玄學堂提供訪談以外的實用玄學服務，形成完整內容生態。",
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
        name: "KT Creative Firm Ltd",
        alternateName: "路天邊制作有限公司",
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
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "var(--text)", fontFamily: "'Noto Serif TC', serif" }}>
            我們是誰
          </h1>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>
            路邊電台由 Ray Choy 創辦，專訪香港真實人物、兩性關係、玄學命理與都市生活文化。每一集都用廣東話講香港人的故事。
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
            <div className="p-8 md:p-10 space-y-5" style={{ border: "1px solid var(--line)" }}>
              <p className="leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>
                2021 年，Ray Choy 开始訪談香港人。最初只是想記錄真實的香港故事——兩性關係、家庭矛盾、人生選擇。
              </p>
              <p className="leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>
                慢慢地，路邊電台成為了香港人講心裡話的地方。嘉賓不就劇本、觀眾不就小天使。每一集都是真實的。
              </p>
              <p className="leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>
                後來加入了玄學。香港人對命理、風水、塔羅的好奇心很強，但市面上有很多不靠譜的內容。路邊玄學堂想做的，是讓大家找到真正靠譜的師傅。
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
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>
                      Ray Choy 是路邊電台的創辦人同主持人。他相信真實的對話最有力量，所以每一集都就實話實說、不就劇本。
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>
                      除了訪談，他也對玄學有深度研究，將命理、風水與塔羅帶入路邊的內容生態，幫香港人找到真正靠譜的玄學師傅。
                    </p>
                  </div>
                  {/* Contact info */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="https://wa.me/85298729990"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all hover:opacity-90"
                      style={{ background: "var(--gold)", color: "var(--bg)" }}
                    >
                      WhatsApp 聯絡
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
