"use client";
import { useState } from "react";
import styles from "./FAQ.module.css";

export default function FAQ({ faqs }) {
  const [open, setOpen] = useState(null);

  return (
    <section className={styles.section}>
      <div className="container">
        <span className="eyebrow">FAQ</span>
        <h2 className="sec-title">
          Common <em>Questions</em>
        </h2>
        <div className={styles.list}>
          {faqs.map((item, i) => (
            <div key={i} className={`${styles.item} ${open === i ? styles.itemOpen : ""}`}>
              <button className={styles.q} onClick={() => setOpen(open === i ? null : i)}>
                <span>{item.q}</span>
                <span className={styles.icon}>{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className={styles.a}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
