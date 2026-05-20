
"use client";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import styles from "./page.module.css";

export default function ProductsClient({ products, categories, catEmoji }) {
  const [cat, setCat] = useState("All");

  const filtered = cat === "All"
    ? products
    : products.filter(p => p.cat === cat);

  return (
    <>
      <section className={styles.header}>
        <div className="container">
          <span className="eyebrow">Our Collection</span>
          <h1 className={styles.title}>All <em>Products</em></h1>
          <p className={styles.sub}>
            Click any product for full details and to order via WhatsApp.
            Payment on delivery — no card or upfront payment needed.
          </p>
          <div className={styles.filters}>
            {categories.map(c => (
              <button
                key={c}
                className={`${styles.filter} ${cat === c ? styles.filterActive : ""}`}
                onClick={() => setCat(c)}
              >
                {catEmoji[c]} {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        <div className="container">
          <p className={styles.count}>
            Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""}
            {cat !== "All" ? ` in ${cat}` : ""}
          </p>
          <div className={styles.productsGrid}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
