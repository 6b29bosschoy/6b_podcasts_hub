import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle, Mail, Phone, Youtube, Instagram, Facebook } from "lucide-react";
import { Link } from "wouter";

const INQUIRY_TYPES = [
  { value: "collaboration", label: "商業合作", desc: "廣告、品牌合作、贊助" },
  { value: "guest", label: "嘉賓邀請", label2: "申請上節目" },
  { value: "feedback", label: "觀眾反饋", desc: "節目意見、建議" },
  { value: "other", label: "其他查詢", desc: "" },
];

export default function Contact() {
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
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "oklch(0.65 0.20 145)" }} />
          <h2 className="text-2xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>訊息已發送！</h2>
          <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.02 60)" }}>
            感謝你的查詢！我們會在 2 個工作天內回覆你。
          </p>
          <Link href="/" className="px-5 py-2.5 rounded-lg text-sm font-bold" style={{ background: "oklch(0.60 0.22 25)", color: "white" }}>
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle = {
    background: "oklch(0.15 0.015 260)",
    border: "1px solid oklch(0.25 0.02 260)",
    color: "oklch(0.92 0.01 60)",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    width: "100%",
    fontSize: "0.875rem",
    outline: "none",
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="py-12 text-center" style={{ background: "oklch(0.10 0.01 260)", borderBottom: "1px solid oklch(0.18 0.02 260)" }}>
        <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>CONTACT</div>
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>聯絡我們</h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: "oklch(0.55 0.02 60)" }}>
          商業合作、嘉賓邀請或任何查詢，歡迎聯絡我們
        </p>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-black mb-4" style={{ color: "oklch(0.92 0.01 60)" }}>直接聯絡</h3>
              <div className="flex flex-col gap-3">
                <a href="mailto:ktcreativefirm@gmail.com" className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity" style={{ color: "oklch(0.70 0.01 60)" }}>
                  <Mail size={16} style={{ color: "oklch(0.62 0.24 25)" }} />
                  ktcreativefirm@gmail.com
                </a>
                <a href="https://wa.me/85298729990" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity" style={{ color: "oklch(0.70 0.01 60)" }}>
                  <Phone size={16} style={{ color: "oklch(0.65 0.20 145)" }} />
                  +852 9872 9990
                </a>
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="font-black mb-4" style={{ color: "oklch(0.92 0.01 60)" }}>社交媒體</h3>
              <div className="flex flex-col gap-3">
                {[
                  { href: "https://www.youtube.com/@6bpodcasts", label: "YouTube 路邊電台", Icon: Youtube, color: "oklch(0.55 0.22 25)" },
                  { href: "https://www.youtube.com/@6bfengshui", label: "YouTube 玄學堂", Icon: Youtube, color: "oklch(0.55 0.20 250)" },
                  { href: "https://www.facebook.com/6bpodcasts", label: "Facebook", Icon: Facebook, color: "oklch(0.50 0.18 255)" },
                  { href: "https://www.instagram.com/6bpodcasts", label: "Instagram", Icon: Instagram, color: "oklch(0.60 0.20 330)" },
                ].map((item) => (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity" style={{ color: "oklch(0.70 0.01 60)" }}>
                    <item.Icon size={16} style={{ color: item.color }} />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="font-black mb-2" style={{ color: "oklch(0.92 0.01 60)" }}>回覆時間</h3>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.02 60)" }}>
                一般查詢：2 個工作天內<br />
                商業合作：1 個工作天內<br />
                WhatsApp 即時回覆（辦公時間）
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 flex flex-col gap-5">
              <h2 className="text-lg font-black" style={{ color: "oklch(0.92 0.01 60)" }}>發送訊息</h2>

              {/* Inquiry Type */}
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: "oklch(0.70 0.01 60)" }}>查詢類型 *</label>
                <div className="grid grid-cols-2 gap-2">
                  {INQUIRY_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, inquiryType: t.value as typeof form.inquiryType }))}
                      className="px-3 py-2.5 rounded-lg text-xs font-bold text-left transition-all"
                      style={form.inquiryType === t.value
                        ? { background: "oklch(0.62 0.24 25 / 0.2)", border: "1px solid oklch(0.62 0.24 25)", color: "oklch(0.62 0.24 25)" }
                        : { background: "oklch(0.15 0.015 260)", border: "1px solid oklch(0.25 0.02 260)", color: "oklch(0.65 0.01 60)" }
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>姓名 *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="你的名字" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>電郵地址 *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" style={inputStyle} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>聯絡電話（選填）</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+852 XXXX XXXX" style={inputStyle} />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>主題 *</label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="簡短描述你的查詢" style={inputStyle} />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>訊息內容 *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={6} placeholder="詳細描述你的查詢或合作想法..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}
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
