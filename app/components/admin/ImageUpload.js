"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./ImageUpload.module.css";

const MAX_SIZE = 5 * 1024 * 1024;   // 5 MB
const ALLOWED  = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPT   = ".jpg,.jpeg,.png,.webp";

export default function ImageUpload({ value = "", onChange, label, hint }) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const [dragging,  setDragging]  = useState(false);
  // urlText is ONLY for the URL text input — preview always uses `value` prop
  const [urlText,   setUrlText]   = useState(value);
  const inputRef = useRef(null);

  // Keep the URL text box in sync when the parent changes `value` externally
  useEffect(() => { setUrlText(value || ""); }, [value]);

  // ── Upload a file to /api/admin/upload ───────────────────────
  const uploadFile = useCallback(async (file) => {
    setError("");

    if (!ALLOWED.includes(file.type)) {
      setError("Invalid file type. Please use JPG, PNG, or WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(`File is ${(file.size / 1024 / 1024).toFixed(1)} MB — max allowed is 5 MB.`);
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res  = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Upload failed. Please try again.");
      } else {
        // Tell the parent — the value prop will update and drive the preview
        onChange(data.url);
      }
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const onFileInput  = (e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); };
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) uploadFile(f);
  }, [uploadFile]);

  const onUrlChange = (e) => {
    setUrlText(e.target.value);
    onChange(e.target.value);   // immediately update parent
    setError("");
  };

  const remove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className={styles.wrap}>
      {label && <p className={styles.fieldLabel}>{label}</p>}

      {/* ── Preview (driven entirely by value prop) ── */}
      {value ? (
        <div className={styles.preview}>
          {/* Plain <img> — no Next.js Image needed in the admin panel */}
          <img src={value} alt="Preview" className={styles.previewImg} />

          <div className={styles.previewActions}>
            <button
              type="button"
              className={styles.replaceBtn}
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              🔄 Replace image
            </button>
            <button type="button" className={styles.removeBtn} onClick={remove}>
              ✕ Remove
            </button>
          </div>

          {/* Hidden input for the Replace button */}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className={styles.hidden}
            onChange={onFileInput}
          />
        </div>
      ) : (
        /* ── Drop zone (shown only when no image) ── */
        <div
          className={`${styles.dropzone} ${dragging ? styles.dragging : ""} ${uploading ? styles.busy : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="Upload image"
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className={styles.hidden}
            onChange={onFileInput}
          />

          {uploading ? (
            <div className={styles.uploadingState}>
              <div className={styles.spinner} />
              <span>Uploading…</span>
            </div>
          ) : (
            <div className={styles.idleState}>
              <div className={styles.dzIcon}>{dragging ? "📂" : "📷"}</div>
              <p className={styles.dzTitle}>
                {dragging ? "Drop to upload" : "Click or drag & drop"}
              </p>
              <p className={styles.dzHint}>JPG, PNG, WebP · Max 5 MB</p>
            </div>
          )}
        </div>
      )}

      {/* ── Upload progress indicator ── */}
      {uploading && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar} />
        </div>
      )}

      {/* ── Error message ── */}
      {error && <p className={styles.error}>⚠️ {error}</p>}

      {/* ── URL fallback input ── */}
      <div className={styles.urlRow}>
        <span className={styles.urlLabel}>Or paste a URL:</span>
        <input
          type="url"
          className={styles.urlInput}
          placeholder="https://example.com/image.jpg"
          value={urlText}
          onChange={onUrlChange}
        />
      </div>

      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
