import { useEffect } from "react";
import { Link } from "wouter";

const LEGACY_MASTER_IDS = new Set(["master-1", "master-2", "master-3", "master-4"]);

interface Props {
  id: string;
}

function setNoindexRobots() {
  let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  const original = robots?.content;
  if (!robots) {
    robots = document.createElement("meta");
    robots.name = "robots";
    document.head.appendChild(robots);
  }
  robots.content = "noindex, nofollow";

  return () => {
    if (!robots) return;
    if (original === undefined) robots.remove();
    else robots.content = original;
  };
}

export default function MysticMasterDetail({ id }: Props) {
  const isLegacyPlaceholder = LEGACY_MASTER_IDS.has(id);

  useEffect(() => {
    if (!isLegacyPlaceholder) return;
    document.title = "師傅陣容準備中｜路邊玄學堂";
    return setNoindexRobots();
  }, [isLegacyPlaceholder]);

  if (!isLegacyPlaceholder) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔮</div>
          <p style={{ color: "var(--text-2)" }}>找不到此師傅頁面</p>
          <Link href="/mystic/masters">
            <span className="text-sm mt-4 inline-block cursor-pointer" style={{ color: "var(--gold)" }}>← 返回玄學堂</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-5xl mb-6" aria-hidden="true">🔮</div>
        <p className="text-xs font-bold tracking-[0.22em] mb-3" style={{ color: "var(--gold)" }}>COMING SOON</p>
        <h1 className="text-3xl font-black mb-4" style={{ color: "var(--text)" }}>師傅陣容準備中</h1>
        <p className="text-sm leading-7 max-w-xl mx-auto" style={{ color: "var(--text-2)" }}>
          路邊玄學堂正整理合作師傅資料。待完成簽約及資料核對後，會以真實資料重新上線。
        </p>
        <Link href="/mystic">
          <span className="inline-block mt-8 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer" style={{ background: "var(--bg-card)", color: "var(--text)" }}>
            返回路邊玄學堂
          </span>
        </Link>
      </div>
    </main>
  );
}
