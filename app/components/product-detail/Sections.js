// Stats.js
import styles from "./Sections.module.css";

export function Stats({ product }) {
  return (
    <section className={styles.stats}>
      <div className="container">
        <div className={styles.statsGrid}>
          {[
            { num: `${product.purchases.toLocaleString()}+`, label: "Happy Customers" },
            { num: `${product.rating}⭐`, label: "Average Rating" },
            { num: `${product.reviews}+`, label: "Verified Reviews" },
            { num: `${product.satisfaction}%`, label: "Satisfaction Rate" },
          ].map((s, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ProblemSolution.js
export function ProblemSolution({ product }) {
  return (
    <section className={styles.ps}>
      <div className="container">
        <div className={styles.psGrid}>
          {/* Problem */}
          <div className={styles.problem}>
            <div className={styles.problemTag}>😔 The Problem</div>
            <h2 className={`sec-title ${styles.psTitle}`}>{product.problem.title}</h2>
            <p className="sec-sub">{product.problem.body}</p>
          </div>
          {/* Solutions */}
          <div className={styles.solutions}>
            <div className={styles.problemTag} style={{ color: "#2A8C52" }}>✅ The Solution</div>
            <div className={styles.solutionList}>
              {product.solutions.map((s, i) => (
                <div key={i} className={styles.solution}>
                  <div className={styles.solIcon}>{s.icon}</div>
                  <div>
                    <div className={styles.solTitle}>{s.title}</div>
                    <div className={styles.solBody}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features.js
export function Features({ product }) {
  return (
    <section className={styles.features}>
      <div className="container">
        <span className="eyebrow">What You Get</span>
        <h2 className="sec-title">
          Product <em>Features</em>
        </h2>
        <div className={styles.featGrid}>
          {product.features.map((f, i) => (
            <div key={i} className={styles.feat}>
              <span className={styles.featCheck}>✓</span>
              <span className={styles.featText}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials.js
export function Testimonials({ product }) {
  return (
    <section className={styles.testimonials}>
      <div className="container">
        <span className="eyebrow">What Customers Say</span>
        <h2 className="sec-title">
          Real <em>Reviews</em>
        </h2>
        <div className={styles.testiGrid}>
          {product.testimonials.map((t, i) => (
            <div key={i} className={styles.testi}>
              <div className={styles.testiStars}>{"⭐".repeat(t.rating)}</div>
              <p className={styles.testiText}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.testiAuthor}>
                <div className={styles.testiAvatar}>{t.name[0]}</div>
                <div>
                  <div className={styles.testiName}>{t.name}</div>
                  <div className={styles.testiLoc}>📍 {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ProductImages.js
export function ProductImages({ product }) {
  return (
    <section className={styles.images}>
      <div className="container">
        <span className="eyebrow">Product Gallery</span>
        <h2 className="sec-title">
          See It <em>Up Close</em>
        </h2>
        <div className={styles.imgGrid}>
          {product.images.map((img, i) => (
            <div key={i} className={`${styles.imgCard} ${i === 0 ? styles.imgMain : ""}`}>
              <div className={styles.imgWrap} style={{ background: product.bg }}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className={styles.imgPhoto}
                />
              </div>
              <div className={styles.imgLabel}>{img.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// LimitedOffer.js — CTA banner
export function LimitedOffer({ product, onOrder }) {
  const saved = product.originalPrice - product.price;
  return (
    <section className={styles.offer}>
      <div className="container">
        <div className={styles.offerInner}>
          <div className={styles.offerEmoji}>{product.emoji}</div>
          <div className={styles.offerText}>
            <div className={styles.offerEyebrow}>🎉 Limited Time Deal</div>
            <h2 className={styles.offerTitle}>
              Get {product.name} for only{" "}
              <span>₦{product.price.toLocaleString()}</span>
            </h2>
            <p className={styles.offerSub}>
              Save ₦{saved.toLocaleString()} off the original price. Pay cash on delivery — no risk, no upfront payment.
            </p>
          </div>
          <div className={styles.offerAction}>
            <button className="btn-wa" onClick={onOrder}>
              <i className="fa-solid fa-cart-shopping"></i> Order Now — Pay Later
            </button>
            <p className={styles.offerNote}>⏰ Offer expires soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
