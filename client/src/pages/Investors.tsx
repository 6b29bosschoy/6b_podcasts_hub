import { useEffect } from "react";
import { Link } from "wouter";
import {
  TrendingUp, Users, Youtube, Mic, Sparkles, Globe,
  BarChart2, DollarSign, Mail, ArrowRight, CheckCircle,
  Play, BookOpen, Star,
} from "lucide-react";
import { JsonLd, buildOrganizationSchema, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";

// ── Traction metrics (update via CMS or hardcode for now) ─────────────────────
const METRICS = [
  { label: "YouTube 總訂閱", value: "2.2萬+", icon: Youtube, color: "var(--red)" },
  { label: "玄學頻道訂閱", value: "2.0K+", icon: Sparkles, color: "var(--gold)" },
  { label: "月均觀看次數", value: "40萬+", icon: Play, color: "var(--gold)" },
  { label: "嘉賓專欄文章", value: "50+", icon: BookOpen, color: "var(--gold)" },
  { label: "Podcast 集數", value: "200+", icon: Mic, color: "var(--gold)" },
  { label: "平台運營年數", value: "5年+", icon: Star, color: "var(--text-2)" },
];

// ── Revenue streams ────────────────────────────────────────────────────────────
const REVENUE_STREAMS = [
  {
    icon: "🎙️",
    title: "品牌內容合作",
    desc: "YouTube 節目植入、主持人背書、專題製作，覆蓋 2.2 萬訂閱受眾。",
    status: "現有收入",
    statusColor: "var(--gold)",
  },
  {
    icon: "🔮",
    title: "玄學服務變現",
    desc: "AI 命盤分析（免費引流）→ 師傅一對一諮詢（付費轉化），高毛利服務業務。",
    status: "現有收入",
    statusColor: "var(--gold)",
  },
  {
    icon: "👑",
    title: "會員訂閱制",
    desc: "玄學 Premium 會員：無限 AI 分析、VIP 內容、直播優先入場。月費 HK$98 起。",
    status: "即將推出",
    statusColor: "var(--gold)",
  },
  {
    icon: "🎤",
    title: "主持招募培訓",
    desc: "篩選有潛力的新主持人，提供製作培訓及頻道孵化，收取培訓費及分潤。",
    status: "規劃中",
    statusColor: "var(--gold)",
  },
  {
    icon: "📱",
    title: "落點算 App",
    desc: "獨立玄學 App，整合 AI 命盤、師傅預約、社群功能，訂閱制 SaaS 模式。",
    status: "規劃中",
    statusColor: "var(--gold)",
  },
];

// ── Ecosystem pillars ──────────────────────────────────────────────────────────
const ECOSYSTEM = [
  {
    icon: "🎙️",
    title: "路邊電台",
    desc: "香港最真實人物訪談 Podcast 及 YouTube 頻道，覆蓋兩性關係、都市情感、人生故事。",
    link: "/podcasts",
    linkLabel: "了解更多",
  },
  {
    icon: "🔮",
    title: "路邊玄學堂",
    desc: "AI 驅動玄學分析平台，結合師傅一對一服務，打通免費引流至付費轉化的完整漏斗。",
    link: "/mystic",
    linkLabel: "了解更多",
  },
  {
    icon: "✍️",
    title: "嘉賓專欄",
    desc: "嘉賓投稿、讀者故事、社群互動，建立高黏性內容生態，提升 SEO 及品牌信任度。",
    link: "/blog",
    linkLabel: "了解更多",
  },
  {
    icon: "🤝",
    title: "商業合作",
    desc: "品牌置入、內容共創、整合行銷，為中小企業提供觸達香港年輕受眾的高效渠道。",
    link: "/partnership",
    linkLabel: "了解更多",
  },
];

export default function Investors() {
  useEffect(() => {
    document.title = "投資者關係｜6B Podcasts 路邊電台";
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: "var(--bg)" }}>
      <JsonLd
        id="investors-schema"
        data={[
          buildOrganizationSchema(),
          buildBreadcrumbSchema([
            { name: "首頁", url: SITE_URL },
            { name: "投資者關係", url: `${SITE_URL}/investors` },
          ]),
        ]}
      />

      {/* ── Hero ── */}
      <section className="py-20 px-4 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--bg-card) 0%, var(--bg) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
            style={{ background: "var(--red)", filter: "blur(120px)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5"
            style={{ background: "var(--gold)", filter: "blur(100px)" }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ background: "var(--red)", border: "1px solid var(--red)", color: "var(--red)" }}>
            <TrendingUp className="w-3.5 h-3.5" />
            投資者關係 / Investor Relations
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight"
            style={{ color: "var(--text)" }}>
            香港最真實的<br />
            <span style={{ color: "var(--red)" }}>內容 × 玄學</span> 平台
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ color: "var(--text-2)" }}>
            6B Podcasts 以路邊電台為流量入口，以路邊玄學堂為變現引擎，
            建立香港本地最具黏性的中文內容生態。我們正在尋找志同道合的戰略投資夥伴。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@6bpodcasts.com"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105"
              style={{ background: "var(--red)", color: "white", boxShadow: "0 4px 20px var(--red)" }}>
              <Mail className="w-5 h-5" />
              聯絡我們洽談
            </a>
            <Link href="/about"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
              style={{ background: "transparent", border: "1px solid var(--text-3)", color: "var(--text-2)" }}>
              <Globe className="w-5 h-5" />
              了解品牌故事
            </Link>
          </div>
        </div>
      </section>

      {/* ── Traction Metrics ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--red)" }}>TRACTION</p>
            <h2 className="text-2xl md:text-3xl font-black" style={{ color: "var(--text)" }}>平台數據</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {METRICS.map((m) => (
              <div key={m.label} className="rounded-2xl p-6 text-center border"
                style={{ background: "var(--bg-card)", borderColor: "var(--line)" }}>
                <m.icon className="w-6 h-6 mx-auto mb-3" style={{ color: m.color }} />
                <div className="text-2xl md:text-3xl font-black mb-1" style={{ color: m.color }}>{m.value}</div>
                <div className="text-xs" style={{ color: "var(--text-2)" }}>{m.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-4" style={{ color: "var(--text-3)" }}>
            * 數據截至 2026 年 7 月，持續更新
          </p>
        </div>
      </section>

      {/* ── Ecosystem Model ── */}
      <section className="py-16 px-4" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--gold)" }}>ECOSYSTEM</p>
            <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: "var(--text)" }}>四大生態支柱</h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--text-2)" }}>
              內容引流 → 社群沉澱 → 服務變現，形成完整的用戶生命週期管理。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ECOSYSTEM.map((e) => (
              <div key={e.title} className="rounded-2xl p-6 border"
                style={{ background: "var(--bg-card)", borderColor: "var(--line)" }}>
                <div className="text-3xl mb-3">{e.icon}</div>
                <h3 className="text-lg font-black mb-2" style={{ color: "var(--text)" }}>{e.title}</h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-2)" }}>{e.desc}</p>
                <Link href={e.link}
                  className="inline-flex items-center gap-1 text-xs font-bold"
                  style={{ color: "var(--red)" }}>
                  {e.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Revenue Streams ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--gold)" }}>REVENUE MODEL</p>
            <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: "var(--text)" }}>收入模式</h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--text-2)" }}>
              多元化收入來源，降低單一渠道依賴，逐步向 SaaS 訂閱制轉型。
            </p>
          </div>
          <div className="space-y-4">
            {REVENUE_STREAMS.map((r) => (
              <div key={r.title} className="rounded-2xl p-5 border flex items-start gap-4"
                style={{ background: "var(--bg-card)", borderColor: "var(--line)" }}>
                <div className="text-2xl flex-shrink-0">{r.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>{r.title}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${r.statusColor} / 0.15`, color: r.statusColor, border: `1px solid ${r.statusColor} / 0.3` }}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-2)" }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Partner ── */}
      <section className="py-16 px-4" style={{ background: "var(--bg)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--gold)" }}>WHY US</p>
            <h2 className="text-2xl md:text-3xl font-black" style={{ color: "var(--text)" }}>為什麼選擇 6B Podcasts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "香港本地稀缺內容", desc: "以廣東話為核心，深耕香港本地文化與社會議題，難以被外來平台複製。" },
              { title: "雙頻道協同效應", desc: "路邊電台（大眾流量）× 路邊玄學堂（高轉化垂直）形成互補，用戶留存率高。" },
              { title: "AI 技術壁壘", desc: "自研玄學 AI 分析引擎，結合農曆推算、命理邏輯與 LLM，技術門檻高。" },
              { title: "社群黏性強", desc: "嘉賓投稿、讀者故事、Web Push 通知，建立多觸點用戶關係，不依賴單一平台算法。" },
              { title: "創辦人媒體影響力", desc: "Ray Choy 個人品牌在香港媒體圈具一定知名度，有助品牌合作及融資談判。" },
              { title: "輕資產高毛利", desc: "內容製作成本低，AI 服務邊際成本接近零，訂閱制收入具高度可擴展性。" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-xl p-4 border"
                style={{ background: "var(--bg-card)", borderColor: "var(--line)" }}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-2xl p-10 border"
            style={{ background: "linear-gradient(135deg, var(--bg-card), var(--bg))", borderColor: "var(--red)" }}>
            <BarChart2 className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--red)" }} />
            <h2 className="text-2xl font-black mb-3" style={{ color: "var(--text)" }}>有興趣了解更多？</h2>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-2)" }}>
              我們歡迎戰略投資者、媒體夥伴及品牌合作方洽談。
              請透過電郵聯絡，我們會在 48 小時內回覆。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:hello@6bpodcasts.com"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105"
                style={{ background: "var(--red)", color: "white", boxShadow: "0 4px 20px var(--red)" }}>
                <Mail className="w-5 h-5" />
                hello@6bpodcasts.com
              </a>
              <Link href="/contact"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
                style={{ background: "transparent", border: "1px solid var(--text-3)", color: "var(--text-2)" }}>
                <DollarSign className="w-5 h-5" />
                聯絡表單
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
