import { Link } from "wouter";
import SubscribeBox from "@/components/SubscribeBox";

const LATEST_VIDEOS = [
  {
    id: "latest1",
    title: "另一半怪怪地？出軌定係我自己有問題？",
    channel: "路邊電台",
    views: "1.1K",
    time: "12天前",
    youtubeId: "latest",
    url: "https://www.youtube.com/@6bpodcasts",
    thumbnail: `https://i.ytimg.com/vi/placeholder/mqdefault.jpg`,
  },
  {
    id: "latest2",
    title: "【心旅對話】切除乳房、注射荷爾蒙！跨性別者親述「女跨男」真實歷程",
    channel: "路邊電台",
    views: "7.1K",
    time: "2週前",
    url: "https://www.youtube.com/@6bpodcasts",
    thumbnail: `https://i.ytimg.com/vi/placeholder/mqdefault.jpg`,
  },
  {
    id: "latest3",
    title: "女仔去日本 Happening Bar 安唔安全？情慾自主Macy帶你去見識見識",
    channel: "路邊電台",
    views: "90K",
    time: "1個月前",
    url: "https://www.youtube.com/@6bpodcasts",
    thumbnail: `https://i.ytimg.com/vi/placeholder/mqdefault.jpg`,
  },
  {
    id: "fengshui1",
    title: "手機尾數係「0」注定白做？師傅踢爆：呢幾組數字先係「發達密碼」！",
    channel: "路邊玄學堂",
    views: "1.4K",
    time: "2個月前",
    url: "https://www.youtube.com/@6bfengshui",
    thumbnail: `https://i.ytimg.com/vi/placeholder/mqdefault.jpg`,
  },
  {
    id: "fengshui2",
    title: "年初五初六關鍵轉運法｜張飛廟vs殷郊元帥，邊個先鎮得住？",
    channel: "路邊玄學堂",
    views: "2.4K",
    time: "1個月前",
    url: "https://www.youtube.com/@6bfengshui",
    thumbnail: `https://i.ytimg.com/vi/placeholder/mqdefault.jpg`,
  },
  {
    id: "fengshui3",
    title: "🤫 係咪真係咁靈？揭秘「張飛廟」神秘力量，真係可以驅邪？",
    channel: "路邊玄學堂",
    views: "248",
    time: "1個月前",
    url: "https://www.youtube.com/@6bfengshui",
    thumbnail: `https://i.ytimg.com/vi/placeholder/mqdefault.jpg`,
  },
];

const SOCIAL_PLATFORMS = [
  {
    name: "YouTube 路邊電台",
    desc: "20.6K 訂閱 · 486 條影片",
    href: "https://www.youtube.com/@6bpodcasts",
    color: "oklch(0.55 0.22 25)",
    icon: "▶",
  },
  {
    name: "YouTube 路邊玄學堂",
    desc: "1.98K 訂閱 · 90 條影片",
    href: "https://www.youtube.com/@6bfengshui",
    color: "oklch(0.55 0.20 250)",
    icon: "☯",
  },
  {
    name: "Facebook",
    desc: "16K 追蹤者",
    href: "https://www.facebook.com/6bpodcasts",
    color: "oklch(0.50 0.18 255)",
    icon: "f",
  },
  {
    name: "Instagram",
    desc: "@6bpodcasts",
    href: "https://www.instagram.com/6bpodcasts",
    color: "oklch(0.60 0.20 330)",
    icon: "◎",
  },
  {
    name: "Apple Podcast",
    desc: "免費收聽",
    href: "https://apple.co/3nhSxy8",
    color: "oklch(0.65 0.15 290)",
    icon: "♪",
  },
  {
    name: "Spotify",
    desc: "免費收聽",
    href: "https://spoti.fi/30EQPOT",
    color: "oklch(0.65 0.20 145)",
    icon: "♫",
  },
];

const SERVICES = [
  { icon: "🧭", title: "風水諮詢", desc: "家居、辦公室風水佈局分析，改善運勢與財運" },
  { icon: "🔮", title: "八字命理", desc: "根據生辰八字分析個人運程、事業、感情走向" },
  { icon: "🃏", title: "塔羅占卜", desc: "塔羅牌解讀，為你的人生問題提供指引" },
  { icon: "🌿", title: "身心靈療癒", desc: "能量療癒、冥想指導，平衡身心靈狀態" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: "oklch(0.62 0.24 25)", filter: "blur(60px)" }} />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full opacity-5" style={{ background: "oklch(0.55 0.20 250)", filter: "blur(40px)" }} />
        </div>

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6" style={{ background: "oklch(0.62 0.24 25 / 0.15)", border: "1px solid oklch(0.62 0.24 25 / 0.3)", color: "oklch(0.62 0.24 25)" }}>
              🎙️ 香港最真實人物訪談
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight neon-flicker">
              <span className="gradient-text">路邊電台</span>
            </h1>
            <p className="text-lg md:text-xl font-medium mb-3" style={{ color: "oklch(0.75 0.15 75)" }}>
              × 路邊玄學堂
            </p>
            <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: "oklch(0.60 0.02 60)" }}>
              探討兩性關係 × 都市感情 × 玄學命理<br />
              每一位嘉賓都係講真話，呈現最真實嘅內心世界
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://www.youtube.com/@6bpodcasts"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.75 0.15 75))", color: "white" }}
              >
                ▶ 立即收看
              </a>
              <Link
                href="/booking"
                className="px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:opacity-90"
                style={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(0.30 0.03 260)", color: "oklch(0.85 0.01 60)" }}
              >
                預約玄學服務
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Platforms */}
      <section className="py-16" style={{ background: "oklch(0.10 0.01 260)" }}>
        <div className="container">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>FOLLOW US</div>
            <h2 className="text-2xl font-black" style={{ color: "oklch(0.92 0.01 60)" }}>追蹤我們的平台</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SOCIAL_PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 group"
              >
                <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold" style={{ background: `${p.color} / 0.2`, color: p.color, border: `1px solid ${p.color} / 0.3` }}>
                  {p.icon}
                </div>
                <div className="text-xs font-bold mb-1" style={{ color: "oklch(0.85 0.01 60)" }}>{p.name}</div>
                <div className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{p.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Videos */}
      <section className="py-16" style={{ background: "oklch(0.08 0.01 260)" }}>
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>LATEST CONTENT</div>
              <h2 className="text-2xl font-black" style={{ color: "oklch(0.92 0.01 60)" }}>最新影片</h2>
            </div>
            <a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "oklch(0.62 0.24 25)" }}>
              查看全部 →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LATEST_VIDEOS.map((v) => (
              <a
                key={v.id}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-xl overflow-hidden group transition-all duration-200 hover:scale-[1.02]"
              >
                {/* Thumbnail placeholder */}
                <div className="aspect-video flex items-center justify-center relative overflow-hidden" style={{ background: "oklch(0.15 0.015 260)" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "oklch(0.62 0.24 25 / 0.8)" }}>
                      <span className="text-white text-lg">▶</span>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold" style={{ background: v.channel === "路邊玄學堂" ? "oklch(0.55 0.20 250 / 0.9)" : "oklch(0.62 0.24 25 / 0.9)", color: "white" }}>
                    {v.channel}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold leading-snug mb-2 line-clamp-2" style={{ color: "oklch(0.88 0.01 60)" }}>
                    {v.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>
                    <span>{v.views} 次觀看</span>
                    <span>·</span>
                    <span>{v.time}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16" style={{ background: "oklch(0.10 0.01 260)" }}>
        <div className="container">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.78 0.16 75)" }}>SERVICES</div>
            <h2 className="text-2xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>玄學服務</h2>
            <p className="text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>由專業玄學師傅提供，助你解惑人生疑問</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {SERVICES.map((s) => (
              <div key={s.title} className="glass-card rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: "oklch(0.88 0.01 60)" }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.02 60)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/booking"
              className="inline-block px-8 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{ background: "linear-gradient(135deg, oklch(0.75 0.15 75), oklch(0.60 0.22 25))", color: "white" }}
            >
              立即預約 →
            </Link>
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-16" style={{ background: "oklch(0.08 0.01 260)" }}>
        <div className="container">
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center" style={{ border: "1px solid oklch(0.78 0.16 75 / 0.2)" }}>
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "oklch(0.78 0.16 75)" }}>GUEST COLUMN</div>
            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>嘉賓專欄</h2>
            <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: "oklch(0.55 0.02 60)" }}>
              閱讀嘉賓訪談後的深度心得，或分享你的故事，成為路邊電台的嘉賓作者。
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/blog" className="px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(0.30 0.03 260)", color: "oklch(0.85 0.01 60)" }}>
                閱讀文章
              </Link>
              <Link href="/blog/submit" className="px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, oklch(0.75 0.15 75), oklch(0.60 0.22 25))", color: "white" }}>
                投稿分享
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <SubscribeBox />
    </div>
  );
}
