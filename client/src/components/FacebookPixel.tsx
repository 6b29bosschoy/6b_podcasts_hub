import { useEffect } from "react";
import { useLocation } from "wouter";

// ── Types ─────────────────────────────────────────────────────────────────────
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * FacebookPixel – injects the Meta Pixel base code and fires PageView on every
 * route change.  Replace PIXEL_ID with your actual Pixel ID from
 * https://business.facebook.com/events_manager
 *
 * Set VITE_FB_PIXEL_ID in your environment variables to activate tracking.
 * If the env var is not set, the component renders nothing (safe for dev).
 */
const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID as string | undefined;

function initPixel(pixelId: string) {
  if (window.fbq) return; // already loaded
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fbq: any = function (...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fbq as any).callMethod
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fbq as any).callMethod.apply(fbq, args)
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fbq as any).queue.push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  // noscript pixel image
  const noscript = document.createElement("noscript");
  const img = document.createElement("img");
  img.height = 1;
  img.width = 1;
  img.style.display = "none";
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.head.appendChild(noscript);

  window.fbq?.("init", pixelId);
}

/** Track a custom FB Pixel event from anywhere in the app */
export function trackFbEvent(event: string, params?: Record<string, unknown>) {
  if (window.fbq) {
    window.fbq("track", event, params);
  }
}

/** Track a standard PageView */
export function trackPageView() {
  if (window.fbq) {
    window.fbq("track", "PageView");
  }
}

export default function FacebookPixel() {
  const [location] = useLocation();

  useEffect(() => {
    if (!PIXEL_ID) return; // skip if not configured
    initPixel(PIXEL_ID);
    trackPageView();
  }, [location]); // re-fire on every route change

  return null;
}
