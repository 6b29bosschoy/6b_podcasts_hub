/**
 * ImageUploader — reusable image upload component
 *
 * Features:
 * - Drag-and-drop or click-to-select
 * - Up to 5 images, each ≤ 2MB
 * - Accepted: jpg, png, webp, gif
 * - Thumbnail preview with remove button
 * - Uploads to S3 via submission.uploadImage tRPC procedure
 * - Returns array of CDN URLs to parent via onImagesChange
 */

import { useCallback, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { ImagePlus, X, Loader2, AlertCircle, Upload } from "lucide-react";
import { toast } from "sonner";

const MAX_FILES = 5;
const MAX_BYTES = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type AcceptedMime = (typeof ACCEPTED_TYPES)[number];

export interface UploadedImage {
  url: string;
  key: string;
  localPreview: string; // object URL for preview
  fileName: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  disabled?: boolean;
  /** Dark-mode style (default: true) */
  dark?: boolean;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data:image/xxx;base64, prefix
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ images, onImagesChange, disabled = false, dark = true }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.submission.uploadImage.useMutation();

  // ── colour tokens ──────────────────────────────────────────────────────────
  const bg = dark ? "var(--bg-card)" : "var(--text)";
  const border = dark ? "var(--line)" : "var(--text)";
  const borderActive = "var(--red)";
  const textMuted = dark ? "var(--text-3)" : "var(--text-3)";
  const textMain = dark ? "var(--text)" : "var(--bg-raise)";
  const accent = "var(--red)";

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const remaining = MAX_FILES - images.length;

    if (remaining <= 0) {
      toast.error(`最多上傳 ${MAX_FILES} 張圖片`);
      return;
    }

    const toUpload = fileArr.slice(0, remaining);
    const skipped = fileArr.length - toUpload.length;
    if (skipped > 0) toast.warning(`只上傳前 ${toUpload.length} 張，已達上限`);

    const validFiles: File[] = [];
    for (const file of toUpload) {
      if (!ACCEPTED_TYPES.includes(file.type as AcceptedMime)) {
        toast.error(`「${file.name}」格式不支援`, { description: "只接受 JPG、PNG、WebP、GIF" });
        continue;
      }
      if (file.size > MAX_BYTES) {
        toast.error(`「${file.name}」超過 2MB 限制`, { description: `檔案大小：${(file.size / 1024 / 1024).toFixed(1)}MB` });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploadingCount((c) => c + validFiles.length);

    const newImages: UploadedImage[] = [];
    await Promise.all(
      validFiles.map(async (file) => {
        const localPreview = URL.createObjectURL(file);
        try {
          const base64Data = await fileToBase64(file);
          const result = await uploadMutation.mutateAsync({
            fileName: file.name,
            mimeType: file.type as AcceptedMime,
            base64Data,
            sizeBytes: file.size,
          });
          newImages.push({ url: result.url, key: result.key, localPreview, fileName: file.name });
        } catch (err) {
          URL.revokeObjectURL(localPreview);
          const msg = err instanceof Error ? err.message : "上傳失敗";
          toast.error(`「${file.name}」上傳失敗`, { description: msg });
        } finally {
          setUploadingCount((c) => Math.max(0, c - 1));
        }
      })
    );

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  }, [images, onImagesChange, uploadMutation]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  }, [disabled, processFiles]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); if (!disabled) setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = ""; // reset so same file can be re-selected
  };

  const removeImage = (idx: number) => {
    const img = images[idx];
    if (img) URL.revokeObjectURL(img.localPreview);
    onImagesChange(images.filter((_, i) => i !== idx));
  };

  const isUploading = uploadingCount > 0;
  const canAdd = images.length < MAX_FILES && !disabled;

  return (
    <div className="space-y-3">
      {/* Drop zone — only shown when can add more */}
      {canAdd && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all select-none"
          style={{
            background: isDragging ? `${accent}10` : bg,
            borderColor: isDragging ? borderActive : border,
            padding: "20px 16px",
            minHeight: "96px",
          }}
        >
          {isUploading ? (
            <Loader2 size={24} className="animate-spin" style={{ color: accent }} />
          ) : (
            <Upload size={22} style={{ color: isDragging ? accent : textMuted }} />
          )}
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: isDragging ? accent : textMain }}>
              {isUploading ? `上傳中… (${uploadingCount} 張)` : "點擊或拖放圖片到此處"}
            </div>
            <div className="text-xs mt-0.5" style={{ color: textMuted }}>
              JPG / PNG / WebP / GIF · 每張 ≤ 2MB · 最多 {MAX_FILES} 張（已選 {images.length}）
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleFileInput}
            disabled={disabled || isUploading}
          />
        </div>
      )}

      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <div
              key={img.url}
              className="relative rounded-lg overflow-hidden group"
              style={{ aspectRatio: "1/1", background: dark ? "var(--bg-raise)" : "var(--text)" }}
            >
              <img
                src={img.localPreview}
                alt={img.fileName}
                className="w-full h-full object-cover"
              />
              {/* Remove button */}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(13,12,10,0.7)" }}
                  title="移除圖片"
                >
                  <X size={11} color="white" />
                </button>
              )}
              {/* Index badge */}
              <div
                className="absolute bottom-1 left-1 text-xs px-1 rounded"
                style={{ background: "rgba(13,12,10,0.55)", color: "white", fontSize: "10px" }}
              >
                {idx + 1}/{MAX_FILES}
              </div>
            </div>
          ))}
          {/* Add more slot */}
          {canAdd && images.length > 0 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all hover:opacity-80"
              style={{ aspectRatio: "1/1", borderColor: border, background: bg }}
              title="新增圖片"
            >
              <ImagePlus size={18} style={{ color: textMuted }} />
              <span className="text-xs" style={{ color: textMuted, fontSize: "10px" }}>新增</span>
            </button>
          )}
        </div>
      )}

      {/* Limit warning */}
      {images.length >= MAX_FILES && (
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--gold)" }}>
          <AlertCircle size={12} />
          已達 {MAX_FILES} 張上限
        </div>
      )}
    </div>
  );
}
