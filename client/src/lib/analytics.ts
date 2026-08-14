declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    clarity?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;

let initialised = false;

function loadScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function initAnalytics() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;

  if (GA_ID) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`, "ga4-script");
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }

  if (PIXEL_ID && !window.fbq) {
    const fbq = function fbq(...args: unknown[]) {
      // Meta Pixel queue pattern
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queue = (fbq as any).queue ?? [];
      queue.push(args);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fbq as any).queue = queue;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fbq as any).loaded = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fbq as any).version = "2.0";
    window.fbq = fbq;
    window._fbq = fbq;
    loadScript("https://connect.facebook.net/en_US/fbevents.js", "meta-pixel-script");
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  if (CLARITY_ID) {
    window.clarity = window.clarity ?? function clarity(...args: unknown[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window.clarity as any).q = (window.clarity as any).q ?? []).push(args);
    };
    loadScript(`https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_ID)}`, "clarity-script");
  }
}

export type AnalyticsEvent =
  | "video_play"
  | "outbound_youtube"
  | "treehole_submit"
  | "booking_submit"
  | "whatsapp_click"
  | "partnership_submit"
  | "pricing_view"
  | "checkout_start"
  | "purchase";

const SAFE_EVENT_KEYS = new Set([
  "source",
  "service",
  "video_id",
  "content_type",
  "destination",
  "plan",
  "currency",
  "value",
  "page_type",
  "payment_provider",
  "payment_environment",
]);

function sanitiseEventParams(params: Record<string, string | number | boolean | undefined>) {
  return Object.fromEntries(
    Object.entries(params).filter(([key, value]) => {
      if (!SAFE_EVENT_KEYS.has(key) || value === undefined) return false;
      return typeof value !== "string" || value.length <= 100;
    }),
  );
}

export function trackEvent(event: AnalyticsEvent, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;
  const safeParams = sanitiseEventParams(params);
  window.gtag?.("event", event, safeParams);
  window.fbq?.("trackCustom", event, safeParams);
  window.clarity?.("event", event);
}
