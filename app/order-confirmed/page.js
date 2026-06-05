"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";
import styles from "./page.module.css";

// ─── Reads optional URL params passed by Cognito Forms redirect ──
// Set your Cognito Forms redirect URL to:
//   https://yourdomain.vercel.app/order-confirmed?ref={entry.id}&name={entry.name}
function ConfirmationContent() {
  const params  = useSearchParams();
  const ref     = params.get("ref");
  const name    = params.get("name");
  const product = params.get("product");

  const greeting = name ? `Thank You, ${name.split(" ")[0]}!` : "Thank You!";

  return (
    <div className={styles.page}>

      {/* ── Background blobs ── */}
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />

      {/* ── Card ── */}
      <main className={styles.card}>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoBuy}>Buy</span>
          <span className={styles.logoRem}>Rem</span>
        </Link>

        {/* Animated checkmark */}
        <div className={styles.iconWrap} aria-hidden>
          <svg className={styles.circle} viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="2.5"
              className={styles.circleRing} />
            <polyline points="16,28 24,36 40,20" stroke="currentColor" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
              className={styles.checkmark} />
          </svg>
          <div className={styles.pulse} />
        </div>

        {/* Headline */}
        <h1 className={styles.heading}>{greeting}</h1>
        <p className={styles.sub}>Your submission has been received.</p>

        {/* Optional reference */}
        {ref && (
          <div className={styles.refBadge}>
            <span className={styles.refLabel}>Reference ID</span>
            <span className={styles.refNum}>{ref}</span>
          </div>
        )}

        {/* Confirmation message */}
        <div className={styles.message}>
          <p>
            {product
              ? `Your order  for <strong>${product}</strong> has been submitted successfully.`
              : "Your order  has been submitted successfully."}
            {" "}Our team has received your details and will process your request shortly.
          </p>
          <p>
            A representative will reach out to you on WhatsApp or by phone call to confirm
            your order and arrange delivery. <strong>No payment is required until your order arrives.</strong>
          </p>
        </div>

        {/* Next steps */}
        <div className={styles.steps}>
          <div className={styles.stepsTitle}>What happens next</div>
          <div className={styles.stepsList}>
            {[
              { icon:"📋", n:"01", t:"Order Received",     d:"Your details are in our system." },
              { icon:"📞", n:"02", t:"We Confirm",         d:"A rep may call or WhatsApp you to confirm." },
              { icon:"🚚", n:"03", t:"We Deliver",         d:"Your order arrives in 1–3 business days." },
              { icon:"💵", n:"04", t:"Pay on Delivery",    d:"You pay cash when it arrives. Zero risk." },
            ].map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum}>{s.icon}</div>
                <div>
                  <div className={styles.stepTitle}>{s.t}</div>
                  <div className={styles.stepDesc}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className={styles.actions}>
          <Link href="/products" className={styles.btnPrimary}>
            🛍️ Continue Shopping
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I just submitted an order form and would like to follow up.")}`}
            target="_blank"
            rel="noreferrer"
            className={styles.btnWa}
          >
            <>
  <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
</>
          </a>
        </div>

        {/* Back to home */}
        <Link href="/" className={styles.homeLink}>
          ← Back to {STORE_NAME}
        </Link>

      </main>

      {/* ── Footer note ── */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} {STORE_NAME} · Lagos, Nigeria</p>
        <p>Payment on Delivery · Genuine Products · Fast Lagos Delivery</p>
      </footer>

    </div>
  );
}

// Wrap in Suspense — required by Next.js when useSearchParams is used
export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        background:"#FAF5EE", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#7A5240" }}>
        Loading…
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
