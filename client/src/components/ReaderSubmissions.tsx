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
import { Heart, PenLine, MessageSquareHeart, ChevronRight, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "relationship" | "fengshui" | "confession" | "question" | "other";

const CATEGORY_LABELS: Record<Category, { label: string; emoji: string; color: string }> = {
  relationship: { label: "感情故事", emoji: "💕", color: "oklch(0.62 0.24 25)" },
  fengshui:     { label: "玄學奇遇", emoji: "🔮", color: "oklch(0.65 0.20 290)" },
  confession:   { label: "心底話",   emoji: "💬", color: "oklch(0.60 0.18 200)" },
  question:     { label: "問題想問", emoji: "🙋", color: "oklch(0.65 0.20 145)" },
  other:        { label: "其他",     emoji: "✨", color: "oklch(0.78 0.16 75)" },
};

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
  };
  onLike: (id: number) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(item.likes);
  const cat = CATEGORY_LABELS[item.category] ?? CATEGORY_LABELS.other;

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
      className="flex flex-col rounded-2xl p-5 transition-all hover:translate-y-[-2px]"
      style={{
        background: "oklch(0.11 0.015 260)",
        border: "1px solid oklch(0.20 0.02 260)",
        boxShadow: "0 2px 12px oklch(0 0 0 / 0.2)",
      }}
    >
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
        <span className="text-xs" style={{ color: "oklch(0.42 0.01 60)" }}>
          {dateStr}
        </span>
      </div>

      {/* Content */}
      <p
        className="flex-1 text-sm leading-relaxed line-clamp-5 mb-4"
        style={{ color: "oklch(0.78 0.01 60)" }}
      >
        {item.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid oklch(0.18 0.02 260)" }}>
        <span className="text-xs font-medium" style={{ color: "oklch(0.50 0.02 60)" }}>
          — {displayName}
        </span>
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all hover:scale-110"
          style={{
            background: liked ? "oklch(0.62 0.24 25 / 0.15)" : "oklch(0.16 0.02 260)",
            border: `1px solid ${liked ? "oklch(0.62 0.24 25 / 0.5)" : "oklch(0.22 0.02 260)"}`,
            color: liked ? "oklch(0.62 0.24 25)" : "oklch(0.50 0.02 60)",
          }}
          aria-label="讚好"
        >
          <Heart size={12} fill={liked ? "currentColor" : "none"} />
          {localLikes}
        </button>
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

  const submitMutation = trpc.submission.submit.useMutation({
    onSuccess: () => {
      toast.success("投稿成功！", {
        description: "感謝你嘅分享，我哋會盡快審核，精選投稿將會喺首頁展示 🎉",
      });
      setNickname("");
      setCategory("relationship");
      setContent("");
      setIsAnonymous(false);
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg"
        style={{ background: "oklch(0.10 0.015 260)", border: "1px solid oklch(0.22 0.025 260)" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg" style={{ color: "oklch(0.92 0.01 60)" }}>
            <MessageSquareHeart size={20} style={{ color: "oklch(0.78 0.16 75)" }} />
            向路邊電台投稿
          </DialogTitle>
          <DialogDescription style={{ color: "oklch(0.55 0.02 60)" }}>
            分享你嘅故事、問題或心底話，精選投稿將展示喺首頁，讓更多人知道你唔孤單。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Category */}
          <div className="space-y-1.5">
            <Label style={{ color: "oklch(0.75 0.01 60)" }}>投稿類別</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger style={{ background: "oklch(0.14 0.018 260)", border: "1px solid oklch(0.25 0.025 260)", color: "oklch(0.85 0.01 60)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: "oklch(0.12 0.018 260)", border: "1px solid oklch(0.22 0.025 260)" }}>
                {(Object.entries(CATEGORY_LABELS) as [Category, typeof CATEGORY_LABELS[Category]][]).map(([val, meta]) => (
                  <SelectItem key={val} value={val} style={{ color: "oklch(0.85 0.01 60)" }}>
                    {meta.emoji} {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label style={{ color: "oklch(0.75 0.01 60)" }}>
              你嘅故事 / 問題
              <span className="ml-1 text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>
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
                background: "oklch(0.14 0.018 260)",
                border: "1px solid oklch(0.25 0.025 260)",
                color: "oklch(0.85 0.01 60)",
              }}
            />
          </div>

          {/* Nickname + Anonymous toggle */}
          <div className="space-y-1.5">
            <Label style={{ color: "oklch(0.75 0.01 60)" }}>你嘅名字（可用花名）</Label>
            <div className="flex gap-2">
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 50))}
                placeholder={isAnonymous ? "匿名投稿" : "例如：小明、Coco…"}
                disabled={isAnonymous}
                style={{
                  background: "oklch(0.14 0.018 260)",
                  border: "1px solid oklch(0.25 0.025 260)",
                  color: "oklch(0.85 0.01 60)",
                  opacity: isAnonymous ? 0.5 : 1,
                }}
              />
              <button
                type="button"
                onClick={() => setIsAnonymous((v) => !v)}
                className="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: isAnonymous ? "oklch(0.55 0.20 250 / 0.2)" : "oklch(0.16 0.02 260)",
                  border: `1px solid ${isAnonymous ? "oklch(0.55 0.20 250 / 0.5)" : "oklch(0.25 0.025 260)"}`,
                  color: isAnonymous ? "oklch(0.75 0.15 250)" : "oklch(0.55 0.02 60)",
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
              style={{ background: "transparent", border: "1px solid oklch(0.25 0.025 260)", color: "oklch(0.60 0.02 60)" }}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="flex-1 font-bold"
              style={{
                background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))",
                color: "white",
                border: "none",
              }}
            >
              {submitMutation.isPending ? (
                <><Loader2 size={14} className="animate-spin mr-1" /> 提交中…</>
              ) : (
                "立即投稿 ✉️"
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
        background: "linear-gradient(180deg, oklch(0.08 0.01 260) 0%, oklch(0.10 0.015 260) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div
              className="text-xs font-bold tracking-widest mb-2"
              style={{ color: "oklch(0.78 0.16 75)" }}
            >
              READER STORIES
            </div>
            <h2
              className="text-2xl md:text-3xl font-black mb-1"
              style={{ color: "oklch(0.92 0.01 60)" }}
            >
              讀者投稿
            </h2>
            <p className="text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>
              每一個故事都值得被聆聽，你唔孤單
            </p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105 self-start sm:self-auto"
            style={{
              background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))",
              color: "white",
              boxShadow: "0 4px 16px oklch(0.60 0.22 25 / 0.35)",
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
                style={{ background: "oklch(0.11 0.015 260)", height: "200px" }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty state — encourage first submission */
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              background: "oklch(0.11 0.015 260)",
              border: "2px dashed oklch(0.22 0.025 260)",
            }}
          >
            <div className="text-4xl mb-3">✉️</div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: "oklch(0.88 0.01 60)" }}
            >
              成為第一位投稿嘅讀者！
            </h3>
            <p className="text-sm mb-5" style={{ color: "oklch(0.50 0.02 60)" }}>
              分享你嘅感情故事、玄學奇遇或心底話，精選投稿將展示喺呢度
            </p>
            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))",
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
                background: "oklch(0.11 0.015 260)",
                border: "1px solid oklch(0.20 0.02 260)",
              }}
            >
              <div>
                <div
                  className="text-sm font-bold mb-0.5"
                  style={{ color: "oklch(0.88 0.01 60)" }}
                >
                  你都有故事想分享？
                </div>
                <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>
                  每週精選投稿，有機會喺節目中被討論
                </div>
              </div>
              <button
                onClick={() => setDialogOpen(true)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                style={{
                  background: "oklch(0.78 0.16 75 / 0.15)",
                  border: "1px solid oklch(0.78 0.16 75 / 0.4)",
                  color: "oklch(0.78 0.16 75)",
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
