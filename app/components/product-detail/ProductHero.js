"use client";
import { useState } from "react";
import { CAT_COLORS } from "@/lib/products";
import OrderModal from "./OrderModal";
import styles from "./ProductHero.module.css";

export default function ProductHero({ product }) {
  const [modal, setModal] = useState(false);
  const cc = CAT_COLORS[product.cat];
  const saved = product.originalPrice - product.price;
  const savedPct = Math.round((saved / product.originalPrice) * 100);

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.inner}`}>
          {/* Image side */}
          <div className={styles.imgSide}>
            <div className={styles.imgMain} style={{ background: product.bg }}>
              {product.emoji}
            </div>
            <div className={styles.thumbRow}>
              {product.images.slice(0, 4).map((img, i) => (
                <div key={i} className={styles.thumb} style={{ background: img.bg }}>
                  {img.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Info side */}
          <div className={styles.info}>
            <div className={styles.topRow}>
              <div className={styles.catChip} style={{ background: cc.bg, color: cc.text }}>
                {product.cat}
              </div>
              {product.badge && (
                <div className={styles.badge} style={{ background: product.badgeColor }}>
                  {product.badge}
                </div>
              )}
            </div>

            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.tagline}>{product.tagline}</p>

            <div className={styles.ratingRow}>
              {"⭐".repeat(5)}
              <span className={styles.ratingNum}>{product.rating}</span>
              <span className={styles.ratingCount}>({product.reviews} reviews)</span>
              <span className={styles.ratingDot}>·</span>
              <span className={styles.purchases}>{product.purchases.toLocaleString()} sold</span>
            </div>

            <div className={styles.priceRow}>
              <div className={styles.price}>₦{product.price.toLocaleString()}</div>
              <div className={styles.original}>₦{product.originalPrice.toLocaleString()}</div>
              <div className={styles.saveBadge}>Save {savedPct}%</div>
            </div>

            <p className={styles.desc}>{product.description}</p>

            <div className={styles.trustRow}>
              <div className={styles.trustItem}>✅ Payment on Delivery</div>
              <div className={styles.trustItem}>🚚 Lagos Delivery</div>
              <div className={styles.trustItem}>↩️ 5-days returns</div>
            </div>

            <button className={styles.orderBtn} onClick={() => setModal(true)}>
              💬 Order Now — Pay on Delivery
            </button>
            <p className={styles.orderNote}>
              Fill a quick form → sent to WhatsApp → pay cash on delivery
            </p>
          </div>
        </div>
      </section>

      {modal && (
        <OrderModal product={product} onClose={() => setModal(false)} />
      )}

      {/* Sticky floating WA on mobile */}
      <div className={styles.stickyBar}>
        <div className={styles.stickyPrice}>₦{product.price.toLocaleString()}</div>
        <button className={styles.stickyBtn} onClick={() => setModal(true)}>
          💬 Order Now
        </button>
      </div>
    </>
  );
}
