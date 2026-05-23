"use client";
import { useState, useRef, useCallback } from "react";
import styles from "./ImageUpload.module.css";

const MAX_SIZE    = 5 * 1024 * 1024;
const ALLOWED     = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPT      = ".jpg,.jpeg,.png,.webp";

export default function ImageUpload({ value = "", onChange, label, hint }) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const [dragging,  setDragging]  = useState(false);
  const [urlInput,  setUrlInput]  = useState(value);
  const inputRef = useRef(null);

  // ── Upload a File object to /api/admin/upload ────────────────
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
        onChange(data.url);
        setUrlInput(data.url);
      }
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  // ── Handlers ─────────────────────────────────────────────────
  const onFileInput  = (e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) uploadFile(f);
  }, [uploadFile]);

  const onUrlChange = (e) => {
    setUrlInput(e.target.value);
    onChange(e.target.value);
    setError("");
  };

  const remove = () => {
    onChange("");
    setUrlInput("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const current = value || urlInput;

  return (
    <div className={styles.wrap}>
      {label && <p className={styles.fieldLabel}>{label}</p>}

      {/* ── Current image preview ── */}
      {current && (
        <div className={styles.preview}>
          <img
            src={current}
            alt="Preview"
            className={styles.previewImg}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className={styles.previewActions}>
            <button
              type="button"
              className={styles.replaceBtn}
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              🔄 Replace
            </button>
            <button type="button" className={styles.removeBtn} onClick={remove}>
              ✕ Remove
            </button>
          </div>
        </div>
      )}

      {/* ── Drop zone ── */}
      {!current && (
        <div
          className={`${styles.dropzone} ${dragging ? styles.dragging : ""} ${uploading ? styles.busy : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
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
              <span>Uploading image…</span>
            </div>
          ) : (
            <div className={styles.idleState}>
              <div className={styles.dzIcon}>
                {dragging ? "📂" : "📷"}
              </div>
              <p className={styles.dzTitle}>
                {dragging ? "Drop to upload" : "Click or drag & drop"}
              </p>
              <p className={styles.dzHint}>JPG, PNG, WebP · Max 5 MB</p>
            </div>
          )}
        </div>
      )}

      {/* Replace button when image exists but we need the hidden input */}
      {current && (
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className={styles.hidden}
          onChange={onFileInput}
        />
      )}

      {/* ── Upload progress bar ── */}
      {uploading && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar} />
        </div>
      )}

      {/* ── Error ── */}
      {error && <p className={styles.error}>⚠️ {error}</p>}

      {/* ── URL fallback ── */}
      <div className={styles.urlRow}>
        <span className={styles.urlLabel}>Or paste URL:</span>
        <input
          type="url"
          className={styles.urlInput}
          placeholder="https://example.com/image.jpg"
          value={urlInput}
          onChange={onUrlChange}
        />
      </div>

      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
