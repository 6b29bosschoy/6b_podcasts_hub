import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

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
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "oklch(0.65 0.20 145)" }} />
          <h2 className="text-2xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>預約成功！</h2>
          <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.02 60)" }}>
            我們已收到你的預約申請，團隊會在 24 小時內透過電郵聯絡你確認詳情。
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-5 py-2.5 rounded-lg text-sm font-bold" style={{ background: "oklch(0.60 0.22 25)", color: "white" }}>
              返回首頁
            </Link>
          </div>
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
        <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.78 0.16 75)" }}>BOOKING</div>
        <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>玄學服務預約</h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: "oklch(0.55 0.02 60)" }}>
          由專業玄學師傅提供一對一諮詢服務，助你解惑人生疑問
        </p>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Service Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-black mb-4" style={{ color: "oklch(0.92 0.01 60)" }}>選擇服務</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSelectedService(s.value)}
                  className="glass-card rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02]"
                  style={selectedService === s.value ? { border: "1px solid oklch(0.62 0.24 25)", boxShadow: "0 0 12px oklch(0.62 0.24 25 / 0.3)" } : {}}
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-sm font-bold mb-1" style={{ color: selectedService === s.value ? "oklch(0.62 0.24 25)" : "oklch(0.88 0.01 60)" }}>
                    {s.label}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "oklch(0.50 0.02 60)" }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 flex flex-col gap-5">
            <h2 className="text-lg font-black" style={{ color: "oklch(0.92 0.01 60)" }}>填寫預約資料</h2>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>希望日期（選填）</label>
                <input name="preferredDate" type="date" value={form.preferredDate} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>希望時間（選填）</label>
                <select name="preferredTime" value={form.preferredTime} onChange={(e) => setForm((p) => ({ ...p, preferredTime: e.target.value }))} style={{ ...inputStyle }}>
                  <option value="">請選擇時間</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>備註（選填）</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="請描述你的問題或特別需求..." style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <button
              type="submit"
              disabled={bookingMutation.isPending || !selectedService}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, oklch(0.75 0.15 75), oklch(0.60 0.22 25))", color: "white" }}
            >
              {bookingMutation.isPending ? "提交中..." : "確認預約"}
            </button>

            <p className="text-xs text-center" style={{ color: "oklch(0.45 0.02 60)" }}>
              提交後我們會在 24 小時內透過電郵確認預約詳情
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
