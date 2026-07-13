import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "6B 路邊電台｜聽見關係，看懂自己",
  description: "香港的兩性關係與玄學內容平台。探索真實故事、深度對話與人生方向。",
  metadataBase: new URL("https://www.6bpodcasts.com"),
  openGraph: {
    title: "6B 路邊電台｜聽見關係，看懂自己",
    description: "香港的兩性關係與玄學內容平台。探索真實故事、深度對話與人生方向。",
    url: "https://www.6bpodcasts.com",
    siteName: "6B 路邊電台",
    locale: "zh_HK",
    type: "website",
    images: [{ url: "/og.png", width: 1680, height: 882, alt: "6B 路邊電台｜聽見關係，看懂自己" }],
  },
  twitter: { card: "summary_large_image", title: "6B 路邊電台｜聽見關係，看懂自己", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body>{children}</body>
    </html>
  );
}
