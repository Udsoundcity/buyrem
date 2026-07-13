import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsForm from "@/app/form/SettingsForm";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const store = await cookies();
  if (store.get("admin_token")?.value !== "myshop_admin_ok") redirect("/admin/login");
}

export default async function NewFormPage() {
  await requireAdmin();
  return (
    <div className="admin-wrap">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            <div className="admin-topbar-title">➕ New Order Form</div>
            <div className="admin-topbar-sub">Create a form for a new product</div>
          </div>
        </div>
        <div className="admin-content" style={{ maxWidth:740 }}>
          <SettingsForm initial={null} />
        </div>
      </div>
    </div>
  );
}
