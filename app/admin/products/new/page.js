import ProductForm from "@/app/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Add Product | Admin" };

export default function NewProductPage() {
  return <ProductForm isEdit={false} />;
}