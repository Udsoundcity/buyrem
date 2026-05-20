
import Link from "next/link";
import Image from "next/image";
import { CAT_COLORS } from "@/lib/constants";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const cc = CAT_COLORS[product.cat];

  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      {product.badge && (
        <div className={styles.badge} style={{ background: product.badgeColor }}>
          {product.badge}
        </div>
      )}
      <div className={styles.catChip} style={{ background: cc.bg, color: cc.text }}>
        {product.cat}
      </div>

      {/* Product thumbnail image */}
      <div className={styles.imgWrap} style={{ background: product.bg }}>
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={styles.img}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.tagline}>{product.tagline}</div>

        <div className={styles.rating}>
          {"⭐".repeat(5)}
          <span className={styles.ratingNum}>{product.rating}</span>
          <span className={styles.ratingCount}>({product.reviews})</span>
        </div>

        <div className={styles.divider} />
        <div className={styles.pod}>🚚 Payment on Delivery</div>
        <div className={styles.divider} />

        <div className={styles.bottom}>
          <div className={styles.priceWrap}>
            <div className={styles.price}>₦{product.price.toLocaleString()}</div>
            <div className={styles.original}>₦{product.originalPrice.toLocaleString()}</div>
          </div>
          <div className={styles.cta}>View Details →</div>
        </div>
      </div>
    </Link>
  );
}
