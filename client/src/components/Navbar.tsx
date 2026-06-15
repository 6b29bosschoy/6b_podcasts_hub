import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Play, Sparkles, Handshake, Calendar } from "lucide-react";

// Mobile bottom quick nav (4 items)
const MOBILE_BOTTOM_NAV = [
  { label: "最新影片", href: "/episodes", Icon: Play },
  { label: "玄學堂", href: "/mystic", Icon: Sparkles },
  { label: "預約服務", href: "/booking", Icon: Calendar },
  { label: "合作查詢", href: "/partnership", Icon: Handshake },
];

const SOCIAL_LINKS = [
  { label: "YouTube 路邊電台", href: "https://www.youtube.com/@6bpodcasts", icon: "YT" },
  { label: "YouTube 玄學堂", href: "https://www.youtube.com/@6bfengshui", icon: "玄" },
  { label: "Facebook", href: "https://www.facebook.com/6bpodcasts", icon: "FB" },
  { label: "Instagram", href: "https://www.instagram.com/6bpodcasts", icon: "IG" },
];

const NAV_ITEMS = [
  { label: "首頁", href: "/home" },
  { label: "最新節目", href: "/episodes" },
  { label: "路邊電台", href: "/podcasts" },
  { label: "路邊玄學堂", href: "/mystic" },
  { label: "玄學服務", href: "/mystic/services" },
  { label: "嘉賓專欄", href: "/blog" },
  { label: "商業合作", href: "/partnership" },
  { label: "關於 6B", href: "/about" },
  { label: "聯絡我們", href: "/contact" },
];

// Submission dropdown options
const SUBMIT_OPTIONS = [
  {
    icon: "📝",
    label: "觀眾投稿",
    desc: "分享你的故事、心底話",
    href: "/#submissions",
    isAnchor: true,
  },
  {
    icon: "✍️",
    label: "嘉賓投稿",
    desc: "投稿嘉賓專欄文章",
    href: "/blog/submit",
    isAnchor: false,
  },
  {
    icon: "🎙️",
    label: "主持招募",
    desc: "加入我們的節目主持團隊",
    href: "/host-recruitment",
    isAnchor: false,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSubmitOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle anchor link scroll for /#submissions
  function handleAnchorClick(href: string) {
    setSubmitOpen(false);
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location === "/") {
        // Already on home page — scroll directly
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Navigate to home then scroll after load
        window.location.href = href;
      }
    }
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "oklch(0.08 0.01 260 / 0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid oklch(0.22 0.02 260)",
        }}
      >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/logo_393d1c47.png"
            alt="路邊 PODCASTS"
            className="h-10 w-10 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
            style={{ filter: "drop-shadow(0 0 6px oklch(0.62 0.24 25 / 0.5))" }}
          />
          <div className="hidden sm:block">
            <div className="text-sm font-black leading-tight" style={{ color: "oklch(0.92 0.01 60)" }}>路邊電台</div>
            <div className="text-xs" style={{ color: "oklch(0.55 0.02 60)" }}>香港最真實人物訪談</div>
          </div>
        </Link>

        {/* Desktop Nav — 9 items */}
        <nav className="hidden lg:flex items-center gap-2 flex-wrap">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium transition-colors duration-200 whitespace-nowrap px-1 py-1"
              style={{
                color: location === item.href ? "oklch(0.75 0.20 25)" : "oklch(0.68 0.01 60)",
                borderBottom: location === item.href ? "1px solid oklch(0.62 0.24 25)" : "1px solid transparent",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Submit button + Social Icons + Mobile Menu */}
        <div className="flex items-center gap-2">

          {/* ── ✉️ 投稿 Dropdown Button (desktop) ───────────────── */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setSubmitOpen((v) => !v)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{
                background: submitOpen
                  ? "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.78 0.15 75))"
                  : "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))",
                color: "white",
                boxShadow: "0 0 12px oklch(0.62 0.24 25 / 0.35)",
              }}
              aria-haspopup="true"
              aria-expanded={submitOpen}
            >
              ✉️ 投稿
              <ChevronDown
                size={12}
                className="transition-transform duration-200"
                style={{ transform: submitOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Dropdown menu */}
            {submitOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden shadow-xl z-50"
                style={{
                  background: "oklch(0.12 0.02 260)",
                  border: "1px solid oklch(0.25 0.03 260)",
                  boxShadow: "0 8px 32px oklch(0 0 0 / 0.5), 0 0 16px oklch(0.62 0.24 25 / 0.15)",
                }}
              >
                {SUBMIT_OPTIONS.map((opt) =>
                  opt.isAnchor ? (
                    <button
                      key={opt.label}
                      onClick={() => handleAnchorClick(opt.href)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-white/5"
                    >
                      <span className="text-lg leading-none mt-0.5">{opt.icon}</span>
                      <div>
                        <div className="text-xs font-bold" style={{ color: "oklch(0.90 0.01 60)" }}>{opt.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.02 60)" }}>{opt.desc}</div>
                      </div>
                    </button>
                  ) : (
                    <Link
                      key={opt.label}
                      href={opt.href}
                      onClick={() => setSubmitOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 transition-colors duration-150 hover:bg-white/5"
                    >
                      <span className="text-lg leading-none mt-0.5">{opt.icon}</span>
                      <div>
                        <div className="text-xs font-bold" style={{ color: "oklch(0.90 0.01 60)" }}>{opt.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.02 60)" }}>{opt.desc}</div>
                      </div>
                    </Link>
                  )
                )}

                {/* Divider + hint */}
                <div
                  className="px-4 py-2 text-xs"
                  style={{
                    borderTop: "1px solid oklch(0.20 0.02 260)",
                    color: "oklch(0.40 0.02 60)",
                  }}
                >
                  你的故事值得被聽見 🎙️
                </div>
              </div>
            )}
          </div>

          {/* Social Icons (large screens only) */}
          <div className="hidden lg:flex items-center gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: "oklch(0.18 0.02 260)",
                  color: "oklch(0.70 0.01 60)",
                  border: "1px solid oklch(0.25 0.02 260)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "oklch(0.62 0.24 25)";
                  (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.62 0.24 25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "oklch(0.70 0.01 60)";
                  (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.25 0.02 260)";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded"
            style={{ color: "oklch(0.70 0.01 60)" }}
            onClick={() => setOpen(!open)}
            aria-label={open ? "關閉選單" : "開啟選單"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="lg:hidden" style={{ background: "oklch(0.10 0.01 260)", borderTop: "1px solid oklch(0.22 0.02 260)" }}>
          <div className="container py-4 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-sm font-medium"
                style={{ color: location === item.href ? "oklch(0.62 0.24 25)" : "oklch(0.70 0.01 60)" }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* ── Mobile Submit Options ─────────────────────────── */}
            <div
              className="pt-3 mt-1 flex flex-col gap-2"
              style={{ borderTop: "1px solid oklch(0.22 0.02 260)" }}
            >
              <div className="text-xs font-bold tracking-widest mb-1" style={{ color: "oklch(0.62 0.24 25)" }}>
                ✉️ 投稿
              </div>
              {SUBMIT_OPTIONS.map((opt) =>
                opt.isAnchor ? (
                  <button
                    key={opt.label}
                    onClick={() => handleAnchorClick(opt.href)}
                    className="flex items-center gap-3 py-2 text-sm text-left w-full"
                    style={{ color: "oklch(0.75 0.01 60)" }}
                  >
                    <span>{opt.icon}</span>
                    <div>
                      <div className="font-bold text-sm" style={{ color: "oklch(0.85 0.01 60)" }}>{opt.label}</div>
                      <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{opt.desc}</div>
                    </div>
                  </button>
                ) : (
                  <Link
                    key={opt.label}
                    href={opt.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2 text-sm"
                    style={{ color: "oklch(0.75 0.01 60)" }}
                  >
                    <span>{opt.icon}</span>
                    <div>
                      <div className="font-bold text-sm" style={{ color: "oklch(0.85 0.01 60)" }}>{opt.label}</div>
                      <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{opt.desc}</div>
                    </div>
                  </Link>
                )
              )}
            </div>

            {/* Social icons row */}
            <div className="flex gap-2 pt-2" style={{ borderTop: "1px solid oklch(0.22 0.02 260)" }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-8 h-8 rounded text-xs font-bold flex items-center justify-center"
                  style={{ background: "oklch(0.18 0.02 260)", color: "oklch(0.70 0.01 60)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
      {/* ── Mobile Bottom Quick Nav ──────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{
          background: "oklch(0.09 0.01 260 / 0.96)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid oklch(0.20 0.02 260)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-center justify-around h-14">
          {MOBILE_BOTTOM_NAV.map(({ label, href, Icon }) => {
            const isActive = location === href || (href !== "/home" && location.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200 min-w-0"
                style={{ color: isActive ? "oklch(0.75 0.20 25)" : "oklch(0.55 0.02 260)" }}
              >
                <Icon
                  className="w-5 h-5 transition-transform duration-200"
                  style={{ transform: isActive ? "scale(1.15)" : "scale(1)" }}
                />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
