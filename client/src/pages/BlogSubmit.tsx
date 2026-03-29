import { useState, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Upload, X, Plus, Link2, ImageIcon } from "lucide-react";

const CATEGORIES = [
  { value: "relationship", label: "兩性關係" },
  { value: "fengshui", label: "玄學風水" },
  { value: "lifestyle", label: "生活態度" },
  { value: "interview", label: "嘉賓訪談" },
  { value: "other", label: "其他" },
];

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 2;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type AcceptedMime = (typeof ACCEPTED_TYPES)[number];

interface LinkItem {
  title: string;
  url: string;
}

interface UploadedImage {
  previewUrl: string;
  s3Url: string | null;
  uploading: boolean;
  error: string | null;
  file: File;
}

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
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageMutation = trpc.blog.uploadImage.useMutation();

  const submitMutation = trpc.blog.submit.useMutation({
    onSuccess: () => { setSubmitted(true); },
    onError: (err) => { toast.error(err.message || "提交失敗，請稍後再試。"); },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const processFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { toast.error(`最多只能上傳 ${MAX_IMAGES} 張圖片`); return; }
    const toProcess = fileArr.slice(0, remaining);

    for (const file of toProcess) {
      if (!ACCEPTED_TYPES.includes(file.type as AcceptedMime)) {
        toast.error(`${file.name} 格式不支援，請上傳 JPG、PNG、WebP 或 GIF`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} 超過 ${MAX_SIZE_MB}MB 限制`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      const imgEntry: UploadedImage = { previewUrl, s3Url: null, uploading: true, error: null, file };
      setImages((prev) => [...prev, imgEntry]);

      // Convert to base64 and upload
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(",")[1];
        try {
          const result = await uploadImageMutation.mutateAsync({
            filename: file.name,
            contentType: file.type as AcceptedMime,
            base64,
          });
          setImages((prev) =>
            prev.map((img) =>
              img.previewUrl === previewUrl ? { ...img, s3Url: result.url, uploading: false } : img
            )
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "上傳失敗";
          setImages((prev) =>
            prev.map((img) =>
              img.previewUrl === previewUrl ? { ...img, uploading: false, error: message } : img
            )
          );
          toast.error(`圖片上傳失敗：${message}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const removeImage = (previewUrl: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.previewUrl === previewUrl);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((i) => i.previewUrl !== previewUrl);
    });
  };

  const addLink = () => {
    if (links.length >= 3) { toast.error("最多只能加入 3 條連結"); return; }
    setLinks((prev) => [...prev, { title: "", url: "" }]);
  };

  const updateLink = (idx: number, field: keyof LinkItem, value: string) => {
    setLinks((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };

  const removeLink = (idx: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uploadingCount = images.filter((i) => i.uploading).length;
    if (uploadingCount > 0) { toast.error("請等待圖片上傳完成"); return; }
    const errorCount = images.filter((i) => i.error).length;
    if (errorCount > 0) { toast.error("部分圖片上傳失敗，請移除後重試"); return; }

    const imageUrls = images.filter((i) => i.s3Url).map((i) => i.s3Url!);
    const validLinks = links.filter((l) => l.title.trim() && l.url.trim());

    submitMutation.mutate({ ...form, imageUrls, links: validLinks });
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

  const labelStyle = { color: "oklch(0.70 0.01 60)" };

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
          {/* Author info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={labelStyle}>你的名字 *</label>
              <input name="authorName" value={form.authorName} onChange={handleChange} required placeholder="顯示名稱" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={labelStyle}>電郵地址 *</label>
              <input name="authorEmail" type="email" value={form.authorEmail} onChange={handleChange} required placeholder="your@email.com" style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={labelStyle}>個人簡介（選填）</label>
            <input name="authorBio" value={form.authorBio} onChange={handleChange} placeholder="例：路邊電台嘉賓、玄學愛好者..." style={inputStyle} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={labelStyle}>文章標題 *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="吸引讀者的標題" style={inputStyle} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={labelStyle}>文章分類 *</label>
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={labelStyle}>文章摘要（選填）</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="一兩句話描述文章重點..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={labelStyle}>文章內容 *</label>
            <textarea name="content" value={form.content} onChange={handleChange} required rows={12} placeholder="分享你的故事、心得或見解..." style={{ ...inputStyle, resize: "vertical" }} />
            <p className="text-xs mt-1" style={{ color: "oklch(0.45 0.02 60)" }}>最少 50 字</p>
          </div>

          {/* ── Image Upload ─────────────────────────────────────── */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={labelStyle}>
              <ImageIcon size={13} className="inline mr-1" />
              附上圖片（選填，最多 {MAX_IMAGES} 張，每張 ≤ {MAX_SIZE_MB}MB）
            </label>

            {/* Drop zone */}
            {images.length < MAX_IMAGES && (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-lg flex flex-col items-center justify-center gap-2 py-6 transition-all"
                style={{
                  border: `2px dashed ${isDragging ? "oklch(0.62 0.24 25)" : "oklch(0.28 0.02 260)"}`,
                  background: isDragging ? "oklch(0.15 0.03 25 / 0.3)" : "oklch(0.13 0.015 260)",
                }}
              >
                <Upload size={22} style={{ color: "oklch(0.55 0.02 60)" }} />
                <p className="text-xs" style={{ color: "oklch(0.55 0.02 60)" }}>
                  拖放圖片到此處，或 <span style={{ color: "oklch(0.62 0.24 25)" }}>點擊選擇</span>
                </p>
                <p className="text-xs" style={{ color: "oklch(0.40 0.02 60)" }}>JPG、PNG、WebP、GIF</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                {images.map((img) => (
                  <div key={img.previewUrl} className="relative rounded-lg overflow-hidden aspect-square" style={{ background: "oklch(0.13 0.015 260)" }}>
                    <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                    {img.uploading && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "oklch(0 0 0 / 0.6)" }}>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {img.error && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "oklch(0 0 0 / 0.7)" }}>
                        <X size={18} style={{ color: "oklch(0.65 0.25 25)" }} />
                      </div>
                    )}
                    {!img.uploading && (
                      <button
                        type="button"
                        onClick={() => removeImage(img.previewUrl)}
                        className="absolute top-1 right-1 rounded-full p-0.5"
                        style={{ background: "oklch(0 0 0 / 0.7)" }}
                      >
                        <X size={12} style={{ color: "white" }} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {images.length > 0 && (
              <p className="text-xs mt-1.5" style={{ color: "oklch(0.45 0.02 60)" }}>
                已選 {images.length}/{MAX_IMAGES} 張
                {images.some((i) => i.uploading) && " · 上傳中..."}
              </p>
            )}
          </div>

          {/* ── Links ─────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold" style={labelStyle}>
                <Link2 size={13} className="inline mr-1" />
                相關連結（選填，最多 3 條）
              </label>
              {links.length < 3 && (
                <button type="button" onClick={addLink} className="flex items-center gap-1 text-xs font-bold hover:opacity-80 transition-opacity" style={{ color: "oklch(0.62 0.24 25)" }}>
                  <Plus size={13} /> 加入連結
                </button>
              )}
            </div>

            {links.length === 0 && (
              <button
                type="button"
                onClick={addLink}
                className="w-full py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{ border: "1px dashed oklch(0.28 0.02 260)", color: "oklch(0.50 0.02 60)", background: "transparent" }}
              >
                <Plus size={14} /> 加入相關連結（YouTube 影片、社交媒體等）
              </button>
            )}

            <div className="flex flex-col gap-3">
              {links.map((link, idx) => (
                <div key={idx} className="rounded-lg p-3 flex flex-col gap-2" style={{ background: "oklch(0.13 0.015 260)", border: "1px solid oklch(0.22 0.02 260)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: "oklch(0.62 0.24 25)" }}>連結 {idx + 1}</span>
                    <button type="button" onClick={() => removeLink(idx)} className="hover:opacity-70">
                      <X size={14} style={{ color: "oklch(0.50 0.02 60)" }} />
                    </button>
                  </div>
                  <input
                    value={link.title}
                    onChange={(e) => updateLink(idx, "title", e.target.value)}
                    placeholder="連結標題（例：我的 YouTube 頻道）"
                    style={{ ...inputStyle, padding: "0.5rem 0.75rem" }}
                  />
                  <input
                    value={link.url}
                    onChange={(e) => updateLink(idx, "url", e.target.value)}
                    placeholder="https://..."
                    type="url"
                    style={{ ...inputStyle, padding: "0.5rem 0.75rem" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitMutation.isPending || images.some((i) => i.uploading)}
            className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}
          >
            {submitMutation.isPending
              ? "提交中..."
              : images.some((i) => i.uploading)
              ? `上傳圖片中（${images.filter((i) => i.uploading).length} 張）...`
              : `提交投稿${images.filter((i) => i.s3Url).length > 0 ? `（含 ${images.filter((i) => i.s3Url).length} 張圖片）` : ""}`}
          </button>
        </form>
      </div>
    </div>
  );
}
