import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;
const DISMISSED_KEY = "push-prompt-dismissed";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    await navigator.serviceWorker.ready;
    return reg;
  } catch (err) {
    console.warn("[PushManager] SW registration failed:", err);
    return null;
  }
}

export function usePushNotification() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [swReg, setSwReg] = useState<ServiceWorkerRegistration | null>(null);

  const subscribeMutation = trpc.push.subscribe.useMutation();
  const unsubscribeMutation = trpc.push.unsubscribe.useMutation();

  useEffect(() => {
    if (!("Notification" in window)) return;
    setPermission(Notification.permission);

    registerServiceWorker().then(async (reg) => {
      if (!reg) return;
      setSwReg(reg);
      const existing = await reg.pushManager.getSubscription();
      setIsSubscribed(!!existing);
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (!swReg || !VAPID_PUBLIC_KEY) return;
    setIsLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        toast.error("請允許通知權限以接收最新資訊");
        return;
      }

      const sub = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const json = sub.toJSON();
      await subscribeMutation.mutateAsync({
        endpoint: json.endpoint!,
        keys: {
          p256dh: json.keys!.p256dh,
          auth: json.keys!.auth,
        },
        userAgent: navigator.userAgent,
      });

      setIsSubscribed(true);
      toast.success("🔔 已開啟推送通知！我們會第一時間通知你最新節目");
    } catch (err) {
      console.error("[PushManager] Subscribe failed:", err);
      toast.error("訂閱失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  }, [swReg, subscribeMutation]);

  const unsubscribe = useCallback(async () => {
    if (!swReg) return;
    setIsLoading(true);
    try {
      const sub = await swReg.pushManager.getSubscription();
      if (sub) {
        await unsubscribeMutation.mutateAsync({ endpoint: sub.endpoint });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
      toast.success("已取消推送通知訂閱");
    } catch (err) {
      console.error("[PushManager] Unsubscribe failed:", err);
      toast.error("取消訂閱失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  }, [swReg, unsubscribeMutation]);

  return { permission, isSubscribed, isLoading, subscribe, unsubscribe };
}

/** Floating bell button in the bottom-left corner */
export function PushBellButton() {
  const { permission, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotification();

  if (!("Notification" in window) || !("serviceWorker" in navigator)) return null;
  if (permission === "denied") return null;

  return (
    <button
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={isLoading}
      title={isSubscribed ? "取消推送通知" : "訂閱推送通知"}
      className="fixed bottom-24 left-4 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
      style={{
        background: isSubscribed
          ? "oklch(0.62 0.24 25)"
          : "oklch(0.14 0.01 260)",
        border: `1px solid ${isSubscribed ? "oklch(0.62 0.24 25)" : "oklch(0.25 0.02 260)"}`,
        boxShadow: isSubscribed
          ? "0 0 12px oklch(0.62 0.24 25 / 0.5)"
          : "0 4px 12px oklch(0 0 0 / 0.4)",
      }}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-white" />
      ) : isSubscribed ? (
        <Bell className="w-4 h-4 text-white fill-white" />
      ) : (
        <BellOff className="w-4 h-4" style={{ color: "oklch(0.60 0.02 60)" }} />
      )}
    </button>
  );
}

/** Prompt banner shown to new visitors */
export function PushPromptBanner() {
  const [show, setShow] = useState(false);
  const { permission, isSubscribed, isLoading, subscribe } = usePushNotification();

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (permission === "granted" || permission === "denied") return;
    if (isSubscribed) return;
    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    // Show banner after 8 seconds
    const timer = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(timer);
  }, [permission, isSubscribed]);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  };

  const handleSubscribe = async () => {
    await subscribe();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 rounded-xl p-4 shadow-2xl"
      style={{
        background: "oklch(0.12 0.01 260)",
        border: "1px solid oklch(0.62 0.24 25 / 0.4)",
        boxShadow: "0 0 30px oklch(0.62 0.24 25 / 0.15), 0 8px 32px oklch(0 0 0 / 0.5)",
      }}
    >
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
        style={{ color: "oklch(0.50 0.02 60)" }}
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3 pr-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "oklch(0.62 0.24 25 / 0.15)", border: "1px solid oklch(0.62 0.24 25 / 0.3)" }}
        >
          <Bell className="w-5 h-5" style={{ color: "oklch(0.62 0.24 25)" }} />
        </div>
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: "oklch(0.92 0.01 60)" }}>
            訂閱推送通知
          </p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "oklch(0.60 0.02 60)" }}>
            第一時間收到最新節目上線、嘉賓公告及玄學資訊，即使不在網站也不會錯過！
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-1.5"
              style={{ background: "oklch(0.62 0.24 25)", color: "white" }}
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Bell className="w-3 h-3" />
              )}
              立即訂閱
            </button>
            <button
              onClick={dismiss}
              className="px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5"
              style={{ color: "oklch(0.50 0.02 60)", border: "1px solid oklch(0.25 0.02 260)" }}
            >
              稍後
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
