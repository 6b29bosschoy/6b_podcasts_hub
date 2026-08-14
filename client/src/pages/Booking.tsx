import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { JsonLd, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";
import { trackEvent } from "@/lib/analytics";

const SERVICES = [
  { value: "fengshui", label: "風水諮詢", icon: "🧭", desc: "家居、辦公室風水佈局分析，改善運勢與財運" },
  { value: "bazi", label: "八字命理", icon: "🔮", desc: "根據生辰八字分析個人運程、事業、感情走向" },
  { value: "tarot", label: "塔羅占卜", icon: "🃏", desc: "塔羅牌解讀，為你的人生問題提供指引" },
  { value: "spiritual", label: "身心靈療癒", icon: "🌿", desc: "能量療癒、冥想指導，平衡身心靈狀態" },
  { value: "course", label: "課程報名", icon: "📚", desc: "報名玄學、風水、命理相關課程" },
];

const MASTER_INFO = {
  name: "路邊玄學堂合作師傅",
  bio: "我哋會按你嘅問題類型，轉介合適嘅玄學師傅作一對一跟進。所有師傅均經過初步篩選，並以清晰收費及服務範圍為先。",
  experience: "服務範圍包括感情、事業、家庭及人生方向整理。",
};

const PRICE_RANGE = "HK$380 - HK$580 / 節";

const FAQS = [
  { q: "預約後幾耐會有回覆？", a: "一般會喺 24 小時內透過電郵或 WhatsApp 回覆，確認時間及服務內容。" },
  { q: "可以揀師傅嗎？", a: "可以喺備註寫低偏好，我哋會盡量按問題類型及師傅檔期安排。" },
  { q: "收費係點計？", a: `一般一對一服務收費為 ${PRICE_RANGE}，具體會按服務類型及師傅安排確認。` },
];

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "19:00", "20:00"];

export default function Booking() {
  useEffect(() => {
    document.title = "玄學服務預約｜風水諮詢、八字命理、塔羅占卜";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "線上預約路邊玄學堂玄學服務：風水諮詢、八字命理分析、塔羅占卜、身心靈課程，專業玄學師傅為你解決人生問題。");
    setMeta("keywords", "風水諮詢,八字命理,塔羅占卜,身心靈課程,玄學服務,香港風水師,路邊玄學堂預約");
    setMeta("og:title", "玄學服務預約｜路邊玄學堂", true);
    setMeta("og:description", "線上預約風水諮詢、八字命理、塔羅占卜及身心靈課程，專業玄學師傅為你解決人生問題。", true);
    return () => { document.title = "路邊電台 × 路邊玄學堂｜香港最真實人物訪談"; };
  }, []);
  const [, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContactMethod: "whatsapp" as "whatsapp" | "phone",
    preferredDate: "",
    preferredTime: "",
    message: "",
    privacyConsent: false,
  });

  const bookingMutation = trpc.booking.create.useMutation({
    onSuccess: () => { trackEvent("booking_submit", { service: selectedService }); setLocation("/booking/success"); },
    onError: (err) => { toast.error(err.message || "預約失敗，請稍後再試。"); },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) { toast.error("請選擇服務類型"); return; }
    if (!form.privacyConsent) { toast.error("請先同意個人資料收集聲明"); return; }
    bookingMutation.mutate({
      ...form,
      privacyConsent: true,
      serviceType: selectedService as "fengshui" | "bazi" | "tarot" | "spiritual" | "course",
      email: form.email || undefined,
      preferredDate: form.preferredDate || undefined,
      preferredTime: form.preferredTime || undefined,
      message: form.message || undefined,
    });
  };

  const inputStyle = {
    background: "var(--bg-card)",
    border: "1px solid var(--line)",
    color: "var(--text)",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    width: "100%",
    fontSize: "0.875rem",
    outline: "none",
  };

  const bookingSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "路邊玄學堂玄學服務",
      description: "香港專業玄學服務，提供風水診詢、八字命理、塔羅占卜及身心靈療癒課程",
      url: `${SITE_URL}/booking`,
      provider: {
        "@type": "Organization",
        name: "路邊玄學堂",
        url: SITE_URL,
      },
      areaServed: { "@type": "Place", name: "香港" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "玄學服務專案",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "風水診詢",
              description: "家居、辦公室風水佈局分析，改善運勢與財運",
            },
            priceRange: "HK$500-HK$800",
            priceCurrency: "HKD",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "八字命理",
              description: "根據生辰八字分析個人運程、事業、感情走向",
            },
            priceRange: "HK$1000-HK$1500",
            priceCurrency: "HKD",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "塔羅占卜",
              description: "塔羅牌解讀，為你的人生問題提供指引",
            },
            priceRange: "HK$500-HK$800",
            priceCurrency: "HKD",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "玄學課程",
              description: "風水、命理、塔羅相關課程報名",
            },
            priceRange: "HK$2000-HK$5000",
            priceCurrency: "HKD",
          },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "玄學服務收費是多少？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "風水診詢 HK$500-800，八字命理 HK$1,000-1,500，塔羅占卜 HK$500-800，玄學課程 HK$2,000-5,000。詳情請聯絡我們確認。",
          },
        },
        {
          "@type": "Question",
          name: "預約後多久會確認？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "提交預約後，我們會在 24 小時內透過電郵或 WhatsApp 確認預約詳情及時間安排。",
          },
        },
        {
          "@type": "Question",
          name: "玄學診詢是面對面還是線上進行？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "我們提供面對面及線上（Zoom/WhatsApp）兩種形式，方便香港及海外客戶。",
          },
        },
      ],
    },
    buildBreadcrumbSchema([
      { name: "首頁", url: SITE_URL },
      { name: "玄學服務預約", url: `${SITE_URL}/booking` },
    ]),
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <JsonLd data={bookingSchemas} id="booking" />
      {/* Header */}
      <div className="py-12 text-center" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--line)" }}>
        <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--gold)" }}>BOOKING</div>
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--text)" }}>玄學服務預約</h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--text-3)" }}>
          由專業玄學師傅提供一對一諮詢服務，助你解惑人生疑問
        </p>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* 師傅介紹 */}
          <div className="mb-8 rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
            <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>師傅介紹</h2>
            <p className="text-sm mb-2" style={{ color: "var(--text-2)" }}>{MASTER_INFO.bio}</p>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>{MASTER_INFO.experience}</p>
          </div>

          {/* 服務時間及收費 */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
              <h3 className="text-sm font-black mb-2" style={{ color: "var(--text)" }}>服務時間</h3>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>星期一至日 09:00 - 20:00（需預約）</p>
            </div>
            <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
              <h3 className="text-sm font-black mb-2" style={{ color: "var(--text)" }}>收費範圍</h3>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>{PRICE_RANGE}（按服務類型及師傅安排確認）</p>
            </div>
          </div>

          {/* 預約流程 */}
          <div className="mb-8 rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
            <h2 className="text-lg font-black mb-4" style={{ color: "var(--text)" }}>預約流程</h2>
            <ol className="text-sm flex flex-col gap-2" style={{ color: "var(--text-2)" }}>
              <li>1. 提交預約查詢，寫低你嘅問題類型及偏好時間</li>
              <li>2. 我哋會喺 24 小時內回覆，確認師傅及收費</li>
              <li>3. 確認後安排一對一服務（面對面或線上）</li>
            </ol>
          </div>

          {/* Service Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-black mb-4" style={{ color: "var(--text)" }}>選擇服務</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSelectedService(s.value)}
                  className="glass-card rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02]"
                  style={selectedService === s.value ? { border: "1px solid var(--red)", boxShadow: "none" } : {}}
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-sm font-bold mb-1" style={{ color: selectedService === s.value ? "var(--red)" : "var(--text)" }}>
                    {s.label}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <form method="post" data-clarity-mask="true" onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 flex flex-col gap-5">
            <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>填寫預約資料</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-name" className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>姓名 *</label>
                <input id="booking-name" name="name" autoComplete="name" value={form.name} onChange={handleChange} required placeholder="你的名字" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="booking-email" className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>電郵地址（選填）</label>
                <input id="booking-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} />
              </div>
            </div>

            <div>
              <label htmlFor="booking-phone" className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>WhatsApp／聯絡電話 *</label>
              <input id="booking-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} required placeholder="+852 XXXX XXXX" style={inputStyle} />
            </div>

            <div>
              <label htmlFor="booking-contact-method" className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>偏好聯絡方法 *</label>
              <select id="booking-contact-method" name="preferredContactMethod" autoComplete="off" value={form.preferredContactMethod} onChange={handleChange} style={inputStyle} required>
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">電話</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-date" className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>希望日期（選填）</label>
                <input id="booking-date" name="preferredDate" type="date" autoComplete="off" value={form.preferredDate} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="booking-time" className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>希望時間（選填）</label>
                <select id="booking-time" name="preferredTime" autoComplete="off" value={form.preferredTime} onChange={(e) => setForm((p) => ({ ...p, preferredTime: e.target.value }))} style={{ ...inputStyle }}>
                  <option value="">請選擇時間</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="booking-message" className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>備註（選填）</label>
              <textarea id="booking-message" name="message" autoComplete="off" value={form.message} onChange={handleChange} rows={4} placeholder="請描述你的問題或特別需求..." style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <div className="flex items-start gap-2">
              <input
                id="booking-consent"
                name="privacyConsent"
                type="checkbox"
                autoComplete="off"
                checked={form.privacyConsent}
                onChange={(e) => setForm((p) => ({ ...p, privacyConsent: e.target.checked }))}
                className="mt-1"
                required
              />
              <label htmlFor="booking-consent" className="text-xs" style={{ color: "var(--text-3)" }}>
                我已閱讀並同意 <a href="/privacy" className="underline" style={{ color: "var(--gold)" }}>私隱政策</a> 及個人資料收集聲明，明白資料只會用於預約聯絡及服務安排。
              </label>
            </div>

            <button
              type="submit"
              disabled={bookingMutation.isPending || !selectedService}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, var(--gold), var(--red))", color: "white" }}
            >
              {bookingMutation.isPending ? "提交中..." : "提交預約查詢"}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--text-3)" }}>
              提交後我哋會按你揀嘅 WhatsApp 或電話方法確認預約詳情
            </p>
          </form>

          {/* FAQ */}
          <div className="mt-10 rounded-xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
            <div className="px-5 py-4" style={{ background: "var(--bg-card)" }}>
              <h2 className="text-sm font-black tracking-widest uppercase" style={{ color: "var(--gold)" }}>常見問題 FAQ</h2>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--line)" }}>
              {FAQS.map((faq, idx) => (
                <div key={idx} className="px-5 py-4" style={{ background: "var(--bg)" }}>
                  <h3 className="text-sm font-bold mb-2" style={{ color: "var(--text)" }}>{faq.q}</h3>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 評價區（真實評價先會顯示） */}
          <div className="mt-10 rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
            <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>服務評價</h2>
            <p className="text-sm" style={{ color: "var(--text-3)" }}>暫時未有公開評價。完成服務後，歡迎分享你嘅真實體驗，幫助其他觀眾了解服務。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
