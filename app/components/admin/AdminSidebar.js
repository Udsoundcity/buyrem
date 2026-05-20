"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { icon: "📦", label: "Products",     href: "/admin/products" },
  { icon: "➕", label: "Add Product",  href: "/admin/products/new" },
  { icon: "🏪", label: "View Store",   href: "/" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/api/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <div className="admin-logo-title">My<em>Shop</em></div>
        <div className="admin-logo-sub">Admin Panel</div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-label">Menu</div>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`admin-nav-link ${pathname === n.href || (n.href !== "/admin/products" && pathname.startsWith(n.href)) ? "active" : ""}`}
          >
            <span className="admin-nav-icon">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={logout}>
          🚪 Log Out
        </button>
      </div>
    </aside>
  );
}
