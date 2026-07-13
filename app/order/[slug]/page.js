import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrderForm from "../OrderForm";
import styles from "../page.module.css";
import { STORE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getFormBySlug(slug) {
  const sb = await createClient();
  const { data } = await sb.from("settings").select("*").eq("slug", slug).single();
  return data || null;
}

export async function generateMetadata({ params }) {
  const form = await getFormBySlug(params.slug);
  if (!form) return { title:"Order | " + STORE_NAME };
  return { title:`Order ${form.product_name || form.form_name} | ${STORE_NAME}` };
}

export default async function SlugOrderPage({ params }) {
  const form = await getFormBySlug(params.slug);
  if (!form) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        
      <OrderForm
  settings={form}
  slug={params.slug}
  variant="page"
  redirectTo={form?.redirect_url }
/>
      </div>
    </div>
  );
}