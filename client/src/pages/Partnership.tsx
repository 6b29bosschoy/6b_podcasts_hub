import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { JsonLd, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";
import { useSEO } from "@/hooks/useSEO";

const COLLAB_TYPES = [
  {
    icon: "🤝",
    title: "品牌置入",
    desc: "在「路邊 PODCASTS」節目中自然融入您的品牌，透過真誠的對話與故事，讓觀眾深刻記住您的產品或服務。",
    color: "var(--red)",
  },
  {
    icon: "🎬",
    title: "內容共創",
    desc: "與我們的製作團隊合作，共同策劃與製作符合您品牌調性的專屬內容，打造獨一無二的品牌故事。",
    color: "var(--gold)",
  },
  {
    icon: "📣",
    title: "整合行銷",
    desc: "結合內容製作、社群推廣與流量優化，提供全方位的行銷解決方案，最大化您的投資回報率。",
    color: "var(--gold)",
  },
];

const WHY_COLLAB = [
  { icon: "👥", title: "精準受眾觸達", desc: "透過數據分析與策略規劃，精準觸達您的目標客群。" },
  { icon: "🏆", title: "專業製作團隊", desc: "多年經驗的製作團隊，確保每個作品都達到最高品質標準。" },
  { icon: "🔄", title: "靈活合作模式", desc: "根據您的預算與需求，提供多種彈性的合作方案。" },
  { icon: "📊", title: "成效追蹤報告", desc: "提供詳細的數據報告，讓您清楚了解每次合作的成效。" },
];

export default function Partnership() {
  useSEO({
    title: "商業合作｜6B Podcast—品牌訪談、節目贊助、內容共創與玄學合作",
    description: "與 6B Podcast 路邊電台合作：品牌訪談、節目贊助、內容共創、玄學節目贊助、師傅合作。觸達香港 16,000+ 粉絲，提升品牌曝光度與轉化率。",
    keywords: "商業合作,品牌訪談,節目贊助,內容共創,YouTube 廣告,香港 Podcast 合作,KOL 合作,玄學合作",
    ogTitle: "商業合作｜6B Podcast—品牌訪談、節目贊助、內容共創與玄學合作",
    ogDescription: "品牌訪談、節目贊助、內容共創、玄學節目贊助、師傅合作。觸達香港 16,000+ 粉絲。",
    ogUrl: "https://www.6bpodcasts.com/partnership",
    ogImage: "https://www.6bpodcasts.com/manus-storage/og-partnership_63ed94db.jpg",
    canonical: "https://www.6bpodcasts.com/partnership",
  });
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    collabType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("合作意向已提交！我們將在 1-2 個工作天內與您聯絡。");
    },
    onError: (err) => {
      toast.error("提交失敗，請稍後再試：" + err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("請填寫必填欄位（姓名、電郵、合作需求）");
      return;
    }
    contactMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      inquiryType: "collaboration",
      message: `【合作洽談】\n公司：${form.company || "未填寫"}\n電話：${form.phone || "未填寫"}\n合作類型：${form.collabType || "未選擇"}\n\n${form.message}`,
      subject: "合作洽談查詢",
    });
  };

  const partnershipSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "合作洽談｜路邊電台",
      description: "與路邊電台合作：品牌置入、內容共創、整合行銷方案，觸達香港 16,000+ 粉絲，提升品牌曝光度與轉化率。",
      url: `${SITE_URL}/partnership`,
      mainEntity: {
        "@type": "Organization",
        name: "路邊電台 × 路邊玄學堂",
        url: SITE_URL,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          availableLanguage: ["zh-HK"],
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "合作方式",
      itemListElement: COLLAB_TYPES.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.title,
        description: c.desc,
      })),
    },
    buildBreadcrumbSchema([
      { name: "首頁", url: SITE_URL },
      { name: "合作洽談", url: `${SITE_URL}/partnership` },
    ]),
  ];

  return (
    <div className="min-h-screen pt-20">
      <JsonLd data={partnershipSchemas} id="partnership" />
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "url('/manus-storage/hero-partnership_c94dbb8d.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }} />
        {/* Dark overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--bg)" }} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full opacity-8" style={{ background: "var(--gold)", filter: "blur(80px)" }} />
        </div>
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6" style={{ background: "var(--red)", border: "1px solid var(--red)", color: "var(--red)" }}>
            PARTNERSHIP
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "var(--text)" }}>
            合作洽談
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-2)" }}>
            無論您是希望透過品牌置入擴大影響力，還是想與我們共創優質內容，我們都期待與您攜手合作，創造雙贏的成果。
          </p>
        </div>
      </section>

      {/* Collab Types */}
      <section className="py-20" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "var(--gold)" }}>COLLABORATION TYPES</div>
            <h2 className="text-3xl font-black" style={{ color: "var(--text)" }}>合作方案</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLAB_TYPES.map((c) => (
              <div
                key={c.title}
                className="glass-card rounded-xl p-6 text-center transition-all duration-200 hover:scale-[1.02]"
                style={{ border: `1px solid color-mix(in oklch, ${c.color} 20%, transparent)` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{ background: `color-mix(in oklch, ${c.color} 15%, transparent)`, border: `1px solid color-mix(in oklch, ${c.color} 30%, transparent)` }}
                >
                  {c.icon}
                </div>
                <h3 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 玄學內容合作 */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, var(--bg-card), var(--bg))" }}>
        <div className="container">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "var(--gold)" }}>MYSTIC PARTNERSHIP</div>
            <h2 className="text-2xl font-black" style={{ color: "var(--text)" }}>玄學內容合作</h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>透過路邊玄學堂觸達香港玄學愛好者及對命理有興趣的觀眾</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "✨",
                title: "玄學節目贊助",
                desc: "贊助路邊玄學堂的風水、八字、塔羅等節目，自然融入玄學內容，觸達香港玄學愛好者及對命理有興趣的觀眾。",
                color: "var(--gold)",
              },
              {
                icon: "🔮",
                title: "邀請師傅合作",
                desc: "如果您是玄學師傅，歡迎加入路邊玄學堂，共同創作玄學內容，擴大個人品牌曝光度。",
                color: "var(--gold)",
              },
              {
                icon: "🏢",
                title: "品牌內容合作",
                desc: "品牌命名、Logo 顏色、開業擇日、公司風水，與路邊玄學堂合作創作具有商業價値的玄學內容。",
                color: "var(--gold)",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-6 transition-all hover:scale-[1.02]"
                style={{ background: "var(--bg-card)", border: `1px solid ${item.color}33` }}
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-base font-black mb-2" style={{ color: "var(--text)" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-2)" }}>{item.desc}</p>
                <a
                  href="https://wa.me/85298729990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44`, textDecoration: "none" }}
                >
                  立即查詢 →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Collaborate */}
      <section className="py-16" style={{ background: "var(--bg-card)" }}>
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black" style={{ color: "var(--text)" }}>為什麼選擇與我們合作？</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_COLLAB.map((w) => (
              <div key={w.title} className="glass-card rounded-xl p-5 flex gap-4 items-start">
                <div className="text-2xl flex-shrink-0">{w.icon}</div>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>{w.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "var(--red)" }}>CONTACT US</div>
              <h2 className="text-3xl font-black mb-2" style={{ color: "var(--text)" }}>填寫合作意向表單</h2>
              <p className="text-sm" style={{ color: "var(--text-3)" }}>請填寫以下資訊，我們將在 1-2 個工作天內與您聯絡</p>
            </div>

            {submitted ? (
              <div className="glass-card rounded-2xl p-12 text-center" style={{ border: "1px solid rgba(201,164,92,0.3)" }}>
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-black mb-3" style={{ color: "var(--text)" }}>合作意向已提交！</h3>
                <p className="text-sm" style={{ color: "var(--text-2)" }}>
                  感謝您的合作意向，我們的團隊將在 1-2 個工作天內與您聯絡。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5" style={{ border: "1px solid var(--red)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>
                      姓名 <span style={{ color: "var(--red)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="請輸入您的姓名"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-1 transition-all"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>公司名稱</label>
                    <input
                      type="text"
                      placeholder="請輸入您的公司名稱（選填）"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>
                      電子郵件 <span style={{ color: "var(--red)" }}>*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>聯絡電話</label>
                    <input
                      type="tel"
                      placeholder="請輸入您的聯絡電話（選填）"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>合作類型</label>
                  <select
                    value={form.collabType}
                    onChange={(e) => setForm({ ...form, collabType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: form.collabType ? "var(--text)" : "var(--text-3)" }}
                  >
                    <option value="">請選擇合作類型（選填）</option>
                    <option value="品牌置入">品牌置入</option>
                    <option value="內容共創">內容共創</option>
                    <option value="整合行銷">整合行銷</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>
                    合作需求 <span style={{ color: "var(--red)" }}>*</span>
                  </label>
                  <textarea
                    placeholder="請詳細描述您的合作需求與期望（至少 10 個字元）"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all resize-none"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
                    required
                    minLength={10}
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full py-4 rounded-lg font-black text-sm transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "white" }}
                >
                  {contactMutation.isPending ? "提交中..." : "提交合作意向 →"}
                </button>
              </form>
            )}

            {/* Direct contact */}
            <div className="mt-8 glass-card rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-center justify-between" style={{ border: "1px solid var(--line)" }}>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: "var(--gold)" }}>希望即時溝通？</p>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>透過 WhatsApp 或電郵直接聯絡我們</p>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/85298729990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: "var(--gold)", color: "white" }}
                >
                  📱 WhatsApp
                </a>
                <a
                  href="mailto:ktcreativefirm@gmail.com"
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: "var(--line)", border: "1px solid var(--text-3)", color: "var(--text)" }}
                >
                  ✉️ 電郵
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
