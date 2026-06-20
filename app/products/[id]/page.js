import { notFound } from "next/navigation";
import { getAllProducts, getProduct } from "@/lib/products";
import AnnouncementBar  from "@/app/components/product-detail/AnnouncementBar";
import ProductHero      from "@/app/components/product-detail/ProductHero";
import OrderTrigger     from "@/app/components/product-detail/OrderTrigger";
import {
  TrustStrip, TopStory, Stats,
  ProblemSection, SolutionSection, ResultsList,
  BeforeAfterCarousel, HowItWorks,
  ReviewScreenshots, TestimonialsSection,
  UrgencySection, VideoSection,
  CustomerStory, FAQSection,
  EmbeddedForm, ProductImages,
} from "@/app/components/product-detail/Sections";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  if (!product) return { title:"Not Found" };
  return {
    title:       `${product.name} — ₦${product.price.toLocaleString()} | MyShop Lagos`,
    description: product.tagline || product.description,
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  const saved = product.originalPrice - product.price;

  return (
    <div className={styles.page}>
      <TopStory product={product} />
      <AnnouncementBar product={product} />
      <ProductHero product={product} />
      <TrustStrip />
      <ProblemSection product={product} />
      <SolutionSection product={product} />
      <ResultsList product={product} />
      <Stats product={product} />
      <BeforeAfterCarousel product={product} />
      <HowItWorks product={product} />
      <ProductImages product={product} />
      <ReviewScreenshots product={product} />
      <TestimonialsSection product={product} />
      <UrgencySection product={product} />
      <VideoSection product={product} />
      <CustomerStory product={product} />
      <FAQSection product={product} />

      <section className={styles.finalCta}>
        <div className="container">
          <div className={styles.finalInner}>
            <h2 className={styles.finalTitle}>Ready to get your <em>{product.name}?</em></h2>
            <p className={styles.finalSub}>
              {product.formLink
                ? "Fill the order form below — pay cash when it arrives."
                : `Save ₦${saved.toLocaleString()} today. Pay cash when it arrives — zero risk.`}
            </p>
            <div className={styles.finalActions}>
              <div className={styles.finalPrice}>₦{product.price.toLocaleString()}</div>
              <OrderTrigger product={product} label="Order Now — Pay on Delivery" />
            </div>
            <div className={styles.finalTrust}>
              {["✅ Payment on Delivery","🚚 Nationwide Delivery","↩️ 5-Day Returns","💯 Genuine Product"].map(t=>(
                <span key={t} className={styles.pill}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EmbeddedForm product={product} />
    </div>
  );
}
