import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrderForm from "../../OrderForm";

export const dynamic = "force-dynamic";

async function getFormBySlug(slug) {
  const sb = await createClient();
  const { data } = await sb.from("settings").select("*").eq("slug", slug).single();
  return data || null;
}

export default async function SlugEmbedPage({ params }) {
  const form = await getFormBySlug(params.slug);
  if (!form) notFound();

  return (
    
      <div
  style={{
    margin: 0,
    padding: 0,
    background: "transparent",
    fontFamily: "'Plus Jakarta Sans',sans-serif",
  }}

  
>
  <OrderForm
    settings={form}
    slug={params.slug}
    variant="page"
    redirectTo={form?.redirect_url }
  />
</div>
  );
}