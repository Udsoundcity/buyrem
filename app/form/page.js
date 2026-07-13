import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormsListClient from "./FormsListClient";

export const dynamic = "force-dynamic";

export default async function FormPage() {
  // /form is outside /admin so middleware doesn't cover it — check here
  const store = await cookies();
  if (store.get("admin_token")?.value !== "myshop_admin_ok") {
    redirect("/admin/login");
  }
  return <FormsListClient />;
}