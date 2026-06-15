import { useEffect, useState } from "react";
import { Link } from "wouter";
import { MYSTIC_ARTICLES, ARTICLE_CATEGORIES } from "@/data/mysticData";

export default function MysticArticles() {
  const [category, setCategory] = useState("全部");

  useEffect(() => {
    document.title = "玄學文章專區｜路邊玄學堂";
  }, []);

  const filtered = category === "全部" ? MYSTIC_ARTICLES : MYSTIC_ARTICLES.filter((a) => a.category === category);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "oklch(0.08 0.02 270)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.75 0.20 290)" }}>ARTICLES</p>
          <h1 className="text-3xl font-black" style={{ color: "oklch(0.92 0.05 80)" }}>玄學文章專區</h1>
          <p className="mt-2 text-sm" style={{ color: "oklch(0.60 0.03 250)" }}>深度玄學知識文章，由各派別師傅親筆撰寫</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {ARTICLE_CATEGORIES.map((c) => (
            <button
              key={c}
              className="px-3 py-1.5 rounded-full text-sm border transition-all"
              style={{
                background: category === c ? "oklch(0.55 0.22 290)" : "oklch(0.11 0.03 270)",
                borderColor: category === c ? "oklch(0.55 0.22 290)" : "oklch(0.55 0.22 290 / 0.3)",
                color: category === c ? "oklch(0.95 0.02 80)" : "oklch(0.70 0.03 250)",
              }}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((a) => (
            <div key={a.id} className="p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.55 0.22 290 / 0.2)", color: "oklch(0.75 0.20 290)" }}>{a.category}</span>
                {a.isPremium && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.65 0.20 60 / 0.2)", color: "oklch(0.65 0.20 60)" }}>
                    👑 會員
                  </span>
                )}
              </div>
              <h3 className="font-black mb-2" style={{ color: "oklch(0.88 0.03 80)" }}>{a.title}</h3>
              <p className="text-sm line-clamp-2 mb-3" style={{ color: "oklch(0.60 0.03 250)" }}>{a.excerpt}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {a.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.55 0.22 290 / 0.1)", color: "oklch(0.60 0.10 290)" }}>#{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs pt-3 border-t" style={{ borderColor: "oklch(0.55 0.22 290 / 0.15)", color: "oklch(0.50 0.03 250)" }}>
                <Link href={`/mystic/masters/${a.masterId}`}>
                  <span className="cursor-pointer hover:underline" style={{ color: "oklch(0.65 0.15 290)" }}>{a.masterName}</span>
                </Link>
                <span>{a.readTime} 分鐘 · {(a.views / 1000).toFixed(1)}K 次</span>
              </div>
              {a.isPremium && (
                <div className="mt-3 p-3 rounded-lg text-center" style={{ background: "oklch(0.65 0.20 60 / 0.1)", borderColor: "oklch(0.65 0.20 60 / 0.3)" }}>
                  <p className="text-xs mb-1" style={{ color: "oklch(0.65 0.20 60)" }}>🔒 此文章需要 Premium 會員才可閱讀</p>
                  <Link href="/mystic/pricing">
                    <span className="text-xs font-bold cursor-pointer hover:underline" style={{ color: "oklch(0.65 0.20 60)" }}>升級 Premium →</span>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
