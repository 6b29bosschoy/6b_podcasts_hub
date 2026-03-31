import { useEffect, useRef } from "react";
import { Instagram } from "lucide-react";

/**
 * IgFeedEmbed – embeds an Instagram feed using SnapWidget free widget.
 * Falls back to a styled CTA card if the script fails to load.
 *
 * Usage: place anywhere in the page, the widget renders a 3-col grid of
 * the latest posts from @6bpodcasts.
 */
export default function IgFeedEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SnapWidget script – loads the IG feed widget
    const scriptId = "snapwidget-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://snapwidget.com/js/snapwidget.js";
      script.async = true;
      document.body.appendChild(script);
    }
    return () => {
      // Do not remove the script on unmount to avoid re-loading on navigation
    };
  }, []);

  return (
    <section className="py-16" style={{ background: "oklch(0.07 0.01 260)" }}>
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{ background: "oklch(0.62 0.24 25 / 0.12)", border: "1px solid oklch(0.62 0.24 25 / 0.3)", color: "oklch(0.78 0.16 75)" }}>
            <Instagram size={13} />
            Instagram
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: "oklch(0.92 0.01 60)" }}>
            追蹤我們的 Instagram
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: "oklch(0.55 0.02 60)" }}>
            每日更新嘉賓花絮、玄學知識及幕後點滴
          </p>
        </div>

        {/* SnapWidget iframe embed */}
        <div ref={containerRef} className="flex justify-center">
          <iframe
            src="https://snapwidget.com/embed/1076484"
            className="snapwidget-widget"
            allowTransparency={true}
            frameBorder="0"
            scrolling="no"
            style={{
              border: "none",
              overflow: "hidden",
              width: "100%",
              maxWidth: "900px",
              height: "320px",
            }}
            title="路邊電台 Instagram Feed"
          />
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/6bpodcasts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, oklch(0.62 0.24 25), oklch(0.55 0.22 320))",
              color: "white",
            }}
          >
            <Instagram size={16} />
            追蹤 @6bpodcasts
          </a>
        </div>
      </div>
    </section>
  );
}
