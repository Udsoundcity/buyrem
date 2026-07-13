"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export default function FormSettingsListPage() {
  const router = useRouter();
  const [forms,   setForms]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/form-settings");
    const data = await res.json();
    setForms(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const confirmDelete = async (id) => {
    const res = await fetch(`/api/admin/form-settings/${id}`, { method:"DELETE" });
    if (res.ok) {
      showToast("Form deleted.");
      setForms(f => f.filter(x => x.id !== id));
    } else {
      showToast("Failed to delete.", "error");
    }
    setDeleting(null);
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="admin-wrap">
      <AdminSidebar />
      <div className="admin-main">

        <div className="admin-topbar">
          <div>
            <div className="admin-topbar-title">📝 Order Forms</div>
            <div className="admin-topbar-sub">
              {loading ? "Loading…" : `${forms.length} form${forms.length !== 1 ? "s" : ""}`}
            </div>
          </div>
          <button
            className="btn-admin-primary"
            onClick={() => router.push("/admin/form-settings/new")}
          >
            ➕ New Form
          </button>
        </div>

        <div className="admin-content">

          {loading ? (
            <div style={{ padding:64, textAlign:"center", color:"#94A3B8" }}>
              Loading forms…
            </div>
          ) : forms.length === 0 ? (
            <div style={{ padding:80, textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
              <h2 style={{ color:"#fff", marginBottom:8, fontFamily:"'DM Serif Display',serif" }}>
                No forms yet
              </h2>
              <p style={{ color:"#94A3B8", marginBottom:24 }}>
                Create a separate form for each product you sell.
              </p>
              <button
                className="btn-admin-primary"
                onClick={() => router.push("/admin/form-settings/new")}
              >
                ➕ Create Your First Form
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {forms.map(form => (
                <div key={form.id} className="admin-form-card"
                  style={{ display:"flex", alignItems:"flex-start",
                    justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <span style={{ fontSize:15, fontWeight:700, color:"#fff" }}>
                        {form.form_name}
                      </span>
                      <span style={{ fontSize:11, fontWeight:600, color:"#818CF8",
                        background:"rgba(99,102,241,.12)", padding:"2px 9px",
                        borderRadius:100 }}>
                        {form.tiers?.length || 0} tier{form.tiers?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {form.product_name && (
                      <div style={{ fontSize:13, color:"#94A3B8", marginBottom:6 }}>
                        📦 {form.product_name}
                      </div>
                    )}
                    {/* Customer URL */}
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <code style={{ fontSize:12, color:"#4ADE80",
                        background:"rgba(74,222,128,.08)",
                        padding:"3px 10px", borderRadius:6 }}>
                        /order/{form.slug}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${origin}/order/${form.slug}`);
                          showToast("Link copied!");
                        }}
                        style={{ fontSize:11, color:"#94A3B8", background:"none",
                          border:"1px solid #334155", borderRadius:6,
                          padding:"3px 10px", cursor:"pointer", fontFamily:"inherit" }}
                      >
                        📋 Copy Link
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                    <a
                      href={`/order/${form.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-admin-ghost"
                      style={{ fontSize:12 }}
                    >
                      👁️ Preview
                    </a>
                    <button
                      className="btn-admin-edit"
                      onClick={() => router.push(`/admin/form-settings/${form.id}/edit`)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-admin-delete"
                      onClick={() => setDeleting(form)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleting && (
        <div className="admin-confirm-overlay">
          <div className="admin-confirm-box">
            <div className="admin-confirm-icon">🗑️</div>
            <div className="admin-confirm-title">Delete "{deleting.form_name}"?</div>
            <p className="admin-confirm-sub">
              This deletes the form and its settings. Existing orders are kept.
              This cannot be undone.
            </p>
            <div className="admin-confirm-btns">
              <button className="btn-admin-ghost" onClick={() => setDeleting(null)}>
                Cancel
              </button>
              <button
                className="btn-admin-delete"
                style={{ padding:"10px 24px" }}
                onClick={() => confirmDelete(deleting.id)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}
