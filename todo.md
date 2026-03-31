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

## FB/IG Landing Page (/welcome)

- [x] 後端：復用現有 youtube.getVideos + youtube.getChannels 程序
- [x] 前端：Hero 區塊（品牌標語 + 主要 CTA）
- [x] 前端：最新影片展示區（YouTube 縮圖列表 + 外連）
- [x] 前端：玄學服務快速預約 CTA 區塊
- [x] 前端：社群數據展示（訂閱數、集數、年數）
- [x] 前端：社群追蹤按鈕（YouTube / FB / IG / Podcast）
- [x] 前端：嘉賓金句輪播區塊
- [x] Open Graph 標籤（針對 FB/IG 分享優化）
- [x] JSON-LD Schema（WebPage + Organization + BreadcrumbList）
- [x] UTM 參數追蹤支援（utm_source=facebook/instagram）
- [x] 加入 App.tsx 路由 /welcome（隐藏 Navbar/Footer/ChatBot）
- [x] Vitest 測試覆蓋（40 個測試全部通過）

## 讀者投稿功能（首頁互動區塊）

- [x] DB Schema：新增 reader_submissions 資料表（id, nickname, category, content, status, likes, createdAt）
- [x] 後端：submission.submit 公開程序（提交投稿）
- [x] 後端：submission.listApproved 公開程序（取得精選投稿列表）
- [x] 後端：submission.adminList 管理員程序（全部投稿）
- [x] 後端：submission.updateStatus 管理員程序（審核通過/拒絕）
- [x] 首頁：ReaderSubmissions 區塊（卡片網格 + 讓好按鈕）
- [x] 首頁：投稿表單 Dialog（類別、內容、匿名選項）
- [x] 管理後台：Admin.tsx 加入 📨 讀者投稿審核 tab
- [x] Vitest 測試覆蓋（57 個測試全部通過）

## Landing Page 投稿區塊 (/welcome)

- [x] Welcome.tsx：加入「分享你的故事」內嵌投稿表單（類別、內容、暱稱、匿名）
- [x] 複用 submission.submit tRPC 程序，提交後顯示成功提示
- [x] 區塊設計配合 Landing Page 深色霧虹風格
- [x] 更新 welcome.test.ts 測試覆蓋（64 個測試全部通過）

## 投稿系統升級（圖片上傳 + 發放功能）

- [x] DB Schema：reader_submissions 加入 images、publishTarget、adminNote、publishedAt 欄位
- [x] 後端：S3 圖片上傳 API（最多5張、每張≤2MB、驗證 MIME 類型）
- [x] 後端：submission.uploadImage tRPC 程序（S3 直接上傳）
- [x] 後端：submission.submit 更新支援 imageUrls 陣列- [x] 後端：submission.updateStatus 加入「 published」狀態及發佈目標（首頁/嘉賓專欄）
- [x] 前端：建立可重用 ImageUploader 元件（拖放 + 點擊選擇 + 縮圖預覽 + 删除）
- [x] 前端：圖片驗證（≤5張、每張≤2MB、只接受 jpg/png/webp/gif）
- [x] 前端：管理後台審核卡片加入圖片縮圖預覽
- [x] 前端：管理後台加入「發放」按鈕（選擇發佈目標：首頁精選 / 嘉賓專欄）
- [x] 前端：首頁投稿展示卡片支援圖片輪播（有圖片時顯示）
- [x] 前端：Landing Page 投稿表單同步升級支援圖片上傳
- [x] Vitest 測試更新覆蓋新功能（64 個測試全部通過）

## 嘉賓投稿升級（圖片上傳 + 連結 + 燈箱放大）

- [x] DB Schema：blog_posts 加入 images (varchar 5000, JSON 陣列) 及 links (varchar 2000, JSON 陣列) 欄位
- [x] 後端：blog.submit 更新支援 imageUrls 及 links 陣列參數
- [x] 後端：blog.adminList 及 blog.getPost 回傳 images 及 links 欄位
- [x] 前端：BlogSubmit.tsx 加入 ImageUploader 元件（最多5張、每張≤2MB）
- [x] 前端：BlogSubmit.tsx 加入連結欄位（最多3條，含標題 + URL）
- [x] 前端：建立可重用 Lightbox 元件（點擊圖片放大、鍵盤/點擊關閉、左右切換）
- [x] 前端：Admin.tsx 嘉賓文章審核卡片加入圖片縮圖（點擊放大 Lightbox）及連結顯示
- [x] 前端：Blog 文章詳情頁加入圖片輪播及連結展示區塊
- [x] Vitest 64 個測試全部通過，零 TypeScript 錯誤

## 嘉賓文章列表封面縮圖

- [x] 確認 blog.list tRPC 程序已回傳 images 欄位
- [x] Blog.tsx 文章卡片：有圖片時顯示第一張為封面縮圖（16:9 比例）
- [x] Blog.tsx 文章卡片：無圖片時顯示預設漸層佔位符（含類別圖示）
- [x] 卡片版面調整：封面圖在上，文字內容在下（垂直排列）
- [x] Vitest 64 個測試全部通過，零 TypeScript 錯誤

## 導航列「✉️ 投稿」按鈕

- [x] Navbar.tsx 桌面版：社群圖示左側加入「✉️ 投稿」高亮按鈕（橙色漸層）
- [x] 點擊後顯示下拉選單：「📝 觀眾投稿（分享故事）」→ 首頁 #submissions 區塊 / 「✍️ 嘉賓投稿（嘉賓文章）」→ /blog/submit
- [x] Navbar.tsx 手機版：漢堡選單內加入投稿選項（兩個連結）
- [x] 點擊選單項目後自動關閉選單（含點擊外部自動收起）
- [x] Vitest 64 個測試全部通過，零 TypeScript 錯誤

## Bug 修正：嘉賓投稿 title 驗證錯誤

- [x] 修正 blog.submit 的 title 最小字元限制（從 5 降至 1）
- [x] 加入清晰中文錯誤提示訊息（title / authorName / email / content 全部中文化）

## SEO 加強 + FB/IG 社群整合

- [x] 建立 useSeoMeta hook：每頁獨立 title、description、OG tags、Twitter Card
- [x] index.html 加入預設 OG/Twitter meta 標籤（fallback）
- [x] 建立 /sitemap.xml 動態路由（Express 後端生成）
- [x] 建立 /robots.txt 靜態檔案（允許爬蟲 + 指向 sitemap）
- [x] 每頁加入 canonical URL link 標籤（由 useSeoMeta 統一管理）
- [x] 整合 Facebook Pixel（pageview 追蹤 + ViewContent 自訂事件）
- [x] 文章詳情頁加入 ShareButtons（FB / WhatsApp / 複製連結）
- [x] 首頁加入 IgFeedEmbed 區塊（SnapWidget 嵌入 IG Feed）
- [x] 首頁加入 FB Page Plugin 按讚區塊
- [x] Vitest 64 個測試全部通過，零 TypeScript 錯誤
