import React from "react";
import { Calendar, Clock3, Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SHORT_HIGHLIGHTS = [
  {
    id: "xZOWb5stFwA",
    poster: "/manus-storage/xZOWb5stFwA_1e8d4bcf.webp",
    cropAnchor: "50% 50%",
    reviewNote: "已核對：主講人面部與「極品姊弟戀」字幕均在直式安全區。",
  },
  {
    id: "UtAp2jnVePs",
    poster: "/manus-storage/UtAp2jnVePs_ee3e6ddf.webp",
    cropAnchor: "50% 50%",
    reviewNote: "已核對：主講人面部與兩性提問字幕均在直式安全區。",
  },
  {
    id: "NFKhiVdBSf4",
    poster: "/manus-storage/NFKhiVdBSf4_27b88bc2.webp",
    cropAnchor: "50% 50%",
    reviewNote: "已核對：人物輪廓與關係衝突標題均在直式安全區。",
  },
  {
    id: "5L4QXL5Utng",
    poster: "/manus-storage/5L4QXL5Utng_1cc9f835.webp",
    cropAnchor: "50% 50%",
    reviewNote: "已核對：主講人、話筒及提問字幕均在直式安全區。",
  },
] as const;

export type ShortHighlightVideo = {
  id: string;
  title: string;
  url: string;
  duration: string | null;
};

export type HighlightItem = ShortHighlightVideo & {
  poster: string;
  cropAnchor: string;
  reviewNote: string;
};

export function getShortHighlights(videos: ShortHighlightVideo[]): HighlightItem[] {
  return SHORT_HIGHLIGHTS.reduce<HighlightItem[]>((highlights, item) => {
    const video = videos.find((candidate) => candidate.id === item.id);
    if (video) highlights.push({ ...video, ...item });
    return highlights;
  }, []);
}

export function ShortHighlightCard({ video }: { video: HighlightItem }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[9/16] overflow-hidden border border-line transition-transform duration-200 motion-reduce:transition-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
      style={{ background: "var(--bg-raise)" }}
      aria-label={`在 YouTube 觀看：${video.title}`}
    >
      <img
        src={video.poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ objectPosition: video.cropAnchor }}
        loading="lazy"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(13,9,9,0.05) 20%, rgba(13,9,9,0.94) 100%)" }} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/55 px-4 py-3 text-xs font-medium shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all duration-200 motion-reduce:transition-none group-hover:-translate-y-1 group-hover:scale-110 group-focus-visible:-translate-y-1 group-focus-visible:scale-110 group-active:scale-95" style={{ color: "#f0e6df" }}>
          <span className="flex size-7 items-center justify-center rounded-full" style={{ background: "var(--gold)", color: "#0d0909" }}>
            <Play className="ml-0.5 size-3.5" fill="currentColor" strokeWidth={1.8} />
          </span>
          觀看精華
        </div>
      </div>
      <div className="absolute left-4 top-4 flex items-center gap-2 text-[10px] tracking-[0.16em]" style={{ color: "var(--gold)" }}>
        <span className="size-1.5 rounded-full" style={{ background: "var(--red-bright)" }} />
        短影音精華
      </div>
      <div className="absolute inset-x-4 bottom-4">
        <h3 className="line-clamp-3 text-base font-semibold leading-snug" style={{ color: "#f0e6df", fontFamily: "'Noto Serif TC', serif" }}>
          {video.title}
        </h3>
        <div className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: "rgba(240,230,223,0.65)" }}>
          <Clock3 className="size-3.5" /> {video.duration || "短片"}
        </div>
      </div>
    </a>
  );
}

export function ShortHighlightsSection({ videos, loading }: { videos: ShortHighlightVideo[]; loading: boolean }) {
  const shortHighlights = getShortHighlights(videos);

  return (
    <section id="short-highlights" className="border-y border-line" style={{ background: "var(--bg-deep)" }}>
      <div className="container py-16 md:py-20">
        <div className="mb-9 max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl" style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)" }}>
            短影音精華：先睇到自己，再講下一步。
          </h2>
          <p className="text-sm leading-7 md:text-base" style={{ color: "var(--text-2)" }}>
            每條只留一個關係衝突。睇完覺得講中你，先再決定要唔要按自己個案傾。
          </p>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden" aria-label="短影音精華載入中">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-[9/16] w-[72%] shrink-0 animate-pulse sm:w-[39%] lg:w-[24%]" style={{ background: "var(--bg-raise)" }} />
            ))}
          </div>
        ) : shortHighlights.length > 0 ? (
          <Carousel opts={{ align: "start", containScroll: "trimSnaps" }} className="px-0 md:px-11">
            <CarouselContent>
              {shortHighlights.map((video) => (
                <CarouselItem key={video.id} className="basis-[72%] sm:basis-[39%] lg:basis-[26%]">
                  <ShortHighlightCard video={video} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 hidden border-line bg-[var(--bg-card)] text-[var(--gold)] hover:bg-[var(--bg-raise)] md:flex" />
            <CarouselNext className="right-0 hidden border-line bg-[var(--bg-card)] text-[var(--gold)] hover:bg-[var(--bg-raise)] md:flex" />
          </Carousel>
        ) : (
          <div className="border border-dashed border-line px-6 py-10 text-center" style={{ background: "var(--bg-raise)" }}>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>短影音精華整理中，稍後會喺呢度更新。</p>
          </div>
        )}

        <div className="mt-9 flex flex-col items-start justify-between gap-5 border-t border-line pt-7 md:flex-row md:items-center">
          <p className="max-w-xl text-sm leading-7" style={{ color: "var(--text-3)" }}>
            你唔需要即刻有答案。想按自己嘅情況拆局，可以先了解一對一安排。
          </p>
          <a href="/booking" className="btn-gold shrink-0">
            預約一對一 <Calendar className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
