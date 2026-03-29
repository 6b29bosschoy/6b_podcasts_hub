import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";
import { ExternalLink } from "lucide-react";
import Lightbox from "@/components/Lightbox";

type Tab = "blogs" | "bookings" | "contacts" | "subscriptions" | "push" | "submissions";

const SERVICE_LABELS: Record<string, string> = {
  fengshui: "風水諮詢", bazi: "八字命理", tarot: "塔羅占卜", spiritual: "身心靈療癒", course: "課程報名",
};
const INQUIRY_LABELS: Record<string, string> = {
  collaboration: "商業合作", guest: "嘉賓邀請", feedback: "觀眾反饋", other: "其他",
};
const CATEGORY_LABELS: Record<string, string> = {
  relationship: "兩性關係", fengshui: "玄學風水", lifestyle: "生活態度", interview: "嘉賓訪談", other: "其他",
};

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("blogs");
  // Lightbox state for blog post images
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const openLightbox = (images: string[], idx = 0) => { setLightboxImages(images); setLightboxIndex(idx); };
  const closeLightbox = () => setLightboxImages([]);
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [pushUrl, setPushUrl] = useState("/");

  const { data: blogs, refetch: refetchBlogs } = trpc.blog.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: bookings, refetch: refetchBookings } = trpc.booking.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: contacts } = trpc.contact.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: subscriptions } = trpc.subscription.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });

  const approveBlog = trpc.blog.updateStatus.useMutation({ onSuccess: () => { toast.success("已更新文章狀態"); refetchBlogs(); } });
  const updateBooking = trpc.booking.updateStatus.useMutation({ onSuccess: () => { toast.success("已更新預約狀態"); refetchBookings(); } });

  const { data: submissions, refetch: refetchSubmissions } = trpc.submission.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const updateSubmission = trpc.submission.updateStatus.useMutation({ onSuccess: () => { toast.success("已更新投稿狀態"); refetchSubmissions(); } });

  const { data: pushSubCount } = trpc.push.subscriberCount.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: pushHistory, refetch: refetchPushHistory } = trpc.push.history.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" && tab === "push" });
  const sendPush = trpc.push.send.useMutation({
    onSuccess: (data) => {
      toast.success(`推送完成！成功 ${data.sent} 人，失敗 ${data.failed} 人`);
      setPushTitle(""); setPushBody(""); setPushUrl("/");
      refetchPushHistory();
    },
    onError: () => toast.error("發送失敗，請稍後再試"),
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "oklch(0.75 0.01 60)" }}>需要管理員權限</h2>
          <Link href="/" className="text-sm" style={{ color: "oklch(0.62 0.24 25)" }}>← 返回首頁</Link>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "blogs", label: "嘉賓投稿", count: blogs?.filter(b => b.status === "pending").length },
    { id: "bookings", label: "預約管理", count: bookings?.filter(b => b.status === "pending").length },
    { id: "contacts", label: "聯絡查詢", count: contacts?.length },
    { id: "subscriptions", label: "訂閱者", count: subscriptions?.length },
    { id: "push", label: "🔔 推送通知", count: pushSubCount?.count },
    { id: "submissions", label: "📨 讀者投稿", count: submissions?.items?.filter(s => s.status === "pending").length },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container py-8">
        <div className="mb-8">
          <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.62 0.24 25)" }}>ADMIN</div>
          <h1 className="text-2xl font-black" style={{ color: "oklch(0.92 0.01 60)" }}>管理後台</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
              style={tab === t.id
                ? { background: "oklch(0.60 0.22 25)", color: "white" }
                : { background: "oklch(0.15 0.015 260)", border: "1px solid oklch(0.25 0.02 260)", color: "oklch(0.70 0.01 60)" }
              }>
              {t.label}
              {(t.count ?? 0) > 0 && (
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center" style={{ background: "oklch(0.62 0.24 25 / 0.3)", color: "oklch(0.62 0.24 25)" }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Blog Posts */}
        {tab === "blogs" && (
          <div className="flex flex-col gap-4">
            {!blogs?.length ? <p style={{ color: "oklch(0.55 0.02 60)" }}>暫時沒有投稿</p> : blogs.map((post) => {
              const postImages: string[] = (() => { try { return JSON.parse(post.images || "[]"); } catch { return []; } })();
              const postLinks: { title: string; url: string }[] = (() => { try { return JSON.parse(post.links || "[]"); } catch { return []; } })();
              const statusBg = post.status === "pending" ? "oklch(0.78 0.16 75 / 0.2)" : post.status === "approved" ? "oklch(0.65 0.20 145 / 0.2)" : "oklch(0.55 0.22 25 / 0.2)";
              const statusColor = post.status === "pending" ? "oklch(0.78 0.16 75)" : post.status === "approved" ? "oklch(0.65 0.20 145)" : "oklch(0.55 0.22 25)";
              return (
                <div key={post.id} className="glass-card rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: statusBg, color: statusColor }}>
                          {post.status === "pending" ? "待審核" : post.status === "approved" ? "已發佈" : "已拒絕"}
                        </span>
                        <span className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{CATEGORY_LABELS[post.category]}</span>
                        {postImages.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.25 0.04 260)", color: "oklch(0.70 0.08 260)" }}>
                            🖼 {postImages.length} 張圖片
                          </span>
                        )}
                        {postLinks.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.22 0.04 200)", color: "oklch(0.65 0.12 200)" }}>
                            🔗 {postLinks.length} 條連結
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold mb-1" style={{ color: "oklch(0.88 0.01 60)" }}>{post.title}</h3>
                      <p className="text-xs" style={{ color: "oklch(0.55 0.02 60)" }}>{post.authorName} · {post.authorEmail}</p>
                      {post.authorBio && <p className="text-xs mt-0.5 italic" style={{ color: "oklch(0.48 0.02 60)" }}>{post.authorBio}</p>}
                      {post.excerpt && <p className="text-xs mt-2 line-clamp-2" style={{ color: "oklch(0.50 0.02 60)" }}>{post.excerpt}</p>}

                      {/* Image thumbnails */}
                      {postImages.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {postImages.map((imgUrl, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => openLightbox(postImages, idx)}
                              className="rounded-lg overflow-hidden transition-all hover:scale-105 hover:ring-2"
                              style={{ width: 64, height: 64, flexShrink: 0 }}
                              title="點擊放大"
                            >
                              <img src={imgUrl} alt={`圖片 ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      {postLinks.length > 0 && (
                        <div className="flex flex-col gap-1 mt-3">
                          {postLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
                              style={{ color: "oklch(0.62 0.18 200)" }}
                            >
                              <ExternalLink size={11} />
                              {link.title || link.url}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    {post.status === "pending" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => approveBlog.mutate({ id: post.id, status: "approved" })}
                          className="px-3 py-1.5 rounded text-xs font-bold" style={{ background: "oklch(0.65 0.20 145)", color: "white" }}>
                          批准
                        </button>
                        <button onClick={() => approveBlog.mutate({ id: post.id, status: "rejected" })}
                          className="px-3 py-1.5 rounded text-xs font-bold" style={{ background: "oklch(0.55 0.22 25)", color: "white" }}>
                          拒絕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bookings */}
        {tab === "bookings" && (
          <div className="flex flex-col gap-4">
            {!bookings?.length ? <p style={{ color: "oklch(0.55 0.02 60)" }}>暫時沒有預約</p> : bookings.map((b) => (
              <div key={b.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: b.status === "pending" ? "oklch(0.78 0.16 75 / 0.2)" : b.status === "confirmed" ? "oklch(0.65 0.20 145 / 0.2)" : "oklch(0.55 0.22 25 / 0.2)", color: b.status === "pending" ? "oklch(0.78 0.16 75)" : b.status === "confirmed" ? "oklch(0.65 0.20 145)" : "oklch(0.55 0.22 25)" }}>
                        {b.status === "pending" ? "待確認" : b.status === "confirmed" ? "已確認" : "已取消"}
                      </span>
                      <span className="text-xs font-bold" style={{ color: "oklch(0.78 0.16 75)" }}>{SERVICE_LABELS[b.serviceType]}</span>
                    </div>
                    <h3 className="font-bold mb-1" style={{ color: "oklch(0.88 0.01 60)" }}>{b.name}</h3>
                    <p className="text-xs" style={{ color: "oklch(0.55 0.02 60)" }}>{b.email} {b.phone && `· ${b.phone}`}</p>
                    {(b.preferredDate || b.preferredTime) && (
                      <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.02 60)" }}>希望時間：{b.preferredDate} {b.preferredTime}</p>
                    )}
                    {b.message && <p className="text-xs mt-1 line-clamp-2" style={{ color: "oklch(0.50 0.02 60)" }}>{b.message}</p>}
                  </div>
                  {b.status === "pending" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => updateBooking.mutate({ id: b.id, status: "confirmed" })}
                        className="px-3 py-1.5 rounded text-xs font-bold" style={{ background: "oklch(0.65 0.20 145)", color: "white" }}>
                        確認
                      </button>
                      <button onClick={() => updateBooking.mutate({ id: b.id, status: "cancelled" })}
                        className="px-3 py-1.5 rounded text-xs font-bold" style={{ background: "oklch(0.55 0.22 25)", color: "white" }}>
                        取消
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contacts */}
        {tab === "contacts" && (
          <div className="flex flex-col gap-4">
            {!contacts?.length ? <p style={{ color: "oklch(0.55 0.02 60)" }}>暫時沒有查詢</p> : contacts.map((c) => (
              <div key={c.id} className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: "oklch(0.62 0.24 25 / 0.15)", color: "oklch(0.62 0.24 25)" }}>
                    {INQUIRY_LABELS[c.inquiryType]}
                  </span>
                  <span className="text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>{new Date(c.createdAt).toLocaleDateString("zh-HK")}</span>
                </div>
                <h3 className="font-bold mb-1" style={{ color: "oklch(0.88 0.01 60)" }}>{c.subject}</h3>
                <p className="text-xs mb-2" style={{ color: "oklch(0.55 0.02 60)" }}>{c.name} · {c.email} {c.phone && `· ${c.phone}`}</p>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.70 0.01 60)" }}>{c.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Subscriptions */}
        {tab === "subscriptions" && (
          <div>
            <p className="text-sm mb-4" style={{ color: "oklch(0.55 0.02 60)" }}>共 {subscriptions?.length ?? 0} 位訂閱者</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subscriptions?.map((s) => (
                <div key={s.id} className="glass-card rounded-lg p-4">
                  <div className="text-sm font-bold" style={{ color: "oklch(0.85 0.01 60)" }}>{s.name || "匿名"}</div>
                  <div className="text-xs" style={{ color: "oklch(0.55 0.02 60)" }}>{s.email}</div>
                  <div className="text-xs mt-1" style={{ color: "oklch(0.45 0.02 60)" }}>{new Date(s.createdAt).toLocaleDateString("zh-HK")}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Push Notifications */}
        {tab === "push" && (
          <div className="max-w-2xl">
            {/* Stats */}
            <div className="glass-card rounded-xl p-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: "oklch(0.62 0.24 25 / 0.15)", border: "1px solid oklch(0.62 0.24 25 / 0.3)" }}>🔔</div>
                <div>
                  <div className="text-2xl font-black" style={{ color: "oklch(0.62 0.24 25)" }}>{pushSubCount?.count ?? 0}</div>
                  <div className="text-xs" style={{ color: "oklch(0.55 0.02 60)" }}>目前活躍訂閱者</div>
                </div>
              </div>
            </div>

            {/* Compose */}
            <div className="glass-card rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4" style={{ color: "oklch(0.88 0.01 60)" }}>發送推送通知</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "oklch(0.65 0.02 60)" }}>標題 *</label>
                  <input
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                    placeholder="例：🎙️ 新節目上線！「路邊電台」最新訪談"
                    maxLength={100}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{ background: "oklch(0.10 0.01 260)", border: "1px solid oklch(0.25 0.02 260)", color: "oklch(0.88 0.01 60)" }}
                  />
                  <div className="text-right text-xs mt-1" style={{ color: "oklch(0.45 0.02 60)" }}>{pushTitle.length}/100</div>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "oklch(0.65 0.02 60)" }}>內容 *</label>
                  <textarea
                    value={pushBody}
                    onChange={(e) => setPushBody(e.target.value)}
                    placeholder="例：今日最新一集已上線，立即收聽！"
                    maxLength={300}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all resize-none"
                    style={{ background: "oklch(0.10 0.01 260)", border: "1px solid oklch(0.25 0.02 260)", color: "oklch(0.88 0.01 60)" }}
                  />
                  <div className="text-right text-xs mt-1" style={{ color: "oklch(0.45 0.02 60)" }}>{pushBody.length}/300</div>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "oklch(0.65 0.02 60)" }}>連結 URL（點擊通知後跳轉）</label>
                  <input
                    value={pushUrl}
                    onChange={(e) => setPushUrl(e.target.value)}
                    placeholder="/"
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{ background: "oklch(0.10 0.01 260)", border: "1px solid oklch(0.25 0.02 260)", color: "oklch(0.88 0.01 60)" }}
                  />
                </div>
                <button
                  onClick={() => sendPush.mutate({ title: pushTitle, body: pushBody, url: pushUrl })}
                  disabled={!pushTitle.trim() || !pushBody.trim() || sendPush.isPending || (pushSubCount?.count ?? 0) === 0}
                  className="w-full py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "oklch(0.62 0.24 25)", color: "white" }}
                >
                  {sendPush.isPending ? (
                    <>⏳ 發送中...</>
                  ) : (
                    <>🔔 發送給全部 {pushSubCount?.count ?? 0} 位訂閱者</>
                  )}
                </button>
                {(pushSubCount?.count ?? 0) === 0 && (
                  <p className="text-xs text-center" style={{ color: "oklch(0.50 0.02 60)" }}>目前沒有訂閱者，推廣網站後即可開始累積</p>
                )}
              </div>
            </div>

            {/* History */}
            {pushHistory && pushHistory.length > 0 && (
              <div>
                <h3 className="font-bold mb-3" style={{ color: "oklch(0.88 0.01 60)" }}>發送記錄</h3>
                <div className="flex flex-col gap-3">
                  {pushHistory.map((h) => (
                    <div key={h.id} className="glass-card rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-bold text-sm mb-1" style={{ color: "oklch(0.88 0.01 60)" }}>{h.title}</div>
                          <div className="text-xs mb-2" style={{ color: "oklch(0.60 0.02 60)" }}>{h.body}</div>
                          <div className="text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>{new Date(h.sentAt).toLocaleString("zh-HK")}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold" style={{ color: "oklch(0.65 0.20 145)" }}>✓ {h.sentCount}</div>
                          {h.failedCount > 0 && <div className="text-xs" style={{ color: "oklch(0.55 0.22 25)" }}>✗ {h.failedCount}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      {/* Reader Submissions */}
        {tab === "submissions" && (
          <div className="flex flex-col gap-4">
            {/* Legend */}
            <div className="flex gap-3 text-xs flex-wrap" style={{ color: "oklch(0.50 0.02 60)" }}>
              <span>🟡 待審核</span><span>🟢 已批准（首頁/嘉賓欄）</span><span>🔵 已發放</span><span>🔴 已拒絕</span>
            </div>
            {!submissions?.items?.length ? (
              <p style={{ color: "oklch(0.55 0.02 60)" }}>暫時沒有投稿</p>
            ) : submissions.items.map((s) => {
              // Parse images
              let imgs: string[] = [];
              try { if (s.images && s.images !== "[]") imgs = JSON.parse(s.images as string); } catch {}

              const statusColor = s.status === "pending" ? "oklch(0.78 0.16 75)" : s.status === "approved" ? "oklch(0.65 0.20 145)" : s.status === "published" ? "oklch(0.60 0.20 250)" : "oklch(0.55 0.22 25)";
              const statusBg = statusColor.replace(")", " / 0.15)");
              const statusLabel = s.status === "pending" ? "🟡 待審核" : s.status === "approved" ? "🟢 已批准" : s.status === "published" ? "🔵 已發放" : "🔴 已拒絕";

              return (
              <div key={s.id} className="glass-card rounded-xl p-5">
                <div className="flex flex-col gap-3">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: statusBg, color: statusColor }}>
                        {statusLabel}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.16 0.02 260)", color: "oklch(0.60 0.02 60)" }}>
                        {s.category === "relationship" ? "💕 感情故事" : s.category === "fengshui" ? "🔮 玄學奇遇" : s.category === "confession" ? "💬 心底話" : s.category === "question" ? "🙋 問題想問" : "✨ 其他"}
                      </span>
                      {imgs.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.16 0.02 260)", color: "oklch(0.65 0.20 250)" }}>
                          📷 {imgs.length} 張圖片
                        </span>
                      )}
                      {s.publishTarget && s.status !== "pending" && (
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.16 0.02 260)", color: "oklch(0.65 0.20 145)" }}>
                          {s.publishTarget === "home" ? "🏠 首頁" : "📝 嘉賓專欄"}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>
                        {new Date(s.createdAt).toLocaleString("zh-HK")}
                      </span>
                      <span className="text-xs" style={{ color: "oklch(0.55 0.22 25)" }}>♥ {s.likes}</span>
                    </div>
                  </div>

                  {/* Image thumbnails — click to open Lightbox */}
                  {imgs.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {imgs.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => openLightbox(imgs, i)}
                          className="rounded-lg overflow-hidden transition-all hover:scale-105 hover:opacity-90"
                          style={{ width: 80, height: 80, flexShrink: 0, border: "1px solid oklch(0.22 0.025 260)" }}
                          title="點擊放大"
                        >
                          <img src={url} alt={`圖片${i+1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Content */}
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.82 0.01 60)" }}>{s.content}</p>
                  <p className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>— {s.isAnonymous ? "匿名讀者" : s.nickname}</p>

                  {/* Admin note */}
                  {s.adminNote && (
                    <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "oklch(0.14 0.018 260)", color: "oklch(0.60 0.02 60)", borderLeft: "3px solid oklch(0.78 0.16 75)" }}>
                      管理員備注：{s.adminNote}
                    </p>
                  )}

                  {/* Action buttons */}
                  {(s.status === "pending" || s.status === "approved") && (
                    <div className="flex gap-2 flex-wrap pt-1" style={{ borderTop: "1px solid oklch(0.18 0.02 260)" }}>
                      {s.status === "pending" && (
                        <>
                          <button onClick={() => updateSubmission.mutate({ id: s.id, status: "approved", publishTarget: "home" })}
                            className="px-3 py-1.5 rounded text-xs font-bold transition-opacity hover:opacity-80" style={{ background: "oklch(0.65 0.20 145)", color: "white" }}>
                            ✓ 批准（首頁）
                          </button>
                          <button onClick={() => updateSubmission.mutate({ id: s.id, status: "approved", publishTarget: "blog" })}
                            className="px-3 py-1.5 rounded text-xs font-bold transition-opacity hover:opacity-80" style={{ background: "oklch(0.60 0.20 145)", color: "white" }}>
                            ✓ 批准（嘉賓欄）
                          </button>
                          <button onClick={() => updateSubmission.mutate({ id: s.id, status: "rejected" })}
                            className="px-3 py-1.5 rounded text-xs font-bold transition-opacity hover:opacity-80" style={{ background: "oklch(0.55 0.22 25)", color: "white" }}>
                            ✗ 拒絕
                          </button>
                        </>
                      )}
                      {s.status === "approved" && (
                        <>
                          <button onClick={() => updateSubmission.mutate({ id: s.id, status: "published", publishTarget: (s.publishTarget as "home" | "blog") ?? "home" })}
                            className="px-3 py-1.5 rounded text-xs font-bold transition-opacity hover:opacity-80" style={{ background: "oklch(0.60 0.20 250)", color: "white" }}>
                            🚀 發放至{s.publishTarget === "blog" ? "嘉賓專欄" : "首頁"}
                          </button>
                          <button onClick={() => updateSubmission.mutate({ id: s.id, status: "rejected" })}
                            className="px-3 py-1.5 rounded text-xs font-bold transition-opacity hover:opacity-80" style={{ background: "oklch(0.55 0.22 25)", color: "white" }}>
                            ✗ 撤回
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Lightbox for image preview */}
      {lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={() => setLightboxIndex((i) => Math.max(0, i - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(lightboxImages.length - 1, i + 1))}
        />
      )}
    </div>
  );
}
