# 6bpodcasts.com 發布後 SEO 驗收手冊

本手冊適用於 SEO 修復版本發布至 `https://6bpodcasts.com` 後。所有公開驗收必須針對**非 www** 網域執行；`https://www.6bpodcasts.com/` 應只作 301 轉址入口。

## 1. Canonical、OG 與原始 HTML

先在公開環境擷取原始 HTML，並確認不需要執行 JavaScript 亦可取得首頁文字。

```bash
curl -sS https://6bpodcasts.com/ > /tmp/6b-home.html
grep -Eo '<title>[^<]*|<link rel="canonical"[^>]*|<meta property="og:url"[^>]*|<meta name="twitter:url"[^>]*|<h1>[^<]*' /tmp/6b-home.html
grep -o '<h1>' /tmp/6b-home.html | wc -l
curl -sSI https://www.6bpodcasts.com/ | grep -Ei 'HTTP/|location:'
```

預期首頁有且只有一個 `<h1>`，文字為 `6B Podcast｜香港兩性關係 Podcast 平台`；canonical、`og:url` 與 `twitter:url` 都應為 `https://6bpodcasts.com/`。www 網址應回應 `301` 並指向非 www 網址。

同時檢查至少一個內頁，例如預約頁：

```bash
curl -sS https://6bpodcasts.com/booking | grep -Eo '<link rel="canonical"[^>]*|<h1>[^<]*'
```

預期 canonical 為 `https://6bpodcasts.com/booking`，並只有一個與預約主題相符的 H1。

## 2. robots.txt 與 sitemap.xml

```bash
curl -sS https://6bpodcasts.com/robots.txt
curl -sS https://6bpodcasts.com/sitemap.xml | grep -o '<loc>[^<]*' | grep -E 'www\.6bpodcasts\.com' && exit 1 || true
curl -sS https://6bpodcasts.com/sitemap.xml | grep -o '<loc>[^<]*' | grep -E 'monetization-plan|blog/submit|mystic/funnel|mystic/masters/master-1'
```

預期 `robots.txt` 包含 `User-agent: *`、`Allow: /` 與 `Sitemap: https://6bpodcasts.com/sitemap.xml`。sitemap 所有 URL 都必須是非 www 版本，並涵蓋靜態公開頁、已批准的嘉賓專欄文章，以及由師傅資料清單自動產生的動態師傅頁。

## 3. JSON-LD 與首頁 meta

```bash
curl -sS https://6bpodcasts.com/ | grep -o 'application/ld+json' | wc -l
curl -sS https://6bpodcasts.com/ | grep -Eo '6B Podcast｜香港兩性關係 Podcast・感情樹窿・玄學拆局|香港最敢講感情真相嘅 Podcast。[^<]*'
```

預期首頁有兩個 JSON-LD script，分別包含 `Organization` 與 `PodcastSeries`。title、description、`og:title` 及 `twitter:title` 應與本次指定文案一致。

請把首頁 URL 貼到 [Google Rich Results Test](https://search.google.com/test/rich-results) 重新抓取。工具若能抓到 JSON-LD，代表公開 head 已能被讀取；但 `Organization` 與 `PodcastSeries` 未必屬於 Google 支援的 rich-result 呈現類型，因此「沒有可用 rich result」不等於 schema 無效。可同時使用 [Schema Markup Validator](https://validator.schema.org/) 檢查通用 Schema.org 語法。

## 4. Cache-Control

```bash
curl -sSI https://6bpodcasts.com/ | grep -i '^cache-control:'
asset=$(curl -sS https://6bpodcasts.com/ | grep -o '/assets/[^" ]*\.js' | head -n 1)
curl -sSI "https://6bpodcasts.com${asset}" | grep -i '^cache-control:'
curl -sSI https://6bpodcasts.com/manus-storage/og-image-main_4e62cddd.jpg | grep -i '^cache-control:'
```

預期 HTML 可維持 `no-cache`；由應用程式提供的 CSS、JS、圖片及 `/manus-storage/` 轉址應回應 `public, max-age=31536000, immutable`。如外層 CDN 覆寫標頭，請以公開回應為準，並在 CDN／平台設定層調整。
