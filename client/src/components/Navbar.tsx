import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const SOCIAL_LINKS = [
  { label: "YouTube 路邊電台", href: "https://www.youtube.com/@6bpodcasts", icon: "YT" },
  { label: "YouTube 玄學堂", href: "https://www.youtube.com/@6bfengshui", icon: "玄" },
  { label: "Facebook", href: "https://www.facebook.com/6bpodcasts", icon: "FB" },
  { label: "Instagram", href: "https://www.instagram.com/6bpodcasts", icon: "IG" },
];

const NAV_ITEMS = [
  { label: "首頁", href: "/" },
  { label: "關於我們", href: "/about" },
  { label: "服務項目", href: "/services" },
  { label: "嘉賓專欄", href: "/blog" },
  { label: "玄學服務", href: "/booking" },
  { label: "收聽聲音 PODCASTS", href: "/podcasts" },
  { label: "合作洽談", href: "/partnership" },
  { label: "聯絡我們", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ background: "oklch(0.08 0.01 260 / 0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid oklch(0.22 0.02 260)" }}>
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black" style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))" }}>
            路
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-black leading-tight" style={{ color: "oklch(0.92 0.01 60)" }}>路邊電台</div>
            <div className="text-xs" style={{ color: "oklch(0.55 0.02 60)" }}>香港最真實人物訪談</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 flex-wrap">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium transition-colors duration-200 whitespace-nowrap"
              style={{ color: location === item.href ? "oklch(0.62 0.24 25)" : "oklch(0.70 0.01 60)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Social Icons + Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: "oklch(0.18 0.02 260)", color: "oklch(0.70 0.01 60)", border: "1px solid oklch(0.25 0.02 260)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.62 0.24 25)"; (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.62 0.24 25)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.70 0.01 60)"; (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.25 0.02 260)"; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
          <button
            className="md:hidden p-2 rounded"
            style={{ color: "oklch(0.70 0.01 60)" }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden" style={{ background: "oklch(0.10 0.01 260)", borderTop: "1px solid oklch(0.22 0.02 260)" }}>
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
            <div className="flex gap-2 pt-2 border-t" style={{ borderColor: "oklch(0.22 0.02 260)" }}>
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
  );
}
