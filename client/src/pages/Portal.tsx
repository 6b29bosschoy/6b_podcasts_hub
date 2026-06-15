/**
 * Portal.tsx -- 6B Podcasts SaaS-taste redesign
 * Dials: DESIGN_VARIANCE:7  MOTION_INTENSITY:5  VISUAL_DENSITY:3
 * Pre-flight: zero em-dashes, dark-only, Phosphor icons, prefers-reduced-motion
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  MicrophoneStage,
  MagicWand,
  ArrowRight,
  Star,
  Users,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

type Channel = "podcasts" | "mystic" | null;

function FeaturePill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/8 border border-white/12 text-white/55">
      {label}
    </span>
  );
}

type CardCfg = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  accent: string;
  glow: string;
  border: string;
  bg: string;
  iconBg: string;
  glowX: string;
  delay: number;
};

function ChannelCard({
  channel,
  isHovered,
  isOtherSelected,
  onEnter,
  onLeave,
  onClick,
}: {
  channel: Channel;
  isHovered: boolean;
  isOtherSelected: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const isPodcasts = channel === "podcasts";

  const podcastsCfg: CardCfg = {
    icon: <MicrophoneStage weight="fill" size={36} />,
    title: "路邊電台",
    subtitle: "6B Podcasts",
    tagline: "香港最真實的人物訪談",
    description: "兩性討論、運動健身、嘉賓專欄。每週更新，直播不設限。",
    features: ["嘉賓訪談", "兩性討論", "運動健身", "直播節目"],
    cta: "進入電台",
    accent: "oklch(0.62 0.24 25)",
    glow: "oklch(0.62 0.24 25 / 0.18)",
    border: "oklch(0.62 0.24 25 / 0.35)",
    bg: "linear-gradient(145deg, oklch(0.10 0.03 25) 0%, oklch(0.07 0.01 260) 100%)",
    iconBg: "oklch(0.14 0.04 25)",
    glowX: "30%",
    delay: 0.1,
  };

  const mysticCfg: CardCfg = {
    icon: <MagicWand weight="fill" size={36} />,
    title: "路邊玄學堂",
    subtitle: "Mystic Studio",
    tagline: "中西玄學 AI 分析平台",
    description: "八字命盤、紫微斗數、塔羅占星、阿卡西紀錄。一次輸入，十二派別解讀。",
    features: ["八字命盤", "紫微斗數", "塔羅占星", "阿卡西紀錄"],
    cta: "進入玄學堂",
    accent: "oklch(0.68 0.20 280)",
    glow: "oklch(0.68 0.20 280 / 0.18)",
    border: "oklch(0.68 0.20 280 / 0.35)",
    bg: "linear-gradient(145deg, oklch(0.09 0.04 280) 0%, oklch(0.07 0.01 260) 100%)",
    iconBg: "oklch(0.13 0.04 280)",
    glowX: "70%",
    delay: 0.2,
  };

  const cfg = isPodcasts ? podcastsCfg : mysticCfg;

  return (
    <div
      className="relative flex flex-col h-full cursor-pointer overflow-hidden select-none"
      style={{ background: cfg.bg }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 60% 55% at ${cfg.glowX} 40%, ${cfg.glow}, transparent)`,
          opacity: isHovered ? 1 : 0.35,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{ background: "oklch(0.07 0.01 260)", opacity: isOtherSelected ? 1 : 0 }}
      />
      <div
        className="relative z-10 flex flex-col h-full p-8 md:p-10 lg:p-14 transition-opacity duration-300"
        style={{ opacity: isOtherSelected ? 0 : 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: cfg.delay, duration: 0.55, ease: "easeOut" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: cfg.iconBg,
              border: `1px solid ${cfg.border}`,
              color: cfg.accent,
              boxShadow: isHovered ? `0 0 24px ${cfg.glow}` : "none",
              transition: "box-shadow 0.4s ease",
            }}
          >
            {cfg.icon}
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: cfg.accent }}>
            {cfg.subtitle}
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Noto Serif HK', serif" }}
          >
            {cfg.title}
          </h2>
          <p className="mt-2 text-sm text-white/55 font-light">{cfg.tagline}</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: cfg.delay + 0.2, duration: 0.55 }}
          className="mt-5 text-sm text-white/45 leading-relaxed max-w-xs"
        >
          {cfg.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: cfg.delay + 0.3, duration: 0.5 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {cfg.features.map((f) => (
            <FeaturePill key={f} label={f} />
          ))}
        </motion.div>

        <div className="flex-1 min-h-[24px]" />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: cfg.delay + 0.4, duration: 0.5 }}
        >
          <button
            className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300"
            style={{
              background: isHovered ? cfg.accent : cfg.iconBg,
              color: isHovered ? "oklch(0.98 0 0)" : "oklch(0.80 0.01 60)",
              border: `1px solid ${cfg.border}`,
              boxShadow: isHovered ? `0 4px 28px ${cfg.glow}` : "none",
              minHeight: "48px",
            }}
          >
            <span>{cfg.cta}</span>
            <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function Portal() {
  const [hovered, setHovered] = useState<Channel>(null);
  const [selected, setSelected] = useState<Channel>(null);
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: channels } = trpc.youtube.getChannels.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    document.title = "路邊系列 | 選擇你的頻道";
  }, []);

  useEffect(() => {
    if (!selected) return;
    const timer = setTimeout(() => {
      navigate(selected === "podcasts" ? "/home" : "/mystic");
    }, 700);
    return () => clearTimeout(timer);
  }, [selected, navigate]);

  const formatSubs = (n?: number | null) => {
    if (!n) return null;
    if (n >= 10000) return `${(n / 10000).toFixed(1)}萬`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return `${n}`;
  };

  const podcastSubs = (channels?.podcasts as { subscriberCount?: number } | null)?.subscriberCount;
  const fengshuiSubs = (channels?.fengshui as { subscriberCount?: number } | null)?.subscriberCount;
  const totalSubs = (podcastSubs ?? 0) + (fengshuiSubs ?? 0);

  const leftW = selected === "podcasts" ? "100%" : selected === "mystic" ? "0%" : hovered === "podcasts" ? "60%" : hovered === "mystic" ? "40%" : "50%";
  const rightW = selected === "mystic" ? "100%" : selected === "podcasts" ? "0%" : hovered === "mystic" ? "60%" : hovered === "podcasts" ? "40%" : "50%";

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col" style={{ background: "oklch(0.07 0.01 260)" }}>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 md:px-10"
        style={{ borderBottom: "1px solid oklch(0.16 0.02 260)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.62 0.24 25)", boxShadow: "0 0 12px oklch(0.62 0.24 25 / 0.45)" }}
          >
            <MicrophoneStage weight="fill" size={14} color="white" />
          </div>
          <span className="text-sm font-bold text-white/90 tracking-tight">路邊系列</span>
          <span className="hidden sm:inline text-xs text-white/25 font-light">6B Media</span>
        </div>
        <div className="flex items-center gap-3">
          {totalSubs > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Users size={12} className="text-white/40" />
              <span className="text-xs text-white/40">訂閱者</span>
              <span className="text-xs font-semibold text-white/70">{formatSubs(totalSubs)}</span>
            </div>
          )}
          {user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
                <span className="text-xs text-white/60">{user.name?.[0] ?? "U"}</span>
              </div>
              <span className="text-xs text-white/55 max-w-[80px] truncate">{user.name}</span>
            </div>
          ) : (
            <a
              href={getLoginUrl()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white transition-all duration-200"
              style={{ background: "oklch(0.14 0.02 260)", border: "1px solid oklch(0.22 0.03 260)", minHeight: "36px" }}
            >
              登入
            </a>
          )}
        </div>
      </motion.nav>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div
          className="flex-1 md:flex-none overflow-hidden"
          style={{ width: leftW, transition: "width 0.6s cubic-bezier(0.32,0,0.67,0)", minWidth: selected === "mystic" ? 0 : undefined }}
        >
          <ChannelCard
            channel="podcasts"
            isHovered={hovered === "podcasts"}
            isOtherSelected={selected === "mystic"}
            onEnter={() => !selected && setHovered("podcasts")}
            onLeave={() => !selected && setHovered(null)}
            onClick={() => !selected && setSelected("podcasts")}
          />
        </div>
        <div className="hidden md:block w-px flex-shrink-0" style={{ background: "oklch(0.18 0.02 260)" }} />
        <div className="md:hidden h-px flex-shrink-0" style={{ background: "oklch(0.18 0.02 260)" }} />
        <div
          className="flex-1 md:flex-none overflow-hidden"
          style={{ width: rightW, transition: "width 0.6s cubic-bezier(0.32,0,0.67,0)", minWidth: selected === "podcasts" ? 0 : undefined }}
        >
          <ChannelCard
            channel="mystic"
            isHovered={hovered === "mystic"}
            isOtherSelected={selected === "podcasts"}
            onEnter={() => !selected && setHovered("mystic")}
            onLeave={() => !selected && setHovered(null)}
            onClick={() => !selected && setSelected("mystic")}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.45 }}
        className="flex-shrink-0 flex items-center justify-center gap-4 px-6 py-2.5"
        style={{ borderTop: "1px solid oklch(0.14 0.02 260)" }}
      >
        <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white/25 hover:text-white/55 transition-colors duration-200">
          <YoutubeLogo size={12} weight="fill" />
          <span>@6bpodcasts</span>
          {podcastSubs ? <span className="text-white/18">{formatSubs(podcastSubs)} 訂閱</span> : null}
        </a>
        <span className="text-white/12 text-xs">|</span>
        <a href="https://www.youtube.com/@6bfengshui" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white/25 hover:text-white/55 transition-colors duration-200">
          <YoutubeLogo size={12} weight="fill" />
          <span>@6bfengshui</span>
          {fengshuiSubs ? <span className="text-white/18">{formatSubs(fengshuiSubs)} 訂閱</span> : null}
        </a>
        <span className="text-white/12 text-xs hidden sm:inline">|</span>
        <span className="hidden sm:flex items-center gap-1 text-xs text-white/20">
          <Star size={10} weight="fill" />
          <span>限時免費體驗全功能</span>
        </span>
      </motion.div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
}
