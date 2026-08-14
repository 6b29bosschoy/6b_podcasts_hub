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

export default function EpisodeDetail({ id }: { id: string }) {
  const { data, isLoading, error } = trpc.youtube.getVideoById.useQuery({ id });
  const video = data?.video as Video | undefined;

  useSEO({
    title: video ? `${video.title}｜路邊電台節目` : "節目詳情｜路邊電台",
    description: video ? summaryFromDescription(video.description).slice(0, 150) : "收聽路邊電台最新節目。",
    canonical: `${SITE_URL}/episodes/${id}`,
  });

  useEffect(() => {
    if (video) trackEvent("video_play", { video_id: video.id, title: video.title });
  }, [video]);

  const timestamps = useMemo(() => (video ? parseTimestamps(video.description) : []), [video]);
  const summary = useMemo(() => (video ? summaryFromDescription(video.description) : ""), [video]);

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
                <Link href="/treehole" className="btn-gold text-center" onClick={() => trackEvent("treehole_submit", { source: "episode_detail" })}>
                  <PenLine className="w-4 h-4" /> 匿名投稿
                </Link>
                <a href="https://wa.me/85298729990?text=你好，我想先問清楚服務安排" target="_blank" rel="noopener noreferrer" className="btn-ghost text-center" onClick={() => trackEvent("whatsapp_click", { source: "episode_detail" })}>
                  <MessageCircle className="w-4 h-4" /> WhatsApp先問清楚
                </a>
                <Link href="/booking" className="btn-ghost text-center" onClick={() => trackEvent("booking_submit", { source: "episode_detail" })}>
                  <Calendar className="w-4 h-4" /> 預約一對一
                </Link>
              </div>
            </div>

            <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
              <h2 className="text-sm font-black mb-3" style={{ color: "var(--text)" }}>相關內容</h2>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/episodes" style={{ color: "var(--gold)" }}>最新節目</Link>
                <Link href="/blog" style={{ color: "var(--gold)" }}>感情故事</Link>
                <Link href="/mystic" style={{ color: "var(--gold)" }}>路邊玄學堂</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
