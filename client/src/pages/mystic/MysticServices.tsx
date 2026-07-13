import { Link } from "wouter";
import { Sparkles, Calendar, Star, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const SERVICES = [
  {
    icon: "🔮",
    title: "八字命盤分析",
    desc: "依據出生年月日時，推算四柱命盤、十神關係、大運流年，深入了解命運格局。",
    price: "HK$800 起",
    href: "/mystic/bazi",
    tag: "中式玄學",
  },
  {
    icon: "🌟",
    title: "紫微斗數",
    desc: "以星曜排盤，分析命宮、財帛、夫妻、事業等十二宮位，洞察人生各方面運勢。",
    price: "HK$900 起",
    href: "/booking",
    tag: "中式玄學",
  },
  {
    icon: "🏠",
    title: "風水勘察",
    desc: "住宅或商業場所風水分析，改善氣場佈局，提升財運、健康及人際關係。",
    price: "HK$1,500 起",
    href: "/booking",
    tag: "中式玄學",
  },
  {
    icon: "🃏",
    title: "塔羅占卜",
    desc: "透過塔羅牌解讀當前能量，針對感情、事業、人際等問題提供指引。",
    price: "HK$500 起",
    href: "/mystic/analysis",
    tag: "西方玄學",
  },
  {
    icon: "⭐",
    title: "星座占星",
    desc: "本命盤及流年分析，了解星座能量對個人性格、關係及事業的影響。",
    price: "HK$600 起",
    href: "/mystic/analysis",
    tag: "西方玄學",
  },
  {
    icon: "🔢",
    title: "生命靈數",
    desc: "以出生日期計算靈數，分析靈魂使命、天賦才能及人生課題。",
    price: "HK$400 起",
    href: "/mystic/analysis",
    tag: "西方玄學",
  },
  {
    icon: "📖",
    title: "阿卡西紀錄",
    desc: "深入靈魂層面，探索前世今生、靈魂伴侶及靈魂年齡的神秘解讀。",
    price: "HK$700 起",
    href: "/mystic/analysis",
    tag: "靈性探索",
  },
];

export default function MysticServices() {
  useSEO({
    title: "玄學服務｜路邊玄學堂—八字命盤、風水勘察、塔羅占卜、占星服務",
    description: "路邊玄學堂提供香港專業玄學服務：八字命盤、紫微斗數、風水勘察、塔羅占卜、星座占星、生命靈數及阿卡西紀錄。立即預約合適的玄學師傅。",
    keywords: "玄學服務,香港玄學,八字命盤,風水勘察,塔羅占卜,占星服務,生命靈數,阿卡西紀錄",
    ogTitle: "玄學服務｜路邊玄學堂—八字命盤、風水勘察、塔羅占卜、占星服務",
    ogDescription: "香港專業玄學服務：八字命盤、紫微斗數、風水勘察、塔羅占卜、占星服務。立即預約合適的玄學師傅。",
    ogUrl: "https://www.6bpodcasts.com/mystic/services",
    canonical: "https://www.6bpodcasts.com/mystic/services",
  });

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div
        className="py-12 px-4 text-center"
        style={{
          background: "linear-gradient(180deg, var(--bg-card) 0%, var(--bg) 100%)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{ background: "rgba(201,164,92,0.15)", color: "var(--gold)", border: "1px solid rgba(201,164,92,0.3)" }}>
            <Sparkles size={12} /> 玄學服務
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--text)" }}>
            路邊玄學堂服務
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-3)" }}>
            中西玄學 AI 分析平台，提供個人化命理解讀與靈性探索服務
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/mystic/analysis"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90"
              style={{ background: "var(--bg-card)", color: "white" }}>
              <Sparkles size={16} /> 立即 AI 分析
            </Link>
            <Link href="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90"
              style={{ background: "var(--bg-raise)", color: "var(--text-2)", border: "1px solid var(--line)" }}>
              <Calendar size={16} /> 預約人工服務
            </Link>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(svc => (
            <Link
              key={svc.title}
              href={svc.href}
              className="group block rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--line)",
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{svc.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{svc.title}</h3>
                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: svc.tag === "中式玄學" ? "var(--red)" : svc.tag === "西方玄學" ? "rgba(201,164,92,0.15)" : "rgba(201,164,92,0.15)",
                        color: svc.tag === "中式玄學" ? "var(--red)" : svc.tag === "西方玄學" ? "var(--gold)" : "var(--gold)",
                      }}>
                      {svc.tag}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-3)" }}>{svc.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: "var(--red)" }}>{svc.price}</span>
                <div className="flex items-center gap-1 text-xs font-medium transition-all duration-200 group-hover:gap-2"
                  style={{ color: "var(--gold)" }}>
                  了解更多 <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* AI Analysis CTA */}
        <div className="mt-10 rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, var(--bg-raise), var(--bg-card))", border: "1px solid var(--line)" }}>
          <Star size={32} className="mx-auto mb-3" style={{ color: "var(--gold)" }} />
          <h2 className="text-xl font-black mb-2" style={{ color: "var(--text)" }}>
            免費 AI 玄學分析
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--text-3)" }}>
            輸入出生資料，即時獲得八字、塔羅、星座、生命靈數等 AI 解讀
          </p>
          <Link href="/mystic/analysis"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{ background: "var(--bg-card)", color: "white" }}>
            <Sparkles size={16} /> 立即體驗免費分析
          </Link>
        </div>
      </div>
    </div>
  );
}
