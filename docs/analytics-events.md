# 第二輪分析事件清單

所有網站事件透過同一個白名單函式傳送至 **GA4**、**Meta Pixel** 及 **Microsoft Clarity**。只會傳送下表列出的非個人識別資料；姓名、電話、電郵、生日、感情故事、訊息內容、UTM 原值及 Stripe 客戶資料均不在白名單內。

| 事件 | 觸發時機 | 安全參數 | 狀態 |
|---|---|---|---|
| `video_play` | 用戶按「在 YouTube 觀看完整版」 | `video_id`、`content_type` | 程式及回歸測試已驗證 |
| `outbound_youtube` | 用戶由節目頁外連到 YouTube | `video_id`、`destination` | 程式及回歸測試已驗證 |
| `treehole_submit` | 感情樹窿投稿伺服器成功回覆後 | `source` | 程式及回歸測試已驗證 |
| `booking_submit` | 預約查詢伺服器成功回覆後 | `service` | 程式及回歸測試已驗證 |
| `whatsapp_click` | 用戶按 WhatsApp 查詢連結 | `source` | 程式及回歸測試已驗證 |
| `partnership_submit` | 商業合作查詢成功提交後 | `source` | 程式及回歸測試已驗證 |
| `pricing_view` | 會員方案頁載入後 | `source`、`payment_environment` | 程式及回歸測試已驗證 |
| `checkout_start` | 用戶按 Premium／VIP Stripe 沙盒結帳掣 | `plan`、`payment_provider`、`payment_environment` | 程式及回歸測試已驗證 |
| `purchase` | Stripe 成功返回頁收到已知方案及 `cs_test_` session 時，一個 session 只記錄一次 | `plan`、`payment_provider`、`payment_environment` | 程式及回歸測試已驗證；等待新沙盒返回實際驗證平台接收 |

> Stripe 目前屬 **test mode**。Premium 與 VIP 測試付款連結、回傳成功頁及 Premium 沙盒訂閱已驗證；正式收款、webhook 驗證及正式會員權益同步尚未開通。
