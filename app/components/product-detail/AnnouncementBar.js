"use client";
import { useState } from "react";
import styles from "./AnnouncementBar.module.css";

export default function AnnouncementBar({ product }) {
  const [dismissed, setDismissed] = useState(false);
  const bar = product?.announcementBar;

  if (!bar?.enabled || !bar.text || dismissed) return null;

  return (
    <div
      className={styles.bar}
      style={{
        background: bar.bgColor ||  "#7C3AED",
        color:      bar.textColor || "#ffffff",
      }}
      role="banner"
    >
      <span className={styles.text}>{bar.text}</span>
      {bar.showClose !== false && (
        <button
          className={styles.close}
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
        >
          ×
        </button>
      )}
    </div>
  );
}