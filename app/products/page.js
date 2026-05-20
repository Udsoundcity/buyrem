import { getAllProducts, CATEGORIES, CAT_EMOJI } from "@/lib/products";
import ProductsClient from "./ProductsClient";

// Always read fresh data — never serve a cached/stale product list
export const dynamic = "force-dynamic";

export default function ProductsPage() {
  // Runs server-side on every request, reads current products.json
  const products = getAllProducts();

  return <ProductsClient products={products} categories={CATEGORIES} catEmoji={CAT_EMOJI} />;
}