import { useEffect } from "react";
import { Link } from "wouter";
import { JsonLd, buildServiceSchema, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";

const PLANS = [
  {
    id: "free",
    name: "免費版",
    price: "HK$0",
    period: "永久免費",
    color: "var(--text-2)",
    borderColor: "rgba(236,229,216,0.3)",
    bgColor: "var(--bg-card)",
    features: [
      { label: "玄學分析（登入後每日 10 次）", included: true },
      { label: "免費影片觀看", included: true },
      { label: "免費文章閱讀", included: true },
      { label: "玄學家列表瀏覽", included: true },
      { label: "完整流年報告", included: false },
      { label: "VIP 影片及文章", included: false },
      { label: "無限次分析", included: false },
      { label: "玄學家直播優先入場", included: false },
    ],
    cta: "免費使用",
    ctaLink: "/mystic/analysis",
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "HK$98",
    period: "每月",
    color: "var(--gold)",
    borderColor: "var(--gold)",
    bgColor: "var(--bg-card)",
    features: [
      { label: "無限次玄學分析", included: true },
      { label: "完整 12 個月流年報告", included: true },
      { label: "全部 VIP 影片及文章", included: true },
      { label: "玄學家直播優先入場", included: true },
      { label: "每月玄學家 Q&A 直播", included: true },
      { label: "個人化開運建議", included: true },
      { label: "玄學家 1 對 1 諮詢折扣", included: false },
      { label: "年度命盤深度分析", included: false },
    ],
    cta: "立即升級",
    ctaLink: "/mystic/analysis",
    highlight: true,
    badge: "最受歡迎",
  },
  {
    id: "vip",
    name: "VIP 尊享",
    price: "HK$298",
    period: "每月",
    color: "var(--gold)",
    borderColor: "var(--gold)",
    bgColor: "var(--bg-card)",
    features: [
      { label: "Premium 所有功能", included: true },
      { label: "玄學家 1 對 1 諮詢折扣 30%", included: true },
      { label: "年度命盤深度分析（1 次）", included: true },
      { label: "專屬 VIP 社群", included: true },
      { label: "每月玄學家私人直播", included: true },
      { label: "個人化流年開運計劃", included: true },
      { label: "優先預約玄學家", included: true },
      { label: "生日月份免費諮詢（30 分鐘）", included: true },
    ],
    cta: "成為 VIP",
    ctaLink: "/mystic/analysis",
    highlight: false,
  },
];

export default function MysticPricing() {
  useEffect(() => {
    document.title = "會員方案｜路邊玄學堂";
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "var(--bg)" }}>
      <JsonLd
        id="pricing-schema"
        data={[
          buildServiceSchema({
            name: "路邊玄學堂 玄學分析服務",
            description: "香港專業玄學分析服務，涵蓋風水命理、八字小山、紫微斗數、塔羅占卜、星座分析、生命靈數等多種派別。登入後每日免費使用 10 次完整分析。",
            url: `${SITE_URL}/mystic/pricing`,
          }),
          buildServiceSchema({
            name: "路邊玄學堂 個人玄學諾詢服務",
            description: "由專業玄學師傅一對一深度諾詢，涵蓋風水居家、婚姻合婚、事業財運等各類問題。可通過 WhatsApp 預約。",
            url: `${SITE_URL}/booking`,
          }),
          buildBreadcrumbSchema([
            { name: "首頁", url: SITE_URL },
            { name: "路邊玄學堂", url: `${SITE_URL}/mystic` },
            { name: "會員方案", url: `${SITE_URL}/mystic/pricing` },
          ]),
        ]}
      />
      <div className="max-w-5xl mx-auto">
        {/* Limited Time Free Banner */}
        <div className="mb-8 rounded-2xl p-4 border flex items-center gap-4" style={{ background: "rgba(26,23,18,0.3)", borderColor: "rgba(201,164,92,0.5)" }}>
          <span className="text-2xl flex-shrink-0">🎉</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: "var(--gold)", color: "var(--bg-card)" }}>限時免費體驗中</span>
              <span className="text-sm font-bold" style={{ color: "var(--gold)" }}>完整流年分析報告現已免費開放</span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-2)" }}>測試期間全功能免費開放，登入後每日可免費使用 10 次完整玄學分析。此功能稍後將成為 Premium 會員專屬，趣快體驗！</p>
          </div>
        </div>

        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--gold)" }}>MEMBERSHIP</p>
          <h1 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "var(--text)" }}>選擇你的會員方案</h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--text-2)" }}>
            解鎖完整玄學分析報告、VIP 影片及文章，以及玄學家直播優先入場資格
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl p-6 border relative transition-all hover:scale-[1.02]"
              style={{
                background: plan.bgColor,
                borderColor: plan.borderColor,
                boxShadow: plan.highlight ? `0 0 40px ${plan.borderColor} / 0.2` : "none",
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-4 py-1 rounded-full font-bold"
                  style={{ background: plan.color, color: "var(--bg)" }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-black mb-1" style={{ color: "var(--text)" }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black" style={{ color: plan.color }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: "var(--text-2)" }}>/ {plan.period}</span>
                </div>
              </div>

              <div className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5">
                    <span className="text-sm flex-shrink-0" style={{ color: f.included ? "var(--gold)" : "var(--text-3)" }}>
                      {f.included ? "✓" : "✗"}
                    </span>
                    <span className="text-sm" style={{ color: f.included ? "var(--text)" : "var(--text-3)" }}>
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>

              <Link href={plan.ctaLink}>
                <span
                  className="block w-full py-3 rounded-xl font-bold text-center text-sm cursor-pointer transition-all hover:scale-[1.02]"
                  style={plan.highlight ? {
                    background: `linear-gradient(135deg, ${plan.color}, var(--gold))`,
                    color: "var(--text)",
                  } : {
                    border: `1px solid ${plan.borderColor}`,
                    color: plan.color,
                    background: "transparent",
                  }}
                >
                  {plan.cta}
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-xl font-black text-center mb-8" style={{ color: "var(--text)" }}>常見問題</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { q: "可以隨時取消訂閱嗎？", a: "可以，你可以隨時取消訂閱，取消後仍可使用至當月結束。" },
              { q: "分析報告係由 AI 還是真實玄學家生成？", a: "基本分析由 AI 根據玄學理論生成，Premium 及 VIP 會員可預約真實玄學家進行深度諮詢。" },
              { q: "支援哪些付款方式？", a: "支援信用卡、PayMe、FPS 等主要付款方式。" },
              { q: "免責聲明", a: "本平台內容只供娛樂、文化及參考用途，並不構成任何投資、醫療、法律或人生重大決策建議。所有分析結果應以理性判斷作最後決定。" },
            ].map((item) => (
              <div key={item.q} className="p-5 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "rgba(201,164,92,0.2)" }}>
                <h4 className="font-bold mb-2" style={{ color: "var(--text)" }}>Q: {item.q}</h4>
                <p className="text-sm" style={{ color: "var(--text-2)" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
