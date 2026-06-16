import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import {
  Play, Calendar, Star, ChevronDown, ChevronUp,
  Sparkles, Eye, Clock, Users, ArrowRight, Check, Youtube, MessageCircle
} from "lucide-react";

// ─── Mystic Categories ───────────────────────────────────────────────────────
const MYSTIC_CATEGORIES = [
  { icon: "🏠", label: "風水", desc: "家居、辦公室及商業場所氣場分析", href: "/mystic/videos", color: "oklch(0.62 0.24 25)" },
  { icon: "📅", label: "八字命理", desc: "四柱八字、十神關係、大運流年推算", href: "/mystic/bazi", color: "oklch(0.55 0.18 280)" },
  { icon: "⭐", label: "紫微斗數", desc: "十二宮位命盤，洞察人生各方面運勢", href: "/mystic/analysis", color: "oklch(0.65 0.20 330)" },
  { icon: "🌀", label: "奇門遁甲", desc: "時空能量分析，把握人生關鍵時機", href: "/mystic/analysis", color: "oklch(0.55 0.22 290)" },
  { icon: "🃏", label: "塔羅占卜", desc: "牌陣解讀，感情事業人際指引", href: "/mystic/analysis", color: "oklch(0.62 0.20 160)" },
  { icon: "♈", label: "星座分析", desc: "本命盤及流年，了解星座能量影響", href: "/mystic/analysis", color: "oklch(0.65 0.18 200)" },
  { icon: "🔢", label: "生命靈數", desc: "出生日期靈數，探索靈魂使命與天賦", href: "/mystic/analysis", color: "oklch(0.70 0.18 75)" },
  { icon: "🌸", label: "身心靈療癒", desc: "阿卡西紀錄、能量療癒、靈魂探索", href: "/mystic/analysis", color: "oklch(0.65 0.15 350)" },
];

// ─── Featured Themes ─────────────────────────────────────────────────────────
const FEATURED_THEMES = [
  { icon: "📆", label: "每月運程", desc: "每月整體運勢解析，提前掌握吉凶方向", href: "/mystic/videos" },
  { icon: "💕", label: "感情姻緣", desc: "桃花運、感情走向、姻緣時機分析", href: "/mystic/videos" },
  { icon: "💼", label: "事業財運", desc: "事業轉機、財運高峰、投資時機解讀", href: "/mystic/videos" },
  { icon: "🏡", label: "家居風水", desc: "佈局調整、旺財旺運、化解煞氣", href: "/mystic/videos" },
  { icon: "🗓️", label: "流年分析", desc: "年度大運走向，逐月細析人生節奏", href: "/mystic/videos" },
  { icon: "✨", label: "開運貼士", desc: "日常小改變，提升整體運勢與能量", href: "/mystic/videos" },
];

// ─── Masters ─────────────────────────────────────────────────────────────────
const MASTERS = [
  {
    id: "master-fengshui",
    name: "風水師傅",
    tradition: "中式玄學",
    specialty: ["家居風水", "辦公室風水", "流年佈局"],
    bio: "專注於住宅及商業場所的風水勘察，以傳統形巒與理氣結合，協助客戶改善居住及工作環境的氣場能量。",
    emoji: "🏠",
    videoHref: "/mystic/videos",
    bookingHref: "/booking",
    accentColor: "oklch(0.62 0.24 25)",
  },
  {
    id: "master-bazi",
    name: "八字命理師",
    tradition: "中式玄學",
    specialty: ["八字命盤", "紫微斗數", "流年大運"],
    bio: "深研四柱八字與紫微斗數，擅長以命盤分析事業財運、感情走向及人生關鍵轉折，提供清晰的命理方向指引。",
    emoji: "📅",
    videoHref: "/mystic/bazi",
    bookingHref: "/booking",
    accentColor: "oklch(0.55 0.18 280)",
  },
  {
    id: "master-tarot",
    name: "塔羅占卜師",
    tradition: "西方玄學",
    specialty: ["塔羅占卜", "星座占星", "生命靈數"],
    bio: "結合塔羅、占星與生命靈數，以直觀而貼地的方式解讀當前能量，幫助客戶在感情、事業及人生選擇上找到清晰方向。",
    emoji: "🃏",
    videoHref: "/mystic/videos",
    bookingHref: "/booking",
    accentColor: "oklch(0.65 0.20 330)",
  },
  {
    id: "master-akashic",
    name: "身心靈導師",
    tradition: "靈性探索",
    specialty: ["阿卡西紀錄", "能量療癒", "靈魂探索"],
    bio: "透過阿卡西紀錄及能量療癒，協助客戶深入了解靈魂層面的課題，探索前世今生及靈魂使命，促進身心靈整合。",
    emoji: "🌸",
    videoHref: "/mystic/videos",
    bookingHref: "/booking",
    accentColor: "oklch(0.65 0.15 350)",
  },
];

// ─── Membership Tiers ────────────────────────────────────────────────────────
const MEMBERSHIP_TIERS = [
  {
    id: "free",
    name: "免費觀看",
    price: "免費",
    priceNote: "永久免費",
    highlight: false,
    features: [
      "YouTube 公開影片",
      "短片及精華片段",
      "公開文章及開運貼士",
      "玄學 AI 免費分析（基礎版）",
    ],
    cta: "立即觀看",
    ctaHref: "/mystic/videos",
    accentColor: "oklch(0.55 0.02 60)",
  },
  {
    id: "member",
    name: "玄學會員",
    price: "HK$98",
    priceNote: "每月",
    highlight: true,
    features: [
      "每月詳細運程分析",
      "會員專屬直播",
      "限定深度文章",
      "開運日曆（每月更新）",
      "玄學 AI 進階分析",
      "會員社群討論區",
    ],
    cta: "加入會員",
    ctaHref: "/mystic/pricing",
    accentColor: "oklch(0.55 0.18 280)",
  },
  {
    id: "personal",
    name: "個人服務",
    price: "按服務",
    priceNote: "單次預約",
    highlight: false,
    features: [
      "命盤深度分析（60 分鐘）",
      "風水上門勘察",
      "塔羅一對一解讀",
      "企業風水諮詢",
      "線上視像諮詢",
      "書面報告（部分服務）",
    ],
    cta: "預約服務",
    ctaHref: "/booking",
    accentColor: "oklch(0.62 0.24 25)",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "第一次睇命理應該準備什麼？",
    a: "準備好出生年月日及出生時間（如知道的話），部分師傅亦會詢問出生地點。第一次諮詢建議先想好最想了解的方向，例如感情、事業或財運，讓師傅可以更有針對性地解讀。",
  },
  {
    q: "風水服務是否需要上門？",
    a: "視乎服務類型。家居或辦公室風水勘察通常需要上門實地察看，以便準確分析氣場流動及環境佈局。部分師傅亦提供平面圖遙距分析服務，可先查詢師傅的服務方式。",
  },
  {
    q: "八字需要提供什麼資料？",
    a: "八字分析需要提供出生年、月、日及時辰（如知道的話）。時辰雖然非必須，但有助提高命盤準確度。如不知道確實出生時間，師傅可透過校正方式推算。",
  },
  {
    q: "塔羅適合問什麼問題？",
    a: "塔羅適合探索當前能量狀態、感情走向、事業選擇及人際關係等開放式問題。建議以「目前的感情狀況如何發展？」代替「他/她是否喜歡我？」等封閉式問題，效果更佳。",
  },
  {
    q: "玄學會員內容包括什麼？",
    a: "玄學會員可享有每月詳細運程分析（涵蓋整體、感情、事業、財運）、會員專屬直播、限定深度文章、開運日曆，以及玄學 AI 進階分析功能。詳情可參閱會員方案頁面。",
  },
  {
    q: "玄學分析是否等同投資或醫療建議？",
    a: "玄學分析僅供參考及個人啟發，不構成任何投資、醫療、法律或財務建議。所有決策應由個人審慎判斷，如有需要請諮詢相關專業人士。",
  },
];

// ─── Utility ─────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "今天";
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 週前`;
  if (days < 365) return `${Math.floor(days / 30)} 個月前`;
  return `${Math.floor(days / 365)} 年前`;
}

function formatDuration(d: string | null | undefined) {
  if (!d) return "";
  const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return d;
  const h = parseInt(m[1] || "0");
  const min = parseInt(m[2] || "0");
  const sec = parseInt(m[3] || "0");
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MysticHome() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useSEO({
    title: "路邊玄學堂｜香港中西玄學、風水命理與身心靈內容平台",
    description: "路邊玄學堂集合風水、八字、紫微斗數、塔羅占卜、星座分析、生命靈數與身心靈療癒內容。用貼地方式理解命運、感情關係、事業財運與人生選擇。",
    keywords: "路邊玄學堂,香港玄學,風水命理,八字分析,紫微斗數,塔羅占卜,星座分析,生命靈數,身心靈療癒",
    ogTitle: "路邊玄學堂｜香港中西玄學、風水命理與身心靈內容平台",
    ogDescription: "集合風水、八字、紫微斗數、塔羅、星座、生命靈數與身心靈療癒內容。用貼地方式理解命運與人生。",
    ogUrl: "https://www.6bpodcasts.com/mystic",
    ogImage: "https://www.6bpodcasts.com/manus-storage/og-mystic_41914502.jpg",
    canonical: "https://www.6bpodcasts.com/mystic",
  });

  // Fetch @6bfengshui videos
  const { data: videoData, isLoading: videosLoading } = trpc.youtube.getVideos.useQuery(
    { channel: "fengshui", limit: 6 },
    { staleTime: 5 * 60 * 1000 }
  );

  // Fetch channel info
  const { data: channelData } = trpc.youtube.getChannels.useQuery(
    undefined,
    { staleTime: 10 * 60 * 1000 }
  );

  type VideoItem = {
    id: string; title: string; thumbnail: string | null;
    url: string; viewCount: string; publishedAt: string; duration: string | null;
  };
  const videos = (videoData?.videos ?? []) as VideoItem[];

  // getChannels returns { podcasts, fengshui } — each is a YouTubeChannel object
  type ChannelInfo = { subscriberCount?: string } | null;
  const fengshuiChannel = (channelData as { podcasts?: ChannelInfo; fengshui?: ChannelInfo } | undefined)?.fengshui;
  const subCount = fengshuiChannel?.subscriberCount ?? null;

  const BG = "oklch(0.07 0.015 270)";
  const BG2 = "oklch(0.10 0.02 270)";
  const BORDER = "oklch(0.18 0.02 270)";
  const PURPLE = "oklch(0.55 0.18 280)";
  const PURPLE_LIGHT = "oklch(0.70 0.15 280)";
  const GOLD = "oklch(0.75 0.18 75)";
  const TEXT_PRIMARY = "oklch(0.92 0.01 60)";
  const TEXT_MUTED = "oklch(0.55 0.02 60)";

  return (
    <div className="min-h-screen pb-20 lg:pb-0" style={{ background: BG }}>

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "url('/manus-storage/hero-mystic_0e642ac2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat"
        }} />
        {/* Dark overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "oklch(0.08 0.02 280 / 0.80)" }} />
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-15"
            style={{ background: "radial-gradient(ellipse, oklch(0.55 0.22 290), transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-10"
            style={{ background: "oklch(0.65 0.20 330)" }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ color: PURPLE_LIGHT, border: `1px solid ${PURPLE}40`, background: `${PURPLE}18` }}>
            <Sparkles size={12} />
            路邊玄學堂 · 中西玄學一站式平台
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-tight"
            style={{ color: TEXT_PRIMARY }}>
            路邊玄學堂
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{ color: PURPLE_LIGHT }}>
              中西玄學、命理與身心靈內容平台
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ color: TEXT_MUTED }}>
            從風水、八字、紫微斗數到塔羅、星座與生命靈數，
            <br className="hidden md:block" />
            用貼地方式理解命運、關係、事業與人生選擇。
          </p>

          {/* Subscriber count */}
          {subCount && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
              style={{ background: BG2, border: `1px solid ${BORDER}`, color: TEXT_MUTED }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "oklch(0.62 0.24 25)" }} />
              @6bfengshui · {subCount} 訂閱
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <a
              href="https://www.youtube.com/@6bfengshui"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${PURPLE}, oklch(0.45 0.18 300))`,
                color: "white",
                boxShadow: `0 0 24px ${PURPLE}58`,
              }}
            >
              <Play size={16} fill="white" /> 觀看玄學影片
            </a>
            <a
              href="https://wa.me/85298729990"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.20 145), oklch(0.45 0.18 145))",
                color: "white",
                boxShadow: "0 0 24px oklch(0.55 0.20 145 / 0.4)",
              }}
            >
              <MessageCircle size={16} /> WhatsApp 預約
            </a>
            <Link href="/mystic/pricing">
              <span className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 cursor-pointer border"
                style={{
                  borderColor: `${PURPLE}66`,
                  color: PURPLE_LIGHT,
                  background: `${PURPLE}14`,
                }}>
                <Star size={16} /> 加入會員
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          YOUTUBE SUBSCRIPTION BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-6 px-4" style={{ background: "oklch(0.09 0.025 280)", borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl px-6 py-4"
            style={{ background: `linear-gradient(135deg, oklch(0.12 0.04 280), oklch(0.10 0.03 300))`, border: `1px solid ${PURPLE}40` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${PURPLE}25`, border: `1px solid ${PURPLE}50` }}>
                <Youtube className="w-5 h-5" style={{ color: PURPLE_LIGHT }} />
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: TEXT_PRIMARY }}>訂閱 @6bfengshui 玄學頻道</div>
                <div className="text-xs" style={{ color: TEXT_MUTED }}>每週更新風水、八字、塔羅影片，免費學習中西玄學</div>
              </div>
            </div>
            <a
              href="https://www.youtube.com/@6bfengshui?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${PURPLE}, oklch(0.45 0.18 300))`, color: "white" }}
            >
              <Youtube className="w-4 h-4" /> 立即訂閱
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. MYSTIC CATEGORIES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: TEXT_PRIMARY }}>玄學分類</h2>
            <p className="text-sm" style={{ color: TEXT_MUTED }}>中西玄學各派別，一站式深入了解</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {MYSTIC_CATEGORIES.map((cat) => {
              // Map category labels to image paths
              const imgMap: Record<string, string> = {
                "風水": "/manus-storage/card-fengshui_74f6f725.jpg",
                "八字命理": "/manus-storage/card-bazi_362f5a10.jpg",
                "紫微斗數": "/manus-storage/card-ziwei_c0d5ccac.jpg",
                "塔羅占卜": "/manus-storage/card-tarot_4d0881c2.jpg",
                "星座分析": "/manus-storage/card-astrology_39b038e0.jpg",
                "生命靈數": "/manus-storage/card-numerology_212aa873.jpg",
              };
              const imgSrc = imgMap[cat.label];
              return (
                <Link key={cat.label} href={cat.href}>
                  <div
                    className="group rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    style={{ border: `1px solid ${BORDER}` }}
                  >
                    {imgSrc ? (
                      <div className="relative h-28 overflow-hidden">
                        <img src={imgSrc} alt={cat.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, oklch(0.08 0.02 280 / 0.85))" }} />
                        <div className="absolute bottom-2 left-0 right-0 text-center">
                          <span className="text-sm font-bold" style={{ color: TEXT_PRIMARY }}>{cat.label}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 flex flex-col items-center justify-center" style={{ background: BG2 }}>
                        <div className="text-3xl mb-1">{cat.icon}</div>
                        <div className="font-bold text-sm" style={{ color: TEXT_PRIMARY }}>{cat.label}</div>
                      </div>
                    )}
                    <div className="p-3" style={{ background: BG2 }}>
                      <div className="text-xs leading-snug" style={{ color: TEXT_MUTED }}>{cat.desc}</div>
                      <div className="mt-2 flex items-center justify-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: cat.color }}>
                        了解更多 <ArrowRight size={10} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. LATEST VIDEOS (@6bfengshui)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4" style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-black mb-1" style={{ color: TEXT_PRIMARY }}>最新玄學影片</h2>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>來自 @6bfengshui 的最新節目</p>
            </div>
            <a
              href="https://www.youtube.com/@6bfengshui"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-80"
              style={{ background: PURPLE, color: "white" }}
            >
              <Play size={14} /> 訂閱頻道
            </a>
          </div>

          {videosLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: BG }}>
                  <div className="aspect-video" style={{ background: BORDER }} />
                  <div className="p-4 space-y-2">
                    <div className="h-4 rounded" style={{ background: BORDER }} />
                    <div className="h-3 w-2/3 rounded" style={{ background: BORDER }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!videosLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{ background: BG, border: `1px solid ${BORDER}` }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${BG2}, ${BG})` }}>
                        <Sparkles size={32} style={{ color: BORDER }} />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "oklch(0 0 0 / 0.45)" }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: `${PURPLE}e6` }}>
                        <Play size={20} fill="white" style={{ color: "white", marginLeft: 2 }} />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono font-bold"
                        style={{ background: "oklch(0 0 0 / 0.8)", color: "white" }}>
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-purple-400 transition-colors"
                      style={{ color: TEXT_PRIMARY }}>
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs" style={{ color: TEXT_MUTED }}>
                      <span className="flex items-center gap-1"><Eye size={11} /> {video.viewCount}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo(video.publishedAt)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {!videosLoading && videos.length === 0 && (
            <div className="text-center py-12">
              <Sparkles size={40} className="mx-auto mb-3" style={{ color: BORDER }} />
              <p style={{ color: TEXT_MUTED }}>暫時未有影片</p>
            </div>
          )}

          {!videosLoading && videos.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/mystic/videos">
                <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all hover:opacity-80 border"
                  style={{ borderColor: BORDER, color: PURPLE_LIGHT }}>
                  查看全部玄學影片 <ArrowRight size={14} />
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. FEATURED THEMES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: TEXT_PRIMARY }}>精選主題</h2>
            <p className="text-sm" style={{ color: TEXT_MUTED }}>從不同角度解讀你的人生方向</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURED_THEMES.map((theme) => (
              <Link key={theme.label} href={theme.href}>
                <div
                  className="group p-5 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{ background: BG2, border: `1px solid ${BORDER}` }}
                >
                  <div className="text-2xl mb-3">{theme.icon}</div>
                  <div className="font-bold text-sm mb-1.5" style={{ color: TEXT_PRIMARY }}>{theme.label}</div>
                  <div className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>{theme.desc}</div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: PURPLE_LIGHT }}>
                    探索 <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. MASTERS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 relative overflow-hidden" style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(/manus-storage/masters-bg_8a1d37af.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: TEXT_PRIMARY }}>師傅介紹</h2>
            <p className="text-sm" style={{ color: TEXT_MUTED }}>各派別專業玄學師傅，為你提供深度解讀</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MASTERS.map((master) => (
              <div key={master.id}
                className="rounded-xl p-6 flex flex-col gap-4"
                style={{ background: BG, border: `1px solid ${BORDER}` }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: `${master.accentColor}20`, border: `1px solid ${master.accentColor}40` }}>
                    {master.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-base mb-0.5" style={{ color: TEXT_PRIMARY }}>{master.name}</div>
                    <div className="text-xs px-2 py-0.5 rounded-full inline-block mb-2"
                      style={{ background: `${master.accentColor}20`, color: master.accentColor }}>
                      {master.tradition}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {master.specialty.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: BG2, color: TEXT_MUTED, border: `1px solid ${BORDER}` }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>{master.bio}</p>
                <div className="flex gap-2 mt-auto">
                  <Link href={master.videoHref}>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all hover:opacity-80"
                      style={{ background: `${master.accentColor}20`, color: master.accentColor, border: `1px solid ${master.accentColor}40` }}>
                      <Play size={12} /> 觀看影片
                    </span>
                  </Link>
                  <Link href={master.bookingHref}>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all hover:opacity-80"
                      style={{ background: master.accentColor, color: "white" }}>
                      <Calendar size={12} /> 立即預約
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/mystic/masters">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all hover:opacity-80 border"
                style={{ borderColor: BORDER, color: PURPLE_LIGHT }}>
                查看全部師傅 <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. MEMBERSHIP TIERS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: TEXT_PRIMARY }}>會員訂閱</h2>
            <p className="text-sm" style={{ color: TEXT_MUTED }}>選擇最適合你的方式，深入探索玄學世界</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MEMBERSHIP_TIERS.map((tier) => (
              <div key={tier.id}
                className="rounded-2xl p-6 flex flex-col relative"
                style={{
                  background: tier.highlight
                    ? `linear-gradient(160deg, oklch(0.13 0.04 280), oklch(0.11 0.03 300))`
                    : BG2,
                  border: tier.highlight
                    ? `1px solid ${PURPLE}80`
                    : `1px solid ${BORDER}`,
                  boxShadow: tier.highlight ? `0 0 40px ${PURPLE}26` : "none",
                }}>
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black"
                    style={{ background: PURPLE, color: "white" }}>
                    最受歡迎
                  </div>
                )}
                <div className="mb-5">
                  <div className="font-black text-base mb-1" style={{ color: tier.accentColor }}>{tier.name}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black" style={{ color: TEXT_PRIMARY }}>{tier.price}</span>
                    <span className="text-xs" style={{ color: TEXT_MUTED }}>{tier.priceNote}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs" style={{ color: TEXT_MUTED }}>
                      <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: tier.accentColor }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={tier.ctaHref}>
                  <span
                    className="block w-full text-center py-3 rounded-xl font-bold text-sm cursor-pointer transition-all hover:opacity-90"
                    style={{
                      background: tier.highlight
                        ? `linear-gradient(135deg, ${PURPLE}, oklch(0.45 0.15 300))`
                        : `${tier.accentColor}20`,
                      color: tier.highlight ? "white" : tier.accentColor,
                      border: tier.highlight ? "none" : `1px solid ${tier.accentColor}4d`,
                    }}
                  >
                    {tier.cta}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          7. BOOKING CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4" style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ background: "oklch(0.62 0.24 25 / 0.12)", color: GOLD, border: "1px solid oklch(0.62 0.24 25 / 0.3)" }}>
            <Users size={12} /> 個人玄學諮詢
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: TEXT_PRIMARY }}>
            想了解自己未來一年的
            <br />
            <span style={{ color: GOLD }}>感情、事業、財運或家居風水？</span>
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-xl mx-auto" style={{ color: TEXT_MUTED }}>
            立即預約合適的玄學師傅，透過命盤分析、風水勘察或塔羅解讀，
            為你提供清晰的方向指引，協助你做出更有把握的人生選擇。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <a
              href="https://wa.me/85298729990"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.20 145), oklch(0.45 0.18 145))",
                color: "white",
                boxShadow: "0 0 24px oklch(0.55 0.20 145 / 0.35)",
              }}
            >
              <MessageCircle size={16} /> WhatsApp 立即預約
            </a>
            <Link href="/booking">
              <span className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:opacity-90 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, oklch(0.62 0.24 25), oklch(0.55 0.20 45))",
                  color: "white",
                  boxShadow: "0 0 24px oklch(0.62 0.24 25 / 0.3)",
                }}>
                <Calendar size={16} /> 預約師傅諮詢
              </span>
            </Link>
            <Link href="/mystic/services">
              <span className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:opacity-80 border"
                style={{ borderColor: BORDER, color: TEXT_MUTED }}>
                查看服務詳情 <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          8. FAQ
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: TEXT_PRIMARY }}>常見問題</h2>
            <p className="text-sm" style={{ color: TEXT_MUTED }}>解答你對玄學服務的疑問</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i}
                className="rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  background: BG2,
                  border: `1px solid ${openFaq === i ? PURPLE + "66" : BORDER}`,
                }}>
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm" style={{ color: TEXT_PRIMARY }}>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={16} className="flex-shrink-0" style={{ color: PURPLE_LIGHT }} />
                    : <ChevronDown size={16} className="flex-shrink-0" style={{ color: TEXT_MUTED }} />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 rounded-xl text-xs leading-relaxed text-center"
            style={{ background: BG2, border: `1px solid ${BORDER}`, color: TEXT_MUTED }}>
            所有玄學分析及內容僅供參考及個人啟發，不構成任何投資、醫療、法律或財務建議。如有需要，請諮詢相關專業人士。
          </div>
        </div>
      </section>

    </div>
  );
}
