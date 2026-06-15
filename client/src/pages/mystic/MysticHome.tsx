import { useEffect } from "react";
import { Link } from "wouter";
import { MYSTIC_MASTERS, MYSTIC_VIDEOS, MYSTIC_ARTICLES, CHINESE_METHODS, WESTERN_METHODS } from "@/data/mysticData";

export default function MysticHome() {
  useEffect(() => {
    document.title = "路邊玄學堂｜中西玄學一站式分析平台";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "路邊玄學堂 — 結合紫微斗數、奇門遁甲、星座占星、生命靈數等中西玄學派別，為你分析事業、財運、感情同人生方向。");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0.02 270)" }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "oklch(0.55 0.22 290)" }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: "oklch(0.65 0.20 330)" }} />
          {/* Decorative symbols */}
          <div className="absolute top-24 right-12 text-6xl opacity-5">☯</div>
          <div className="absolute top-40 left-8 text-4xl opacity-5">✦</div>
          <div className="absolute bottom-20 right-20 text-5xl opacity-5">🌙</div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block text-xs font-bold tracking-[0.3em] px-4 py-1.5 rounded-full mb-6 border" style={{ color: "oklch(0.75 0.20 290)", borderColor: "oklch(0.55 0.22 290 / 0.4)", background: "oklch(0.55 0.22 290 / 0.1)" }}>
            中西玄學，一站式拆解你嘅流年方向
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight" style={{ color: "oklch(0.92 0.05 80)" }}>
            輸入出生資料，<br />
            <span style={{ color: "oklch(0.75 0.20 290)" }}>即睇你嘅流年玄學報告</span>
          </h1>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: "oklch(0.65 0.03 250)" }}>
            結合紫微斗數、奇門遁甲、星座占星、生命靈數等中西玄學派別，為你分析事業、財運、感情同人生方向。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mystic/analysis">
              <span
                className="inline-block px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg, oklch(0.45 0.22 290), oklch(0.55 0.22 310))",
                  color: "oklch(0.95 0.02 80)",
                  boxShadow: "0 0 30px oklch(0.55 0.22 290 / 0.3)",
                }}
              >
                🔮 立即開始分析
              </span>
            </Link>
            <Link href="/mystic/videos">
              <span
                className="inline-block px-8 py-4 rounded-xl font-bold text-lg cursor-pointer border transition-all hover:scale-105"
                style={{
                  borderColor: "oklch(0.55 0.22 290 / 0.5)",
                  color: "oklch(0.75 0.20 290)",
                  background: "oklch(0.55 0.22 290 / 0.08)",
                }}
              >
                ▶ 睇玄學家影片
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Mystic Categories */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.75 0.20 290)" }}>CHOOSE YOUR PATH</p>
            <h2 className="text-2xl md:text-3xl font-black" style={{ color: "oklch(0.92 0.05 80)" }}>選擇你的玄學派別</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chinese */}
            <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "oklch(0.80 0.15 60)" }}>🐉 中國玄學</h3>
              <div className="grid grid-cols-2 gap-3">
                {CHINESE_METHODS.map((m) => (
                  <Link key={m.id} href={`/mystic/analysis?method=${m.id}`}>
                    <div className="p-3 rounded-xl cursor-pointer transition-all hover:scale-105 border" style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.15)" }}>
                      <div className="text-2xl mb-1">{m.icon}</div>
                      <div className="text-sm font-semibold" style={{ color: "oklch(0.85 0.05 80)" }}>{m.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.03 250)" }}>{m.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {/* Western */}
            <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "oklch(0.75 0.20 290)" }}>⭐ 西方玄學</h3>
              <div className="grid grid-cols-2 gap-3">
                {WESTERN_METHODS.map((m) => (
                  <Link key={m.id} href={`/mystic/analysis?method=${m.id}`}>
                    <div className="p-3 rounded-xl cursor-pointer transition-all hover:scale-105 border" style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.15)" }}>
                      <div className="text-2xl mb-1">{m.icon}</div>
                      <div className="text-sm font-semibold" style={{ color: "oklch(0.85 0.05 80)" }}>{m.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.03 250)" }}>{m.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Videos */}
      <section className="py-16 px-4" style={{ background: "oklch(0.09 0.025 270)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest mb-1" style={{ color: "oklch(0.75 0.20 290)" }}>LATEST VIDEOS</p>
              <h2 className="text-2xl font-black" style={{ color: "oklch(0.92 0.05 80)" }}>最新影片</h2>
            </div>
            <Link href="/mystic/videos">
              <span className="text-sm cursor-pointer hover:underline" style={{ color: "oklch(0.75 0.20 290)" }}>查看全部 →</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MYSTIC_VIDEOS.slice(0, 4).map((v) => (
              <div key={v.id} className="rounded-xl overflow-hidden border transition-all hover:scale-105 cursor-pointer" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
                <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center">
                  <span className="text-4xl opacity-40">🎬</span>
                  {v.isPremium && (
                    <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.65 0.20 60)", color: "oklch(0.10 0.02 60)" }}>
                      👑 VIP
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "oklch(0.05 0.02 270 / 0.8)", color: "oklch(0.80 0.03 250)" }}>
                    {v.duration}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs mb-1 font-semibold" style={{ color: "oklch(0.75 0.20 290)" }}>{v.category}</div>
                  <h3 className="text-sm font-bold leading-snug line-clamp-2 mb-2" style={{ color: "oklch(0.88 0.03 80)" }}>{v.title}</h3>
                  <div className="flex items-center justify-between text-xs" style={{ color: "oklch(0.50 0.03 250)" }}>
                    <span>{v.masterName}</span>
                    <span>{(v.views / 1000).toFixed(1)}K 次</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest mb-1" style={{ color: "oklch(0.75 0.20 290)" }}>LATEST ARTICLES</p>
              <h2 className="text-2xl font-black" style={{ color: "oklch(0.92 0.05 80)" }}>最新文章</h2>
            </div>
            <Link href="/mystic/articles">
              <span className="text-sm cursor-pointer hover:underline" style={{ color: "oklch(0.75 0.20 290)" }}>查看全部 →</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MYSTIC_ARTICLES.slice(0, 4).map((a) => (
              <div key={a.id} className="p-5 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.55 0.22 290 / 0.2)", color: "oklch(0.75 0.20 290)" }}>{a.category}</span>
                  {a.isPremium && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.65 0.20 60 / 0.2)", color: "oklch(0.65 0.20 60)" }}>👑 會員</span>}
                </div>
                <h3 className="font-bold mb-2" style={{ color: "oklch(0.88 0.03 80)" }}>{a.title}</h3>
                <p className="text-sm line-clamp-2 mb-3" style={{ color: "oklch(0.60 0.03 250)" }}>{a.excerpt}</p>
                <div className="flex items-center justify-between text-xs" style={{ color: "oklch(0.50 0.03 250)" }}>
                  <span>{a.masterName}</span>
                  <span>{a.readTime} 分鐘閱讀 · {(a.views / 1000).toFixed(1)}K 次</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Masters */}
      <section className="py-16 px-4" style={{ background: "oklch(0.09 0.025 270)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.75 0.20 290)" }}>OUR MASTERS</p>
            <h2 className="text-2xl md:text-3xl font-black" style={{ color: "oklch(0.92 0.05 80)" }}>精選玄學家</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MYSTIC_MASTERS.map((m) => (
              <Link key={m.id} href={`/mystic/masters/${m.id}`}>
                <div className="p-5 rounded-xl border text-center cursor-pointer transition-all hover:scale-105" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
                  <div className="text-5xl mb-3">{m.avatar}</div>
                  <h3 className="font-bold mb-1" style={{ color: "oklch(0.88 0.03 80)" }}>{m.name}</h3>
                  <p className="text-xs mb-3" style={{ color: "oklch(0.75 0.20 290)" }}>{m.title}</p>
                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    {m.specialty.slice(0, 2).map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.55 0.22 290 / 0.15)", color: "oklch(0.70 0.15 290)" }}>{s}</span>
                    ))}
                  </div>
                  <div className="text-xs" style={{ color: "oklch(0.55 0.03 250)" }}>
                    ⭐ {m.rating} · {m.reviewCount} 評價
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-2xl p-10 border relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, oklch(0.12 0.05 290), oklch(0.10 0.04 310))", borderColor: "oklch(0.55 0.22 290 / 0.3)" }}
          >
            <div className="absolute inset-0 opacity-5 text-9xl flex items-center justify-center pointer-events-none">🔮</div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: "oklch(0.92 0.05 80)" }}>
                解鎖完整玄學報告
              </h2>
              <p className="mb-6" style={{ color: "oklch(0.65 0.03 250)" }}>
                你嘅完整 12 個月流年分析已準備好，升級 Premium 即可解鎖完整報告。
              </p>
              <Link href="/mystic/pricing">
                <span
                  className="inline-block px-8 py-3 rounded-xl font-bold cursor-pointer transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.65 0.20 60), oklch(0.70 0.18 50))",
                    color: "oklch(0.10 0.02 60)",
                  }}
                >
                  👑 升級 Premium
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t text-center" style={{ borderColor: "oklch(0.55 0.22 290 / 0.15)" }}>
        <p className="text-xs" style={{ color: "oklch(0.40 0.02 250)" }}>
          © 2024 路邊玄學堂 · 本平台內容只供娛樂、文化及參考用途，並不構成任何投資、醫療、法律或人生重大決策建議。
        </p>
      </footer>
    </div>
  );
}
