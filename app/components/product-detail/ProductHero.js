"use client";
import { useState } from "react";
import Image from "next/image";
import { CAT_COLORS } from "@/lib/constants";
import OrderModal from "./OrderModal";
import styles from "./ProductHero.module.css";

function scrollToForm() {
  document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" });
}

export default function ProductHero({ product }) {
  const [modal,       setModal]       = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const cc          = CAT_COLORS[product.cat];
  const saved       = product.originalPrice - product.price;
  const savedPct    = Math.round((saved / product.originalPrice) * 100);
  const activeImage = product.images[activeIndex];

  const handleOrder = () => {
    if (product.formLink) {
      scrollToForm();
    } else {
      setModal(true);
    }
  };

const orderLabel = product.formLink
  ? <><i className="fa-solid fa-file-lines"></i> Fill Order Form ↓</>
  : <><i className="fa-solid fa-cart-shopping"></i> Order Now — Pay on Delivery</>;

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.inner}`}>

          {/* IMAGE SIDE */}
          <div className={styles.imgSide}>
            <div className={styles.imgMain} style={{ background: product.bg }}>
              <Image
                key={activeIndex}
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="(max-width: 900px) 90vw, 45vw"
                className={styles.mainImg}
                priority={activeIndex === 0}
              />
            </div>

            <div className={styles.thumbRow}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${activeIndex === i ? styles.thumbActive : ""}`}
                  onClick={() => setActiveIndex(i)}
                  title={img.label}
                  aria-label={`View ${img.label}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="80px"
                    className={styles.thumbImg}
                  />
                </button>
              ))}
            </div>

            <p className={styles.imgLabel}>📸 {activeImage.label}</p>
          </div>

          {/* INFO SIDE */}
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
              <span className={styles.trustItem}>✅ Payment on Delivery</span>
              <span className={styles.trustItem}>🚚 Nationwide Delivery</span>
              <span className={styles.trustItem}>↩️ 5-day returns</span>
            </div>

            <button className={styles.orderBtn} onClick={handleOrder}>
              {orderLabel}
            </button>
            <p className={styles.orderNote}>
              {product.formLink
                ? "Fill the form below and we'll confirm your order"
                : "Fill a quick form → sent to WhatsApp → pay cash on delivery"}
            </p>
          </div>
        </div>
      </section>

      {modal && <OrderModal product={product} onClose={() => setModal(false)} />}

      {/* Sticky mobile bar */}
      <div className={styles.stickyBar}>
        <div className={styles.stickyPrice}>₦{product.price.toLocaleString()}</div>
        <button className={styles.stickyBtn} onClick={handleOrder}>
        {
  product.formLink
    ? <><i className="fa-solid fa-file-lines"></i> Fill Order Form ↓</>
    : <><i className="fa-solid fa-cart-shopping"></i> Order Now — Pay Later</>
}
        </button>
      </div>
    </>
  );
}
