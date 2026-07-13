import { createClient } from "@/lib/supabase/server";
import OrderForm from "../OrderForm";

export const dynamic = "force-dynamic";

async function getSettings() {
  try {
    const sb = await createClient();

    const { data } = await sb
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();

    return data ?? null;
  } catch {
    return null;
  }
}

export default async function EmbedPage() {
  const settings = await getSettings();

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: "transparent",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    ><OrderForm
  settings={form}
  slug={params.slug}
  variant="page"
  redirectTo={form?.redirect_url }
/>
    </div>
  );
}