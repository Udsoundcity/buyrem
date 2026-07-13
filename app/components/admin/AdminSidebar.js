"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CSS from "./Sidebar.css?inline";

const NAV = [
  { icon:"📦", label:"Products",    href:"/admin/products" },
  { icon:"➕", label:"Add Product", href:"/admin/products/new" },
  { icon:"📋", label:"Orders",      href:"/admin/orders" },
  { icon:"📝", label:"Order Forms", href:"/admin/form-settings" },
  { icon:"⚙️", label:"Settings",    href:"/admin/settings" },
  { icon:"🏪", label:"View Store",  href:"/" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method:"POST" });
    router.push("/admin/login");
  };

  const isActive = (href) => {
    if (href === "/admin/products") return pathname === href;
    if (href === "/") return false;
    return pathname.startsWith(href);
  };

  const NavLinks = ({ onNav }) => (
    <>
      <div className="asb-nav-label">Menu</div>
      {NAV.map(n => (
        <Link key={n.href} href={n.href}
          className={`asb-link ${isActive(n.href)?"on":""}`}
          onClick={onNav}>
          <span>{n.icon}</span>{n.label}
        </Link>
      ))}
    </>
  );

  return (
    <>
      

      {/* ── Desktop sidebar (hidden on mobile via CSS) ── */}
      <aside className="asb-desktop">
        <div className="asb-logo">
          <div className="asb-logo-title">My<em>Shop</em></div>
          <div className="asb-logo-sub">Admin Panel</div>
        </div>
        <nav className="asb-nav">
          <NavLinks onNav={()=>{}} />
        </nav>
        <div className="asb-footer">
          <button className="asb-logout" onClick={logout}>🚪 Log Out</button>
        </div>
      </aside>

      {/* ── Mobile top bar (hidden on desktop via CSS) ── */}
      <div className="asb-mobile-bar">
        <div className="asb-mobile-logo">My<em>Shop</em></div>
        <button className="asb-hamburger" onClick={()=>setOpen(true)} aria-label="Open menu">
          <span className="asb-bar"/>
          <span className="asb-bar"/>
          <span className="asb-bar"/>
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="asb-drawer-overlay">
          <div className="asb-drawer-bg" onClick={()=>setOpen(false)}/>
          <div className="asb-drawer">
            <div style={{padding:"18px 18px 14px",borderBottom:"1px solid #334155"}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#fff"}}>
                My<em style={{color:"#818CF8",fontStyle:"italic"}}>Shop</em>
              </div>
              <div style={{fontSize:10,color:"#64748B",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>
                Admin Panel
              </div>
            </div>
            <nav style={{flex:1,padding:"12px 0"}}>
              <NavLinks onNav={()=>setOpen(false)} />
            </nav>
            <div style={{padding:"14px 18px",borderTop:"1px solid #334155"}}>
              <button className="asb-logout" onClick={logout}>🚪 Log Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}