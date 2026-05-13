"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { STORE_NAME, WHATSAPP_NUMBER } from "../../lib/products";
import styles from "./Nav.module.css";

const LINKS = [
  { label: "Home",     href: "/" },
  { label: "Products", href: "/products" },
  { label: "Contact",  href: "/#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
<em>{STORE_NAME[0]}</em>{STORE_NAME.slice(1)}
        </Link>

        {/* Desktop links */}
        <nav className={styles.links}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${pathname === l.href ? styles.active : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          className={styles.waBtn}
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank" rel="noreferrer"
        >
          <i class="fa-brands fa-whatsapp"></i> WhatsApp Us
        </a>

        {/* Hamburger */}
        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={styles.mobile}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.mobileLink}>
              {l.label}
            </Link>
          ))}
          <a
            className={styles.mobileWa}
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank" rel="noreferrer"
          >
            <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
