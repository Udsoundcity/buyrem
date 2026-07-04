"use client";
import { useState, useEffect, useRef } from "react";
import { CAT_COLORS } from "@/lib/constants";
import CartIcon from "@/app/components/CartIcon";
import OrderModal from "./OrderModal";
import styles from "./ProductHero.module.css";

function scrollToForm() {
  document.getElementById("product-form")?.scrollIntoView({ behavior:"smooth" });
}

// ── Sticky top bar ────────────────────────────────────────────────
function StickyBar({ product, onOrder }) {
  const label = product.formLink ? "Order Now - Pay On Delivery" : "Order Now";
  return (
    <div className={styles.stickyBar}>
      <div className={styles.sbProof}>
        ⭐ <strong>{product.purchases?.toLocaleString()} sold</strong>
        &nbsp;·&nbsp;Rated {product.rating}/5
      </div>
      <button className={styles.sbCta} onClick={onOrder}>
        <CartIcon size={12} /> {label}
      </button>
    </div>
  );
}

// ── Auto-sliding image/video carousel ────────────────────────────
function HeroCarousel({ slides }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const go = (i) => {
    setActive(i);
    clearInterval(timerRef.current);
    if (slides.length > 1) {
      timerRef.current = setInterval(() => setActive(p => (p + 1) % slides.length), 3500);
    }
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => setActive(p => (p + 1) % slides.length), 3500);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselTrack} style={{ transform:`translateX(-${active * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={i} className={styles.carouselSlide}>
            {s.type === "video" ? (
              <iframe
                src={s.embedUrl}
                className={styles.slideVideo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Product video"
              />
            ) : (
              <img src={s.src} alt={s.alt || "Product"} className={styles.slideImg} />
            )}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${active === i ? styles.dotActive : ""}`}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Build slides from product images + optional video ─────────────
function buildSlides(product) {
  const slides = [];

  // Product gallery images
  (product.images || []).forEach(img => {
    if (img.src) slides.push({ type:"image", src:img.src, alt:img.alt });
  });

  // Video as last slide (if set)
  if (product.videoUrl) {
    const url    = product.videoUrl;
    const srcM   = url.match(/src=["']([^"']+)["']/);
    const rawUrl = srcM ? srcM[1].trim() : url.trim();
    const ytW    = rawUrl.match(/youtube\.com\/watch\?v=([^&\s]+)/);
    const ytS    = rawUrl.match(/youtu\.be\/([^?\s]+)/);
    const vm     = rawUrl.match(/vimeo\.com\/(\d+)/);
    let embedUrl = rawUrl;
    if      (ytW) embedUrl = `https://www.youtube.com/embed/${ytW[1]}?rel=0&autoplay=0`;
    else if (ytS) embedUrl = `https://www.youtube.com/embed/${ytS[1]}?rel=0&autoplay=0`;
    else if (vm)  embedUrl = `https://player.vimeo.com/video/${vm[1]}`;
    if (/\.(mp4|webm)(\?|$)/i.test(rawUrl)) {
      // Direct video — skip as carousel slide (shown in VideoSection instead)
    } else {
      slides.push({ type:"video", embedUrl, alt:"Product video" });
    }
  }

  return slides;
}

// ── Main ProductHero (landing page style) ────────────────────────
export default function ProductHero({ product }) {
  const [modal, setModal] = useState(false);
  const saved    = product.originalPrice - product.price;
  const savedPct = Math.round(saved / product.originalPrice * 100);
  const slides   = buildSlides(product);

  const handleOrder = () => product.formLink ? scrollToForm() : setModal(true);
  const orderLabel  = product.formLink ? "Fill Order Form ↓" : "Order Now — Pay on Delivery";

  return (
    <>
      {/* Sticky top navigation bar */}
      <StickyBar product={product} onOrder={handleOrder} />

      {/* Hero carousel */}
      <HeroCarousel slides={slides.length ? slides : [{ type:"image", src:product.thumbnail, alt:product.name }]} />

      {/* Hero body */}
      <div className={styles.heroBody}>
        {/* Social proof badge */}
        <div className={styles.badge}>
          🔥 {product.purchases?.toLocaleString()} customers already ordered
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>{product.tagline || product.name}</h1>

        {/* Rating */}
        <div className={styles.ratingRow}>
          <span className={styles.stars}>★★★★★</span>
          <span className={styles.ratingText}>
            {product.rating} · {product.reviews} verified reviews
          </span>
        </div>

        {/* Price */}
        <div className={styles.priceRow}>
          <span className={styles.price}>₦{product.price.toLocaleString()}</span>
          <span className={styles.orig}>₦{product.originalPrice.toLocaleString()}</span>
          <span className={styles.savePill}>{savedPct}% OFF</span>
        </div>

        {/* Stock scarcity */}
        {product.satisfaction && (
          <div className={styles.stockWarn}>
            🔥 Only a few left at this price — {product.satisfaction}% satisfaction rate
          </div>
        )}

        {/* CTA */}
        <button className={styles.ctaBtn} onClick={handleOrder}>
          <CartIcon size={18} /> {orderLabel}
        </button>
        <p className={styles.ctaNote}>
          {product.formLink
            ? "Fill the form below and pay cash when it arrives"
            : "No upfront payment · Cash on delivery · 5-day refund"}
        </p>
      </div>

      {modal && <OrderModal product={product} onClose={() => setModal(false)} />}

      {/* Mobile sticky bottom bar */}
      <div className={styles.mobileBar}>
        <div className={styles.mobilePrice}>₦{product.price.toLocaleString()}</div>
        <button className={styles.mobileCta} onClick={handleOrder}>
          <CartIcon size={15} /> {product.formLink ? "Order Now" : "Order Now"}
        </button>
      </div>
    </>
  );
}
