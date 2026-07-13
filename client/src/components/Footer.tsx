import { Link } from "wouter";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-deep)", borderTop: "1px solid var(--line)" }}>
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/logo_393d1c47.png"
                alt="路邊 PODCASTS"
                className="h-10 w-10 object-cover"
                style={{ borderRadius: "var(--radius)" }}
              />
              <div>
                <div className="text-base font-bold" style={{ fontFamily: "'Noto Serif TC', serif", color: "var(--text)" }}>路邊系列</div>
                <div className="text-xs" style={{ color: "var(--text-3)", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.08em" }}>6B Media</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
              探討兩性關係 × 都市感情 × 專家對談 × 玄學命理<br />
              每週三、日準時上架新節目
            </p>
          </div>

          {/* Links */}
          <div>
            <div
              className="text-xs mb-4"
              style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.3em", textTransform: "uppercase" }}
            >
              快速連結
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "首頁", href: "/home" },
                { label: "嘉賓專欄", href: "/blog" },
                { label: "玄學服務預約", href: "/booking" },
                { label: "聯絡我們", href: "/contact" },
                { label: "嘉賓投稿", href: "/blog/submit" },
                { label: "主持招募", href: "/host-recruitment" },
                { label: "投資者關係", href: "/investors" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs transition-colors duration-200"
                  style={{ color: "var(--text-3)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <div
              className="text-xs mb-4"
              style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.3em", textTransform: "uppercase" }}
            >
              追蹤我們
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "YouTube 路邊電台", href: "https://www.youtube.com/@6bpodcasts" },
                { label: "YouTube 路邊玄學堂", href: "https://www.youtube.com/@6bfengshui" },
                { label: "Facebook", href: "https://www.facebook.com/6bpodcasts" },
                { label: "Instagram", href: "https://www.instagram.com/6bpodcasts" },
                { label: "Apple Podcast", href: "https://apple.co/3nhSxy8" },
                { label: "Spotify", href: "https://spoti.fi/30EQPOT" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs transition-colors duration-200"
                  style={{ color: "var(--text-3)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--line-soft)" }}>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>ktcreativefirm@gmail.com</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>WhatsApp: +852 9872 9990</p>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-3)", fontFamily: "'Cormorant Garamond', serif" }}>
            © 2026 路邊電台 × 路邊玄學堂. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-3)", fontFamily: "'Cormorant Garamond', serif" }}>
            Powered by KT Creative Firm
          </p>
        </div>
      </div>
    </footer>
  );
}
