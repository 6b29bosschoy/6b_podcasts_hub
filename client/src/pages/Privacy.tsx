import { useSEO } from "@/hooks/useSEO";
import { SITE_URL } from "@/components/JsonLd";

export default function Privacy() {
  useSEO({
    title: "私隱政策及個人資料收集聲明｜6B Podcasts",
    description: "了解 6B Podcasts 如何收集、使用及保護你的個人資料，包括匿名投稿、預約查詢及聯絡資料。",
    canonical: `${SITE_URL}/privacy`,
  });

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: "var(--bg)" }}>
      <div className="container max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-black mb-6" style={{ color: "var(--text)", fontFamily: "'Noto Serif TC', serif" }}>私隱政策及個人資料收集聲明</h1>

        <section className="mb-8">
          <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>我哋收集咩資料？</h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-2)" }}>
            當你使用感情樹窿匿名投稿、預約查詢或聯絡表格時，我哋可能會收集以下資料：
          </p>
          <ul className="text-sm leading-relaxed list-disc pl-5" style={{ color: "var(--text-2)" }}>
            <li>你提供嘅花名、性別、年齡層、感情狀態及問題描述</li>
            <li>你自願提供嘅聯絡方式（例如 WhatsApp、IG、Telegram 或電郵）</li>
            <li>你嘅 UTM 來源參數（用於了解內容推廣成效）</li>
            <li>你嘅瀏覽器及裝置資料（用於網站分析）</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>我哋點用你嘅資料？</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            收集嘅資料只會用於：回覆你嘅查詢、安排預約服務、整理匿名投稿內容（經審核及去識別化後先會公開）、改善網站內容及分析推廣成效。我哋唔會將你嘅個人資料出售或轉售畀第三方。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>匿名投稿嘅處理</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            感情樹窿投稿預設匿名處理。除非你明確同意，否則我哋唔會公開你嘅聯絡方式或可識別身份嘅資料。投稿內容會經過審核，並以不識別身份方式分享。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>第三方服務</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            本網站使用 Google Analytics 4、Meta Pixel 及 Microsoft Clarity 作流量及行為分析。呢啲服務可能會收集你嘅瀏覽器及裝置資料，並受其各自私隱政策約束。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>你嘅權利</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            你可以隨時聯絡我哋，要求查閱、更正或刪除你嘅個人資料。如有查詢，請透過 WhatsApp 或電郵聯絡我哋。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>聯絡我哋</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            如對本私隱政策有任何疑問，歡迎透過 <a href="https://wa.me/85298729990" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--gold)" }}>WhatsApp</a> 聯絡我哋。
          </p>
        </section>
      </div>
    </div>
  );
}
