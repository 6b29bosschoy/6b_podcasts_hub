import { Link } from "wouter";
import {
  ArrowRight,
  Calendar,
  Check,
  CircleHelp,
  FileText,
  Handshake,
  HeartHandshake,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { JsonLd, buildBreadcrumbSchema, SITE_URL } from "@/components/JsonLd";
import { useSEO } from "@/hooks/useSEO";

const HERO_IMAGE = "/manus-storage/monetization-plan-hero_10c74cd7.jpg";

const REFERRAL_STEPS = [
  {
    step: "01",
    title: "由一條關係片開始",
    body: "你可以先睇節目、留言，或者匿名講低自己遇到嘅問題。不需要一開始就預約。",
    Icon: Play,
  },
  {
    step: "02",
    title: "先講清楚你想解決咩",
    body: "用 DM 或預約表講低你在意嘅關係困局。我哋會先了解問題，再建議適合嘅下一步。",
    Icon: MessageCircle,
  },
  {
    step: "03",
    title: "同意後先安排轉介",
    body: "如個案適合一對一諮詢，會先講清楚服務形式、可約時間同收費範圍；你同意先安排。",
    Icon: UserRoundCheck,
  },
  {
    step: "04",
    title: "由師傅按個案拆局",
    body: "感情方向、八字命理或家居風水，都以你實際問題為先。玄學係拆局工具，唔係取代你自己決定。",
    Icon: Sparkles,
  },
];

const REFERRAL_POINTS = [
  "適合：曖昧、冷淡、復合、信任受損，或者人生方向卡住嘅時候。",
  "查詢資料只用於跟進該次預約；未經你同意，唔會把聯絡方式或問題內容交畀師傅。",
  "如要安排轉介，會先確認要提供咩資料、服務形式及收費範圍，再由你決定是否繼續。",
];

const BRAND_DELIVERABLES = [
  {
    title: "單集自然置入",
    body: "在適合嘅關係議題入面，將品牌放進真實對話，而唔係硬插產品介紹。",
    Icon: HeartHandshake,
  },
  {
    title: "直式短片延伸",
    body: "由長片剪出一條可獨立理解嘅 30–45 秒直式短片，方便放上社交平台測試反應。",
    Icon: Play,
  },
  {
    title: "一個可追蹤入口",
    body: "每次合作只定一個下一步，例如查詢、登記或專屬連結，方便你睇到真正回應。",
    Icon: FileText,
  },
];

const BRAND_STEPS = [
  "先講清楚品牌想接觸邊類人，同想觀眾做咩下一步。",
  "一齊揀合適題目，再確認內容角度、交付形式及修改次數。",
  "上線後交回基礎平台數據，同下一輪內容測試建議。",
];

const FAQS = [
  {
    question: "路邊電台係咪直接提供命理服務？",
    answer: "路邊電台負責用內容幫觀眾整理問題，同按需要轉介合適師傅。實際一對一服務由師傅按個案安排。",
  },
  {
    question: "想預約，係咪一定要先講好多私人資料？",
    answer: "唔需要。你可以先簡單講問題同希望嘅形式；查詢資料只用於跟進該次預約。未經你同意，唔會把聯絡方式或問題內容交畀師傅。",
  },
  {
    question: "品牌合作有冇固定價目？",
    answer: "暫時以合作目標、片段形式、平台分發及內容使用範圍逐次報價。先對齊交付，再講預算，會比一張空泛價目表更準確。",
  },
];

export default function MonetizationPlan() {
  useSEO({
    title: "點樣合作與預約｜師傅轉介 × 品牌內容合作｜6B Podcast",
    description: "6B Podcast 用兩性內容連接真實關係問題，再按需要安排師傅轉介；同時為品牌提供關係議題內容合作及可追蹤的查詢入口。",
    keywords: "香港兩性關係,師傅轉介,感情諮詢,玄學服務預約,品牌內容合作,香港 Podcast 合作",
    ogTitle: "師傅轉介 × 品牌內容合作｜6B Podcast",
    ogDescription: "由關係內容開始，清楚了解一對一轉介與品牌合作點樣運作。",
    ogImage: `${SITE_URL}${HERO_IMAGE}`,
    ogUrl: `${SITE_URL}/monetization-plan`,
    canonical: `${SITE_URL}/monetization-plan`,
  });

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "點樣合作與預約｜6B Podcast",
    description: "6B Podcast 的師傅轉介與品牌內容合作說明頁。",
    url: `${SITE_URL}/monetization-plan`,
    inLanguage: "zh-HK",
    about: ["兩性關係內容", "師傅轉介", "品牌內容合作"],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)" }}>
      <JsonLd
        id="monetization-plan"
        data={[
          pageSchema,
          faqSchema,
          buildBreadcrumbSchema([
            { name: "首頁", url: SITE_URL },
            { name: "點樣合作與預約", url: `${SITE_URL}/monetization-plan` },
          ]),
        ]}
      />

      <section className="relative isolate overflow-hidden border-b border-line pt-14">
        <div className="absolute inset-0 -z-20" style={{ background: "var(--bg-deep)" }} />
        <img
          src={HERO_IMAGE}
          alt="深色木桌上的匿名信與茶杯"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(90deg, rgba(7,5,5,0.98) 0%, rgba(7,5,5,0.88) 40%, rgba(7,5,5,0.40) 100%)" }} />
        <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg, rgba(13,9,9,0.15) 0%, rgba(13,9,9,0.90) 100%)" }} />

        <div className="container relative z-10 grid min-h-[590px] items-end py-16 md:py-20 lg:grid-cols-12 lg:py-20">
          <div className="max-w-2xl lg:col-span-7">
            <div className="mb-6 flex items-center gap-3 text-xs tracking-[0.18em]" style={{ color: "var(--gold)" }}>
              <span className="block h-px w-10" style={{ background: "var(--gold)" }} />
              點樣合作與預約
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-[1.18] md:text-5xl lg:text-6xl" style={{ color: "var(--text)" }}>
              先聽明你嘅問題，
              <br />
              再講下一步。
            </h1>
            <p className="mb-8 max-w-xl text-base leading-8 md:text-lg" style={{ color: "var(--text-2)" }}>
              路邊電台用兩性內容打開對話；需要時，再按你嘅個案安排合適師傅，或者同品牌一齊做有意義嘅內容合作。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/booking" className="btn-gold justify-center sm:justify-start">
                預約一對一 <Calendar size={16} strokeWidth={1.75} />
              </Link>
              <a href="#brand" className="btn-ghost justify-center sm:justify-start">
                查看合作方法 <ArrowRight size={16} strokeWidth={1.75} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <p className="channel-tag-red mb-4">FOR INDIVIDUALS</p>
            <h2 className="section-heading mb-5">師傅轉介，唔係硬推服務。</h2>
            <p className="max-w-md text-sm leading-7" style={{ color: "var(--text-2)" }}>
              當你真係有一個想拆嘅關係問題，先值得搵人一對一傾。呢個流程由你嘅問題出發，唔係由一堆玄學名詞出發。
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-px overflow-hidden border border-line md:grid-cols-2" style={{ background: "var(--line)" }}>
              {REFERRAL_STEPS.map(({ step, title, body, Icon }) => (
                <article key={step} className="relative min-h-60 p-7 md:p-8" style={{ background: "var(--bg-card)" }}>
                  <div className="mb-8 flex items-start justify-between">
                    <Icon size={24} strokeWidth={1.4} style={{ color: "var(--gold)" }} />
                    <span className="text-xs tracking-[0.16em]" style={{ color: "var(--text-3)" }}>STEP {step}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{title}</h3>
                  <p className="text-sm leading-7" style={{ color: "var(--text-2)" }}>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line" style={{ background: "var(--bg-raise)" }}>
        <div className="container grid gap-10 py-16 md:py-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="mb-5 flex size-12 items-center justify-center border border-gold/30" style={{ background: "rgba(200,169,106,0.08)", color: "var(--gold)" }}>
              <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <h2 className="section-heading mb-4">你有選擇權，亦有時間慢慢諗。</h2>
            <p className="max-w-xl text-sm leading-7" style={{ color: "var(--text-2)" }}>
              預約前，先知道自己會面對咩形式同要準備咩。師傅安排只係一個選項；你可以先睇片、先投稿，或者先問清楚。
            </p>
          </div>
          <div className="space-y-0 border-y border-line lg:col-span-7 lg:border-y-0 lg:border-l">
            {REFERRAL_POINTS.map((point) => (
              <div key={point} className="flex gap-4 border-b border-line px-0 py-5 last:border-b-0 lg:px-8">
                <Check className="mt-1 shrink-0" size={16} strokeWidth={2} style={{ color: "var(--gold)" }} />
                <p className="text-sm leading-7" style={{ color: "var(--text-2)" }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="brand" className="scroll-mt-20 container py-16 md:py-24">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="channel-tag-gold mb-4">FOR BRANDS</p>
          <h2 className="section-heading mb-5">品牌合作，賣嘅唔只係曝光。</h2>
          <p className="text-sm leading-7" style={{ color: "var(--text-2)" }}>
            我哋先由品牌想接觸邊類人、想建立咩對話開始，再定一個真係做得到、睇得到回應嘅內容合作試點。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {BRAND_DELIVERABLES.map(({ title, body, Icon }, index) => (
            <article key={title} className="card-line flex min-h-72 flex-col p-7">
              <div className="mb-14 flex items-start justify-between">
                <Icon size={25} strokeWidth={1.4} style={{ color: index === 0 ? "var(--red-bright)" : "var(--gold)" }} />
                <span className="text-xs" style={{ color: "var(--text-3)" }}>0{index + 1}</span>
              </div>
              <div className="mt-auto">
                <h3 className="mb-3 text-xl font-semibold">{title}</h3>
                <p className="text-sm leading-7" style={{ color: "var(--text-2)" }}>{body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-8 border border-line p-7 md:grid-cols-12 md:p-10" style={{ background: "var(--bg-card)" }}>
          <div className="md:col-span-4">
            <h3 className="text-2xl font-semibold">由第一次傾，到上線後檢討。</h3>
          </div>
          <ol className="space-y-5 md:col-span-8">
            {BRAND_STEPS.map((step, index) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] gap-4">
                <span className="text-sm" style={{ color: "var(--gold)" }}>0{index + 1}</span>
                <p className="text-sm leading-7" style={{ color: "var(--text-2)" }}>{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-line pt-8 md:flex-row md:items-center">
          <p className="max-w-xl text-sm leading-7" style={{ color: "var(--text-3)" }}>
            未有一張預設價目表，因為合作內容、平台分發同使用範圍都會影響工作量。先對齊交付，再講預算。
          </p>
          <Link href="/partnership" className="btn-red whitespace-nowrap">
            合作查詢 <Handshake size={16} strokeWidth={1.75} />
          </Link>
        </div>
      </section>

      <section className="border-y border-line" style={{ background: "var(--bg-raise)" }}>
        <div className="container py-16 md:py-20">
          <div className="mb-10 max-w-xl">
            <p className="channel-tag-red mb-4">FAQ</p>
            <h2 className="section-heading">先講清楚，先至傾得舒服。</h2>
          </div>
          <div className="grid gap-x-12 gap-y-0 md:grid-cols-2">
            {FAQS.map((faq) => (
              <article key={faq.question} className="border-t border-line py-6">
                <div className="mb-3 flex gap-3">
                  <CircleHelp className="mt-0.5 shrink-0" size={17} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                  <h3 className="text-base font-semibold">{faq.question}</h3>
                </div>
                <p className="pl-7 text-sm leading-7" style={{ color: "var(--text-2)" }}>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="relative overflow-hidden border border-gold/30 p-8 md:p-12" style={{ background: "linear-gradient(135deg, rgba(139,46,46,0.18), rgba(22,13,13,0.92) 55%, rgba(200,169,106,0.10))" }}>
          <div className="absolute right-0 top-0 h-full w-1/3" style={{ background: "radial-gradient(circle at 100% 0%, rgba(200,169,106,0.16), transparent 68%)" }} />
          <div className="relative max-w-2xl">
            <p className="channel-tag-gold mb-4">NEXT STEP</p>
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">你可以由一個問題開始。</h2>
            <p className="mb-8 text-sm leading-7 md:text-base" style={{ color: "var(--text-2)" }}>
              想按自己情況搵人傾，就預約一對一；想同我哋一齊做關係內容，就由一個合作想法開始。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/booking" className="btn-gold justify-center">
                預約一對一 <Calendar size={16} strokeWidth={1.75} />
              </Link>
              <Link href="/partnership" className="btn-ghost justify-center">
                合作查詢 <ArrowRight size={16} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
