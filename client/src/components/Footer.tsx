import { Link } from "wouter";

export default function Footer() {
  return (
    <footer style={{ background: "oklch(0.06 0.01 260)", borderTop: "1px solid oklch(0.18 0.02 260)" }}>
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-black mb-2 gradient-text">路邊電台</div>
            <div className="text-sm mb-1" style={{ color: "oklch(0.55 0.02 60)" }}>香港最真實人物訪談</div>
            <div className="text-xs mt-3 leading-relaxed" style={{ color: "oklch(0.45 0.02 60)" }}>
              探討兩性關係 × 都市感情 × 專家對談 × 玄學命理<br />
              每週三、日準時上架新節目
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="text-sm font-bold mb-4" style={{ color: "oklch(0.78 0.16 75)" }}>快速連結</div>
            <div className="flex flex-col gap-2">
              {[
                { label: "首頁", href: "/" },
                { label: "嘉賓專欄", href: "/blog" },
                { label: "玄學服務預約", href: "/booking" },
                { label: "聯絡我們", href: "/contact" },
                { label: "嘉賓投稿", href: "/blog/submit" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="text-sm hover:text-primary transition-colors" style={{ color: "oklch(0.55 0.02 60)" }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <div className="text-sm font-bold mb-4" style={{ color: "oklch(0.78 0.16 75)" }}>追蹤我們</div>
            <div className="flex flex-col gap-2">
              {[
                { label: "YouTube 路邊電台", href: "https://www.youtube.com/@6bpodcasts" },
                { label: "YouTube 路邊玄學堂", href: "https://www.youtube.com/@6bfengshui" },
                { label: "Facebook", href: "https://www.facebook.com/6bpodcasts" },
                { label: "Instagram", href: "https://www.instagram.com/6bpodcasts" },
                { label: "Apple Podcast", href: "https://apple.co/3nhSxy8" },
                { label: "Spotify", href: "https://spoti.fi/30EQPOT" },
              ].map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="text-sm hover:text-primary transition-colors" style={{ color: "oklch(0.55 0.02 60)" }}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-4 text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>
              商業合作：ktcreativefirm@gmail.com<br />
              WhatsApp: +852 9872 9990
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderTop: "1px solid oklch(0.18 0.02 260)" }}>
          <div className="text-xs" style={{ color: "oklch(0.40 0.02 60)" }}>
            © 2026 路邊電台 × 路邊玄學堂. All rights reserved.
          </div>
          <div className="text-xs" style={{ color: "oklch(0.40 0.02 60)" }}>
            Powered by KT Creative Firm
          </div>
        </div>
      </div>
    </footer>
  );
}
