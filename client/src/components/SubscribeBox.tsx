import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function SubscribeBox() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const subscribeMutation = trpc.subscription.subscribe.useMutation({
    onSuccess: () => {
      toast.success("訂閱成功！感謝你的支持，我們會定期發送獨家內容給你。");
      setEmail("");
      setName("");
    },
    onError: (err) => {
      toast.error(err.message || "訂閱失敗，請稍後再試。");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email, name: name || undefined });
  };

  return (
    <section className="py-16" style={{ background: "linear-gradient(135deg, var(--bg-card), var(--bg-card))" }}>
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "var(--red)" }}>
            電子報訂閱
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: "var(--text)" }}>
            訂閱獨家內容
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-3)" }}>
            定期獲取節目預告、玄學小貼士及嘉賓獨家心得，成為「路邊人」大家庭的一份子。
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="你的名字（選填）"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
              style={{ background: "var(--line)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
            <input
              type="email"
              placeholder="你的電郵地址 *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
              style={{ background: "var(--line)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
            <button
              type="submit"
              disabled={subscribeMutation.isPending}
              className="px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "var(--text)" }}
            >
              {subscribeMutation.isPending ? "訂閱中..." : "立即訂閱"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
