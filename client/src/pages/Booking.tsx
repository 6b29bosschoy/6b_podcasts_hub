import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { JsonLd, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";

const SERVICES = [
  { value: "fengshui", label: "風水諮詢", icon: "🧭", desc: "家居、辦公室風水佈局分析，改善運勢與財運" },
  { value: "bazi", label: "八字命理", icon: "🔮", desc: "根據生辰八字分析個人運程、事業、感情走向" },
  { value: "tarot", label: "塔羅占卜", icon: "🃏", desc: "塔羅牌解讀，為你的人生問題提供指引" },
  { value: "spiritual", label: "身心靈療癒", icon: "🌿", desc: "能量療癒、冥想指導，平衡身心靈狀態" },
  { value: "course", label: "課程報名", icon: "📚", desc: "報名玄學、風水、命理相關課程" },
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
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const bookingMutation = trpc.booking.create.useMutation({
    onSuccess: () => { setSubmitted(true); },
    onError: (err) => { toast.error(err.message || "預約失敗，請稍後再試。"); },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) { toast.error("請選擇服務類型"); return; }
    bookingMutation.mutate({
      ...form,
      serviceType: selectedService as "fengshui" | "bazi" | "tarot" | "spiritual" | "course",
      phone: form.phone || undefined,
      preferredDate: form.preferredDate || undefined,
      preferredTime: form.preferredTime || undefined,
      message: form.message || undefined,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "var(--gold)" }} />
          <h2 className="text-2xl font-black mb-3" style={{ color: "var(--text)" }}>預約成功！</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-3)" }}>
            我們已收到你的預約申請，團隊會在 24 小時內透過電郵聯絡你確認詳情。
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-5 py-2.5 rounded-lg text-sm font-bold" style={{ background: "var(--red)", color: "white" }}>
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 flex flex-col gap-5">
            <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>填寫預約資料</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>姓名 *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="你的名字" style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>電郵地址 *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" style={inputStyle} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>聯絡電話（選填）</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+852 XXXX XXXX" style={inputStyle} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>希望日期（選填）</label>
                <input name="preferredDate" type="date" value={form.preferredDate} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>希望時間（選填）</label>
                <select name="preferredTime" value={form.preferredTime} onChange={(e) => setForm((p) => ({ ...p, preferredTime: e.target.value }))} style={{ ...inputStyle }}>
                  <option value="">請選擇時間</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>備註（選填）</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="請描述你的問題或特別需求..." style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <button
              type="submit"
              disabled={bookingMutation.isPending || !selectedService}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, var(--gold), var(--red))", color: "white" }}
            >
              {bookingMutation.isPending ? "提交中..." : "確認預約"}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--text-3)" }}>
              提交後我們會在 24 小時內透過電郵確認預約詳情
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
