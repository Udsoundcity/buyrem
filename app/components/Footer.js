
import Link from "next/link";
import { STORE_NAME, STORE_TAGLINE, STORE_LOCATION, WHATSAPP_NUMBER } from "@/lib/constants";
import styles from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FaXTwitter } from "react-icons/fa6";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";



const SOCIALS = [
{
  label: "WhatsApp",
  emoji: <FontAwesomeIcon icon={faWhatsapp} />,
  href: `https://wa.me/${WHATSAPP_NUMBER}`
},
  {
  label: "X",
  emoji: <FaXTwitter />,
  href: "https://x.com/Buyrem"
},
  {
  label: "Facebook",
  emoji: <FontAwesomeIcon icon={faFacebook} />,
  href: "https://www.facebook.com/profile.php?id=61590766585244"
},
];

const LINKS_COL1 = [
  { label: "Home",       href: "/" },
  { label: "Products",   href: "/products" },
  { label: "Contact",    href: "/#contact" },
];

const LINKS_COL2 = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy ",     href: "/privacy" },
  { label: "Return Policy",      href: "/return" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandName}>
              <em>{STORE_NAME.charAt(0)}</em>
  {STORE_NAME.slice(1)}
          </div>
          <p className={styles.brandTag}>{STORE_TAGLINE}</p>
          <p className={styles.brandLoc}>📍 {STORE_LOCATION}</p>

          {/* Socials */}
          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className={styles.social} title={s.label}>
                {s.emoji}
              </a>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div className={styles.col}>
          <div className={styles.colTitle}>Quick Links</div>
          {LINKS_COL1.map((l) => (
            <Link key={l.href} href={l.href} className={styles.colLink}>{l.label}</Link>
          ))}
        </div>

        {/* Policy links */}
        <div className={styles.col}>
          <div className={styles.colTitle}>Policies</div>
          {LINKS_COL2.map((l) => (
            <Link key={l.href} href={l.href} className={styles.colLink}>{l.label}</Link>
          ))}
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <div className={styles.colTitle}>Contact Us</div>
          <div className={styles.contactItem}><FontAwesomeIcon icon={faEnvelope} /> <a href="mailto:BuyremOrder@gmail.com">
  BuyremOrder@gmail.com
</a> </div>
          <div className={styles.contactItem}>📍 {STORE_LOCATION}</div>
          <div className={styles.contactItem}>⏰ Mon–Sat, 8am–7pm</div>
          <div className={styles.contactItem}>🚚 1–3 day delivery</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <span className={styles.copy}>
            © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </span>
          <span className={styles.pod}>
            <span className={styles.podDot} /> Payment on Delivery · No upfront payment required
          </span>
        </div>
      </div>
    </footer>
  );
}
