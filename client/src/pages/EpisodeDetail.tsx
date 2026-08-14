import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import { JsonLd, SITE_URL } from "@/components/JsonLd";
import { trackEvent } from "@/lib/analytics";
import { Play, Clock, Eye, MessageCircle, PenLine, Calendar } from "lucide-react";

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
  channelTitle: string;
  url: string;
};

type RelatedArticle = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  coverImage: string | null;
};

function parseTimestamps(description: string) {
  const lines = description.split(/\r?\n/);
  const items: Array<{ time: string; label: string }> = [];
  for (const line of lines) {
    const match = line.match(/(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]?\s*(.+)/);
    if (match) items.push({ time: match[1], label: match[2].trim() });
  }
  return items.slice(0, 8);
}

function summaryFromDescription(description: string) {
  const paragraphs = description.split(/\r?\n/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.slice(0, 3).join(" ");
}

function durationToIso(duration: string): string {
  const values = duration.split(":").map(Number);
  if (!values.every(Number.isFinite)) return "PT0S";
  const [hours, minutes, seconds] = values.length === 3 ? values : [0, values[0] ?? 0, values[1] ?? 0];
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${seconds ?? 0}S`;
}

function guestFromDescription(description: string): string | null {
  const line = description.split(/\r?\n/).find((item) => /^\s*(?:嘉賓|guest|受訪者)\s*[：:]/i.test(item));
  return line?.replace(/^\s*(?:嘉賓|guest|受訪者)\s*[：:]\s*/i, "").trim() || null;
}

function extractKeywords(text: string): Set<string> {
  const normalised = text.toLowerCase().replace(/[^\u4e00-\u9fffa-z0-9]/g, "");
  const english = text.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
  const chineseCharacters = (normalised.match(/[\u4e00-\u9fff]/g) ?? []);
  const chineseBigrams = chineseCharacters.reduce<string[]>((keywords, char, index) => index < chineseCharacters.length - 1 ? [...keywords, `${char}${chineseCharacters[index + 1]}`] : keywords, []);
  return new Set([...english, ...chineseBigrams].filter((keyword) => keyword.length > 1));
}

function relevanceScore(reference: string, candidate: string): number {
  const referenceKeywords = extractKeywords(reference);
  const candidateKeywords = extractKeywords(candidate);
  return Array.from(referenceKeywords).filter((keyword) => candidateKeywords.has(keyword)).length;
}

export default function EpisodeDetail({ id }: { id: string }) {
  const { data, isLoading, error } = trpc.youtube.getVideoById.useQuery({ id });
  const video = data?.video as Video | undefined;
  const { data: relatedVideosData } = trpc.youtube.getVideos.useQuery({ channel: "all", limit: 6 });
  const episodeReference = useMemo(() => video ? `${video.title} ${video.description}`.slice(0, 6000) : "節目", [video]);
  const { data: relatedArticlesData } = trpc.blog.relatedToEpisode.useQuery({ reference: episodeReference, limit: 3 }, { enabled: !!video });

  useSEO({
    title: video ? `${video.title}｜路邊電台節目` : "節目詳情｜路邊電台",
    description: video ? summaryFromDescription(video.description).slice(0, 150) : "收聽路邊電台最新節目。",
    canonical: `${SITE_URL}/episodes/${id}`,
  });

  const timestamps = useMemo(() => (video ? parseTimestamps(video.description) : []), [video]);
  const summary = useMemo(() => (video ? summaryFromDescription(video.description) : ""), [video]);
  const guest = useMemo(() => (video ? guestFromDescription(video.description) : null), [video]);
  const relatedVideos = useMemo(() => {
    if (!video) return [];
    const reference = `${video.title} ${video.description}`;
    return ((relatedVideosData?.videos ?? []) as Video[])
      .filter((item) => item.id !== id)
      .map((item) => ({ item, score: relevanceScore(reference, `${item.title} ${item.description}`) + (item.channelTitle === video.channelTitle ? 2 : 0) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ item }) => item);
  }, [relatedVideosData, video, id]);
  const relatedArticles = useMemo(() => (relatedArticlesData ?? []) as RelatedArticle[], [relatedArticlesData]);

  if (isLoading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center" style={{ color: "var(--text-3)" }}>載入節目資料中…</div>;
  }

  if (error || !video) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-3" style={{ color: "var(--text)" }}>搵唔到呢條節目</h1>
          <Link href="/episodes" className="text-sm" style={{ color: "var(--gold)" }}>返回最新節目</Link>
        </div>
      </div>
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: summary,
    thumbnailUrl: video.thumbnail,
    uploadDate: video.publishedAt,
    duration: durationToIso(video.duration),
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    url: `${SITE_URL}/episodes/${video.id}`,
  };

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: "var(--bg)" }}>
      <JsonLd data={schema} id={`episode-${video.id}`} />
      <div className="container max-w-5xl mx-auto py-10">
        <Link href="/episodes" className="text-sm mb-6 inline-block" style={{ color: "var(--gold)" }}>← 返回最新節目</Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-8">
          <div>
            <div className="aspect-video rounded-xl overflow-hidden mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <a href={video.url} target="_blank" rel="noopener noreferrer" className="mb-6 inline-flex items-center gap-2 text-sm font-bold" style={{ color: "var(--gold)" }} onClick={() => {
              trackEvent("video_play", { video_id: video.id, content_type: "youtube" });
              trackEvent("outbound_youtube", { video_id: video.id, destination: "youtube" });
            }}>
              <Play className="h-4 w-4" aria-hidden="true" /> 在 YouTube 觀看完整版
            </a>

            <h1 className="text-2xl md:text-3xl font-black mb-4" style={{ color: "var(--text)", fontFamily: "'Noto Serif TC', serif" }}>{video.title}</h1>
            <div className="flex items-center gap-4 text-xs mb-6" style={{ color: "var(--text-3)" }}>
              <span className="flex items-center gap-1"><Eye size={12} /> {video.viewCount} 次觀看</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {video.duration}</span>
              <span>{new Date(video.publishedAt).toLocaleDateString("zh-HK")}</span>
            </div>

            <section className="mb-8">
              <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>節目摘要</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{summary || "呢條節目暫時未有詳細摘要，歡迎直接觀看完整內容。"}</p>
            </section>

            <section className="mb-8 rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
              <h2 className="text-lg font-black mb-2" style={{ color: "var(--text)" }}>嘉賓介紹</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                {guest ? `YouTube 描述列明嘅嘉賓：${guest}` : "此集 YouTube 描述未有明確標註嘉賓資料，所以唔會估算或補寫。"}
              </p>
            </section>

            {timestamps.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>時間軸</h2>
                <div className="flex flex-col gap-2">
                  {timestamps.map((item) => (
                    <div key={`${item.time}-${item.label}`} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-2)" }}>
                      <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: "var(--bg-card)", color: "var(--gold)" }}>{item.time}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
              <h2 className="text-sm font-black mb-3" style={{ color: "var(--text)" }}>有共鳴？</h2>
              <p className="text-xs mb-4" style={{ color: "var(--text-3)" }}>如果你都有類似感情困局，可以匿名投稿，或者先 WhatsApp 問清楚服務安排。</p>
              <div className="flex flex-col gap-2">
                <Link href="/treehole" className="btn-gold text-center">
                  <PenLine className="w-4 h-4" /> 匿名投稿
                </Link>
                <a href="https://wa.me/85298729990?text=你好，我想先問清楚服務安排" target="_blank" rel="noopener noreferrer" className="btn-ghost text-center" onClick={() => trackEvent("whatsapp_click", { source: "episode_detail" })}>
                  <MessageCircle className="w-4 h-4" /> WhatsApp先問清楚
                </a>
                <Link href="/booking" className="btn-ghost text-center">
                  <Calendar className="w-4 h-4" /> 預約一對一
                </Link>
              </div>
            </div>

            {(relatedVideos.length > 0 || relatedArticles.length > 0) && <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
              <h2 className="text-sm font-black mb-3" style={{ color: "var(--text)" }}>相關內容</h2>
              <div className="flex flex-col gap-3">
                {relatedVideos.map((item) => <Link key={item.id} href={`/episodes/${item.id}`} className="group overflow-hidden rounded-lg" style={{ border: "1px solid var(--line)" }}>
                  <img src={item.thumbnail} alt={item.title} className="aspect-video w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" />
                  <p className="p-2 text-xs font-bold leading-5" style={{ color: "var(--text)" }}>{item.title}</p>
                </Link>)}
                {relatedArticles.map((article) => <Link key={article.slug} href={`/blog/${article.slug}`} className="rounded-lg p-3 transition-opacity hover:opacity-80" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
                  <p className="text-[11px]" style={{ color: "var(--gold)" }}>相關文章</p>
                  <p className="mt-1 text-xs font-bold leading-5" style={{ color: "var(--text)" }}>{article.title}</p>
                </Link>)}
              </div>
            </div>}
          </aside>
        </div>
      </div>
    </div>
  );
}
