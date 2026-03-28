# 6B Podcasts Hub - TODO

## 資料庫 & 後端
- [x] 設計 schema：blog_posts, subscriptions, bookings, contacts
- [x] 建立 blog 相關 tRPC procedures
- [x] 建立 subscription tRPC procedures
- [x] 建立 booking tRPC procedures
- [x] 建立 contact tRPC procedures
- [x] 建立 AI chatbot tRPC procedure（LLM 整合）
- [x] 新增/預約/聯絡時自動通知 owner

## 前端頁面
- [x] 全域 CSS 主題（深夜霓虹風格）
- [x] 頂部導航欄（含社交媒體連結）
- [x] 首頁（Hero + 最新影片展示 + 社交媒體引流）
- [x] 部落格列表頁
- [x] 部落格文章詳情頁
- [x] 部落格投稿頁（嘉賓提交）
- [x] 玄學服務預約頁
- [x] 電郵訂閱組件
- [x] 聯絡表單頁
- [x] AI 聊天機器人浮動按鈕
- [x] 頁腳（Footer）
- [x] 管理員後台（審核部落格文章）
- [x] 響應式設計適配

## 測試
- [x] 後端 procedures 單元測試
- [x] 前端主要流程測試

## YouTube API 整合
- [x] 設定 YOUTUBE_API_KEY 環境變數
- [x] 建立 server/youtube.ts（resolveChannelId, getChannelInfo, getLatestVideos, parseDuration, formatViewCount）
- [x] 在 routers.ts 加入 youtube.getVideos 及 youtube.getChannels tRPC procedures
- [x] 更新 Home.tsx：以真實 YouTube 數據替換靜態影片，加入頻道篩選 tabs、縮圖、觀看數、時間
- [x] 首頁社交平台區顯示即時訂閱人數
- [x] 撰寫 youtube.test.ts 並通過所有 23 個測試

## 新增 Tab 頁面（參考舊版網站）
- [x] 訪問舊版網站收集內容
- [x] 建立「關於我們」頁面 /about
- [x] 建立「服務項目」頁面 /services
- [x] 建立「收聽聲音 PODCASTS」頁面 /podcasts
- [x] 建立「合作洽談」頁面 /partnership
- [x] 更新 Navbar 加入四個新 Tab
- [x] 更新 App.tsx 路由
- [x] 撰寫新頁面測試（29 個測試全部通過）

## 影片卡片互動優化
- [x] 首頁影片卡片：鼠標懸停時自動播放 YouTube 影片預覽

## YouTube API 配額修復
- [x] 建立 youtube_cache 資料表（頻道 ID + 影片列表，TTL 24h）
- [x] 後端優先讀快取，失效才呼叫 YouTube API（頻道 ID 快取 24h，影片列表快取 1h）
- [x] 配額超限時自動降級至 7 天 stale 快取，不拋出錯誤至前端
- [x] 修復 Admin.tsx blog.approve 連結錯誤
- [x] 修復 Home.tsx TypeScript 類型錯誤

## Web Push Notification 系統
- [x] 安裝 web-push 套件，生成 VAPID 金鑰
- [x] 建立 push_subscriptions + push_notifications 資料表
- [x] 後端 push.ts：subscribe / unsubscribe / sendPushToAll / getPushHistory / getPushSubscriberCount
- [x] tRPC push router：subscribe, unsubscribe, subscriberCount, send, history procedures
- [x] 前端 Service Worker sw.js：接收推送、點擊跳轉、震動回饋
- [x] PushNotificationManager.tsx：訂閱提示 Banner（8秒後出現）+ 浮動鈴鐵按鈕
- [x] 管理員後台「🔔 推送通知」 Tab：訂閱者數量、撰寫發送、發送記錄
- [x] 34 個測試全部通過

## SEO 修復（首頁）
- [x] 優化頁面標題至 30–60 字元（路邊電台 × 路邊玄學堂｜香港最真實人物訪談）
- [x] 加入 Meta Description（50–160 字元）
- [x] 加入關鍵字 Meta 標籤（12 個關鍵字）
- [x] 加入 Open Graph 標籤（Facebook / WhatsApp 分享預覽）
- [x] 加入 Twitter Card 標籤
- [x] 設定 html lang="zh-Hant" 及 canonical URL
- [x] 首頁 useEffect 動態設定 document.title 及 meta
- [x] 34 個測試全部通過

## SEO - Sitemap & robots.txt
- [x] 建立動態 /sitemap.xml 端點（列出 8 個頁面，含 lastmod / changefreq / priority）
- [x] 建立靜態 robots.txt（允許所有爬蟲，封鎖 /admin 及 /api/）
- [x] sitemap 指向 https://6bpodcasts.com，自動更新 lastmod 為當天日期
- [x] 34 個測試全部通過

## 各頁面獨立 SEO 優化
- [x] About.tsx — 關於我們｜Ray Choy 路邊電台創辦人（標題 + Description + 關鍵字 + OG）
- [x] Services.tsx — 服務項目｜YouTube訪談製作、宣傳推廣、場地租用（標題 + Description + 關鍵字 + OG）
- [x] Booking.tsx — 玄學服務預約｜風水諮詢、八字命理、塔羅占卜（標題 + Description + 關鍵字 + OG）
- [x] Blog.tsx — 嘉賓專欄｜路邊電台嘉賓心得與幕後故事（標題 + Description + 關鍵字 + OG）
- [x] PodcastsPage.tsx — 收聽聲音 PODCASTS｜Apple Podcasts 及 Spotify 收聽（標題 + Description + 關鍵字 + OG）
- [x] Partnership.tsx — 合作洽談｜品牌置入、內容共創、整合行销（標題 + Description + 關鍵字 + OG）
- [x] Contact.tsx — 聯絡我們｜商業合作、嘉賓邀請、觀眾反饵（標題 + Description + 關鍵字 + OG）
- [x] 34 個測試全部通過
## 結構化資料 (Schema.org JSON-LD)

- [x] 建立可重用 JsonLd 元件 (client/src/components/JsonLd.tsx)
- [x] 首頁：Organization + WebSite + BreadcrumbList Schema
- [x] 關於我們：Person (Ray Choy) + Organization Schema
- [x] 服務項目：Service + ItemList Schema（含 FAQ）
- [x] 玄學預約：Service + FAQPage Schema（含服務價格）
- [x] 嘉賓專欄：Blog + BreadcrumbList Schema
- [x] 收聽 Podcasts：PodcastSeries + BreadcrumbList Schema
- [x] 合作洽談：ContactPage + BreadcrumbList Schema
- [x] 聯絡我們：ContactPage + LocalBusiness Schema
