import { useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function MysticPaymentSuccess() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id") ?? "";
  const requestedPlan = params.get("plan");
  const plan = requestedPlan === "premium" || requestedPlan === "vip" ? requestedPlan : null;
  const isTestSession = sessionId.startsWith("cs_test_");

  useEffect(() => {
    if (!plan || !isTestSession) return;
    const storageKey = `stripe-test-purchase-${sessionId}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    trackEvent("purchase", { plan, payment_provider: "stripe", payment_environment: "test" });
    window.sessionStorage.setItem(storageKey, "tracked");
  }, [isTestSession, plan, sessionId]);

  return (
    <div className="min-h-screen px-4 pb-16 pt-28" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-lg rounded-2xl border p-8 text-center" style={{ background: "var(--bg-card)", borderColor: "var(--gold)" }}>
        <CheckCircle2 className="mx-auto mb-5 h-12 w-12" style={{ color: "var(--gold)" }} aria-hidden="true" />
        <p className="mb-2 text-xs font-black tracking-[0.22em]" style={{ color: "var(--gold)" }}>STRIPE TEST MODE</p>
        <h1 className="mb-3 text-2xl font-black" style={{ color: "var(--text)" }}>測試付款已完成</h1>
        <p className="mb-6 text-sm leading-7" style={{ color: "var(--text-2)" }}>
          呢個係 Stripe 沙盒測試流程，唔會向真實客戶收費。正式模式開通後，付款成功會由 webhook 更新會員權益。
        </p>
        <Link href="/mystic/pricing" className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold" style={{ background: "var(--gold)", color: "var(--bg)" }}>
          返回會員方案
        </Link>
      </div>
    </div>
  );
}
