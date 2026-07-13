import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import SettingsForm from "@/app/form/SettingsForm";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const store = await cookies();
  if (store.get("admin_token")?.value !== "myshop_admin_ok") redirect("/admin/login");
}

async function getForm(id) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { global: { fetch: (url, o={}) => fetch(url, { ...o, cache:"no-store" }) } }
  );
  const { data } = await sb.from("settings").select("*").eq("id", id).single();
  return data;
}

export default async function EditFormPage({ params }) {
  await requireAdmin();
  const form = await getForm(params.id);
  if (!form) redirect("/admin/form-settings");

  return (
    <div className="admin-wrap">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            <div className="admin-topbar-title">✏️ Edit Form</div>
            <div className="admin-topbar-sub">{form.form_name}</div>
          </div>
        </div>
        <div className="admin-content" style={{ maxWidth:740 }}>
          <SettingsForm initial={form} />
        </div>
      </div>
    </div>
  );
}
