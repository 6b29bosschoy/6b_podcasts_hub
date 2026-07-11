import { useEffect, useState } from "react";
import { Link } from "wouter";
import { MYSTIC_MASTERS } from "@/data/mysticData";

export default function MysticMasters() {
  const [filter, setFilter] = useState<"all" | "chinese" | "western">("all");

  useEffect(() => {
    document.title = "玄學家列表｜路邊玄學堂";
  }, []);

  const filtered = MYSTIC_MASTERS.filter((m) => filter === "all" || m.tradition === filter);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--gold)" }}>OUR MASTERS</p>
          <h1 className="text-3xl font-black" style={{ color: "var(--text)" }}>精選玄學家</h1>
          <p className="mt-3 text-sm" style={{ color: "var(--text-2)" }}>
            集合中西玄學各派別專家，為你提供最專業的流年分析
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 justify-center mb-8">
          {[
            { val: "all", label: "全部" },
            { val: "chinese", label: "🐉 中國玄學" },
            { val: "western", label: "⭐ 西方玄學" },
          ].map((f) => (
            <button
              key={f.val}
              className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: filter === f.val ? "var(--gold)" : "var(--bg-card)",
                borderColor: filter === f.val ? "var(--gold)" : "rgba(201,164,92,0.3)",
                color: filter === f.val ? "var(--text)" : "var(--text-2)",
              }}
              onClick={() => setFilter(f.val as typeof filter)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Masters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((m) => (
            <Link key={m.id} href={`/mystic/masters/${m.id}`}>
              <div
                className="rounded-2xl p-6 border cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "rgba(201,164,92,0.2)",
                  boxShadow: "0 0 0 rgba(201,164,92,0.0)",
                }}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{m.avatar}</div>
                  <h3 className="font-black text-lg" style={{ color: "var(--text)" }}>{m.name}</h3>
                  <p className="text-sm mt-1" style={{ color: "var(--gold)" }}>{m.title}</p>
                </div>

                <p className="text-xs mb-4 line-clamp-3" style={{ color: "var(--text-2)" }}>{m.bio}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {m.specialty.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(201,164,92,0.15)", color: "var(--gold)" }}>{s}</span>
                  ))}
                </div>

                <div className="text-xs pt-3 border-t" style={{ borderColor: "rgba(201,164,92,0.15)" }}>
                  {m.rayEndorsement && !m.rayEndorsement.includes('待 Ray') ? (
                    <p className="italic line-clamp-2" style={{ color: "var(--gold)", fontFamily: "'Noto Serif TC', serif" }}>「{m.rayEndorsement}」</p>
                  ) : (
                    <p style={{ color: "var(--text-3)" }}>Ray Choy 推薦師傅</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>想預約玄學家進行深度分析？</p>
          <Link href="/booking">
            <span
              className="inline-block px-6 py-3 rounded-xl font-bold cursor-pointer transition-all hover:scale-105"
              style={{ background: "var(--bg-card)", color: "var(--text)" }}
            >
              🔮 預約玄學諮詢
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
