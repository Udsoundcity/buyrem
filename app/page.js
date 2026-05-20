
import Link from "next/link";
import { getAllProducts, WHATSAPP_NUMBER } from "@/lib/products";
import ProductCard from "./components/ProductCard";
import styles from "./page.module.css";

// ← Tell Next.js: never cache this page.
//   Always read fresh data from products.json on every request.
export const dynamic = "force-dynamic";

export default function HomePage() {
  // Called fresh on every request — always reads current products.json
  const featured = getAllProducts().slice(0, 4);

  return (
    <>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroLeft}>
            <div className={styles.heroTag}>
              <span className={styles.tagDot} />
              Beauty · Electronics · Health
            </div>
            <h1 className={styles.heroTitle}>
              Quality products,<br />delivered to your <em>door.</em>
            </h1>
            <p className={styles.heroSub}>
              Handpicked beauty, electronics, and health products for Nigerian families.
              Order via WhatsApp — pay cash on delivery. No upfront payment, ever.
            </p>
            <div className={styles.heroActions}>
              <Link href="/products" className="btn-primary">Shop All Products →</Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to place an order.")}`}
                target="_blank" rel="noreferrer" className="btn-wa">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp Us
              </a>
            </div>
            <div className={styles.trustPills}>
              {["✅ Pay on Delivery","🚚 Nationwide Delivery","↩️ 5-Day Returns","💯 Genuine Products"].map(t=>(
                <span key={t} className={styles.pill}>{t}</span>
              ))}
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroCards}>
              <div className={`${styles.hCard} ${styles.hWide}`}>
                <span className={styles.hEmoji}>🛍️</span>
                <span className={styles.hLabel}>3 Categories · {getAllProducts().length} Products</span>
              </div>
              {[{e:"💄",l:"Beauty"},{e:"⚡",l:"Electronics"},{e:"🌿",l:"Health"}].map(c=>(
                <div key={c.l} className={styles.hCard}>
                  <span className={styles.hEmoji}>{c.e}</span>
                  <span className={styles.hLabel}>{c.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className={styles.strip}>
        🚚 <strong>FREE delivery</strong> Nationwide &nbsp;·&nbsp;
        💵 <strong>Pay on Delivery</strong> — no card needed &nbsp;·&nbsp;
        ⭐ Trusted by 3,000+ customers &nbsp;·&nbsp;
        ↩️ <strong>5-day returns</strong>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className={styles.products}>
        <div className="container">
          <div className={styles.productsHeader}>
            <div>
              <span className="eyebrow">Featured Products</span>
              <h2 className="sec-title">Our Top <em>Picks</em></h2>
              <p className="sec-sub">Click any product to see full details and order via WhatsApp.</p>
            </div>
            <Link href="/products" className={styles.viewAll}>View All Products →</Link>
          </div>
          <div className={styles.grid}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className={styles.moreCta}>
            <Link href="/products" className="btn-primary">See All Products →</Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className={styles.why}>
        <div className="container">
          <div className={styles.whyHeader}>
            <span className="eyebrow">Why Choose Us</span>
            <h2 className="sec-title">Shopping made <em>simple & safe</em></h2>
          </div>
          <div className={styles.whyGrid}>
            {[
              {icon:"💵",t:"Pay on Delivery",d:"You only pay when your order arrives. Zero risk, zero upfront payment required."},
              {icon:"💬",t:"WhatsApp Orders",d:"Fill a quick form and your order details go straight to our WhatsApp. Easy!"},
              {icon:"🚚",t:"Nationwide Delivery",d:"We deliver across all Lagos LGAs. Same-day delivery available in some areas."},
              {icon:"↩️",t:"5-Day Returns",d:"Not happy? WhatsApp us within 14 days of delivery. We'll make it right."},
              {icon:"✅",t:"Genuine Products",d:"Every product is vetted for quality. No fakes, no substandard goods — ever."},
              {icon:"⭐",t:"3,000+ Customers",d:"Thousands of Lagos residents trust us for beauty, electronics, and health needs."},
            ].map((w,i)=>(
              <div key={i} className={styles.whyCard}>
                <div className={styles.whyIcon}>{w.icon}</div>
                <div className={styles.whyTitle}>{w.t}</div>
                <div className={styles.whySub}>{w.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO ORDER ── */}
      <section className={styles.how}>
        <div className="container">
          <div className={styles.howGrid}>
            <div>
              <span className={styles.howEyebrow}>How to Order</span>
              <h2 className={styles.howTitle}>4 simple steps.<br /><em>Pay only on delivery.</em></h2>
              <p className={styles.howSub}>No account needed. No card required. Just WhatsApp and cash on delivery.</p>
            </div>
            <div className={styles.steps}>
              {[
                {n:"01",t:"Browse & click a product",d:"Click any product to see full details, reviews, and specs."},
                {n:"02",t:"Fill the quick order form",d:"Enter your name, phone, address, and quantity. Takes under a minute."},
                {n:"03",t:"Details sent to WhatsApp",d:"Your complete order is formatted and sent to our WhatsApp instantly."},
                {n:"04",t:"Pay cash on delivery",d:"We deliver in 1–3 days. Inspect your order, then pay the delivery person."},
              ].map((s,i)=>(
                <div key={i} className={styles.step}>
                  <div className={styles.stepNum}>{s.n}</div>
                  <div><div className={styles.stepTitle}>{s.t}</div><div className={styles.stepDesc}>{s.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className={styles.contact} id="contact">
        <div className="container">
          <div className={styles.contactGrid}>
            <div>
              <span className="eyebrow">Contact Us</span>
              <h2 className="sec-title">We&apos;re here <em>for you</em></h2>
              <p className="sec-sub">Questions about a product or your order? Reach us on WhatsApp — we reply fast.</p>
              <div className={styles.contactCards}>
                {[
                  {icon:"💬",l:"WhatsApp",v:"+234 7067584692",s:"Fastest — usually under 30 mins"},
                  {icon:"📍",l:"Location",v:"Lagos, Nigeria",s:"Delivering across all Lagos LGAs"},
                  {icon:"⏰",l:"Hours",v:"Mon – Sat, 8am – 7pm",s:"We're online and ready to help"},
                  {icon:"🚚",l:"Delivery",v:"1–3 Business Days",s:"Same-day in select areas"},
                ].map((c,i)=>(
                  <div key={i} className={styles.cCard}>
                    <div className={styles.cIcon}>{c.icon}</div>
                    <div>
                      <div className={styles.cLabel}>{c.l}</div>
                      <div className={styles.cVal}>{c.v}</div>
                      <div className={styles.cSub}>{c.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.ctaBox}>
              <div className={styles.ctaEmoji}><i class="fa-solid fa-cart-shopping"></i></div>
              <h3 className={styles.ctaTitle}>Ready to order?</h3>
              <p className={styles.ctaSub}>Chat with us on WhatsApp. We&apos;ll help you choose the right product and confirm delivery.</p>
              <a className="btn-wa"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to place an order.")}`}
                target="_blank" rel="noreferrer">
                <i class="fa-brands fa-whatsapp"></i> Start a Chat
              </a>
              <p className={styles.ctaNote}>⏰ Replies within 30 minutes</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}