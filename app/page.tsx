"use client";

import { useState } from "react";

const stories = [
  { category: "兩性關係", title: "當對方開始冷淡，我們真正害怕的是甚麼？", type: "關係剖析", time: "12 min" },
  { category: "真實故事", title: "她離開後，我才學會好好說再見", type: "聽眾來信", time: "9 min" },
  { category: "自我成長", title: "不是不夠好：從討好裡找回自己的位置", type: "深度對談", time: "16 min" },
];

const paths = [
  { no: "01", title: "關係裡的自己", text: "從曖昧、親密到告別，聽懂那些說不出口的心事。", tag: "路邊電台" },
  { no: "02", title: "命運裡的提示", text: "以命理、風水與生活觀察，陪你看見選擇的方向。", tag: "路邊玄學堂" },
  { no: "03", title: "生活裡的答案", text: "真實人物、創作與城市故事，讓你不再一個人摸索。", tag: "人物專訪" },
];

const faqs = [
  ["我想預約諮詢，應該由哪裡開始？", "先選擇最接近你當下需要的主題：感情、事業、家居或人生方向；我們會再為你配對合適的服務與時段。"],
  ["節目內容是玄學，還是兩性關係？", "兩者都是。6B 相信關係、性格與人生選擇從來不是單一問題；你可以從不同角度，慢慢拼湊屬於自己的答案。"],
  ["可以成為嘉賓或分享故事嗎？", "可以。我們珍惜每一個真實故事，歡迎透過合作洽談與我們聯絡。"],
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      <nav className="nav-shell" aria-label="主要導覽">
        <a className="brand" href="#top" aria-label="6B 路邊電台首頁"><span>6B</span><i>路邊</i></a>
        <div className="nav-links">
          <a href="#stories">兩性故事</a><a href="#paths">玄學堂</a><a href="#watch">節目精選</a><a href="#consult">預約諮詢</a>
        </div>
        <a className="nav-cta" href="#consult">展開對話 <b>↗</b></a>
      </nav>

      <section id="top" className="hero">
        <div className="hero-image" role="img" aria-label="燈光下的復古播客麥克風與信件" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> HONG KONG · STORIES &amp; INNER COMPASS</p>
          <h1>聽見關係，<em>看懂自己。</em></h1>
          <p className="intro">在愛裡探索，在命運裡提問。<br />這裡有真實對話，也有讓你重新出發的線索。</p>
          <div className="hero-actions"><a className="button button-gold" href="#watch">開始收聽 <b>→</b></a><a className="button button-quiet" href="#consult">探索諮詢服務</a></div>
        </div>
        <div className="hero-note"><span>6B PODCASTS</span><p>讓每一段經歷，<br />都有被好好聽見的空間。</p></div>
        <a className="scroll-cue" href="#stories">SCROLL TO EXPLORE <span>↓</span></a>
      </section>

      <section className="statement"><p>我們不急著給你答案。<br /><strong>先陪你，聽見心裡真正的聲音。</strong></p><div className="statement-mark">6B<br /><small>since 2020</small></div></section>

      <section id="stories" className="section stories-section">
        <div className="section-heading"><div><p className="eyebrow dark"><span /> THE EDIT</p><h2>最近想和你談的事</h2></div><a className="text-link" href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noreferrer">更多真實故事 <b>→</b></a></div>
        <div className="story-grid">{stories.map((story, index) => <article className={`story-card story-${index + 1}`} key={story.title}><div className="card-top"><span>{story.category}</span><span>0{index + 1}</span></div><div><p>{story.type} · {story.time}</p><h3>{story.title}</h3><a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noreferrer" aria-label={`收聽${story.title}`}>收聽故事 <b>↗</b></a></div></article>)}</div>
      </section>

      <section id="paths" className="paths-section"><div className="paths-intro"><p className="eyebrow"><span /> MORE THAN A PODCAST</p><h2>人生從來不只<br />一個視角。</h2><p>讓感情、命運與生活，在同一張地圖上慢慢被理解。</p></div><div className="paths-list">{paths.map((path) => <article className="path" key={path.no}><span className="path-no">{path.no}</span><div><small>{path.tag}</small><h3>{path.title}</h3><p>{path.text}</p></div><a href={path.no === "02" ? "https://www.youtube.com/@6bfengshui" : "#watch"} aria-label={`探索${path.title}`}>↗</a></article>)}</div></section>

      <section id="watch" className="watch-section"><div className="watch-video"><div className="video-caption"><span className="pulse" /> 最新一集 · 路邊電台</div><a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noreferrer" className="play" aria-label="前往路邊電台 YouTube 頻道">▶</a><p>那些不敢問的感情問題，<br />其實每個人都曾經歷。</p></div><div className="watch-copy"><p className="eyebrow dark"><span /> WATCH / LISTEN</p><h2>每一次對話，<br />都是真實人生。</h2><p>路邊電台以不說教、不評判的方式，和你走近人與人之間最複雜、也最溫柔的地方。</p><div className="channel-links"><a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noreferrer">YouTube 路邊電台 <b>↗</b></a><a href="https://www.youtube.com/@6bfengshui" target="_blank" rel="noreferrer">YouTube 路邊玄學堂 <b>↗</b></a></div></div></section>

      <section id="consult" className="consult-section"><div><p className="eyebrow"><span /> PRIVATE CONSULTATION</p><h2>當你想為自己，<br /><em>認真問一次。</em></h2><p>關係、事業、居所或人生方向——以更完整的視角，陪你走到下一個選擇之前。</p></div><div className="consult-card"><p>ONE-TO-ONE GUIDANCE</p><h3>把心裡的問題<br />留給一場好對話。</h3><ul><li>感情與人生方向</li><li>八字命理分析</li><li>家居及辦公室風水</li></ul><a className="button button-gold" href="mailto:info@6bpodcasts.com?subject=6B%20諮詢服務查詢">查詢及預約 <b>→</b></a></div></section>

      <section className="faq-section"><p className="eyebrow dark"><span /> GOOD TO KNOW</p><h2>你可能會想問</h2><div className="faq-list">{faqs.map(([q, a], i) => <button className={`faq ${openFaq === i ? "active" : ""}`} key={q} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{q}</span><b>{openFaq === i ? "−" : "+"}</b>{openFaq === i && <p>{a}</p>}</button>)}</div></section>

      <footer><a className="brand footer-brand" href="#top"><span>6B</span><i>路邊</i></a><p>香港的真實故事平台，<br />關於關係、命運與活成自己。</p><div><a href="https://www.youtube.com/@6bpodcasts" target="_blank" rel="noreferrer">YouTube</a><a href="https://www.instagram.com/6bpodcasts" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/6bpodcasts" target="_blank" rel="noreferrer">Facebook</a></div><small>© 2026 6B PODCASTS · HONG KONG</small></footer>
    </main>
  );
}
