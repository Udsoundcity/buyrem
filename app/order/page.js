import { createClient } from "@/lib/supabase/server";
import OrderForm from "./OrderForm";
import styles from "./page.module.css";
import { STORE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Order Now | ${STORE_NAME}`,
  description: "Place your order — pay cash on delivery.",
};

async function getSettings() {
  try {
    const sb = await createClient();
    const { data } = await sb
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();
    return data || null;
  } catch { return null; }
}

export default async function OrderPage() {
  const settings = await getSettings();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Trust badges */}
        
        <OrderForm
          settings={settings}
          variant="page"
          redirectTo="/order-confirmed"
        />
      </div>
    </div>
  );
}
