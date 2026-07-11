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

## SnapWidget IG Feed 更新

- [x] IgFeedEmbed.tsx 更新使用真實 SnapWidget ID 1121118（響應式寬度）

## Bug 修正：IgFeedEmbed allowTransparency prop

- [x] IgFeedEmbed.tsx：移除 allowTransparency 屬性（React/TS 不支援），透明度由 SnapWidget 自行處理

## AI 搜尋引擎優化（AEO / GEO）

- [x] 建立 /llms.txt 靜態檔案（符合 llmstxt.org 規範）
- [x] 建立 /llms-full.txt 完整版（包含所有頁面 Markdown 內容）
- [x] 在 server 加入 /llms.txt 及 /llms-full.txt 路由端點
- [x] 更新 robots.txt 加入 llms.txt 位置提示
- [x] 測試 llms.txt 端點正確回應

## 首頁 Hero 背景圖片升級

- [x] 上傳錄音室背景圖片至 CDN
- [x] 更新首頁 Hero 區塊使用真實錄音室背景圖
- [x] 確保文字在圖片上清晰可見（加入暗色遮罩）

## 嘉賓專欄社交分享功能

- [x] 建立 ShareButtons 元件（Facebook、Threads、WhatsApp、X/Twitter、複製連結）
- [x] 加入到文章詳情頁（BlogPost.tsx）

## 文章瀏覽次數統## 文章欄位計數功能

- [x] 在 blog_posts 表加入 viewCount 欄位
- [x] 建立 blog.incrementViewCount tRPC procedure
- [x] 在 BlogPost 頁面載入時呼叫 incrementViewCount
- [x] 在文章詳情頁顯示「已有 XXX 人閱讀」
## 自動化文章發布流程

- [x] 建立 publish_article.mjs 統一發布腳本（AI 生成配圖 + 上傳 S3 + 插入資料庫一次完成）
- [x] 更新 hk-daily-column 技能說明文件

## 嘉賓投稿改進

- [x] 嘉賓投稿自動批准發布（status 直接設為 approved，publishedAt 自動填入）
- [x] 嘉賓投稿表單移除 Email 必填欄位（改為完全隱藏）

## 相關文章推薦區塊

- [x] 後端：新增 blog.getRelated procedure（依分類取 3 篇相關文章，排除當前文章）
- [x] 前端：BlogPost.tsx 文章底部加入「相關文章」卡片區塊

## 相關文章「換一批」功能

- [x] 後端：blog.getRelated 新增 offset 參數支援分頁輪換
- [x] 前端：相關文章區塊加入「換一批」按鈕，點擊後顯示下一批推薦

## SEO/GEO 四項改進

- [x] index.html 加入 hreflang zh-HK / zh-Hant / x-default 標籤
- [x] 文章詳情頁加入 Article JSON-LD Schema（含 author、datePublished、image、publisher）
- [x] 資料庫新增 faq 欄位，後端新增 blog.getFaq / blog.generateFaq procedure（AI 自動生成）
- [x] BlogPost.tsx 加入 FAQ 展開區塊及 FAQPage JSON-LD Schema
- [x] 為現有 9 篇文章批量生成 FAQ
- [x] Google Search Console 驗證及提交 Sitemap 指引

## Google AdSense 整合

- [x] index.html 加入 AdSense 腳本（pub-7035034067070430）及 Auto Ads
- [x] 改用 Auto Ads ，移除手動廣告位（Google 自動分析最佳位置）

## 首頁 SEO 修復

- [x] 關鍵字從 12 個精簡至 6 個核心關鍵字
- [x] 標題從 22 字元延長至 30-60 字元，並用 document.title 動態設置

## 新文章自動生成 FAQ

- [x] 在文章發布 procedure（管理員發布 + 嘉賓投稿）中加入自動 FAQ 生成邏輯

## 文章留言區塊

- [x] 資料庫新增 comments 表（postSlug, authorName, content, createdAt, approved）
- [x] 後端：新增 comment.list / comment.submit procedures
- [x] 前端：建立 Comments.tsx 元件，整合至 BlogPost.tsx 文章底部

## AI Agent 可發現性（Agent Readiness）

- [x] robots.txt 加入 Content Signals（ai-train=no, search=yes, ai-input=no）
- [x] 建立 /.well-known/api-catalog（application/linkset+json，RFC 9727）
- [x] 建立 /.well-known/oauth-authorization-server（OAuth 2.0 元資料）
- [x] 建立 /.well-known/oauth-protected-resource（受保護資源元資料）
- [x] 建立 /.well-known/mcp/server-card.json（MCP Server Card）
- [x] 建立 /.well-known/agent-skills/index.json（Agent Skills Discovery）
- [x] Express 伺服器加入 RFC 8288 Link 回應標頭
- [x] Express 伺服器加入 Markdown 協商中介層（Accept: text/markdown）
- [x] 前端加入 WebMCP navigator.modelContext.provideContext() 工具定義

## API Catalog 修復（RFC 9727）

- [x] 修復 /.well-known/api-catalog 端點，確保回傳 application/linkset+json（非 HTML）
- [x] 刪除 client/public/.well-known/ 靜態檔案，Express 路由完全接管所有 .well-known 端點

## Markdown for Agents 改進

- [x] 擴展 Express Markdown 協商中介層，支援 /、/blog 及 /blog/:slug 路徑
- [x] 加入 x-markdown-tokens 標頭（估算 token 數量）
- [x] 加入 Vary: Accept 標頭確保快取正確區分 HTML/Markdown 回應

## 主持招募 Landing Page

- [x] 資料庫新增 host_applications 表（9 個欄位 + 隱私聲明）
- [x] 後端新增 host.submit tRPC procedure（表單提交）
- [x] 前端建立 HostRecruitment.tsx landing page（9 欄位表單 + 隱私聲明）
- [x] 前端加入路由 /host-recruitment
- [x] 導航列加入「主持招募」連結
- [x] 測試表單提交流程（69 個測試全部通過）
- [x] 儲存 checkpoint

## 主持招募表單升級

- [x] 資料庫新增 availableTimeSlots（JSON 陣列，多選時間段）、hostPhotos（JSON 陣列，最多 5 張照片 URL）、acceptCommercial（boolean）欄位
- [x] 生成及執行資料庫遷移
- [x] 後端更新 host.submit procedure 支援新欄位
- [x] 前端新增時間段多選元件（星期一至日 + 14:00-18:00 / 19:00-23:00）
- [x] 前端新增照片上傳元件（最多 5 張，複用 ImageUploader）
- [x] 前端新增商業合作複選框
- [x] 測試表單提交及驗證（69 個測試全部通過）
- [x] 儲存 checkpoint（版本 d8f28d44）

## 路邊玄學堂平台 MVP

- [x] 品牌選擇入口 Portal（首頁選擇路邊Podcasts / 路邊玄學堂）
- [x] 玄學堂首頁（Hero、分類入口、最新影片、最新文章、玄學家介紹、會員升級區）
- [x] 玄學分析工具頁（5步驟表單：出生資料→分類→派別→主題→生成報告）
- [x] 玄學家列表頁（/mystic/masters）
- [x] 玄學家個人頁（/mystic/masters/[id]）
- [x] 影片專區（/mystic/videos，分類篩選）
- [x] 文章專區（/mystic/articles，分類篩選）
- [x] 會員方案頁（/mystic/pricing，三個等級）
- [x] 玄學堂導航列（含品牌切換）
- [x] Mock data（4位玄學家、影片、文章）
- [x] 整合路由（App.tsx）
- [x] Admin.tsx JSX 錯誤修復
- [x] 69 個測試全部通過
- [x] 儲存 checkpoint（版本 e9d9e981）

## 開門轉場品牌選擇首頁

- [x] 重新設計 Portal.tsx：分割畫面（左邊路邊Podcasts / 右邊路邊玄學堂），hover 時該側展開，點擊後「開門」動畫轉場
- [x] 修改 App.tsx：將 / 路由指向新 Portal，原 Home 移至 /home
- [x] 更新 MysticNavbar 及 Navbar 的 Logo 連結（回到 /）
- [x] 69 個測試全部通過
- [x] 儲存 checkpoint（版本 92d7427c）

## 八字命盤分析工具

- [x] 建立 server/bazi.ts 八字推算核心（天干地支、四柱、藏干、十神、大運、流年）
- [x] 建立後端 tRPC mystic.calculateBazi procedure
- [x] 建立後端 tRPC mystic.analyzeBazi AI 分析 procedure（付費解鎖）
- [x] 建立前端 /mystic/bazi 頁面（輸入表單 + 彩色四柱命盤 + 基本資料 + 免費總結 + 付費解鎖 AI 分析）
- [x] 整合至 MysticHome 及 MysticNavbar 導航
- [x] 69 個測試全部通過，儲存 checkpoint bd64b237

## 玄學影片專區 YouTube 真實資料整合

- [x] 重寫 MysticVideos.tsx 使用 trpc.youtube.getVideos({ channel: "fengshui", limit: 50 }) 真實資料
- [x] 加入 VideoCard 元件（縮圖、播放覆蓋、時長標籤、觀看數、發布日期）
- [x] 加入分類篩選（全部 / 風水命理 / 塔羅靈數 / Shorts）
- [x] 加入 @6bfengshui 頻道資訊橫幅（頻道頭像、訂閱按鈕）
- [x] 全部影片分拆為「最新影片」及「Shorts 速學玄學」兩個區塊
- [x] 加入載入骨架屏、錯誤狀態、載入更多按鈕
- [x] 112 個測試全部通過，零 TypeScript 錯誤
- [x] 儲存 checkpoint

## 西方玄學 AI Prompt 升級 + 阿卡西紀錄功能

- [x] 升級後端 generateReport prompt：加入角色設定框架、防止 AI 感的技巧
- [x] 塔羅牌分析改用「牌陣師傅」角色設定，輸出有畫面感的解讀
- [x] 星座占星改用「占星師」角色，加入具體月份建議
- [x] 生命靈數改用「靈數導師」角色，加入業力課題分析
- [x] 新增阿卡西紀錄解讀 procedure（前世今生、靈魂伴侶、靈魂年齡）
- [x] 在 WESTERN_METHODS 加入「阿卡西紀錄」入口
- [x] 前端 MysticAnalysis 頁面加入阿卡西紀錄專用表單（姓名+生日）

## 玄學分析流程修正

- [x] 重構 MysticAnalysis.tsx：輸入一次出生資料後可反覆切換中式/西式/派別，不需重新輸入
- [x] 結果頁加入「換一個派別」按鈕，直接跳回選擇傳統步驟，保留出生資料
- [x] 阿卡西紀錄選完後直接進入阿卡西流程，完成後可返回選其他派別

## 串流 AI 回應 + 精確農曆功能

- [x] 安裝 lunar-typescript 精確農曆套件
- [x] 後端 bazi.ts 改用精確農曆計算替換近似版
- [x] 後端新增 /api/mystic/stream-report SSE 端點（Express route，非 tRPC）
- [x] 後端新增 /api/mystic/stream-akashic SSE 端點
- [x] 前端 MysticAnalysis.tsx 加入農曆/陽曆切換輸入選項
- [x] 前端 MysticAnalysis.tsx 改用串流接收，逐字顯示報告
- [-] 前端 MysticBazi.tsx AI 分析改用串流顯示（待後續要求）
- [x] 測試串流及農曆功能正常運作

## 會員系統（每日額度控制）

- [x] 資料庫新增 mystic_usage 表（userId, date, count）
- [x] 後端新增 canUseMysticToday / incrementMysticUsage helpers 及 mystic.getUsage tRPC procedure
- [x] 後端串流端點加入 auth + 額度驗證（401 未登入，429 額度用盡）
- [x] 前端 MysticAnalysis：未登入顯示登入提示頁，登入後顯示今日剩餘次數 badge
- [x] 前端每次生成後自動刷新剩餘次數
- [x] 測試期間：每日 10 次免費，全功能開放

## 首頁重新設計

- [x] 重新設計 Home.tsx：全新 Hero 區塊（大標題、品牌 tagline、動態背景）
- [x] 加入兩大頻道展示卡（路邊電台 vs 路邊玄學堂）
- [x] 加入最新影片區塊（保留現有 YouTube 邏輯）
- [x] 加入玄學堂 AI 分析入口 CTA（突出顯示）
- [x] 加入社交平台追蹤區塊（訂閱數）
- [x] 加入嘉賓專欄 CTA
- [x] 確保 mobile-first，所有點擊區域 ≥ 44px

## 現代化 SaaS 登錄頁設計（taste-skill）

- [x] 重新設計 Portal.tsx：全螢幕分割門戶頁，加入 SaaS 登入 CTA、品牌故事、即時訂閱數
- [x] 加入 framer-motion 入場動畫（stagger reveal）
- [x] 加入 Phosphor Icons 替換 emoji
- [x] 預飛檢查：零 em-dash、dark mode、mobile collapse、prefers-reduced-motion

## 首頁第三階段重設計（資訊架構重建）

- [x] Hero Section：主標題「6B Podcast｜香港真實人物、關係、玄學與生活文化內容平台」+ 副標題 + 三個 CTA + 即時訂閱數
- [x] 三大入口卡：路邊電台 / 路邊玄學堂 / 商業合作
- [x] 最新 YouTube 影片區塊（混合兩個頻道，含篩選 tabs）
- [x] 熱門節目分類區塊（4 個分類卡）
- [x] 路邊玄學堂精選內容區塊（10 種派別網格 + AI 分析 CTA）
- [x] 玄學服務 / 會員訂閱入口區塊
- [x] 嘉賓專欄 / 精選文章區塊（有文章時顯示）
- [x] 商業合作區塊
- [x] 社交媒體追蹤區（6 個平台）
- [x] Footer 更新（含導航連結）
- [x] TypeScript 零錯誤，112 個測試全部通過
- [x] 手機版底部固定快捷導航（4 項：首頁/最新影片/玄學堂/合作查詢）
- [x] 更新 Navbar：桌面 9 項（首頁/最新節目/路邊電台/路邊玄學堂/玄學服務/嘉賓專欄/商業合作/關於 6B/聯絡我們）
- [x] 手機版 Navbar 底部快捷導航（最新影片/玄學堂/預約服務/合作查詢）
- [x] 更新 App.tsx 路由（/episodes 最新節目頁、/mystic/services 玄學服務頁）

## 路邊玄學堂 Landing Page 重建（第四階段）

- [x] Hero Section：主標題 + 副標 + 3 CTA（觀看節目/預約服務/加入會員）+ @6bfengshui 訂閱數
- [x] 玄學分類區：8 個分類卡（風水/八字命理/紫微斗數/奇門遁甲/塔羅占卜/星座分析/生命靈數/身心靈療癒）
- [x] 最新玄學影片：嵌入 @6bfengshui 最新影片（復用 youtube.getVideos fengshui）
- [x] 精選主題：6 個主題卡（每月運程/感情姻緣/事業財運/家居風水/流年分析/開運貼士）
- [x] 師傅介紹：4 位師傅（風水/八字/塔羅/身心靈），含姓名、派別、專長、代表影片連結、預約 CTA
- [x] 會員訂閱區：三個層級（免費觀看/玄學會員/個人服務）
- [x] 預約 CTA 區塊：文案 + 立即預約按鈕
- [x] FAQ 區塊：6 個常見問題（Accordion 展開）
- [x] 語氣：專業貼地有神秘感，避免恐嚇式文案
- [x] TypeScript 零錯誤，112 個測試全部通過
- [x] 師傅資料以通用稱謂作佔位，待後續提供真實資料再更新
- [x] 儲存 checkpoint

## 玄學變現漏斗（第五階段）

- [x] 建立 /mystic/funnel 四層轉換路徑頁面（免費內容/玄學會員/個人服務/高端服務）
- [x] 首頁 Hero 加入路邊玄學堂 CTA 入口
- [x] 文章詳情頁（BlogPost.tsx）玄學分類文章底部加入預約玄學服務 + 觀看玄學影片 + YouTube 訂閱 CTA
- [x] 影片頁（MysticVideos.tsx）底部加入訂閱 YouTube + 預約分析 + 查看服務方案 CTA 橫幅
- [x] 商業合作頁（Partnership.tsx）加入玄學內容合作區塊（節目贊助/師傅合作/品牌內容）
- [x] 所有 CTA 文案符合香港觀眾習慣，不突兀
- [x] TypeScript 零錯誤，112 個測試全部通過
- [x] 儲存 checkpoint

## YouTube 及社交媒體導流強化（第六階段）

- [x] 建立 /episodes 路邊電台影片頁：5 大分類（兩性關係/人物訪談/都市情感/人生故事/職場與生活）+ 關鍵字篩選、訂閱 CTA
- [x] 升級影片卡：縮圖、標題、分類標籤、觀看 CTA、相關服務連結
- [x] 升級 /mystic/videos 玄學影片頁：7 大分類（風水/八字/紫微斗數/塔羅/星座/生命靈數/身心靈）+ 升級影片卡
- [x] 首頁影片區塊：路邊電台 vs 路邊玄學堂 分開展示，各有訂閱 CTA 及「查看全部」連結
- [x] 首頁社交追蹤區：7 個平台入口（YouTube×2/Facebook/Instagram/Threads/Apple Podcast/Spotify）
- [x] 各影片卡加入分類標籤及相關服務連結
- [x] TypeScript 零錯誤，112 個測試全部通過
- [x] 儲存 checkpoint

## SEO 基礎設定（第七階段）

- [x] 建立共用 useSEO hook（client/src/hooks/useSEO.ts）動態設定 title、meta description、OG tags、canonical
- [x] 首頁：Title「6B Podcast｜香港真實人物訪談、兩性關係、中西玄學內容平台」+ Meta Description + OG
- [x] 最新節目（/episodes）：獨立 Title + Meta Description + OG
- [x] 路邊電台（/podcasts）：獨立 Title + Meta Description + OG
- [x] 路邊玄學堂（/mystic）：獨立 Title + Meta Description + OG
- [x] 玄學服務（/mystic/services）：獨立 Title + Meta Description + OG
- [x] 嘉賓專欄（/blog）：獨立 Title + Meta Description + OG
- [x] 商業合作（/partnership）：獨立 Title + Meta Description + OG
- [x] 關於 6B（/about）：獨立 Title + Meta Description + OG
- [x] 聯絡我們（/contact）：獨立 Title + Meta Description + OG
- [x] 每頁 Title 及 Meta Description 不重複
- [x] index.html Open Graph 圖片設定（og:image）+ Twitter Card 圖片
- [x] index.html 更新首頁 Title、Meta Description、Keywords（按照用戶提供的 13 個關鍵字）
- [x] TypeScript 零錯誤，112 個測試全部通過
- [x] 儲存 checkpoint（版本 636966f2）

## Visual System 圖片生成（第八階段）

- [x] 並行生成 19 張品牌圖片（香港本地感、真實感、避免 stock photo）
- [x] 生成 19 張圖片（香港本地感、真實感、有溫度）
- [x] 上傳圖片至 S3 Storage
- [x] 更新首頁 Hero 背景圖片
- [x] 更新首頁三大入口卡圖片（路邊電台/路邊玄學堂/商業合作）
- [x] 更新玄學堂 Hero 圖片
- [x] 更新玄學分類卡圖片（風水、八字、紫微斗數、塔羅、星座、生命靈數）
- [x] 更新商業合作頁 Hero 圖片
- [x] 更新 index.html OG 圖片及 Twitter Card 圖片
- [x] TypeScript 零錯誤，112 個測試全部通過
- [x] 更新師傅介紹區背景圖（masters-bg）
- [x] 更新玄學堂 OG 圖片（og-mystic）
- [x] 更新商業合作 OG 圖片（og-partnership）
- [x] TypeScript 零錯誤，112 個測試全部通過
- [x] 儲存 checkpoint（版本 d7c76e03）
## 玄學堂 Landing Page 升級 + 圖片系統更新（第六階段）

- [x] 更新首頁 Hero 背景圖為新版本（/manus-storage/hero-main_e8a05c5e.jpg）
- [x] 更新三大入口卡圖片（card-podcasts、card-mystic、card-partnership）
- [x] 更新玄學堂 Hero 背景圖（/manus-storage/hero-mystic_0e642ac2.jpg）
- [x] 玄學堂 Hero CTA：加入 WhatsApp 預約按鈕（綠色漸層）
- [x] 玄學堂 Hero CTA：「節目」改為「影片」
- [x] 玄學堂：加入 YouTube 訂閱橫幅（@6bfengshui，立即訂閱按鈕）
- [x] 玄學堂預約 CTA 區塊：加入 WhatsApp 立即預約按鈕（主要 CTA）
- [x] 生成 mystic-booking.jpg 及 mystic-membership.jpg 新圖片
- [x] TypeScript 零錯誤，112 個測試全部通過

## 優化需求文件 v1.0（2026-07）— 三軌轉化引擎升級

### P0 — 技術 SEO 地基
- [ ] 1.1 評估並實施 CSR 可見性方案（prerender / SSG / 初始 HTML 內容） — 待確認方案
- [x] 1.2 每頁獨立 Meta Tags 全面覆蓋（blog/:slug、師傅頁 /mystic/masters/:id 動態路由）
- [x] 1.3 更新 robots.txt（確認排除 /admin，指向 sitemap）
- [x] 1.3 更新 sitemap.xml（加入所有新增頁面，blog 文章動態加入）
- [x] 1.4 補齊 JSON-LD（PodcastEpisode、Article with author/datePublished/image、Person、Service+Offer）
- [x] 1.5 JS bundle code splitting / lazy load（拆出 admin、mystic 分析工具等非首屏模組）
- [x] 1.5 移除 viewport maximum-scale=1（accessibility 問題）

### P1 — 轉化架構重整
- [x] 2.1 移除全站 Google AdSense script 及廣告位
- [x] 2.2 全站 CTA 收斂為「✨ 立即免費命盤分析」主 CTA（首頁 hero 下、blog 文尾）
- [ ] 2.2 次 CTA 降級（YouTube 訂閱、WhatsApp 預約僅保留在 /booking 及師傅頁）
- [ ] 2.2 免費分析結果頁加入分流（➊ 預約師傅深度諮詢 ➋ 落點算 App）
- [ ] 2.3 首頁重整（Hero 定位句+最新一集、三大內容支柱、數據列、主 CTA 區、Footer 分流）

### P2 — 新增頁面
- [x] 3.1 新增 /investors 頁（平台定位、Traction 數據、生態模型、收入模式、聯絡 CTA）
- [ ] 3.2 /host-recruitment 升級為篩選 Funnel（4 條 qualifying 問題、48h 回覆訊息、CSV export） — 待實施
- [ ] 3.3 師傅頁（/mystic/masters/:id）加轉化故事線 — 待實施

## 第二階段：全站 Design Token 統一（2026-07）

- [x] Navbar.tsx — 移除霓虹色，套用金色 + 暖黑 + 細線風格
- [x] Footer.tsx — 套用新 token，移除 gradient-text
- [x] Portal.tsx — 選台頁套用新設計系統
- [x] MysticNavbar.tsx — 移除紫色霓虹，套用金色 + 暖黑
- [x] MysticHome.tsx — 全面套用新 token
- [x] MysticMasterDetail.tsx — 套用新 token
- [x] MysticPricing.tsx — 套用新 token
- [x] MysticServices.tsx — 套用新 token
- [x] BlogPost.tsx — 套用新 token
- [x] BlogList.tsx — 套用新 token
- [x] Episodes.tsx — 套用新 token
- [x] Podcasts.tsx — 套用新 token
- [x] About.tsx — 套用新 token
- [x] Contact.tsx — 套用新 token
- [x] Partnership.tsx — 套用新 token
- [x] Investors.tsx — 確認已使用新 token

## 修復任務文件 v2.0（2026-07-11）

### P0：立即修復
- [ ] P0-1: 修正 Header 訂閱數格式化錯誤（22700 → 2.27萬，非 22700.2萬）
- [ ] P0-2: 修復 Footer Spotify 死鏈（spoti.fi/30EQPOT → 正確 show URL）
- [ ] P0-3: 修復 Apple Podcasts 連結（短鏈 → https://podcasts.apple.com/hk/podcast/id1595723029）
- [ ] P0-4a: 修正 /contact title 錯字（反饲 → 反饋）
- [ ] P0-4b: 刪除 /blog 第一篇文章摘要結尾多餘的「v」字元

### P1：內容一致性
- [ ] P1-1: 全站數字統一（/services、/welcome、/podcasts、/investors 頁面）
- [ ] P1-2: 全站電郵統一（ktcreativefirm@gmail.com → hello@6bpodcasts.com）
- [ ] P1-3: /about 頁刪除無出處「大數據研究」聲稱
- [ ] P1-4: 補齊 /host-recruitment、/blog/submit、/home 頁面 title + meta description

### P2：SEO 架構
- [ ] P2-1: Per-page server-side canonical + meta tags（所有主要路由）
- [ ] P2-2: / 與 /home 各有獨立 title/meta，logo 與導航「首頁」連結統一
- [ ] P2-3: sitemap.xml 確保 Content-Type 為 application/xml、明文 XML、non-www URL
- [ ] P2-4: 重寫 llms.txt 與 llms-full.txt（訂閱數、集數、連結、價格、電郵全部更新）
