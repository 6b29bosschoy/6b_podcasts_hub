import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Play, Sparkles, Handshake, MessageCircle, PenLine } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// Mobile bottom quick nav (4 items)
const MOBILE_BOTTOM_NAV = [
  { label: "最新節目", href: "/episodes", Icon: Play },
  { label: "匿名投稿", href: "/treehole", Icon: PenLine },
  { label: "玄學堂", href: "/mystic", Icon: Sparkles },
  { label: "服務合作", href: "/services", Icon: Handshake },
];

const SOCIAL_LINKS = [
  { label: "YouTube 路邊電台", href: "https://www.youtube.com/@6bpodcasts", icon: "YT" },
  { label: "YouTube 玄學堂", href: "https://www.youtube.com/@6bfengshui", icon: "玄" },
  { label: "Facebook", href: "https://www.facebook.com/6bpodcasts", icon: "FB" },
  { label: "Instagram", href: "https://www.instagram.com/6bpodcasts", icon: "IG" },
];

const NAV_ITEMS = [
  { label: "最新節目", href: "/episodes" },
  { label: "感情故事", href: "/blog" },
  { label: "路邊玄學堂", href: "/mystic" },
  { label: "匿名投稿", href: "/treehole" },
  { label: "服務與合作", href: "/services" },
];

const SUBMIT_OPTIONS = [
  { icon: "✍", label: "感情樹窿", desc: "匿名講出你嘅故事", href: "/treehole", isAnchor: false },
  { icon: "✍", label: "嘉賓投稿", desc: "投稿嘉賓專欄文章", href: "/blog/submit", isAnchor: false },
  { icon: "✍", label: "主持招募", desc: "加入我們的節目主持團隊", href: "/host-recruitment", isAnchor: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSubmitOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleAnchorClick(href: string) {
    setSubmitOpen(false);
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location === "/") {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(13,9,9,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="container flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/logo_393d1c47.png"
              alt="路邊 PODCASTS"
              className="h-8 w-8 object-cover"
              style={{ borderRadius: "var(--radius)" }}
            />
            <div className="block">
              <div className="text-[10px] font-bold leading-tight sm:text-sm" style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)" }}>路邊系列</div>
              <div className="text-[9px] sm:text-xs" style={{ color: "var(--text-3)", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.08em" }}>6B PODCASTS</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs font-medium transition-colors duration-200 whitespace-nowrap px-2 py-1"
                  style={{
                    color: isActive ? "var(--gold)" : "var(--text-2)",
                    borderBottom: isActive ? "1px solid var(--gold)" : "1px solid transparent",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* 投稿 Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSubmitOpen((v) => !v)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-200"
                style={{
                  background: "transparent",
                  color: "var(--gold)",
                  border: "1px solid var(--gold-dim)",
                  borderRadius: "var(--radius)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-dim)"; }}
                aria-haspopup="true"
                aria-expanded={submitOpen}
              >
                投稿
                <ChevronDown
                  size={11}
                  className="transition-transform duration-200"
                  style={{ transform: submitOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {submitOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-52 z-50"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--radius)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  {SUBMIT_OPTIONS.map((opt) =>
                    opt.isAnchor ? (
                      <button
                        key={opt.label}
                        onClick={() => handleAnchorClick(opt.href)}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150"
                        style={{ borderBottom: "1px solid var(--line-soft)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raise)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <div>
                          <div className="text-xs font-medium" style={{ color: "var(--text)" }}>{opt.label}</div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{opt.desc}</div>
                        </div>
                      </button>
                    ) : (
                      <Link
                        key={opt.label}
                        href={opt.href}
                        onClick={() => setSubmitOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 transition-colors duration-150"
                        style={{ borderBottom: "1px solid var(--line-soft)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raise)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <div>
                          <div className="text-xs font-medium" style={{ color: "var(--text)" }}>{opt.label}</div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{opt.desc}</div>
                        </div>
                      </Link>
                    )
                  )}
                  <div className="px-4 py-2 text-xs" style={{ color: "var(--text-3)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                    你的故事值得被聽見
                  </div>
                </div>
              )}
            </div>

            {/* Social Icons (large screens only) */}
            <div className="hidden lg:flex items-center gap-1">
              <a
                href="https://wa.me/85298729990?text=你好，我想查詢服務或合作"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp 查詢"
                onClick={() => trackEvent("whatsapp_click", { source: "navbar" })}
                className="w-7 h-7 text-xs font-medium flex items-center justify-center transition-all duration-200"
                style={{ background: "var(--bg-raise)", color: "var(--text-3)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}
              >
                <MessageCircle size={14} />
              </a>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-7 h-7 text-xs font-medium flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "var(--bg-raise)",
                    color: "var(--text-3)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--radius)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = "var(--gold)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-dim)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2"
              style={{ color: "var(--text-2)" }}
              onClick={() => setOpen(!open)}
              aria-label={open ? "關閉選單" : "開啟選單"}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div style={{ background: "var(--bg-card)", borderTop: "1px solid var(--line)" }}>
            <div className="container py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2.5 text-sm transition-colors"
                  style={{ color: location === item.href ? "var(--gold)" : "var(--text-2)", borderBottom: "1px solid var(--line-soft)" }}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 mt-1 flex flex-col gap-1" style={{ borderTop: "1px solid var(--line)" }}>
                <div className="text-xs mb-2" style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  投稿
                </div>
                {SUBMIT_OPTIONS.map((opt) =>
                  opt.isAnchor ? (
                    <button
                      key={opt.label}
                      onClick={() => handleAnchorClick(opt.href)}
                      className="flex items-center gap-3 py-2 text-sm text-left w-full"
                      style={{ color: "var(--text-2)" }}
                    >
                      <div>
                        <div className="text-sm" style={{ color: "var(--text)" }}>{opt.label}</div>
                        <div className="text-xs" style={{ color: "var(--text-3)" }}>{opt.desc}</div>
                      </div>
                    </button>
                  ) : (
                    <Link
                      key={opt.label}
                      href={opt.href}
                      className="flex items-center gap-3 py-2 text-sm"
                      style={{ color: "var(--text-2)" }}
                      onClick={() => setOpen(false)}
                    >
                      <div>
                        <div className="text-sm" style={{ color: "var(--text)" }}>{opt.label}</div>
                        <div className="text-xs" style={{ color: "var(--text-3)" }}>{opt.desc}</div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ background: "rgba(13,9,9,0.95)", borderTop: "1px solid var(--line)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex">
          {MOBILE_BOTTOM_NAV.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors"
                style={{ color: isActive ? "var(--gold)" : "var(--text-3)" }}
              >
                <item.Icon size={18} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
