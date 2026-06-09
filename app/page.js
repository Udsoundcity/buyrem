import Link from "next/link";
import { getAllProducts, WHATSAPP_NUMBER } from "@/lib/products";
import ProductCard from "./components/ProductCard";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allProducts = await getAllProducts();
  const featured    = allProducts.slice(0, 4);

  return (
    <>
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
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to place an order.")}`}
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
                <span className={styles.hLabel}>3 Categories · {allProducts.length} Products</span>
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

      <div className={styles.strip}>
        🚚 <strong>FREE delivery</strong> Nationwide&nbsp;·&nbsp;
        💵 <strong>Pay on Delivery</strong> &nbsp;·&nbsp;
        ⭐ Trusted by 4,000+ customers
      </div>

      <section className={styles.products}>
        <div className="container">
          <div className={styles.productsHeader}>
            <div>
              <span className="eyebrow">Featured Products</span>
              <h2 className="sec-title">Our Top <em>Picks</em></h2>
              <p className="sec-sub">Click any product to see full details and order via WhatsApp.</p>
            </div>
            <Link href="/products" className={styles.viewAll}>Check All Products →</Link>
          </div>
          <div className={styles.grid}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className={styles.moreCta}>
            <Link href="/products" className="btn-primary">See All Products →</Link>
          </div>
        </div>
      </section>

      <section className={styles.why}>
        <div className="container">
          <div className={styles.whyHeader}>
            <span className="eyebrow">Why Choose Us</span>
            <h2 className="sec-title">Shopping made <em>simple & safe</em></h2>
          </div>
          <div className={styles.whyGrid}>
            {[
              {icon:"💵",t:"Pay on Delivery",d:"You only pay when your order arrives. Zero risk, zero upfront payment."},
              {icon:"💬",t:"WhatsApp Orders",d:"Fill a quick form and your order details go straight to our WhatsApp."},
              {icon:"🚚",t:"Nationwide Delivery",d:"We deliver across all Lagos LGAs. Same-day in some areas."},
              {icon:"↩️",t:"5-Day Returns",d:"Not happy? WhatsApp us within 5 days. We'll make it right."},
              {icon:"✅",t:"Genuine Products",d:"Every product is vetted for quality. No fakes, ever."},
              {icon:"⭐",t:"4,000+ Customers",d:"Thousands of Lagos residents trust us for their daily needs."},
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

      <section className={styles.how}>
        <div className="container">
          <div className={styles.howGrid}>
            <div>
              <span className={styles.howEyebrow}>How to Order</span>
              <h2 className={styles.howTitle}>4 simple steps.<br /><em>Pay only on delivery.</em></h2>
              <p className={styles.howSub}>No account. No card. Just WhatsApp and cash on delivery.</p>
            </div>
            <div className={styles.steps}>
              {[
                {n:"01",t:"Browse & click a product",d:"See full details, reviews, and specs."},
                {n:"02",t:"Fill the quick order form",d:"Name, phone, address, quantity. Under a minute."},
                {n:"03",t:"Details sent to WhatsApp",d:"Your order is formatted and sent instantly."},
                {n:"04",t:"Pay cash on delivery",d:"We deliver in 1–3 days. Pay when it arrives."},
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

      <section className={styles.contact} id="contact">
        <div className="container">
          <div className={styles.contactGrid}>
            <div>
              <span className="eyebrow">Contact Us</span>
              <h2 className="sec-title">We&apos;re here <em>for you</em></h2>
              <p className="sec-sub">Questions? Reach us on WhatsApp — we reply fast.</p>
              <div className={styles.contactCards}>
                {[
                  {icon:"💬",l:"WhatsApp",v:"+234 8060987399",s:"Usually under 30 mins"},
                  {icon:"📍",l:"Location",v:"Lagos, Nigeria",s:"Delivering across all States"},
                  {icon:"⏰",l:"Hours",v:"Mon – Sat, 8am – 7pm",s:"We're online and ready"},
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
              <p className={styles.ctaSub}>Chat with us on WhatsApp. We&apos;ll confirm your order and delivery.</p>
              <a className="btn-wa"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to place an order.")}`}
                target="_blank" rel="noreferrer">
                <i class="fa-brands fa-whatsapp"></i> Start a Chat
              </a>
              <p className={styles.ctaNote}>⏰ We Reply within 30 minutes</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
