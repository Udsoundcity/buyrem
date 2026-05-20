"use client";
import ProductForm from "@/app/components/admin/ProductForm";

export default function EditClient({ product }) {
  return <ProductForm initial={product} isEdit={true} />;
}