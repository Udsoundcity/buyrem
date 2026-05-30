"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./VideoUpload.module.css";

const VIDEO_TYPES = ["video/mp4","video/webm","video/ogg","video/quicktime","video/x-msvideo"];
const ACCEPT      = ".mp4,.webm,.ogg,.mov,.avi";
const MAX_SIZE    = 200 * 1024 * 1024; // 200 MB

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Converts any YouTube/Vimeo URL or full <iframe> HTML to a clean embed URL
function getEmbedUrl(input) {
  if (!input) return null;
  const srcFromHtml = input.match(/src=["']([^"']+)["']/);
  const url = srcFromHtml ? srcFromHtml[1].trim() : input.trim();
  const ytWatch = url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?rel=0`;
  const ytShort = url.match(/youtu\.be\/([^?\s]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?rel=0`;
  if (url.includes("youtube.com/embed/")) return url;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

export default function VideoUpload({ value = "", onChange, hint }) {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState("");
  const [dragging,  setDragging]  = useState(false);
  const [urlText,   setUrlText]   = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setUrlText(value || ""); }, [value]);

  const isDirectVideo = (url) => /\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(url);

  const uploadFile = useCallback(async (file) => {
    setError("");

    if (!VIDEO_TYPES.includes(file.type)) {
      setError("Invalid file type. Please use MP4, WebM, or MOV.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(`File is ${formatSize(file.size)} — max allowed is 200 MB.`);
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulate progress (XHR would give real progress; fetch doesn't)
    const tick = setInterval(() => setProgress(p => Math.min(p + 8, 90)), 400);

    try {
      const form = new FormData();
      form.append("file", file);
      const res  = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      clearInterval(tick);
      setProgress(100);

      if (!res.ok || data.error) {
        setError(data.error || "Upload failed. Please try again.");
        setProgress(0);
      } else {
        onChange(data.url);
        setTimeout(() => setProgress(0), 800);
      }
    } catch {
      clearInterval(tick);
      setProgress(0);
      setError("Upload failed. Check your connection.");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const onFileInput  = (e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); };
  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f);
  }, [uploadFile]);

  const onUrlChange = (e) => {
    setUrlText(e.target.value);
    onChange(e.target.value);
    setError("");
  };

  const remove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={styles.wrap}>

      {/* ── Preview when video exists ── */}
      {value && (
        <div className={styles.preview}>
          {isDirectVideo(value) ? (
            <video
              src={value}
              controls
              playsInline
              className={styles.videoEl}
            />
          ) : (
            /* YouTube / Vimeo — convert to embed URL first */
            <div className={styles.iframeWrap}>
              <iframe
                src={getEmbedUrl(value)}
                className={styles.iframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video preview"
              />
            </div>
          )}
          <div className={styles.previewActions}>
            <button type="button" className={styles.replaceBtn}
              onClick={() => inputRef.current?.click()} disabled={uploading}>
              🔄 Replace
            </button>
            <button type="button" className={styles.removeBtn} onClick={remove}>
              ✕ Remove
            </button>
          </div>
          <input ref={inputRef} type="file" accept={ACCEPT}
            className={styles.hidden} onChange={onFileInput} />
        </div>
      )}

      {/* ── Drop zone (no video yet) ── */}
      {!value && (
        <div
          className={`${styles.dropzone} ${dragging ? styles.dragging : ""} ${uploading ? styles.busy : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          role="button" tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="Upload video"
        >
          <input ref={inputRef} type="file" accept={ACCEPT}
            className={styles.hidden} onChange={onFileInput} />

          {uploading ? (
            <div className={styles.uploadingState}>
              <div className={styles.spinner} />
              <div>
                <div className={styles.uploadingLabel}>Uploading video…</div>
                <div className={styles.uploadingHint}>Please keep this page open</div>
              </div>
            </div>
          ) : (
            <div className={styles.idleState}>
              <div className={styles.dzIcon}>{dragging ? "📂" : "🎬"}</div>
              <p className={styles.dzTitle}>
                {dragging ? "Drop video to upload" : "Click or drag & drop video"}
              </p>
              <p className={styles.dzHint}>MP4, WebM, MOV · Max 200 MB</p>
            </div>
          )}
        </div>
      )}

      {/* ── Progress bar ── */}
      {uploading && progress > 0 && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          <span className={styles.progressLabel}>{progress < 100 ? `${progress}%` : "Processing…"}</span>
        </div>
      )}

      {/* ── Error ── */}
      {error && <p className={styles.error}>⚠️ {error}</p>}

      {/* ── URL fallback ── */}
      <div className={styles.urlRow}>
        <span className={styles.urlLabel}>Or paste YouTube / Vimeo URL:</span>
        <input
          type="url"
          className={styles.urlInput}
          placeholder="https://youtube.com/watch?v=..."
          value={urlText}
          onChange={onUrlChange}
        />
      </div>

      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
