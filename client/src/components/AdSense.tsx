import { useEffect, useRef } from "react";

interface AdSenseProps {
  /** AdSense ad slot ID (from your AdSense account) */
  adSlot: string;
  /** Ad format: auto | rectangle | vertical | horizontal */
  adFormat?: string;
  /** Whether to enable full-width responsive */
  fullWidthResponsive?: boolean;
  /** Optional CSS class for the container */
  className?: string;
  /** Optional inline style for the container */
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * AdSense ad unit component.
 * Renders a single ad slot and pushes to adsbygoogle on mount.
 * Safe to use multiple times on the same page with different adSlot values.
 */
export default function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  style,
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded (e.g. dev env or ad blocker) — silently ignore
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7035034067070430"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
