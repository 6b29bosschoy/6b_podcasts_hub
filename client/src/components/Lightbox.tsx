import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onPrev();
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) onNext();
    },
    [onClose, onPrev, onNext, currentIndex, images.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!images[currentIndex]) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.92)" }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full transition-all hover:opacity-80"
        style={{ background: "oklch(0.20 0.02 260)", color: "white" }}
        aria-label="關閉"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: "oklch(0.20 0.02 260)", color: "oklch(0.85 0.01 60)" }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Prev button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 p-2 rounded-full transition-all hover:opacity-80"
          style={{ background: "oklch(0.20 0.02 260)", color: "white" }}
          aria-label="上一張"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Next button */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 p-2 rounded-full transition-all hover:opacity-80"
          style={{ background: "oklch(0.20 0.02 260)", color: "white" }}
          aria-label="下一張"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Main image */}
      <div
        className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`圖片 ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          style={{ boxShadow: "0 25px 60px oklch(0 0 0 / 0.8)" }}
        />
      </div>

      {/* Thumbnail strip (if multiple images) */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                // Navigate to specific index via onPrev/onNext chain
                const diff = idx - currentIndex;
                if (diff < 0) for (let i = 0; i < Math.abs(diff); i++) onPrev();
                if (diff > 0) for (let i = 0; i < diff; i++) onNext();
              }}
              className="rounded overflow-hidden transition-all"
              style={{
                width: 44,
                height: 44,
                border: idx === currentIndex ? "2px solid oklch(0.62 0.24 25)" : "2px solid transparent",
                opacity: idx === currentIndex ? 1 : 0.5,
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
