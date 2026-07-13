import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, PenLine, MessageSquareHeart, ChevronRight, Loader2, ChevronLeft, Image as ImageIcon } from "lucide-react";
import ImageUploader, { type UploadedImage } from "@/components/ImageUploader";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "relationship" | "fengshui" | "confession" | "question" | "other";

const CATEGORY_LABELS: Record<Category, { label: string; emoji: string; color: string }> = {
  relationship: { label: "感情故事", emoji: "💕", color: "var(--red)" },
  fengshui:     { label: "玄學奇遇", emoji: "🔮", color: "var(--gold)" },
  confession:   { label: "心底話",   emoji: "💬", color: "var(--gold)" },
  question:     { label: "問題想問", emoji: "🙋", color: "var(--gold)" },
  other:        { label: "其他",     emoji: "✨", color: "var(--gold)" },
};

// ─── Image Carousel ───────────────────────────────────────────────────────────

function ImageCarousel({ urls }: { urls: string[] }) {
  const [idx, setIdx] = useState(0);
  if (urls.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + urls.length) % urls.length);
  const next = () => setIdx((i) => (i + 1) % urls.length);

  return (
    <div className="relative rounded-xl overflow-hidden mb-3" style={{ aspectRatio: "16/9", background: "var(--bg)" }}>
      <img
        src={urls[idx]}
        alt={`圖片 ${idx + 1}`}
        className="w-full h-full object-cover"
      />
      {urls.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-100 opacity-70"
            style={{ background: "rgba(13,12,10,0.6)" }}
          >
            <ChevronLeft size={14} color="white" />
          </button>
          <button
            onClick={next}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-100 opacity-70"
            style={{ background: "rgba(13,12,10,0.6)" }}
          >
            <ChevronRight size={14} color="white" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {urls.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === idx ? "white" : "rgba(236,229,216,0.4)" }}
              />
            ))}
          </div>
          {/* Counter */}
          <div
            className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded"
            style={{ background: "rgba(13,12,10,0.55)", color: "white", fontSize: "10px" }}
          >
            {idx + 1}/{urls.length}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Submission Card ──────────────────────────────────────────────────────────

function SubmissionCard({
  item,
  onLike,
}: {
  item: {
    id: number;
    nickname: string;
    category: Category;
    content: string;
    likes: number;
    isAnonymous: boolean;
    createdAt: Date | string;
    images?: string | null;
  };
  onLike: (id: number) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(item.likes);
  const cat = CATEGORY_LABELS[item.category] ?? CATEGORY_LABELS.other;

  // Parse images JSON
  let imageUrls: string[] = [];
  try {
    if (item.images && item.images !== "[]") {
      const parsed = JSON.parse(item.images);
      if (Array.isArray(parsed)) imageUrls = parsed.filter((u): u is string => typeof u === "string");
    }
  } catch {
    imageUrls = [];
  }

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setLocalLikes((n) => n + 1);
    onLike(item.id);
  };

  const displayName = item.isAnonymous ? "匿名讀者" : item.nickname;
  const dateStr = new Date(item.createdAt).toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden transition-all hover:translate-y-[-2px]"
      style={{
        background: "var(--bg)",
        border: "1px solid var(--line)",
        boxShadow: "0 2px 12px rgba(13,12,10,0.2)",
      }}
    >
      {/* Image carousel (if any) */}
      {imageUrls.length > 0 && (
        <div className="px-4 pt-4">
          <ImageCarousel urls={imageUrls} />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              background: `${cat.color}18`,
              border: `1px solid ${cat.color}40`,
              color: cat.color,
            }}
          >
            {cat.emoji} {cat.label}
          </span>
          <div className="flex items-center gap-1.5">
            {imageUrls.length > 0 && (
              <span className="flex items-center gap-0.5 text-xs" style={{ color: "var(--text-3)" }}>
                <ImageIcon size={10} />
                {imageUrls.length}
              </span>
            )}
            <span className="text-xs" style={{ color: "var(--text-3)" }}>
              {dateStr}
            </span>
          </div>
        </div>

        {/* Content */}
        <p
          className="flex-1 text-sm leading-relaxed line-clamp-5 mb-4"
          style={{ color: "var(--text)" }}
        >
          {item.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--line)" }}>
          <span className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
            — {displayName}
          </span>
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all hover:scale-110"
            style={{
              background: liked ? "var(--red)" : "var(--bg-raise)",
              border: `1px solid ${liked ? "var(--red)" : "var(--line)"}`,
              color: liked ? "var(--red)" : "var(--text-3)",
            }}
            aria-label="讚好"
          >
            <Heart size={12} fill={liked ? "currentColor" : "none"} />
            {localLikes}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Submit Form Dialog ───────────────────────────────────────────────────────

function SubmitDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [nickname, setNickname] = useState("");
  const [category, setCategory] = useState<Category>("relationship");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const submitMutation = trpc.submission.submit.useMutation({
    onSuccess: () => {
      toast.success("投稿成功！", {
        description: "感謝你嘅分享，我哋會盡快審核，精選投稿將會喺首頁展示 🎉",
      });
      // Reset form
      setNickname("");
      setCategory("relationship");
      setContent("");
      setIsAnonymous(false);
      setUploadedImages([]);
      onSuccess();
      onClose();
    },
    onError: (err) => {
      toast.error("投稿失敗", { description: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 10) {
      toast.error("內容太短", { description: "請輸入至少 10 個字" });
      return;
    }
    submitMutation.mutate({
      nickname: isAnonymous ? "匿名" : nickname.trim() || "讀者",
      category,
      content: content.trim(),
      isAnonymous,
      imageUrls: uploadedImages.map((img) => img.url),
    });
  };

  const isSubmitting = submitMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg" style={{ color: "var(--text)" }}>
            <MessageSquareHeart size={20} style={{ color: "var(--gold)" }} />
            向路邊電台投稿
          </DialogTitle>
          <DialogDescription style={{ color: "var(--text-3)" }}>
            分享你嘅故事、問題或心底話，精選投稿將展示喺首頁，讓更多人知道你唔孤單。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Category */}
          <div className="space-y-1.5">
            <Label style={{ color: "var(--text-2)" }}>投稿類別</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
                {(Object.entries(CATEGORY_LABELS) as [Category, typeof CATEGORY_LABELS[Category]][]).map(([val, meta]) => (
                  <SelectItem key={val} value={val} style={{ color: "var(--text)" }}>
                    {meta.emoji} {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label style={{ color: "var(--text-2)" }}>
              你嘅故事 / 問題
              <span className="ml-1 text-xs" style={{ color: "var(--text-3)" }}>
                ({content.length}/1000)
              </span>
            </Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 1000))}
              placeholder="盡情分享你嘅故事、心底話或想問嘅問題…（最少 10 字）"
              rows={5}
              className="resize-none"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--line)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <Label style={{ color: "var(--text-2)" }}>
              附上圖片
              <span className="ml-1 text-xs" style={{ color: "var(--text-3)" }}>
                （可選，最多 5 張，每張 ≤ 2MB）
              </span>
            </Label>
            <ImageUploader
              images={uploadedImages}
              onImagesChange={setUploadedImages}
              disabled={isSubmitting}
              dark={true}
            />
          </div>

          {/* Nickname + Anonymous toggle */}
          <div className="space-y-1.5">
            <Label style={{ color: "var(--text-2)" }}>你嘅名字（可用花名）</Label>
            <div className="flex gap-2">
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 50))}
                placeholder={isAnonymous ? "匿名投稿" : "例如：小明、Coco…"}
                disabled={isAnonymous}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                  opacity: isAnonymous ? 0.5 : 1,
                }}
              />
              <button
                type="button"
                onClick={() => setIsAnonymous((v) => !v)}
                className="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: isAnonymous ? "rgba(201,164,92,0.2)" : "var(--bg-raise)",
                  border: `1px solid ${isAnonymous ? "rgba(201,164,92,0.5)" : "var(--line)"}`,
                  color: isAnonymous ? "var(--gold)" : "var(--text-3)",
                  whiteSpace: "nowrap",
                }}
              >
                {isAnonymous ? "🙈 匿名中" : "匿名投稿"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--text-2)" }}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 font-bold"
              style={{
                background: "linear-gradient(135deg, var(--red), var(--gold))",
                color: "white",
                border: "none",
              }}
            >
              {isSubmitting ? (
                <><Loader2 size={14} className="animate-spin mr-1" /> 提交中…</>
              ) : (
                <>立即投稿 ✉️{uploadedImages.length > 0 && ` (+${uploadedImages.length}📷)`}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Section Component ───────────────────────────────────────────────────

export default function ReaderSubmissions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.submission.listApproved.useQuery(
    { limit: 9, offset: 0 },
    { staleTime: 1000 * 60 * 5 }
  );

  const likeMutation = trpc.submission.like.useMutation({
    onError: () => {
      toast.error("讚好失敗，請稍後再試");
    },
  });

  const handleLike = (id: number) => {
    likeMutation.mutate({ id });
  };

  const handleSuccess = () => {
    utils.submission.listApproved.invalidate();
  };

  const items = data?.items ?? [];

  return (
    <section
      className="py-16 px-4"
      style={{
        background: "linear-gradient(180deg, var(--bg) 0%, var(--bg) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div
              className="text-xs font-bold tracking-widest mb-2"
              style={{ color: "var(--gold)" }}
            >
              READER STORIES
            </div>
            <h2
              className="text-2xl md:text-3xl font-black mb-1"
              style={{ color: "var(--text)" }}
            >
              讀者投稿
            </h2>
            <p className="text-sm" style={{ color: "var(--text-3)" }}>
              每一個故事都值得被聆聽，你唔孤單
            </p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105 self-start sm:self-auto"
            style={{
              background: "linear-gradient(135deg, var(--red), var(--gold))",
              color: "white",
              boxShadow: "0 4px 16px var(--red)",
            }}
          >
            <PenLine size={15} />
            我要投稿
          </button>
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 animate-pulse"
                style={{ background: "var(--bg)", height: "200px" }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty state — encourage first submission */
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              background: "var(--bg)",
              border: "2px dashed var(--line)",
            }}
          >
            <div className="text-4xl mb-3">✉️</div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: "var(--text)" }}
            >
              成為第一位投稿嘅讀者！
            </h3>
            <p className="text-sm mb-5" style={{ color: "var(--text-3)" }}>
              分享你嘅感情故事、玄學奇遇或心底話，精選投稿將展示喺呢度
            </p>
            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, var(--red), var(--gold))",
                color: "white",
              }}
            >
              <PenLine size={15} />
              立即投稿
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {items.map((item) => (
                <SubmissionCard
                  key={item.id}
                  item={{
                    ...item,
                    category: item.category as Category,
                  }}
                  onLike={handleLike}
                />
              ))}
            </div>

            {/* CTA to submit */}
            <div
              className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--line)",
              }}
            >
              <div>
                <div
                  className="text-sm font-bold mb-0.5"
                  style={{ color: "var(--text)" }}
                >
                  你都有故事想分享？
                </div>
                <div className="text-xs" style={{ color: "var(--text-3)" }}>
                  每週精選投稿，有機會喺節目中被討論 · 支援上傳圖片 📷
                </div>
              </div>
              <button
                onClick={() => setDialogOpen(true)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                style={{
                  background: "var(--gold)",
                  border: "1px solid var(--gold)",
                  color: "var(--gold)",
                }}
              >
                投稿分享 <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Submit dialog */}
      <SubmitDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </section>
  );
}
