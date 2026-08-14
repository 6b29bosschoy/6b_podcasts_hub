import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

type SuccessKind = "booking" | "contact" | "partnership" | "treehole";

const COPY: Record<SuccessKind, { title: string; body: string; returnHref: string; returnLabel: string }> = {
  booking: {
    title: "預約查詢已提交",
    body: "我哋已收到你嘅資料，會按你揀嘅方式聯絡你確認服務安排。",
    returnHref: "/booking",
    returnLabel: "返回預約頁",
  },
  contact: {
    title: "訊息已發送",
    body: "多謝你嘅查詢。我哋會喺兩個工作天內回覆。",
    returnHref: "/contact",
    returnLabel: "返回聯絡頁",
  },
  partnership: {
    title: "合作意向已提交",
    body: "多謝你有興趣同我哋合作。我哋會喺一至兩個工作天內跟進。",
    returnHref: "/partnership",
    returnLabel: "返回合作頁",
  },
  treehole: {
    title: "你嘅心事已經投入樹窿",
    body: "多謝你信任我哋。投稿會以匿名方式整理，並按你揀嘅方式處理。",
    returnHref: "/treehole",
    returnLabel: "再投一個故事",
  },
};

export default function FormSuccess({ kind }: { kind: SuccessKind }) {
  const copy = COPY[kind];
  return (
    <main className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)" }}>
      <section className="container flex min-h-[55vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl p-8 text-center md:p-12" style={{ background: "var(--bg-raise)", border: "1px solid var(--line)" }}>
          <CheckCircle2 size={56} className="mx-auto" style={{ color: "var(--gold)" }} aria-hidden="true" />
          <h1 className="mt-5 text-3xl font-bold" style={{ color: "var(--text)", fontFamily: "'Noto Serif TC', serif" }}>{copy.title}</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7" style={{ color: "var(--text-3)" }}>{copy.body}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {kind === "treehole" && <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer" className="rounded-xl px-5 py-3 text-sm font-bold" style={{ background: "var(--red)", color: "white" }}>訂閱 YouTube</a>}
            <Link href={copy.returnHref} className="rounded-xl px-5 py-3 text-sm font-bold" style={{ background: "var(--gold)", color: "var(--bg)" }}>{copy.returnLabel}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
