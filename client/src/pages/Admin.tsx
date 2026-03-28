import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";

type Tab = "blogs" | "bookings" | "contacts" | "subscriptions";

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

  const { data: blogs, refetch: refetchBlogs } = trpc.blog.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: bookings, refetch: refetchBookings } = trpc.booking.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: contacts } = trpc.contact.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: subscriptions } = trpc.subscription.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });

  const approveBlog = trpc.blog.approve.useMutation({ onSuccess: () => { toast.success("已更新文章狀態"); refetchBlogs(); } });
  const updateBooking = trpc.booking.updateStatus.useMutation({ onSuccess: () => { toast.success("已更新預約狀態"); refetchBookings(); } });

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
            {!blogs?.length ? <p style={{ color: "oklch(0.55 0.02 60)" }}>暫時沒有投稿</p> : blogs.map((post) => (
              <div key={post.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: post.status === "pending" ? "oklch(0.78 0.16 75 / 0.2)" : post.status === "approved" ? "oklch(0.65 0.20 145 / 0.2)" : "oklch(0.55 0.22 25 / 0.2)", color: post.status === "pending" ? "oklch(0.78 0.16 75)" : post.status === "approved" ? "oklch(0.65 0.20 145)" : "oklch(0.55 0.22 25)" }}>
                        {post.status === "pending" ? "待審核" : post.status === "approved" ? "已發佈" : "已拒絕"}
                      </span>
                      <span className="text-xs" style={{ color: "oklch(0.50 0.02 60)" }}>{CATEGORY_LABELS[post.category]}</span>
                    </div>
                    <h3 className="font-bold mb-1" style={{ color: "oklch(0.88 0.01 60)" }}>{post.title}</h3>
                    <p className="text-xs" style={{ color: "oklch(0.55 0.02 60)" }}>{post.authorName} · {post.authorEmail}</p>
                    {post.excerpt && <p className="text-xs mt-2 line-clamp-2" style={{ color: "oklch(0.50 0.02 60)" }}>{post.excerpt}</p>}
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
            ))}
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
      </div>
    </div>
  );
}
