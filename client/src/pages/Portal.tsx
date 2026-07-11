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
    <span
      className="inline-flex items-center px-2.5 py-1 text-xs"
      style={{
        background: "var(--bg-raise)",
        border: "1px solid var(--line)",
        color: "var(--text-3)",
        borderRadius: "var(--radius)",
        fontFamily: "'Noto Sans TC', sans-serif",
      }}
    >
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
  isGold: boolean;
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
    icon: <MicrophoneStage weight="fill" size={32} />,
    title: "路邊電台",
    subtitle: "6B Podcasts",
    tagline: "香港最真實的人物訪談",
    description: "兩性討論、運動健身、嘉賓專欄。每週更新，直播不設限。",
    features: ["嘉賓訪談", "兩性討論", "運動健身", "直播節目"],
    cta: "進入電台",
    isGold: true,
    delay: 0.1,
  };

  const mysticCfg: CardCfg = {
    icon: <MagicWand weight="fill" size={32} />,
    title: "路邊玄學堂",
    subtitle: "Mystic Studio",
    tagline: "中西玄學 AI 分析平台",
    description: "八字命盤、紫微斗數、塔羅占星、阿卡西紀錄。一次輸入，十二派別解讀。",
    features: ["八字命盤", "紫微斗數", "塔羅占星", "阿卡西紀錄"],
    cta: "進入玄學堂",
    isGold: false,
    delay: 0.2,
  };

  const cfg = isPodcasts ? podcastsCfg : mysticCfg;

  return (
    <div
      className="relative flex flex-col h-full cursor-pointer overflow-hidden select-none"
      style={{
        background: "var(--bg)",
        transition: "background 0.3s",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Subtle warm glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 50% 45% at ${isPodcasts ? "30%" : "70%"} 40%, rgba(201,164,92,0.06), transparent)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {/* Dim overlay when other is selected */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{ background: "var(--bg)", opacity: isOtherSelected ? 0.85 : 0 }}
      />

      <div
        className="relative z-10 flex flex-col h-full p-8 md:p-10 lg:p-14 transition-opacity duration-300"
        style={{ opacity: isOtherSelected ? 0.1 : 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: cfg.delay, duration: 0.55, ease: "easeOut" }}
        >
          <div
            className="w-12 h-12 flex items-center justify-center mb-5"
            style={{
              background: "var(--bg-raise)",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: isHovered ? "var(--gold-dim)" : "var(--line)",
              color: "var(--gold)",
              borderRadius: "var(--radius)",
              transition: "border-color 0.3s",
            }}
          >
            {cfg.icon}
          </div>
          <p
            className="text-xs mb-2"
            style={{
              color: "var(--gold)",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            {cfg.subtitle}
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)" }}
          >
            {cfg.title}
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-3)" }}>{cfg.tagline}</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: cfg.delay + 0.2, duration: 0.55 }}
          className="mt-5 text-sm leading-relaxed max-w-xs"
          style={{ color: "var(--text-3)" }}
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
            className="btn-gold group inline-flex items-center gap-3"
            style={{
              opacity: isHovered ? 1 : 0.85,
              transition: "opacity 0.3s, transform 0.3s",
              transform: isHovered ? "translateY(-1px)" : "none",
            }}
          >
            <span>{cfg.cta}</span>
            <ArrowRight size={14} weight="bold" />
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
    <div className="fixed inset-0 overflow-hidden flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top nav */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex-shrink-0 flex items-center justify-between px-6 py-3 md:px-10"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{ background: "var(--bg-raise)", border: "1px solid var(--line)", borderRadius: "var(--radius)", color: "var(--gold)" }}
          >
            <MicrophoneStage weight="fill" size={14} />
          </div>
          <span className="text-sm font-bold" style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)" }}>路邊系列</span>
          <span className="hidden sm:inline text-xs" style={{ color: "var(--text-3)", fontFamily: "'Cormorant Garamond', serif" }}>6B Media</span>
        </div>
        <div className="flex items-center gap-3">
          {totalSubs > 0 && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5"
              style={{ background: "var(--bg-raise)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}
            >
              <Users size={12} style={{ color: "var(--text-3)" }} />
              <span className="text-xs" style={{ color: "var(--text-3)" }}>訂閱者</span>
              <span className="text-xs font-medium" style={{ color: "var(--gold)" }}>{formatSubs(totalSubs)}</span>
            </div>
          )}
          {user ? (
            <div
              className="flex items-center gap-2 px-3 py-1.5"
              style={{ background: "var(--bg-raise)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}
            >
              <div
                className="w-5 h-5 flex items-center justify-center"
                style={{ background: "var(--bg-card)", borderRadius: "50%", borderWidth: "1px", borderStyle: "solid", borderColor: "var(--line)" }}
              >
                <span className="text-xs" style={{ color: "var(--text-3)" }}>{user.name?.[0] ?? "U"}</span>
              </div>
              <span className="text-xs max-w-[80px] truncate" style={{ color: "var(--text-2)" }}>{user.name}</span>
            </div>
          ) : (
            <a
              href={getLoginUrl()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-all duration-200"
              style={{
                background: "var(--bg-raise)",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "var(--line)",
                color: "var(--text-2)",
                borderRadius: "var(--radius)",
                minHeight: "36px",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--gold-dim)"; el.style.color = "var(--gold)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--line)"; el.style.color = "var(--text-2)"; }}
            >
              登入
            </a>
          )}
        </div>
      </motion.nav>

      {/* Split cards */}
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
        <div className="hidden md:block w-px flex-shrink-0" style={{ background: "var(--line)" }} />
        <div className="md:hidden h-px flex-shrink-0" style={{ background: "var(--line)" }} />
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

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.45 }}
        className="flex-shrink-0 flex items-center justify-center gap-4 px-6 py-2.5"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs transition-colors duration-200"
          style={{ color: "var(--text-3)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
        >
          <YoutubeLogo size={12} weight="fill" />
          <span>@6bpodcasts</span>
          {podcastSubs ? <span style={{ color: "var(--text-3)" }}>{formatSubs(podcastSubs)} 訂閱</span> : null}
        </a>
        <span style={{ color: "var(--line)", fontSize: "10px" }}>|</span>
        <a href="https://www.youtube.com/@6bfengshui" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs transition-colors duration-200"
          style={{ color: "var(--text-3)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
        >
          <YoutubeLogo size={12} weight="fill" />
          <span>@6bfengshui</span>
          {fengshuiSubs ? <span style={{ color: "var(--text-3)" }}>{formatSubs(fengshuiSubs)} 訂閱</span> : null}
        </a>
        <span style={{ color: "var(--line)", fontSize: "10px" }} className="hidden sm:inline">|</span>
        <span className="hidden sm:flex items-center gap-1 text-xs" style={{ color: "var(--text-3)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
          <Star size={10} weight="fill" style={{ color: "var(--gold)" }} />
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
