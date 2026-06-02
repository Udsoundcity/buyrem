import { notFound } from "next/navigation";
import { getAllProducts, getProduct } from "@/lib/products";
import ProductHero from "../../components/product-detail/ProductHero";
import CountdownTimer from "../../components/product-detail/CountdownTimer";
import FAQ from "../../components/product-detail/FAQ";
import {
  TopStory, Stats, ProblemSolution, Features, Testimonials,
  ReviewScreenshots, ProductImages, VideoSection,
  CustomerStory, LimitedOffer, EmbeddedForm,
} from "../../components/product-detail/Sections";
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
  title: `${product.name} — ₦${product.price.toLocaleString()} | BuyRem Nigeria`,
  description: product.description,
};
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const saved = product.originalPrice - product.price;

  return (
    <div className={styles.page}>

      {/* 1. Top Story — only shown if enabled + has content */}
      <TopStory product={product} />

      {/* 2. Hero */}
      <ProductHero product={product} />

      {/* 3. Stats bar */}
      <Stats product={product} />

      {/* 4. Problem & Solution */}
      <ProblemSolution product={product} />

      {/* 5. Features */}
      <Features product={product} />

      {/* 6. Product Image Gallery */}
      <ProductImages product={product} />

      {/* 7. Text Testimonials */}
      <Testimonials product={product} />

      {/* 8. Review Screenshots */}
      <ReviewScreenshots product={product} />

      {/* 9. Countdown Timer */}
      <CountdownTimer product={product} />

      {/* 10. Limited Time Offer CTA */}
      <LimitedOffer product={product} />

      {/* 11. Product Illustration Video */}
      <VideoSection product={product} />

      {/* 12. Customer Story — only shown if enabled + has content */}
      <CustomerStory product={product} />

      {/* 13. FAQ */}
      <FAQ faqs={product.faq} />

      {/* 14. Final CTA */}
      <section className={styles.finalCta}>
        <div className="container">
          <div className={styles.finalInner}>
            <h2 className={styles.finalTitle}>
              Ready to get your <em>{product.name}?</em>
            </h2>
            <p className={styles.finalSub}>
            {product.formLink
  ? "Fill the order form below — pay cash when it arrives. Zero risk."
  : `Save ₦${saved.toLocaleString()} today. Fill the quick form and pay cash when it arrives.`
}
            </p>
            <div className={styles.finalActions}>
              <div className={styles.finalPrice}>₦{product.price.toLocaleString()}</div>
                          <OrderTrigger
  product={product}
  label={<><i className="fa-solid fa-cart-shopping"></i> Order Now — Pay on Delivery</>}
/>
            </div>
            <div className={styles.finalTrust}>
              {["✅ Pay on Delivery","🚚 Nationwide Delivery","↩️ 5-Day Returns","💯 Genuine Product"].map(t=>(
                <span key={t} className={styles.pill}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 15. Embedded Order Form */}
      <EmbeddedForm product={product} />

    </div>
  );
}