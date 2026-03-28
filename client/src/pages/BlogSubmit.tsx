import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle } from "lucide-react";

const CATEGORIES = [
  { value: "relationship", label: "兩性關係" },
  { value: "fengshui", label: "玄學風水" },
  { value: "lifestyle", label: "生活態度" },
  { value: "interview", label: "嘉賓訪談" },
  { value: "other", label: "其他" },
];

export default function BlogSubmit() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    authorName: "",
    authorEmail: "",
    authorBio: "",
    excerpt: "",
    content: "",
    category: "other" as "relationship" | "fengshui" | "lifestyle" | "interview" | "other",
  });

  const submitMutation = trpc.blog.submit.useMutation({
    onSuccess: () => { setSubmitted(true); },
    onError: (err) => { toast.error(err.message || "提交失敗，請稍後再試。"); },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "oklch(0.65 0.20 145)" }} />
          <h2 className="text-2xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>投稿成功！</h2>
          <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.02 60)" }}>
            感謝你的分享！我們的團隊會在審核後盡快發佈你的文章。
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/blog" className="px-5 py-2.5 rounded-lg text-sm font-bold" style={{ background: "oklch(0.60 0.22 25)", color: "white" }}>
              返回嘉賓專欄
            </Link>
            <Link href="/" className="px-5 py-2.5 rounded-lg text-sm font-bold" style={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(0.28 0.02 260)", color: "oklch(0.85 0.01 60)" }}>
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
      <div className="container max-w-2xl mx-auto py-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-80" style={{ color: "oklch(0.62 0.24 25)" }}>
          <ArrowLeft size={16} />
          返回嘉賓專欄
        </Link>

        <div className="mb-8">
          <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>SUBMIT YOUR STORY</div>
          <h1 className="text-3xl font-black mb-2" style={{ color: "oklch(0.92 0.01 60)" }}>投稿分享你的故事</h1>
          <p className="text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>
            歡迎嘉賓及觀眾分享訪談心得、人生故事或玄學見解。所有投稿均需經過審核才會發佈。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>你的名字 *</label>
              <input name="authorName" value={form.authorName} onChange={handleChange} required placeholder="顯示名稱" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>電郵地址 *</label>
              <input name="authorEmail" type="email" value={form.authorEmail} onChange={handleChange} required placeholder="your@email.com" style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>個人簡介（選填）</label>
            <input name="authorBio" value={form.authorBio} onChange={handleChange} placeholder="例：路邊電台嘉賓、玄學愛好者..." style={inputStyle} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>文章標題 *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="吸引讀者的標題" style={inputStyle} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>文章分類 *</label>
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>文章摘要（選填）</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="一兩句話描述文章重點..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "oklch(0.70 0.01 60)" }}>文章內容 *</label>
            <textarea name="content" value={form.content} onChange={handleChange} required rows={12} placeholder="分享你的故事、心得或見解..." style={{ ...inputStyle, resize: "vertical" }} />
            <p className="text-xs mt-1" style={{ color: "oklch(0.45 0.02 60)" }}>最少 50 字</p>
          </div>

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}
          >
            {submitMutation.isPending ? "提交中..." : "提交投稿"}
          </button>
        </form>
      </div>
    </div>
  );
}
