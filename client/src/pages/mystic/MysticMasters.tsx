import { useEffect } from "react";
import { Link } from "wouter";

export default function MysticMasters() {
  useEffect(() => {
    document.title = "師傅陣容準備中｜路邊玄學堂";
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-5xl mb-6" aria-hidden="true">🔮</div>
        <p className="text-xs font-bold tracking-[0.22em] mb-3" style={{ color: "var(--gold)" }}>COMING SOON</p>
        <h1 className="text-3xl font-black mb-4" style={{ color: "var(--text)" }}>師傅陣容準備中</h1>
        <p className="text-sm leading-7 max-w-xl mx-auto" style={{ color: "var(--text-2)" }}>
          合作師傅資料會在完成簽約與核對後才公開。現階段可以先瀏覽玄學內容，或按需要了解預約安排。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/mystic">
            <span className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer" style={{ background: "var(--bg-card)", color: "var(--text)" }}>返回玄學堂</span>
          </Link>
          <Link href="/booking">
            <span className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer border" style={{ borderColor: "rgba(201,164,92,0.4)", color: "var(--gold)" }}>了解預約安排</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
