import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { JsonLd, buildOrganizationSchema, buildWebSiteSchema } from "@/components/JsonLd";
import { useSEO } from "@/hooks/useSEO";
import { Play, ChevronRight, Youtube, Mic, Calendar, MessageCircle, Instagram, Facebook, Music, ChevronDown } from "lucide-react";

const HERO_BG_DESKTOP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/hero-new-main-3ptD2DHC6jMTxZHCYKJLcE.webp";
const HERO_BG_MOBILE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/hero-new-mobile-WybngLNmW22rmhrdvNB7xw.webp";

const CONTENT_CATEGORIES = [
  { icon: "💬", tag: "兩性關係", title: "愛情裡的真實對話", desc: "分手、出軌、婚姻困境、親密關係——香港人最真實的情感故事，沒有濾鏡，只有共鳴。", href: "/podcasts", color: "var(--red-bright)" },
  { icon: "📖", tag: "真實故事", title: "每個人都有一個故事", desc: "人物專訪、生命轉捩點、職場困境、身份認同——聽見香港人心底話。", href: "/blog", color: "var(--pink-grey)" },
  { icon: "✨", tag: "自我成長", title: "重新認識自己", desc: "八字命盤、塔羅、身心靈——用東西方智慧，找到屬於你的方向。", href: "/mystic", color: "var(--gold)" },
];

const THREE_DIRECTIONS = [
  { num: "01", title: "關係裡的自己", subtitle: "路邊電台", desc: "兩性討論、都市情感、婚姻家庭、親密關係。每週三、日更新，不設限的真實對話。", href: "/podcasts", ytHref: "https://www.youtube.com/@6bpodcasts", tag: "PODCAST · YOUTUBE" },
  { num: "02", title: "命運裡的提示", subtitle: "路邊玄學堂", desc: "八字命理、紫微斗數、塔羅占卜、風水流年。中西玄學，讓你看懂自己的人生格局。", href: "/mystic", ytHref: "https://www.youtube.com/@6bfengshui", tag: "MYSTIC · YOUTUBE" },
  { num: "03", title: "生活裡的答案", subtitle: "人物專訪", desc: "嘉賓故事、生命轉捩點、職場與人生選擇。聽見不同的人，找到屬於你的出路。", href: "/blog", ytHref: "https://www.youtube.com/@6bpodcasts", tag: "INTERVIEW · COLUMN" },
];

const SERVICES = [
  { icon: "💑", title: "感情與人生方向", desc: "感情困境、人生抉擇、職場方向——透過命盤分析，找到最適合你的下一步。", price: "HK$800 起" },
  { icon: "☯️", title: "八字命理分析", desc: "依據出生年月日時，推算四柱命盤、十神關係、大運流年，深入了解命運格局。", price: "HK$800 起" },
  { icon: "🏠", title: "家居及辦公室風水", desc: "針對住宅或辦公室格局，分析氣場流向，提供實用佈置建議，改善運勢。", price: "HK$1,500 起" },
];

const FAQS = [
  { q: "諮詢服務是線上還是面對面？", a: "兩者均可。線上諮詢透過 Zoom 或 WhatsApp 視像進行，面對面諮詢可預約香港各區。" },
  { q: "預約後多久可以安排？", a: "一般在 48 小時內回覆確認，視乎師傅檔期，通常可在一週內安排。" },
  { q: "路邊電台的節目在哪裡收聽？", a: "YouTube、Apple Podcast、Spotify 均有上架，每週三、日更新。" },
  { q: "可以投稿或申請成為嘉賓嗎？", a: "歡迎！可透過「嘉賓專欄」投稿文章，或填寫主持招募表格申請上節目。" },
];

type VideoItem = {
  id: string; title: string; thumbnail: string | null; url: string;
  viewCount: string; publishedAt: string; duration: string | null;
  channelTitle?: string | null; channelId?: string | null;
};

function VideoCard({ v }: { v: VideoItem }) {
  const isMystic = v.channelTitle?.includes("玄學") || v.channelId?.includes("fengshui");
  return (
    <div className="card-line group cursor-pointer" onClick={() => window.open(v.url, "_blank", "noopener,noreferrer")}>
      <div className="aspect-video relative overflow-hidden" style={{ background: "var(--bg-raise)" }}>
        {v.thumbnail ? (
          <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Play className="w-8 h-8" style={{ color: "var(--text-3)" }} /></div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(13,9,9,0.45)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(200,169,106,0.9)" }}>
            <Play className="w-5 h-5 ml-0.5" style={{ color: "#0d0909" }} />
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className="text-xs px-2 py-0.5 font-medium" style={{ background: isMystic ? "rgba(200,169,106,0.9)" : "rgba(139,46,46,0.9)", color: isMystic ? "#0d0909" : "#f0e6df", borderRadius: "var(--radius)", letterSpacing: "0.04em" }}>
            {isMystic ? "玄學堂" : "路邊電台"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium leading-snug line-clamp-2 mb-2" style={{ color: "var(--text)", fontFamily: "'Noto Sans TC', sans-serif" }}>{v.title}</h3>
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-3)" }}>
          {v.viewCount && <span>{parseInt(v.viewCount).toLocaleString()} 次觀看</span>}
          <span>{new Date(v.publishedAt).toLocaleDateString("zh-HK", { month: "short", day: "numeric" })}</span>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b cursor-pointer" style={{ borderColor: "var(--line)" }} onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between py-5 gap-4">
        <span className="text-sm font-medium" style={{ color: "var(--text)", fontFamily: "'Noto Sans TC', sans-serif" }}>{q}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform duration-300" style={{ color: "var(--gold)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </div>
      {open && <div className="pb-5 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{a}</div>}
    </div>
  );
}

export default function Home() {
  useSEO({
    title: "6B Podcast｜聽見關係，看懂自己。香港兩性關係 × 玄學 × 真實故事平台",
    description: "6B Podcast 是香港本地內容平台，集合真實人物訪談、兩性關係、都市情感、中西玄學、風水命理、身心靈及 YouTube 節目內容。",
    keywords: "6B Podcast,路邊電台,路邊玄學堂,香港 Podcast,香港 YouTube 訪談,兩性關係 Podcast,香港玄學,風水命理,八字分析,紫微斗數,塔羅占卜,生命靈數,身心靈香港",
    ogTitle: "6B Podcast｜聽見關係，看懂自己。",
    ogDescription: "在愛裡探索，在命運裡提問。這裡有真實對話，也有讓你重新出發的線索。",
    ogUrl: "https://www.6bpodcasts.com/home",
    canonical: "https://www.6bpodcasts.com/home",
  });

  const [videoFilter, setVideoFilter] = useState<"all" | "podcasts" | "fengshui">("all");
  const videoQueryInput = useMemo(() => ({ channel: "all" as const, limit: 6 }), []);
  const { data: videosData, isLoading: videosLoading } = trpc.youtube.getVideos.useQuery(videoQueryInput, { staleTime: 5 * 60 * 1000 });
  const { data: channelsData } = trpc.youtube.getChannels.useQuery(undefined, { staleTime: 30 * 60 * 1000 });

  type ChannelInfo = { subscriberCount?: string; id?: string; title?: string };
  const podcastsChannel = channelsData?.podcasts as ChannelInfo | null | undefined;
  const fengshuiChannel = channelsData?.fengshui as ChannelInfo | null | undefined;
  const podcastsSubs = podcastsChannel?.subscriberCount ?? "";
  const fengshuiSubs = fengshuiChannel?.subscriberCount ?? "";

  const formatSubs = (s: string) => {
    if (!s) return "";
    const n = parseInt(s.replace(/,/g, ""));
    if (isNaN(n)) return s;
    if (n >= 10000) return `${(n / 10000).toFixed(1)}萬`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return s;
  };

  const allVideos = (videosData?.videos ?? []) as VideoItem[];
  const filteredVideos = videoFilter === "podcasts"
    ? allVideos.filter(v => !v.channelTitle?.includes("玄學") && !v.channelId?.includes("fengshui"))
    : videoFilter === "fengshui"
      ? allVideos.filter(v => v.channelTitle?.includes("玄學") || v.channelId?.includes("fengshui"))
      : allVideos;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebSiteSchema()} />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet={HERO_BG_MOBILE} />
            <img src={HERO_BG_DESKTOP} alt="" className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} fetchPriority="high" />
          </picture>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,9,9,0.5) 0%, rgba(13,9,9,0.3) 40%, rgba(13,9,9,0.78) 75%, rgba(13,9,9,0.97) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-24 pb-32">
          <p className="kicker mb-8 fade-up" style={{ opacity: 0 }}>HONG KONG · PODCAST · MYSTIC ARTS</p>
          <h1 className="mb-6 fade-up-delay-1" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, fontSize: "clamp(2.5rem, 7vw, 4.5rem)", lineHeight: 1.2, color: "#f0e6df", textShadow: "0 2px 24px rgba(13,9,9,0.6)" }}>
            聽見關係，<br /><span style={{ color: "var(--gold)" }}>看懂自己。</span>
          </h1>
          <p className="max-w-lg mx-auto mb-10 text-base leading-relaxed fade-up-delay-2" style={{ color: "rgba(240,230,223,0.82)", fontWeight: 300 }}>
            在愛裡探索，在命運裡提問。<br />這裡有真實對話，也有讓你重新出發的線索。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-up-delay-3">
            <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer" className="btn-gold">
              <Play className="w-4 h-4" /> 開始收聽
            </a>
            <Link href="/booking" className="btn-ghost">
              <Calendar className="w-4 h-4" /> 探索諮詢服務
            </Link>
          </div>
          {(podcastsSubs || fengshuiSubs) && (
            <div className="flex items-center justify-center gap-6 mt-12 fade-up-delay-3">
              {podcastsSubs && (
                <div className="text-center">
                  <div className="stat-num">{formatSubs(podcastsSubs)}</div>
                  <div className="text-xs mt-1" style={{ color: "rgba(240,230,223,0.55)", letterSpacing: "0.06em" }}>路邊電台訂閱</div>
                </div>
              )}
              <div style={{ width: 1, height: 36, background: "rgba(200,169,106,0.3)" }} />
              {fengshuiSubs && (
                <div className="text-center">
                  <div className="stat-num">{formatSubs(fengshuiSubs)}</div>
                  <div className="text-xs mt-1" style={{ color: "rgba(240,230,223,0.55)", letterSpacing: "0.06em" }}>玄學堂訂閱</div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs" style={{ color: "var(--gold)", letterSpacing: "0.2em", fontFamily: "'Cormorant Garamond', serif" }}>SCROLL</span>
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
        </div>
      </section>

      {/* BRAND MANIFESTO */}
      <section style={{ background: "var(--bg-raise)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container py-20 text-center max-w-2xl mx-auto">
          <span className="gold-rule mx-auto" />
          <blockquote className="text-xl leading-loose" style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 400, color: "var(--text-2)", fontStyle: "italic" }}>
            「我們不急著給你答案。<br />先陪你，聽見心裡真正的聲音。」
          </blockquote>
          <span className="gold-rule mx-auto mt-4" />
          <p className="mt-6 text-xs" style={{ color: "var(--text-3)", letterSpacing: "0.2em", fontFamily: "'Cormorant Garamond', serif" }}>
            6B PODCASTS · 路邊電台 · 路邊玄學堂
          </p>
        </div>
      </section>

      {/* CONTENT CATEGORIES */}
      <section className="container py-20">
        <div className="mb-12">
          <p className="kicker mb-3">FEATURED CONTENT</p>
          <h2 className="section-heading">精選內容方向</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTENT_CATEGORIES.map((cat) => (
            <Link key={cat.tag} href={cat.href}>
              <div className="service-card h-full group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-medium px-2 py-0.5" style={{ color: cat.color, border: `1px solid ${cat.color}`, borderRadius: "var(--radius)", letterSpacing: "0.06em", opacity: 0.85 }}>{cat.tag}</span>
                </div>
                <h3 className="text-base font-semibold mb-3" style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)" }}>{cat.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-2)" }}>{cat.desc}</p>
                <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--gold)" }}>
                  了解更多 <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* THREE DIRECTIONS */}
      <section style={{ background: "var(--bg-raise)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container py-20">
          <div className="mb-12">
            <p className="kicker mb-3">OUR UNIVERSE</p>
            <h2 className="section-heading">三個內容方向</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {THREE_DIRECTIONS.map((dir) => (
              <div key={dir.num} className="px-0 md:px-8 py-8 md:py-0 first:pl-0 last:pr-0 border-b md:border-b-0 md:border-r last:border-r-0" style={{ borderColor: "var(--line)" }}>
                <div className="mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.5rem", fontWeight: 300, color: "var(--line)", lineHeight: 1 }}>{dir.num}</div>
                <p className="kicker mb-2">{dir.tag}</p>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)" }}>{dir.title}</h3>
                <p className="text-xs mb-3" style={{ color: "var(--gold)", letterSpacing: "0.08em" }}>{dir.subtitle}</p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-2)" }}>{dir.desc}</p>
                <div className="flex flex-col gap-2">
                  <Link href={dir.href} className="text-xs flex items-center gap-1 transition-colors duration-200" style={{ color: "var(--text-3)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}>
                    <ChevronRight className="w-3 h-3" /> 進入專頁
                  </Link>
                  <a href={dir.ytHref} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 transition-colors duration-200" style={{ color: "var(--text-3)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}>
                    <Youtube className="w-3 h-3" /> YouTube 頻道
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST VIDEOS */}
      <section className="container py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="kicker mb-3">LATEST EPISODES</p>
            <h2 className="section-heading">最新節目</h2>
          </div>
          <div className="flex gap-2">
              {(["all", "podcasts", "fengshui"] as const).map((f) => (
              <button key={f} onClick={() => setVideoFilter(f)} className="text-xs px-3 py-1.5 transition-all duration-200"
                style={{ borderRadius: "var(--radius)", borderWidth: 1, borderStyle: "solid", borderColor: videoFilter === f ? "var(--gold)" : "var(--line)", background: videoFilter === f ? "rgba(200,169,106,0.12)" : "transparent", color: videoFilter === f ? "var(--gold)" : "var(--text-3)", letterSpacing: "0.04em" }}>
                {f === "all" ? "全部" : f === "podcasts" ? "路邊電台" : "玄學堂"}
              </button>
            ))}
          </div>
        </div>
        {videosLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-line">
                <div className="aspect-video" style={{ background: "var(--bg-raise)" }} />
                <div className="p-4 space-y-2">
                  <div className="h-4 rounded" style={{ background: "var(--bg-raise)", width: "80%" }} />
                  <div className="h-3 rounded" style={{ background: "var(--bg-raise)", width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVideos.slice(0, 6).map((v) => <VideoCard key={v.id} v={v} />)}
          </div>
        ) : (
          <div className="text-center py-16" style={{ color: "var(--text-3)" }}>
            <Youtube className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">暫無影片</p>
          </div>
        )}
        <div className="mt-10 text-center">
          <Link href="/episodes" className="btn-ghost">查看所有節目 <ChevronRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* CONSULTATION SERVICES */}
      <section style={{ background: "var(--bg-raise)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="kicker mb-3">CONSULTATION</p>
              <h2 className="section-heading mb-4">諮詢服務</h2>
              <span className="gold-rule" />
              <p className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: "var(--text-2)" }}>
                由 Ray 引薦的資深師傅，提供一對一命理諮詢。無論是感情困境、人生方向、還是居家風水，都可以預約傾吓。
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/booking" className="btn-gold"><Calendar className="w-4 h-4" /> 立即預約</Link>
                <a href="https://wa.me/85298729990" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <MessageCircle className="w-4 h-4" /> WhatsApp 問吓先
                </a>
              </div>
              <div className="flex gap-6 mt-10">
                <div><div className="stat-num">48h</div><div className="text-xs mt-1" style={{ color: "var(--text-3)" }}>內回覆確認</div></div>
                <div style={{ width: 1, background: "var(--line)" }} />
                <div><div className="stat-num">3+</div><div className="text-xs mt-1" style={{ color: "var(--text-3)" }}>資深師傅</div></div>
                <div style={{ width: 1, background: "var(--line)" }} />
                <div><div className="stat-num">線上</div><div className="text-xs mt-1" style={{ color: "var(--text-3)" }}>或面對面</div></div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {SERVICES.map((svc) => (
                <div key={svc.title} className="service-card">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{svc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold" style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)" }}>{svc.title}</h3>
                        <span className="text-xs flex-shrink-0" style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem" }}>{svc.price}</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>{svc.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/mystic/services" className="text-xs flex items-center gap-1 mt-2 transition-colors duration-200" style={{ color: "var(--text-3)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}>
                <ChevronRight className="w-3.5 h-3.5" /> 查看所有服務詳情
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-20 max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="kicker mb-3">FAQ</p>
          <h2 className="section-heading">常見問題</h2>
        </div>
        <div>{FAQS.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}</div>
        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-ghost">有其他問題？聯絡我們 <ChevronRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* SOCIAL STRIP */}
      <section style={{ background: "var(--bg-raise)", borderTop: "1px solid var(--line)" }}>
        <div className="container py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="kicker mb-1">FOLLOW US</p>
              <p className="text-sm" style={{ color: "var(--text-2)" }}>追蹤我們，不錯過每週新節目</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { label: "路邊電台", href: "https://www.youtube.com/@6bpodcasts", Icon: Youtube },
                { label: "玄學堂", href: "https://www.youtube.com/@6bfengshui", Icon: Youtube },
                { label: "Facebook", href: "https://www.facebook.com/6bpodcasts", Icon: Facebook },
                { label: "Instagram", href: "https://www.instagram.com/6bpodcasts", Icon: Instagram },
                { label: "Spotify", href: "https://spoti.fi/30EQPOT", Icon: Music },
                { label: "Apple Podcast", href: "https://apple.co/3nhSxy8", Icon: Mic },
              ].map(({ label, href, Icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs px-3 py-2 transition-all duration-200"
                  style={{ borderWidth: 1, borderStyle: "solid", borderColor: "var(--line)", borderRadius: "var(--radius)", color: "var(--text-3)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
