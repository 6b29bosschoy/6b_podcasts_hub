import { useRef, useEffect, useState } from "react";

export default function IgFeedEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(765);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Calculate responsive height: maintain ~2:3 ratio (3 columns × 2 rows)
  const cols = containerWidth < 480 ? 2 : containerWidth < 768 ? 3 : 3;
  const cellSize = Math.floor(containerWidth / cols);
  const rows = 2;
  const iframeHeight = cellSize * rows + 20;

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--red)" }}>
            FOLLOW US ON
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            <span style={{ color: "var(--text)" }}>Instagram</span>
            <span className="ml-2" style={{ color: "var(--red)" }}>@6bpodcasts</span>
          </h2>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            追蹤我哋嘅 IG，睇最新幕後花絮同嘉賓金句
          </p>
        </div>

        {/* SnapWidget Embed */}
        <div
          ref={containerRef}
          className="w-full rounded-2xl overflow-hidden"
          style={{ background: "var(--bg-card)" }}
        >
          <iframe
            src="https://snapwidget.com/embed/1121118"
            className="snapwidget-widget"
            frameBorder={0}
            scrolling="no"
            title="Posts from Instagram @6bpodcasts"
            style={{
              border: "none",
              overflow: "hidden",
              width: `${containerWidth}px`,
              height: `${iframeHeight}px`,
              display: "block",
            }}
          />
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/6bpodcasts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
            style={{
              background: "var(--bg-card))",
              color: "var(--text)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            追蹤 @6bpodcasts
          </a>
        </div>
      </div>
    </section>
  );
}
