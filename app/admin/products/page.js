"use client";
export const dynamic = "force-dynamic"; // this page should always be rendered on the server, not cached
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

const CAT_CLASS = { Beauty: "admin-badge-beauty", Electronics: "admin-badge-electronics", Health: "admin-badge-health" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null); // id to confirm delete
  const [toast,    setToast]    = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    const res = await fetch(`/api/products/${deleting}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Product deleted successfully.");
      setProducts(p => p.filter(x => x.id !== deleting));
    } else {
      showToast("Failed to delete product.", "error");
    }
    setDeleting(null);
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.price * (p.purchases || 0), 0);

  return (
    <div className="admin-wrap">
      <AdminSidebar />

      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div>
            <div className="admin-topbar-title">📦 Products</div>
            <div className="admin-topbar-sub">Manage your store catalogue</div>
          </div>
          <Link href="/admin/products/new" className="btn-admin-primary">
            ➕ Add New Product
          </Link>
        </div>

        <div className="admin-content">
          {/* Stats */}
          <div className="admin-stats-grid">
            {[
              { label: "Total Products",  val: products.length,                           sub: "In catalogue" },
              { label: "Total Sales",     val: products.reduce((s,p) => s+(p.purchases||0),0).toLocaleString(), sub: "Units sold" },
              { label: "Avg Rating",      val: products.length ? (products.reduce((s,p) => s+p.rating,0)/products.length).toFixed(1)+"⭐" : "—", sub: "Across all products" },
              { label: "Est. Revenue",    val: "₦"+totalRevenue.toLocaleString(),          sub: "Based on sales" },
            ].map((s, i) => (
              <div key={i} className="admin-stat-card">
                <div className="admin-stat-label">{s.label}</div>
                <div className="admin-stat-num">{s.val}</div>
                <div className="admin-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <div className="admin-table-title">All Products ({products.length})</div>
              <Link href="/admin/products/new" className="btn-admin-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
                ➕ Add Product
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: 48, textAlign: "center", color: "#94A3B8" }}>Loading products…</div>
            ) : products.length === 0 ? (
              <div style={{ padding: 64, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <p style={{ color: "#94A3B8", marginBottom: 20 }}>No products yet. Add your first one!</p>
                <Link href="/admin/products/new" className="btn-admin-primary">➕ Add Product</Link>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Original</th>
                    <th>Sales</th>
                    <th>Rating</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {p.thumbnail ? (
                           <img
  src={p.thumbnail}
  alt={p.name}
  className="admin-product-img"
  width={48}
  height={48}
  style={{ flexShrink: 0 }}
/>
                          ) : (
                            <div className="admin-product-img" style={{ background: p.bg || "#334155", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🖼️</div>
                          )}
                          <div>
                            <div className="admin-product-name">{p.name}</div>
                            <div className="admin-product-cat">/{p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${CAT_CLASS[p.cat] || ""}`}>{p.cat}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: "#E8956D" }}>₦{p.price?.toLocaleString()}</td>
                      <td style={{ color: "#94A3B8", textDecoration: "line-through" }}>₦{p.originalPrice?.toLocaleString()}</td>
                      <td style={{ color: "#4ADE80" }}>{(p.purchases || 0).toLocaleString()}</td>
                      <td>⭐ {p.rating}</td>
                      <td>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <Link href={`/admin/products/${p.id}/edit`} className="btn-admin-edit">✏️ Edit</Link>
                          <button className="btn-admin-delete" onClick={() => setDeleting(p.id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirm dialog */}
      {deleting && (
        <div className="admin-confirm-overlay">
          <div className="admin-confirm-box">
            <div className="admin-confirm-icon">🗑️</div>
            <div className="admin-confirm-title">Delete Product?</div>
            <p className="admin-confirm-sub">
              This will permanently remove <strong style={{ color:"#fff" }}>{products.find(p=>p.id===deleting)?.name}</strong> from your store. This cannot be undone.
            </p>
            <div className="admin-confirm-btns">
              <button className="btn-admin-ghost" onClick={() => setDeleting(null)}>Cancel</button>
              <button className="btn-admin-delete" style={{ padding: "10px 24px" }} onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}
