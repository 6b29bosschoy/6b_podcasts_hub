import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle, Mail, Phone, Youtube, Instagram, Facebook } from "lucide-react";
import { Link } from "wouter";
import { JsonLd, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";
import { useSEO } from "@/hooks/useSEO";

const INQUIRY_TYPES = [
  { value: "collaboration", label: "商業合作", desc: "廣告、品牌合作、贊助" },
  { value: "guest", label: "嘉賓邀請", label2: "申請上節目" },
  { value: "feedback", label: "觀眾反饋", desc: "節目意見、建議" },
  { value: "other", label: "其他查詢", desc: "" },
];

export default function Contact() {
  useSEO({
    title: "聯絡我們｜6B Podcast—商業合作查詢、嘉賓邀請與觀眾反饋",
    description: "聯絡 6B Podcast 路邊電台：商業合作洽談、嘉賓邀請申請、觀眾反饋意見。我們會在 48 小時內回覆。亦可直接 WhatsApp 查詢玄學服務預約。",
    keywords: "聯絡 6B Podcast,商業合作查詢,嘉賓邀請,觀眾反饋,香港 Podcast 聯絡,玄學服務預約",
    ogTitle: "聯絡我們｜6B Podcast—商業合作查詢、嘉賓邀請與觀眾反饋",
    ogDescription: "商業合作洽談、嘉賓邀請申請、觀眾反饋意見。我們會在 48 小時內回覆。",
    ogUrl: "https://www.6bpodcasts.com/contact",
    canonical: "https://www.6bpodcasts.com/contact",
  });
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "collaboration" as "collaboration" | "guest" | "feedback" | "other",
    subject: "",
    message: "",
  });

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => { setSubmitted(true); },
    onError: (err) => { toast.error(err.message || "提交失敗，請稍後再試。"); },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({ ...form, phone: form.phone || undefined });
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "var(--gold)" }} />
          <h2 className="text-2xl font-black mb-3" style={{ color: "var(--text)" }}>訊息已發送！</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-3)" }}>
            感謝你的查詢！我們會在 2 個工作天內回覆你。
          </p>
          <Link href="/" className="px-5 py-2.5 rounded-lg text-sm font-bold" style={{ background: "var(--red)", color: "white" }}>
            返回首頁
          </Link>
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

  const contactSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#local-business`,
      name: "路邊電台 × 路邊玄學堂",
      alternateName: "6B Podcasts",
      description: "香港最真實訪談節目平台，提供玄學服務、訪談製作及品牌合作。",
      url: SITE_URL,
      email: "6bpodcasts@gmail.com",
      areaServed: {
        "@type": "Place",
        name: "香港",
      },
      sameAs: [
        "https://www.youtube.com/@6bpodcasts",
        "https://www.facebook.com/6bpodcasts",
        "https://www.instagram.com/6bpodcasts",
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "10:00",
          closes: "18:00",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "聯絡我們｜路邊電台",
      description: "聯絡路邊電台：商業合作洽談、嘉賓邀請申請、觀眾反饋意見，我們會在 48 小時內回覆。",
      url: `${SITE_URL}/contact`,
    },
    buildBreadcrumbSchema([
      { name: "首頁", url: SITE_URL },
      { name: "聯絡我們", url: `${SITE_URL}/contact` },
    ]),
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <JsonLd data={contactSchemas} id="contact" />
      {/* Header */}
      <div className="py-12 text-center" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--line)" }}>
        <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--red)" }}>CONTACT</div>
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--text)" }}>聯絡我們</h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--text-3)" }}>
          商業合作、嘉賓邀請或任何查詢，歡迎聯絡我們
        </p>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-black mb-4" style={{ color: "var(--text)" }}>直接聯絡</h3>
              <div className="flex flex-col gap-3">
                <a href="mailto:hello@6bpodcasts.com" className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity" style={{ color: "var(--text-2)" }}>
                  <Mail size={16} style={{ color: "var(--red)" }} />
                  hello@6bpodcasts.com
                </a>
                <a href="https://wa.me/85298729990" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity" style={{ color: "var(--text-2)" }}>
                  <Phone size={16} style={{ color: "var(--gold)" }} />
                  +852 9872 9990
                </a>
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="font-black mb-4" style={{ color: "var(--text)" }}>社交媒體</h3>
              <div className="flex flex-col gap-3">
                {[
                  { href: "https://www.youtube.com/@6bpodcasts", label: "YouTube 路邊電台", Icon: Youtube, color: "var(--red)" },
                  { href: "https://www.youtube.com/@6bfengshui", label: "YouTube 玄學堂", Icon: Youtube, color: "var(--gold)" },
                  { href: "https://www.facebook.com/6bpodcasts", label: "Facebook", Icon: Facebook, color: "var(--gold)" },
                  { href: "https://www.instagram.com/6bpodcasts", label: "Instagram", Icon: Instagram, color: "var(--gold)" },
                ].map((item) => (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity" style={{ color: "var(--text-2)" }}>
                    <item.Icon size={16} style={{ color: item.color }} />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="font-black mb-2" style={{ color: "var(--text)" }}>回覆時間</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
                一般查詢：2 個工作天內<br />
                商業合作：1 個工作天內<br />
                WhatsApp 即時回覆（辦公時間）
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 flex flex-col gap-5">
              <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>發送訊息</h2>

              {/* Inquiry Type */}
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-2)" }}>查詢類型 *</label>
                <div className="grid grid-cols-2 gap-2">
                  {INQUIRY_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, inquiryType: t.value as typeof form.inquiryType }))}
                      className="px-3 py-2.5 rounded-lg text-xs font-bold text-left transition-all"
                      style={form.inquiryType === t.value
                        ? { background: "var(--red)", border: "1px solid var(--red)", color: "var(--red)" }
                        : { background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text-2)" }
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

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

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>主題 *</label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="簡短描述你的查詢" style={inputStyle} />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-2)" }}>訊息內容 *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={6} placeholder="詳細描述你的查詢或合作想法..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "white" }}
              >
                {contactMutation.isPending ? "發送中..." : "發送訊息"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
