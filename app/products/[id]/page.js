import { notFound } from "next/navigation";
import { getAllProducts, getProduct } from "@/lib/products";
import ProductHero from "../../components/product-detail/ProductHero";
import CountdownTimer from "../../components/product-detail/CountdownTimer";
import FAQ from "../../components/product-detail/FAQ";
import { Stats, ProblemSolution, Features, Testimonials, ProductImages, LimitedOffer } from "../../components/product-detail/Sections";
import OrderTrigger from "../../components/product-detail/OrderTrigger";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  if (!product) return { title: "Not Found" };
  return {
    title: `${product.name} — ₦${product.price.toLocaleString()} | MyShop Lagos`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <div className={styles.page}>
      <ProductHero product={product} />
      <Stats product={product} />
      <ProblemSolution product={product} />
      <Features product={product} />
      <ProductImages product={product} />
      <Testimonials product={product} />
      <CountdownTimer product={product} />
      <LimitedOffer product={product} />
      <FAQ faqs={product.faq} />

      <section className={styles.finalCta}>
        <div className="container">
          <div className={styles.finalInner}>
            <h2 className={styles.finalTitle}>
              Ready to get your <em>{product.name}?</em>
            </h2>
            <p className={styles.finalSub}>
              Save ₦{(product.originalPrice - product.price).toLocaleString()} today.
              Pay cash when it arrives — zero risk.
            </p>
            <div className={styles.finalActions}>
              <div className={styles.finalPrice}>₦{product.price.toLocaleString()}</div>
              <OrderTrigger product={product} label={
  <>
    <i className="fa-solid fa-cart-shopping"></i>{" "}
    Order Now — Pay on Delivery
  </>
} />
            </div>
            <div className={styles.finalTrust}>
              {["✅ Pay on Delivery","🚚 Nationwide Delivery","↩️ 5-Day Returns","💯 Genuine Product"].map(t=>(
                <span key={t} className={styles.pill}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
