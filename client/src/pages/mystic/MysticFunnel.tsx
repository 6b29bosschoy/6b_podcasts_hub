import { Link } from "wouter";
import { useState } from "react";
import {
  Youtube,
  Calendar,
  Star,
  Crown,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Play,
  BookOpen,
  Users,
  Building2,
  Heart,
  Briefcase,
  Home,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

// ─── Colour tokens ───────────────────────────────────────────────
const BG = "var(--bg)";
const BG2 = "var(--bg-card)";
const BORDER = "var(--line)";
const GOLD = "var(--gold)";
const PURPLE = "var(--gold)";
const TEAL = "var(--gold)";
const RED = "var(--red)";

// ─── Data ────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "free",
    icon: <Youtube size={28} />,
    color: RED,
    label: "免費內容",
    tagline: "先了解，再決定",
    price: "免費",
    items: [
      { icon: <Play size={16} />, text: "YouTube 玄學影片（每週更新）" },
      { icon: <Play size={16} />, text: "IG Reels 短片（每日開運貼士）" },
      { icon: <BookOpen size={16} />, text: "網站文章（命理知識、玄學入門）" },
      { icon: <Sparkles size={16} />, text: "每週玄學貼士（免費訂閱電郵）" },
    ],
    cta: { label: "立即訂閱 YouTube", href: "https://www.youtube.com/@6bfengshui", external: true },
    ctaSecondary: { label: "瀏覽玄學文章", href: "/blog" },
  },
  {
    id: "member",
    icon: <Star size={28} />,
    color: TEAL,
    label: "玄學會員",
    tagline: "深入了解自己的命盤",
    price: "每月 HK$98",
    items: [
      { icon: <Calendar size={16} />, text: "每月生肖 / 星座 / 命理運程" },
      { icon: <Play size={16} />, text: "會員限定影片（深度分析）" },
      { icon: <Users size={16} />, text: "會員直播重溫（師傅 Q&A）" },
      { icon: <BookOpen size={16} />, text: "限定文章（命理深度解讀）" },
      { icon: <Calendar size={16} />, text: "開運日曆（每月吉日提示）" },
    ],
    cta: { label: "加入玄學會員", href: "/mystic/pricing" },
    highlight: true,
  },
  {
    id: "personal",
    icon: <Sparkles size={28} />,
    color: PURPLE,
    label: "個人服務",
    tagline: "一對一深度分析",
    price: "HK$380 起",
    items: [
      { icon: <Briefcase size={16} />, text: "個人八字簡批（感情 / 事業 / 財運）" },
      { icon: <Star size={16} />, text: "塔羅問題解讀（單一問題深度解析）" },
      { icon: <TrendingUp size={16} />, text: "紫微斗數初步分析（命盤概覽）" },
      { icon: <Heart size={16} />, text: "感情 / 事業 / 財運專項分析" },
    ],
    cta: { label: "預約個人服務", href: "/booking" },
  },
  {
    id: "premium",
    icon: <Crown size={28} />,
    color: GOLD,
    label: "高端服務",
    tagline: "企業及家居全面顧問",
    price: "HK$2,800 起",
    items: [
      { icon: <Home size={16} />, text: "家居風水勘察（上門服務）" },
      { icon: <Building2 size={16} />, text: "辦公室 / 商舖風水佈局" },
      { icon: <Briefcase size={16} />, text: "企業命理顧問（開業擇日、人事佈局）" },
      { icon: <TrendingUp size={16} />, text: "品牌開運策略（品牌命名、Logo 顏色）" },
    ],
    cta: { label: "查詢高端服務", href: "/contact" },
  },
];

const JOURNEY_STEPS = [
  {
    step: "01",
    title: "發現",
    desc: "透過 YouTube 影片或 IG Reels 認識玄學，了解風水、八字、塔羅的基本概念。",
    icon: <Youtube size={20} />,
    color: RED,
  },
  {
    step: "02",
    title: "學習",
    desc: "訂閱玄學會員，每月收到個人化運程分析，參與師傅直播 Q&A，深入了解自己的命盤。",
    icon: <Star size={20} />,
    color: TEAL,
  },
  {
    step: "03",
    title: "諮詢",
    desc: "預約一對一個人服務，針對感情、事業、財運或特定問題進行深度解讀。",
    icon: <Sparkles size={20} />,
    color: PURPLE,
  },
  {
    step: "04",
    title: "全面提升",
    desc: "透過家居風水或企業命理顧問，從環境和格局層面全面優化個人或業務運勢。",
    icon: <Crown size={20} />,
    color: GOLD,
  },
];

const SERVICES_DETAIL = [
  {
    category: "感情 / 姻緣",
    icon: <Heart size={20} />,
    color: "var(--text-2)",
    services: ["八字合婚分析", "塔羅感情解讀", "紫微斗數夫妻宮", "桃花運改善建議"],
  },
  {
    category: "事業 / 財運",
    icon: <Briefcase size={20} />,
    color: TEAL,
    services: ["事業命盤分析", "財運流年解讀", "創業擇日選址", "職場人際風水"],
  },
  {
    category: "家居 / 環境",
    icon: <Home size={20} />,
    color: GOLD,
    services: ["家居風水勘察", "睡房 / 書房佈局", "旺財化煞擺設", "裝修吉日選擇"],
  },
  {
    category: "企業 / 品牌",
    icon: <Building2 size={20} />,
    color: PURPLE,
    services: ["辦公室風水", "品牌命名分析", "企業開業擇日", "管理層命理配對"],
  },
];

// ─── Component ───────────────────────────────────────────────────
export default function MysticFunnel() {
  const [activeTier, setActiveTier] = useState<string | null>(null);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e0f0" }}>
      {/* ── SEO meta ── */}
      {typeof document !== "undefined" && (() => {
        document.title = "玄學服務方案｜路邊玄學堂 — 從免費影片到個人命理諮詢";
        return null;
      })()}

      {/* ── Hero ── */}
      <section
        style={{
          background: `var(--bg-card) 100%)`,
          padding: "80px 24px 60px",
          textAlign: "center",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(201,164,92,0.15)",
              border: `1px solid rgba(201,164,92,0.4)`,
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              color: "var(--gold)",
              marginBottom: 24,
            }}
          >
            <Sparkles size={14} />
            路邊玄學堂 · 服務方案
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: 16,
              background: `linear-gradient(135deg, #fff 0%, var(--gold) 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            由免費影片到個人命理諮詢
            <br />
            按自己步伐了解玄學
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 32 }}>
            無論你是第一次接觸玄學，還是想深入了解自己的命盤，
            路邊玄學堂都有適合你的方案。從免費內容開始，隨時升級。
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/booking">
              <button
                style={{
                  background: `linear-gradient(135deg, ${PURPLE}, var(--gold))`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 28px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Calendar size={18} />
                預約玄學服務
              </button>
            </Link>
            <a
              href="https://www.youtube.com/@6bfengshui"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "transparent",
                color: "#fff",
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
              }}
            >
              <Youtube size={18} />
              先看免費影片
            </a>
          </div>
        </div>
      </section>

      {/* ── Journey Steps ── */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
          你的玄學之旅
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-2)", marginBottom: 40, fontSize: 15 }}>
          四個階段，由認識到深度應用
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {JOURNEY_STEPS.map((s, i) => (
            <div
              key={s.step}
              style={{
                background: BG2,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                padding: "24px 20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* connector arrow */}
              {i < JOURNEY_STEPS.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: -12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    color: s.color,
                    display: "none", // hidden on mobile, shown via media query workaround
                  }}
                >
                  <ChevronRight size={20} />
                </div>
              )}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `${s.color}22`,
                  border: `1px solid ${s.color}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                  marginBottom: 14,
                }}
              >
                {s.icon}
              </div>
              <div style={{ fontSize: 11, color: s.color, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>
                STEP {s.step}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Four Tiers ── */}
      <section style={{ padding: "20px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
          選擇適合你的方案
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-2)", marginBottom: 40, fontSize: 15 }}>
          由免費開始，隨時按需要升級
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setActiveTier(activeTier === tier.id ? null : tier.id)}
              style={{
                background: tier.highlight ? `${tier.color}12` : BG2,
                border: `1px solid ${tier.highlight ? tier.color + "55" : BORDER}`,
                borderRadius: 16,
                padding: "28px 22px",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${tier.color}22`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {tier.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: tier.color,
                    color: "#000",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                  }}
                >
                  最受歡迎
                </div>
              )}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: `${tier.color}20`,
                  border: `1px solid ${tier.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: tier.color,
                  marginBottom: 16,
                }}
              >
                {tier.icon}
              </div>
              <div style={{ fontSize: 11, color: tier.color, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
                {tier.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{tier.label}</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 12 }}>{tier.tagline}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tier.color, marginBottom: 16 }}>{tier.price}</div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                {tier.items.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--text)" }}>
                    <span style={{ color: tier.color, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>

              {tier.cta.external ? (
                <a
                  href={tier.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)`,
                    color: tier.id === "member" ? "#000" : "#fff",
                    borderRadius: 10,
                    padding: "12px 20px",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                    width: "100%",
                  }}
                >
                  {tier.cta.label}
                  <ArrowRight size={16} />
                </a>
              ) : (
                <Link href={tier.cta.href}>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)`,
                      color: tier.id === "member" ? "#000" : "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px 20px",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    {tier.cta.label}
                    <ArrowRight size={16} />
                  </button>
                </Link>
              )}

              {tier.ctaSecondary && (
                <Link href={tier.ctaSecondary.href}>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "transparent",
                      color: "var(--text-2)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 10,
                      padding: "10px 20px",
                      fontSize: 13,
                      cursor: "pointer",
                      width: "100%",
                      marginTop: 8,
                    }}
                  >
                    {tier.ctaSecondary.label}
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Services by Topic ── */}
      <section style={{ padding: "40px 24px 60px", background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
            按主題選擇服務
          </h2>
          <p style={{ textAlign: "center", color: "var(--text-2)", marginBottom: 40, fontSize: 15 }}>
            針對你最關心的人生課題
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {SERVICES_DETAIL.map((cat) => (
              <div
                key={cat.category}
                style={{
                  background: BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 14,
                  padding: "22px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: `${cat.color}20`,
                      border: `1px solid ${cat.color}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: cat.color,
                    }}
                  >
                    {cat.icon}
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{cat.category}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {cat.services.map((s) => (
                    <li key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text)" }}>
                      <span style={{ color: cat.color, fontSize: 10 }}>◆</span>
                      {s}
                    </li>
                  ))}
                </ul>
                <Link href="/booking">
                  <button
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: cat.color,
                      border: `1px solid ${cat.color}55`,
                      borderRadius: 8,
                      padding: "9px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    預約此類服務
                    <ChevronRight size={14} />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        style={{
          padding: "70px 24px",
          textAlign: "center",
          background: `var(--bg-card)`,
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Crown size={36} style={{ color: GOLD, marginBottom: 16 }} />
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            想了解自己未來一年的運勢？
          </h2>
          <p style={{ color: "var(--text-2)", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            感情、事業、財運或家居風水，立即預約合適的玄學師傅，
            用貼地方式理解你的命盤與機遇。
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/booking">
              <button
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, var(--gold))`,
                  color: "#000",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 32px",
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Calendar size={18} />
                立即預約師傅
              </button>
            </Link>
            <Link href="/mystic/pricing">
              <button
                style={{
                  background: "transparent",
                  color: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "14px 28px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Star size={18} />
                查看會員方案
              </button>
            </Link>
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: "var(--text-2)" }}>
            玄學分析僅供參考，不構成投資、醫療或法律建議。
          </p>
        </div>
      </section>
    </div>
  );
}
