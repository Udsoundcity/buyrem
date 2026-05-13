"use client";
import { useState, useEffect } from "react";
import styles from "./CountdownTimer.module.css";

function getTarget() {
  // 24-hour countdown from session start (stored in sessionStorage)
  if (typeof window === "undefined") return new Date(Date.now() + 24 * 60 * 60 * 1000);
  const key = "cowrivo_offer_end";
  let end = sessionStorage.getItem(key);
  if (!end) {
    end = Date.now() + 24 * 60 * 60 * 1000;
    sessionStorage.setItem(key, end);
  }
  return new Date(Number(end));
}

function calcTime(target) {
  const diff = Math.max(0, target - Date.now());
  return {
    h: Math.floor(diff / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer({ product }) {
  const [target]  = useState(getTarget);
  const [time, setTime] = useState({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    setTime(calcTime(target));
    const id = setInterval(() => setTime(calcTime(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const saved = product.originalPrice - product.price;

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <div className={styles.fireRow}>🔥 Limited Time Offer</div>
          <h2 className={styles.title}>
            Save ₦{saved.toLocaleString()} Today Only
          </h2>
          <p className={styles.sub}>
            This discounted price expires when the timer hits zero.
            Don&apos;t miss out — order now and pay on delivery.
          </p>
        </div>

        <div className={styles.timerWrap}>
          {[
            { val: String(time.h).padStart(2,"0"), label: "Hours" },
            { val: String(time.m).padStart(2,"0"), label: "Mins" },
            { val: String(time.s).padStart(2,"0"), label: "Secs" },
          ].map((t, i) => (
            <div key={i} className={styles.block}>
              {i > 0 && <div className={styles.colon}>:</div>}
              <div className={styles.num}>{t.val}</div>
              <div className={styles.label}>{t.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.priceBlock}>
          <div className={styles.nowLabel}>Price now</div>
          <div className={styles.nowPrice}>₦{product.price.toLocaleString()}</div>
          <div className={styles.wasPrice}>Was ₦{product.originalPrice.toLocaleString()}</div>
        </div>
      </div>
    </section>
  );
}
