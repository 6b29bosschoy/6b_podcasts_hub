import { useState } from "react";
import { MessageCircle, Send, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CommentsProps {
  postSlug: string;
}

function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "剛剛";
  if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} 天前`;
  return d.toLocaleDateString("zh-HK", { year: "numeric", month: "short", day: "numeric" });
}

export default function Comments({ postSlug }: CommentsProps) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.comment.list.useQuery({ postSlug });

  const submitMutation = trpc.comment.submit.useMutation({
    onSuccess: () => {
      setAuthorName("");
      setContent("");
      toast.success("留言已發送！", { description: "感謝你的留言，已即時顯示。" });
      utils.comment.list.invalidate({ postSlug });
    },
    onError: (err) => {
      toast.error("發送失敗", { description: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;
    submitMutation.mutate({ postSlug, authorName: authorName.trim(), content: content.trim() });
  };

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <section className="mt-12 border-t border-white/10 pt-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle className="w-5 h-5 text-orange-400" />
        <h3 className="text-xl font-bold text-white">
          讀者留言
          {total > 0 && (
            <span className="ml-2 text-sm font-normal text-white/50">（{total} 則）</span>
          )}
        </h3>
      </div>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="comment-name" className="text-white/70 text-sm">你的名字</Label>
          <Input
            id="comment-name"
            placeholder="匿名讀者"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={100}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-orange-400/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comment-content" className="text-white/70 text-sm">留言內容</Label>
          <Textarea
            id="comment-content"
            placeholder="分享你對這篇文章的想法…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            rows={4}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-orange-400/50 resize-none"
          />
          <p className="text-right text-xs text-white/30">{content.length} / 1000</p>
        </div>
        <Button
          type="submit"
          disabled={submitMutation.isPending || !authorName.trim() || !content.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
        >
          <Send className="w-4 h-4" />
          {submitMutation.isPending ? "發送中…" : "發表留言"}
        </Button>
      </form>

      {/* Comment List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white/5 rounded-xl h-24" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-white/40">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">還沒有留言，成為第一個留言的讀者！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((comment) => (
            <div
              key={comment.id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{comment.authorName}</p>
                  <p className="text-xs text-white/40">{timeAgo(comment.createdAt)}</p>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
