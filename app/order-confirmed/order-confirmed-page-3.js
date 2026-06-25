"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";
import { LeadTracker } from "@/app/components/PixelEvents";
import styles from "./page.module.css";

function resolve(value) {
  if (!value) return null;
  if (value.includes("{") || value.includes("}")) return null;
  return value.trim() || null;
}

function ConfirmationContent() {
  const params  = useSearchParams();
  const ref     = resolve(params.get("ref"));
  const name    = resolve(params.get("name"));
  const product = resolve(params.get("product"));
  const greeting = name ? `Thank You, ${name.split(" ")[0]}!` : "Thank You!";

  return (
    <div className={styles.page}>

      {/* Fires fbq('track','Lead') once per unique Cognito submission */}
      <LeadTracker refId={ref} />

      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />

      <main className={styles.card}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoBuy}>Buy</span>
          <span className={styles.logoRem}>Rem</span>
        </Link>

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

        <h1 className={styles.heading}>{greeting}</h1>
        <p className={styles.sub}>Your submission has been received.</p>

        {ref && (
          <div className={styles.refBadge}>
            <span className={styles.refLabel}>Reference ID</span>
            <span className={styles.refNum}>{ref}</span>
          </div>
        )}

        <div className={styles.message}>
          <p>
            {product
              ? `Your order enquiry for ${product} has been submitted successfully.`
              : "Your order enquiry has been submitted successfully."}{" "}
            Our team has received your details and will process your request shortly.
          </p>
          <p>
            A representative may reach out to you on WhatsApp or by phone to confirm
            your order and arrange delivery.{" "}
            <strong>No payment is required until your order arrives.</strong>
          </p>
        </div>

        <div className={styles.steps}>
          <div className={styles.stepsTitle}>What happens next</div>
          <div className={styles.stepsList}>
            {[
              { icon:"📋", t:"Order Received",  d:"Your details are in our system." },
              { icon:"📞", t:"We Confirm",       d:"A rep may call or WhatsApp you to confirm." },
              { icon:"🚚", t:"We Deliver",       d:"Your order arrives in 1–3 business days." },
              { icon:"💵", t:"Pay on Delivery",  d:"Pay cash when it arrives. Zero risk." },
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

        <div className={styles.actions}>
          <Link href="/products" className={styles.btnPrimary}>🛍️ Continue Shopping</Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hi! I just submitted an order and would like to follow up."
            )}`}
            target="_blank" rel="noreferrer"
            className={styles.btnWa}
          >
            💬 Chat on WhatsApp
          </a>
        </div>

        <Link href="/" className={styles.homeLink}>← Back to {STORE_NAME}</Link>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} {STORE_NAME} · Lagos, Nigeria</p>
        <p>Payment on Delivery · Genuine Products · Fast Delivery</p>
      </footer>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
        justifyContent:"center", background:"#FAF5EE",
        fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#7A5240" }}>
        Loading…
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
