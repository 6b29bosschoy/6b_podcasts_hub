import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";
import { JsonLd, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";
import { useSEO } from "@/hooks/useSEO";
import { useLocation } from "wouter";

const COLLAB_TYPES = [
  {
    icon: "🤝",
    title: "品牌訪談／節目贊助",
    desc: "按節目主題、嘉賓同品牌目標安排合作位置，令訊息自然融入對話，而唔係硬性置入。",
    color: "var(--red)",
  },
  {
    icon: "🎬",
    title: "長短片內容製作",
    desc: "由訪談構思、錄影到長片、精華片及字幕版本，將一個故事變成可持續使用嘅內容資產。",
    color: "var(--gold)",
  },
  {
    icon: "🎙️",
    title: "Podcast 場地製作",
    desc: "適合人物訪談與 Podcast 錄影嘅場地及基本製作配套，減少自行處理燈光、收音同器材嘅時間。",
    color: "var(--gold)",
  },
  {
    icon: "💬",
    title: "社交平台內容合作",
    desc: "為 Facebook、IG、Threads 或 YouTube 規劃有討論空間嘅內容角度，配合品牌實際目標同發布節奏。",
    color: "var(--gold)",
  },
];

const STARTER_PLAN = {
  name: "內容合作入門方案",
  price: "價格由 HK$___ 起",
  delivery: ["一次合作方向會議", "一項主內容交付（按選擇安排）", "發布格式及內容使用建議"],
  timeline: "一般由確認內容起計 2–4 星期；實際時間按嘉賓、場地及修改輪次確認。",
};

const WHY_COLLAB = [
  { icon: "👥", title: "精準受眾觸達", desc: "透過數據分析與策略規劃，精準觸達您的目標客群。" },
  { icon: "🏆", title: "高質素製作流程", desc: "由構思、錄影到剪輯有清晰交付範圍，方便你掌握合作進度。" },
  { icon: "🔄", title: "靈活合作模式", desc: "根據您的預算與需求，提供多種彈性的合作方案。" },
  { icon: "📊", title: "成效追蹤報告", desc: "提供詳細的數據報告，讓您清楚了解每次合作的成效。" },
];

export default function Partnership() {
  useSEO({
    title: "商業合作｜6B Podcast—品牌訪談、節目贊助、內容共創與玄學合作",
    description: "與 6B PODCASTS 合作：品牌訪談及節目贊助、長短片內容製作、Podcast 場地製作及社交平台內容合作。",
    keywords: "商業合作,品牌訪談,節目贊助,長短片內容製作,Podcast場地製作,社交平台內容合作,香港 Podcast 合作,KOL 合作",
    ogTitle: "商業合作｜6B PODCASTS—品牌訪談、內容製作及社交合作",
    ogDescription: "品牌訪談、節目贊助、長短片內容製作、Podcast 場地製作及社交平台內容合作。",
    ogUrl: "https://6bpodcasts.com/partnership",
    ogImage: "https://6bpodcasts.com/manus-storage/og-partnership_63ed94db.jpg",
    canonical: "https://6bpodcasts.com/partnership",
  });
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    collabType: "",
    message: "",
    privacyConsent: false,
  });
  const [, setLocation] = useLocation();

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      trackEvent("partnership_submit", { source: "partnership_form" });
      toast.success("合作意向已提交！我們將在 1-2 個工作天內與您聯絡。");
      setLocation("/partnership/success");
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
      company: form.company || undefined,
      email: form.email,
      phone: form.phone || undefined,
      privacyConsent: true,
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
      description: "與路邊電台合作：品牌訪談及節目贊助、長短片內容製作、Podcast 場地製作及社交平台內容合作。",
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
            無論你想做品牌訪談、節目贊助，定係將一次拍攝變成長短片內容，我哋會先了解你嘅目標，再度身訂造合作範圍。
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Starter plan */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, var(--bg-card), var(--bg))" }}>
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-2xl p-7 md:p-9" style={{ background: "var(--bg)", border: "1px solid var(--gold)" }}>
            <div className="grid gap-7 md:grid-cols-[1.1fr_1fr] md:items-start">
              <div>
                <div className="text-xs font-bold tracking-widest" style={{ color: "var(--gold)" }}>STARTER PLAN</div>
                <h2 className="mt-3 text-2xl font-black" style={{ color: "var(--text)" }}>{STARTER_PLAN.name}</h2>
                <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-2)" }}>適合想先測試合作方向嘅品牌。實際方案會按節目、拍攝、剪輯、發布及使用範圍確認。</p>
                <p className="mt-5 text-lg font-black" style={{ color: "var(--gold)" }}>{STARTER_PLAN.price}</p>
              </div>
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>交付項目</h3>
                  <ul className="mt-2 space-y-2 text-sm" style={{ color: "var(--text-3)" }}>{STARTER_PLAN.delivery.map((item) => <li key={item}>— {item}</li>)}</ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>製作時間</h3>
                  <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-3)" }}>{STARTER_PLAN.timeline}</p>
                </div>
              </div>
            </div>
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
              <p className="text-sm" style={{ color: "var(--text-3)" }}>請填寫以下資料，我哋會喺一至兩個工作天內聯絡你</p>
            </div>

              <form method="post" data-clarity-mask="true" onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5" style={{ border: "1px solid var(--red)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="partnership-name" className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>
                      姓名 <span style={{ color: "var(--red)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="partnership-name"
                      name="name"
                      autoComplete="name"
                      placeholder="請輸入你嘅姓名"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-1 transition-all"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="partnership-company" className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>公司名稱</label>
                    <input
                      type="text"
                      id="partnership-company"
                      name="company"
                      autoComplete="organization"
                      placeholder="請輸入你嘅公司名稱（選填）"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="partnership-email" className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>
                      電子郵件 <span style={{ color: "var(--red)" }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="partnership-email"
                      name="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="partnership-phone" className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>聯絡電話</label>
                    <input
                      type="tel"
                      id="partnership-phone"
                      name="phone"
                      autoComplete="tel"
                      placeholder="請輸入你嘅聯絡電話（選填）"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="partnership-collab-type" className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>合作類型</label>
                  <select
                    id="partnership-collab-type"
                    name="collabType"
                    autoComplete="off"
                    value={form.collabType}
                    onChange={(e) => setForm({ ...form, collabType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: form.collabType ? "var(--text)" : "var(--text-3)" }}
                  >
                    <option value="">請選擇合作類型（選填）</option>
                    <option value="品牌訪談／節目贊助">品牌訪談／節目贊助</option>
                    <option value="長短片內容製作">長短片內容製作</option>
                    <option value="Podcast 場地製作">Podcast 場地製作</option>
                    <option value="社交平台內容合作">社交平台內容合作</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="partnership-message" className="block text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>
                    合作需求 <span style={{ color: "var(--red)" }}>*</span>
                  </label>
                  <textarea
                    id="partnership-message"
                    name="message"
                    autoComplete="off"
                    placeholder="請詳細描述你嘅合作需求與期望（至少 10 個字元）"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all resize-none"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
                    required
                    minLength={10}
                  />
                </div>
                <div className="flex items-start gap-2">
                  <input id="partnership-consent" name="privacyConsent" type="checkbox" autoComplete="off" checked={form.privacyConsent} onChange={(event) => setForm((current) => ({ ...current, privacyConsent: event.target.checked }))} required className="mt-1" />
                  <label htmlFor="partnership-consent" className="text-xs leading-5" style={{ color: "var(--text-3)" }}>我已閱讀並同意 <a href="/privacy" className="underline" style={{ color: "var(--gold)" }}>私隱政策</a>，明白資料只用作處理今次合作查詢。</label>
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
