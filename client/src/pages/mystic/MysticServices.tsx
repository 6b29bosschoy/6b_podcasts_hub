import { Link } from "wouter";
import { Star, ArrowRight, MessageCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { JsonLd, buildServiceSchema } from "@/components/JsonLd";

const SERVICES = [
  {
    title: "八字命盤",
    cantonese: "你係咩命？點解咁多阻滯？",
    desc: "四柱八字、十神關係、大運流年。Ray 親身試過，話係佢見過最準嘅一種。",
    price: "HK$800 起",
    href: "/booking",
    tag: "中式",
  },
  {
    title: "紫微斗數",
    cantonese: "十二宮位，逐格拆解你嘅人生地圖",
    desc: "命宮、財帛、夫妻、事業……每個宮位都有嘢講。適合想深入了解自己格局嘅人。",
    price: "HK$900 起",
    href: "/booking",
    tag: "中式",
  },
  {
    title: "風水勘察",
    cantonese: "屋企擺錯咗？可能係呢個原因",
    desc: "上門睇住宅或商業場所，改善氣場佈局。財運、健康、人際，三者一起睇。",
    price: "HK$1,500 起",
    href: "/booking",
    tag: "中式",
  },
  {
    title: "塔羅占卜",
    cantonese: "而家嘅能量係點？下一步點行？",
    desc: "感情、事業、人際關係。唔係算命，係幫你睇清楚當下嘅狀態同選擇。",
    price: "HK$500 起",
    href: "/booking",
    tag: "西方",
  },
  {
    title: "星座占星",
    cantonese: "唔係得個太陽星座咁簡單",
    desc: "本命盤加流年分析，了解你嘅上升、月亮、各宮位能量。準到嚇你一跳。",
    price: "HK$600 起",
    href: "/booking",
    tag: "西方",
  },
  {
    title: "生命靈數",
    cantonese: "一個數字，講晒你嘅靈魂使命",
    desc: "以出生日期計算靈數，分析天賦才能及人生課題。入門易，但深入起嚟好有料。",
    price: "HK$400 起",
    href: "/booking",
    tag: "西方",
  },
  {
    title: "阿卡西紀錄",
    cantonese: "想知道你嘅靈魂係從哪裡來？",
    desc: "深入靈魂層面，探索前世今生、靈魂伴侶及靈魂年齡。適合對靈性有興趣嘅人。",
    price: "HK$700 起",
    href: "/booking",
    tag: "靈性",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "WhatsApp 問吓先",
    desc: "唔使即刻落訂。WhatsApp 話俾我哋知你想搵邊種服務，我哋幫你配對合適嘅師傅。",
  },
  {
    step: "02",
    title: "確認時間同收費",
    desc: "師傅會同你確認時間、方式（視像 / 上門）同埋實際收費，冇隱藏費用。",
  },
  {
    step: "03",
    title: "開始諮詢",
    desc: "按時進行，完成後師傅會整理報告俾你。有問題可以繼續追問。",
  },
];

export default function MysticServices() {
  useSEO({
    title: "玄學服務｜路邊玄學堂—八字命盤、風水勘察、塔羅占卜",
    description: "路邊玄學堂提供香港專業玄學服務：八字命盤 HK$800 起、紫微斗數 HK$900 起、風水勘察 HK$1,500 起、塔羅占卜 HK$500 起。WhatsApp 問吓先，唔使即刻落訂。",
    keywords: "玄學服務,香港玄學,八字命盤,風水勘察,塔羅占卜,占星服務,生命靈數,阿卡西紀錄",
    ogTitle: "玄學服務｜路邊玄學堂",
    ogDescription: "香港專業玄學服務，WhatsApp 問吓先，唔使即刻落訂。",
    ogUrl: "https://www.6bpodcasts.com/mystic/services",
    canonical: "https://www.6bpodcasts.com/mystic/services",
  });

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <JsonLd data={buildServiceSchema({ name: "路邊玄學堂玄學服務", description: "香港專業玄學服務：八字命盤、紫微斗數、風水勘察、塔羅占卜、星座占星、生命靈數、阿卡西紀錄", url: "https://www.6bpodcasts.com/mystic/services", price: "400", priceCurrency: "HKD" })} />

      {/* ── HERO ── */}
      <section className="py-16 px-4 text-center" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-2xl mx-auto">
          <p className="kicker mb-4">MYSTIC SERVICES</p>
          <h1 className="mb-4" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.2 }}>
            搵師傅傾吓
          </h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>
            唔係算命，係幫你睇清楚而家嘅狀態同下一步。<br />
            WhatsApp 問吓先，唔使即刻落訂。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/85298729990?text=你好，我想了解玄學服務" target="_blank" rel="noopener noreferrer"
              className="btn-gold">
              <MessageCircle className="w-4 h-4" /> WhatsApp 問吓先
            </a>
            <Link href="/mystic/analysis" className="btn-ghost">
              免費 AI 睇吓個盤 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 px-4" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-4xl mx-auto">
          <p className="kicker mb-8 text-center">HOW IT WORKS</p>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ border: "1px solid var(--line)" }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="p-8" style={{ borderRight: i < 2 ? "1px solid var(--line)" : "none" }}>
                <div className="mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1, opacity: 0.6 }}>
                  {step.step}
                </div>
                <h3 className="mb-2 text-base" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="py-14 px-4" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="kicker mb-2">SERVICES & PRICING</p>
            <h2 className="text-2xl" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700 }}>服務同收費</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ border: "1px solid var(--line)" }}>
            {SERVICES.map((svc, i) => (
              <Link key={svc.title} href={svc.href}
                className="group block p-6 transition-all duration-200"
                style={{
                  borderRight: (i % 3 !== 2) ? "1px solid var(--line)" : "none",
                  borderBottom: i < SERVICES.length - (SERVICES.length % 3 || 3) ? "1px solid var(--line)" : "none",
                  background: "var(--bg-card)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raise)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5" style={{
                    border: "1px solid var(--line)",
                    color: "var(--text-3)",
                    fontFamily: "'Noto Sans TC', sans-serif",
                    letterSpacing: "0.08em",
                  }}>{svc.tag}</span>
                </div>
                <h3 className="mb-1 text-base" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "var(--text)" }}>{svc.title}</h3>
                <p className="text-xs mb-3 italic" style={{ color: "var(--gold)", fontFamily: "'Noto Serif TC', serif", fontWeight: 400 }}>{svc.cantonese}</p>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-2)", fontWeight: 300 }}>{svc.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)", fontSize: "1rem" }}>{svc.price}</span>
                  <span className="text-xs transition-all duration-200 group-hover:gap-2 flex items-center gap-1" style={{ color: "var(--gold)" }}>
                    WhatsApp 預約 <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-center" style={{ color: "var(--text-3)" }}>
            以上為起步價，實際收費視乎服務內容及時長而定。WhatsApp 查詢可獲詳細報價。
          </p>
        </div>
      </section>

      {/* ── RAY ENDORSEMENT PLACEHOLDER ── */}
      <section className="py-14 px-4" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="card-line p-8 sm:p-12">
            {/* 【待 Ray 提供：錄音室相片 + 一句親身推薦語（廣東話）】 */}
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Ray photo placeholder */}
              <div className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ border: "1px solid var(--gold-dim)", background: "var(--bg-raise)" }}>
                <span style={{ color: "var(--text-3)", fontSize: "0.625rem", textAlign: "center", padding: "0.5rem" }}>
                  Ray 相片<br />待提供
                </span>
              </div>
              <div>
                <p className="kicker mb-3">RAY 推薦</p>
                <blockquote className="text-base leading-relaxed mb-4" style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)", fontStyle: "italic" }}>
                  「【待 Ray 提供：一句親身試過玄學服務嘅推薦語，廣東話，30 字以內】」
                </blockquote>
                <p className="text-sm" style={{ color: "var(--text-3)" }}>— Ray Choy，6B Podcast 主持</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Star className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--gold)" }} strokeWidth={1} />
          <h2 className="text-xl mb-3" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700 }}>
            唔知揀邊種好？
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 300 }}>
            WhatsApp 話俾我哋知你嘅問題，我哋幫你配對最合適嘅師傅同服務。
          </p>
          <a href="https://wa.me/85298729990?text=你好，我想了解玄學服務，唔知揀邊種好" target="_blank" rel="noopener noreferrer"
            className="btn-gold">
            <MessageCircle className="w-4 h-4" /> WhatsApp 問吓先
          </a>
        </div>
      </section>
    </div>
  );
}
