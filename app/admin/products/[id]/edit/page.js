
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import EditClient from "./EditClient";

export async function generateMetadata({ params }) {
  const p = getProduct(params.id);
  return { title: p ? `Edit: ${p.name} | Admin` : "Not Found" };
}

export default function EditProductPage({ params }) {
  const product = getProduct(params.id);
  if (!product) notFound();
  return <EditClient product={product} />;
}