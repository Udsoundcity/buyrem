
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/products";
import ProductHero from "../../components/product-detail/ProductHero";
import CountdownTimer from "../../components/product-detail/CountdownTimer";
import FAQ from "../../components/product-detail/FAQ";
import { Stats, ProblemSolution, Features, Testimonials, ProductImages, LimitedOffer } from "../../components/product-detail/Sections";
import OrderTrigger from "../../components/product-detail/OrderTrigger";
import styles from "./page.module.css";

export async function generateStaticParams() {
  return PRODUCTS.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const product = getProduct(params.id);
  if (!product) return { title: "Not Found" };
  return {
    title: `${product.name} — ₦${product.price.toLocaleString()} | MyShop Lagos`,
    description: product.description,
  };
}

export default function ProductPage({ params }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  return (
    <div className={styles.page}>

      {/* 1 ── HERO with order button */}
      <ProductHero product={product} />

      {/* 2 ── STATISTICS */}
      <Stats product={product} />

      {/* 3 ── PROBLEM & SOLUTION */}
      <ProblemSolution product={product} />

      {/* 4 ── PRODUCT FEATURES */}
      <Features product={product} />

      {/* 5 ── PRODUCT IMAGES */}
      <ProductImages product={product} />

      {/* 6 ── TESTIMONIALS */}
      <Testimonials product={product} />

      {/* 7 ── COUNTDOWN TIMER */}
      <CountdownTimer product={product} />

      {/* 8 ── LIMITED TIME OFFER */}
      {/* <LimitedOffer product={product} onOrder={() => {}} /> */}
      <LimitedOffer product={product} />

      {/* 9 ── FAQ */}
      <FAQ faqs={product.faq} />

      {/* 10 ── FINAL CTA */}
      <section className={styles.finalCta}>
        <div className="container">
          <div className={styles.finalInner}>
            <h2 className={styles.finalTitle}>
              Ready to get your <em>{product.name}?</em>
            </h2>
            <p className={styles.finalSub}>
              Save ₦{(product.originalPrice - product.price).toLocaleString()} today.
              Fill the quick form and pay cash when it arrives — zero risk.
            </p>
            <div className={styles.finalActions}>
              <div className={styles.finalPrice}>₦{product.price.toLocaleString()}</div>
              <OrderTrigger
  product={product}
  label={
    <>
      <i
        className="fa-solid fa-cart-shopping"
        style={{ fontSize: "14px" }}
      ></i>{" "}
      Order Now — Pay on Delivery
    </>
  }
/>
            </div>
            <div className={styles.finalTrust}>
              {["✅ Pay on Delivery","🚚 Nationwide Delivery","↩️ 5-Days Returns","💯 Genuine Product"].map(t=>(
                <span key={t} className={styles.pill}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
