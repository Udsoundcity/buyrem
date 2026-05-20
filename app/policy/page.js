import Link from "next/link";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";
import styles from "../components/PolicyPage.module.css";

export default function PolicyPage({ badge, title, updated, toc = [], children }) {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span>{title}</span>
          </div>
          <div className={styles.badge}>{badge}</div>
         <h1 className={styles.title}>{title}</h1>
          <div className={styles.meta}>
            <span>📅 Last updated: {updated}</span>
            <span>🏪 {STORE_NAME} · Lagos, Nigeria</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className="container">
          <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.toc}>
              <div className={styles.tocTitle}>Contents</div>
              {toc.map((item, i) => (
                <a key={i} href={`#section-${i + 1}`} className={styles.tocLink}>
                  {i + 1}. {item}
                </a>
              ))}
            </aside>

            {/* Content */}
            <div className={styles.content}>
              {children}

              {/* Contact banner */}
              <div className={styles.contactBanner}>
                <h3>Have a question?</h3>
                <p>
                  If anything on this page is unclear or you need further help,
                  reach us directly on WhatsApp. We reply fast.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I have a question about your policies.")}`}
                  target="_blank" rel="noreferrer"
                >
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
