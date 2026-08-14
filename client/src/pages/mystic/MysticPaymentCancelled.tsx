import { Link } from "wouter";
import { CircleX } from "lucide-react";

export default function MysticPaymentCancelled() {
  return (
    <div className="min-h-screen px-4 pb-16 pt-28" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-lg rounded-2xl border p-8 text-center" style={{ background: "var(--bg-card)", borderColor: "rgba(201,164,92,0.45)" }}>
        <CircleX className="mx-auto mb-5 h-12 w-12" style={{ color: "var(--gold)" }} aria-hidden="true" />
        <p className="mb-2 text-xs font-black tracking-[0.22em]" style={{ color: "var(--gold)" }}>PAYMENT CANCELLED</p>
        <h1 className="mb-3 text-2xl font-black" style={{ color: "var(--text)" }}>你未有完成付款</h1>
        <p className="mb-6 text-sm leading-7" style={{ color: "var(--text-2)" }}>
          今次未有建立收費。你可以返回比較方案，準備好先再開始 Stripe 結帳；如對會員內容有問題，可以先 WhatsApp 查詢。
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/mystic/pricing" className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold" style={{ background: "var(--gold)", color: "var(--bg)" }}>
            返回會員方案
          </Link>
          <a href="https://wa.me/85298729990?text=你好，我想了解會員方案" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-xl border px-5 py-3 text-sm font-bold" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
            WhatsApp 查詢
          </a>
        </div>
      </div>
    </div>
  );
}
