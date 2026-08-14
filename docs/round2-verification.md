# 第二輪修正驗證紀錄

## Microsoft Clarity Strict Masking

2026-08-14：已以連接瀏覽器開啟 Microsoft Clarity 公開頁及 `/projects`，但沒有可用的登入專案介面或專案設定內容。因此暫時**未能在帳戶層面確認 Strict Masking 開關**。網站程式已在整個感情樹窿 `<form>` 加入 `data-clarity-mask="true"`，避免該表格欄位內容出現在 Clarity 記錄。

待可登入對應 Clarity 專案後，需於專案的 Settings／Masking 設定確認 Strict Masking 為開啟狀態，才可完成帳戶設定層的驗證。

## 核心內容頁首訪與內容呈現

2026-08-14：已檢查桌面版首頁、`/blog`、`/episodes` 及真實文章頁 `/blog/5-1777176945826`。四頁首次畫面均有對應頁面內容，未見只剩導覽及頁尾的空白首屏；文章頁正文已由統一 Markdown renderer 輸出。伺服器原始 HTML 亦已以 `curl` 驗證首頁、blog 及節目列表各自含有 `#seo-content` 和對應 H1。

節目詳情頁的原始 HTML 會在既有 YouTube 快取命中時輸出對應的 `VideoObject`；如快取未命中，會保留一般節目內容回退而不對爬蟲直接發出額外 YouTube API 請求。

## Stripe 沙盒訂閱付款

2026-08-14：會員方案頁桌面檢查顯示「Stripe 測試模式」提示、Premium HK$98／月及 VIP HK$298／月的測試結帳 CTA；所有提示均清楚標示不向真實客戶收費。

`/mystic/payment/success?test=1` 已提供獨立測試付款成功頁，顯示沙盒狀態並引導返回會員方案，不把付款資料置入網址。Stripe 沙盒帳戶已建立 Premium 與 VIP 月費 Price 及 Payment Link，兩個 Link 完成後均導向此獨立成功頁。正式模式仍需連接 live mode 及設定 webhook signing secret。

同日以 375px 流動版檢查：免費、Premium 及 VIP 方案卡會直向排列；兩個 Stripe 測試 CTA、沙盒提示及常見問題文字均可見。測試成功頁的主訊息及返回按鈕在首屏可完整閱讀和操作。

Premium 沙盒流程已以 Stripe 測試卡完成一次測試訂閱。Stripe 返回 `/mystic/payment/success?test=1`，並由沙盒 API 驗證相應 Premium 月費 Price 有一筆 `active`、`livemode: false` 的月費訂閱。此測試不使用真實客戶資料、不產生真實扣款；正式 webhook 與會員權益同步仍待 live mode／專案付款金鑰配置。

Stripe Payment Link 只支援成功後 redirect，未提供獨立的取消返回 URL。網站已提供 `/mystic/payment/cancelled` 取消頁與會員方案內的返回入口；若正式模式需要 Stripe 自動返回取消頁，需改用伺服器端 Checkout Session。

第二次 Premium 沙盒訂閱已按更新後的 Payment Link 完成，Stripe 成功返回網址帶有 `test=1`、`plan=premium` 及 `cs_test_` session 識別。以現行預覽成功頁檢查前端佇列：GA4 收到 `purchase`（`plan=premium`、`payment_provider=stripe`、`payment_environment=test`）；Meta Pixel 收到同一組 `trackCustom` 安全參數；Clarity 收到不帶參數的 `purchase` 事件。三者均沒有姓名、電郵、電話或 Stripe 客戶資料。

`/mystic/payment/cancelled` 已以 375px 檢查：取消狀態、返回會員方案及 WhatsApp 查詢按鈕均在首屏完整可見，保留原有黑金視覺與足夠操作空間。

## 第二輪流動版關鍵頁

2026-08-14：已以 375px 檢查 `/booking`、`/contact`、`/partnership`、`/treehole`、`/services` 及 `/episodes`。四個公開表格的必選私隱同意欄、提交掣及頁尾私隱連結均可見；服務頁的 23K／535 指標、四項服務及合作入門方案均正常顯示。節目列表截圖時仍顯示資料骨架，但同期網絡請求已回應影片資料 HTTP 200；這是擷取時機造成的短暫載入狀態，非 API 請求失敗。

其後以瀏覽器重新開啟 `/episodes`，已確認 50 條節目、頻道訂閱數、分類掣、影片縮圖及節目內連結正常顯示，並非持續載入錯誤。
