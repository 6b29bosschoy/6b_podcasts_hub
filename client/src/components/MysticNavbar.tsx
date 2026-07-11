import { useState } from "react";
import { Link, useLocation } from "wouter";

const NAV_LINKS = [
  { href: "/mystic", label: "首頁" },
  { href: "/mystic/bazi", label: "🔮 八字命盤" },
  { href: "/mystic/analysis", label: "玄學分析" },
  { href: "/mystic/masters", label: "玄學家" },
  { href: "/mystic/videos", label: "影片" },
  { href: "/mystic/articles", label: "文章" },
  { href: "/mystic/pricing", label: "會員方案" },
];

export default function MysticNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "var(--bg)",
        borderColor: "rgba(201,164,92,0.2)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/mystic">
          <div className="flex items-center gap-3 cursor-pointer group">
            <span className="text-2xl">🔮</span>
            <div>
              <div className="text-base font-black leading-tight" style={{ color: "var(--text)" }}>
                路邊玄學堂
              </div>
              <div className="text-xs leading-tight" style={{ color: "var(--gold)" }}>
                中西玄學分析平台
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href || (link.href !== "/mystic" && location.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all"
                  style={{
                    color: isActive ? "var(--gold)" : "var(--text-2)",
                    background: isActive ? "rgba(201,164,92,0.15)" : "transparent",
                  }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Back to portal */}
          <Link href="/">
            <span
              className="hidden md:flex items-center gap-1 text-xs px-2 py-1.5 rounded-full cursor-pointer transition-all hover:scale-105"
              style={{ color: "var(--text-3)", background: "var(--bg-raise)" }}
            >
              ⬅ 返回選台
            </span>
          </Link>
          {/* Switch to Podcasts */}
          <Link href="/home">
            <span
              className="hidden md:flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all hover:scale-105"
              style={{
                borderColor: "var(--red)",
                color: "var(--red)",
                background: "var(--red)",
              }}
            >
              🎙️ 路邊電台
            </span>
          </Link>

          {/* CTA */}
          <Link href="/mystic/analysis">
            <span
              className="text-xs px-4 py-2 rounded-full font-bold cursor-pointer transition-all hover:scale-105"
              style={{
                background: "var(--bg-card)",
                color: "var(--text)",
              }}
            >
              立即分析
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "var(--text-2)" }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "var(--bg-card)",
            borderColor: "rgba(201,164,92,0.2)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <div
                className="px-6 py-3 text-sm border-b cursor-pointer"
                style={{
                  color: "var(--text)",
                  borderColor: "rgba(201,164,92,0.1)",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </div>
            </Link>
          ))}
          <Link href="/home">
            <div
              className="px-6 py-3 text-sm cursor-pointer"
              style={{ color: "var(--red)" }}
              onClick={() => setMenuOpen(false)}
            >
              🎙️ 切換至路邊電台
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
}
