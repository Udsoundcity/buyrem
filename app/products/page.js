import { getAllProducts, CATEGORIES, CAT_EMOJI } from "@/lib/products";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getAllProducts();
  return <ProductsClient products={products} categories={CATEGORIES} catEmoji={CAT_EMOJI} />;
}