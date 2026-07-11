import { useEffect } from "react";
import { Link } from "wouter";
import { MYSTIC_MASTERS, MYSTIC_VIDEOS, MYSTIC_ARTICLES } from "@/data/mysticData";
import { JsonLd, buildPersonSchema, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";

interface Props {
  id: string;
}

export default function MysticMasterDetail({ id }: Props) {
  const master = MYSTIC_MASTERS.find((m) => m.id === id);
  const videos = MYSTIC_VIDEOS.filter((v) => v.masterId === id);
  const articles = MYSTIC_ARTICLES.filter((a) => a.masterId === id);

  useEffect(() => {
    if (master) document.title = `${master.name}｜路邊玄學堂`;
  }, [master]);

  if (!master) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔮</div>
          <p style={{ color: "var(--text-2)" }}>找不到此玄學家</p>
          <Link href="/mystic/masters">
            <span className="text-sm mt-4 inline-block cursor-pointer" style={{ color: "var(--gold)" }}>← 返回玄學家列表</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "var(--bg)" }}>
      <JsonLd
        id={`master-${master.id}-schema`}
        data={[
          buildPersonSchema({
            id: master.id,
            name: master.name,
            title: master.title,
            specialties: master.specialty,
            description: master.bio,
          }),
          buildBreadcrumbSchema([
            { name: "首頁", url: SITE_URL },
            { name: "路邊玄學堂", url: `${SITE_URL}/mystic` },
            { name: "玄學家列表", url: `${SITE_URL}/mystic/masters` },
            { name: master.name, url: `${SITE_URL}/mystic/masters/${master.id}` },
          ]),
        ]}
      />
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link href="/mystic/masters">
          <span className="text-sm mb-6 inline-block cursor-pointer" style={{ color: "var(--gold)" }}>← 返回玄學家列表</span>
        </Link>

        {/* Profile */}
        <div className="rounded-2xl p-8 border mb-6" style={{ background: "var(--bg-card)", borderColor: "rgba(201,164,92,0.2)" }}>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="text-7xl flex-shrink-0">{master.avatar}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text)" }}>{master.name}</h1>
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--gold)" }}>{master.title}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {master.specialty.map((s) => (
                  <span key={s} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(201,164,92,0.15)", color: "var(--gold)" }}>{s}</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-2)" }}>{master.bio}</p>
              <div className="flex gap-6 text-sm" style={{ color: "var(--text-2)" }}>
                <span>⭐ {master.rating} 評分</span>
                <span>{master.reviewCount} 評價</span>
                <span>{master.videoCount} 影片</span>
                <span>{master.articleCount} 文章</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/mystic/analysis">
              <span
                className="inline-block px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:scale-105"
                style={{ background: "var(--bg-card)", color: "var(--text)" }}
              >
                🔮 立即分析
              </span>
            </Link>
            <Link href="/booking">
              <span
                className="inline-block px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer border transition-all hover:scale-105"
                style={{ borderColor: "rgba(201,164,92,0.4)", color: "var(--gold)" }}
              >
                📅 預約諮詢
              </span>
            </Link>
          </div>
        </div>

        {/* Videos */}
        {videos.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-black mb-4" style={{ color: "var(--text)" }}>🎬 相關影片</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map((v) => (
                <div key={v.id} className="rounded-xl overflow-hidden border" style={{ background: "var(--bg-card)", borderColor: "rgba(201,164,92,0.2)" }}>
                  <div className="relative aspect-video bg-gradient-to-br flex items-center justify-center text-4xl" style={{ background: "var(--bg-card)" }}>
                    🎬
                    {v.isPremium && (
                      <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--gold)", color: "var(--bg-card)" }}>👑 VIP</div>
                    )}
                    <div className="absolute bottom-2 right-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(13,12,10,0.8)", color: "var(--text)" }}>{v.duration}</div>
                  </div>
                  <div className="p-4">
                    <span className="text-xs mb-1 inline-block" style={{ color: "var(--gold)" }}>{v.category}</span>
                    <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>{v.title}</h3>
                    <p className="text-xs mt-1" style={{ color: "var(--text-2)" }}>{(v.views / 1000).toFixed(1)}K 次觀看</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles */}
        {articles.length > 0 && (
          <div>
            <h2 className="text-lg font-black mb-4" style={{ color: "var(--text)" }}>📝 相關文章</h2>
            <div className="space-y-3">
              {articles.map((a) => (
                <div key={a.id} className="p-5 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "rgba(201,164,92,0.2)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(201,164,92,0.2)", color: "var(--gold)" }}>{a.category}</span>
                    {a.isPremium && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(201,164,92,0.2)", color: "var(--gold)" }}>👑 會員</span>}
                  </div>
                  <h3 className="font-bold mb-1" style={{ color: "var(--text)" }}>{a.title}</h3>
                  <p className="text-sm line-clamp-2" style={{ color: "var(--text-2)" }}>{a.excerpt}</p>
                  <p className="text-xs mt-2" style={{ color: "var(--text-2)" }}>{a.readTime} 分鐘閱讀 · {(a.views / 1000).toFixed(1)}K 次</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
