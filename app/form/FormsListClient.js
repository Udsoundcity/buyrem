"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export default function FormsListClient() {
  const router = useRouter();
  const [forms,      setForms]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [confirmDel, setConfirmDel] = useState(null);
  const [expanded,   setExpanded]   = useState({}); // { [formId]: boolean }
  const [copied,     setCopied]     = useState("");
  const [toast,      setToast]      = useState(null);

  const showToast = (msg, type="success") => {
    setToast({msg,type}); setTimeout(()=>setToast(null),3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/form-settings");
      const data = await res.json();
      setForms(Array.isArray(data)?data:[]);
    } catch { setForms([]); }
    setLoading(false);
  };

  useEffect(()=>{ load(); },[]);

  const copy = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(()=>setCopied(""),2200);
    showToast("Copied to clipboard!");
  };

  const toggleExpand = (id) =>
    setExpanded(e=>({...e,[id]:!e[id]}));

  const confirmDelete = async (id) => {
    const res = await fetch(`/api/admin/form-settings/${id}`,{method:"DELETE"});
    if (res.ok) { setForms(f=>f.filter(x=>x.id!==id)); showToast("Form deleted."); }
    else showToast("Failed to delete.","error");
    setConfirmDel(null);
  };

  const origin = typeof window!=="undefined" ? window.location.origin : "";

  const iframeCode = (slug) =>
`<iframe
  src="${origin}/order/${slug}/embed"
  width="100%"
  height="700"
  frameborder="0"
  style="border:none;border-radius:16px;"
  title="Order Form"
></iframe>`;

  return (
    <>
      <style>{`
        .fml-wrap { display:flex; min-height:100vh; background:#0F172A; }
        .fml-main { flex:1; display:flex; flex-direction:column; min-width:0; background:#0F172A; }
        .fml-topbar {
          background:#1E293B; border-bottom:1px solid #334155;
          padding:14px 20px; display:flex; align-items:center;
          justify-content:space-between; gap:12px; flex-wrap:wrap;
        }
        .fml-topbar-title { font-size:18px; font-weight:700; color:#F1F5F9; }
        .fml-topbar-sub   { font-size:12px; color:#94A3B8; margin-top:2px; }
        .fml-content      { padding:20px; }
        .fml-card {
          background:#1E293B; border:1px solid #334155;
          border-radius:14px; margin-bottom:14px;
          overflow:hidden;
        }
        .fml-card-top {
          padding:18px 20px;
          display:flex; align-items:flex-start;
          justify-content:space-between; gap:16px; flex-wrap:wrap;
        }
        .fml-name    { font-size:15px; font-weight:700; color:#F1F5F9; margin-bottom:5px; }
        .fml-product { font-size:13px; color:#94A3B8; margin-bottom:8px; }
        .fml-slug-badge {
          display:inline-block; font-size:12px; color:#4ADE80;
          background:rgba(74,222,128,0.08); border:1px solid rgba(74,222,128,0.2);
          padding:3px 10px; border-radius:6px; font-family:monospace;
        }
        .fml-tier-pill {
          display:inline-block; margin-left:8px; font-size:11px; font-weight:700;
          color:#818CF8; background:rgba(99,102,241,0.12);
          border:1px solid rgba(99,102,241,0.25);
          padding:2px 9px; border-radius:100px;
        }
        .fml-actions { display:flex; gap:8px; flex-shrink:0; flex-wrap:wrap; align-items:center; }
        .fml-expand-btn {
          width:100%; padding:12px 20px;
          background:#0F172A; border:none; border-top:1px solid #334155;
          color:#818CF8; font-size:13px; font-weight:600;
          cursor:pointer; text-align:left; font-family:inherit;
          display:flex; align-items:center; gap:8px;
          transition:background 0.15s;
        }
        .fml-expand-btn:hover { background:#1a2233; }
        .fml-share-box { padding:20px; background:#0F172A; border-top:1px solid #334155; }
        .fml-share-label {
          font-size:10px; font-weight:700; letter-spacing:1px;
          text-transform:uppercase; color:#64748B; margin-bottom:8px;
        }
        .fml-url-row { display:flex; gap:8px; margin-bottom:6px; }
        .fml-url-input {
          flex:1; padding:9px 12px; background:#1E293B;
          border:1px solid #334155; border-radius:8px;
          color:#4ADE80; font-size:12px; font-family:monospace;
          outline:none; min-width:0;
        }
        .fml-copy-btn {
          padding:9px 16px; border-radius:8px; font-size:12px; font-weight:700;
          cursor:pointer; border:1px solid #334155; background:#1E293B;
          color:#94A3B8; font-family:inherit; white-space:nowrap; flex-shrink:0;
          transition:all 0.18s;
        }
        .fml-copy-btn:hover { border-color:#6366F1; color:#818CF8; }
        .fml-copy-btn.done  { border-color:rgba(34,197,94,0.4); color:#4ADE80; background:rgba(34,197,94,0.08); }
        .fml-embed-box {
          background:#1E293B; border:1px solid #334155;
          border-radius:8px; padding:12px 14px;
          font-family:monospace; font-size:11px;
          color:#4ADE80; line-height:1.7;
          white-space:pre-wrap; word-break:break-all;
          margin-bottom:8px;
        }
        .fml-hint { font-size:11px; color:#64748B; line-height:1.6; margin-top:6px; }
        .fml-divider { height:1px; background:#334155; margin:16px 0; }
        .fml-empty { padding:80px 20px; text-align:center; }
        @media (max-width:600px) {
          .fml-topbar { padding:12px 14px; }
          .fml-content { padding:14px; }
          .fml-card-top { padding:14px 16px; }
          .fml-share-box { padding:16px; }
          .fml-actions { gap:6px; }
        }
      `}</style>

      <div className="fml-wrap">
        <AdminSidebar />
        <div className="fml-main">

          <div className="fml-topbar">
            <div>
              <div className="fml-topbar-title">📝 Order Forms</div>
              <div className="fml-topbar-sub">
                {loading?"Loading…":`${forms.length} form${forms.length!==1?"s":""} — one per product`}
              </div>
            </div>
            <button className="btn-admin-primary"
              onClick={()=>router.push("/admin/form-settings/new")}>
              ➕ New Form
            </button>
          </div>

          <div className="fml-content">
            {loading ? (
              <div style={{padding:64,textAlign:"center",color:"#94A3B8",fontSize:14}}>
                Loading forms…
              </div>

            ) : forms.length===0 ? (
              <div className="fml-empty">
                <div style={{fontSize:48,marginBottom:16}}>📋</div>
                <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,
                  color:"#F1F5F9",marginBottom:8}}>No forms yet</h2>
                <p style={{color:"#94A3B8",marginBottom:28,fontSize:14,lineHeight:1.6}}>
                  Create a separate order form for each product you sell.
                </p>
                <button className="btn-admin-primary"
                  onClick={()=>router.push("/admin/form-settings/new")}
                  style={{padding:"12px 28px",fontSize:14}}>
                  ➕ Create Your First Form
                </button>
              </div>

            ) : (<>
              {forms.map(form=>{
                const pageUrl  = `${origin}/order/${form.slug}`;
                const embedUrl = `${origin}/order/${form.slug}/embed`;
                const isOpen   = expanded[form.id];

                return (
                  <div key={form.id} className="fml-card">

                    {/* Card top row */}
                    <div className="fml-card-top">
                      <div style={{flex:1,minWidth:180}}>
                        <div className="fml-name">
                          {form.form_name}
                          <span className="fml-tier-pill">
                            {form.tiers?.length||0} tier{form.tiers?.length!==1?"s":""}
                          </span>
                        </div>
                        {form.product_name&&(
                          <div className="fml-product">📦 {form.product_name}</div>
                        )}
                        <span className="fml-slug-badge">/order/{form.slug}</span>
                      </div>

                      <div className="fml-actions">
                        <a href={`/order/${form.slug}`} target="_blank" rel="noreferrer"
                          className="btn-admin-ghost"
                          style={{fontSize:12,padding:"8px 14px",textDecoration:"none"}}>
                          👁️ Preview
                        </a>
                        <button className="btn-admin-edit"
                          style={{fontSize:12,padding:"8px 14px"}}
                          onClick={()=>router.push(`/admin/form-settings/${form.id}/edit`)}>
                          ✏️ Edit
                        </button>
                        <button className="btn-admin-delete"
                          style={{fontSize:12,padding:"8px 12px"}}
                          onClick={()=>setConfirmDel(form)}>
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <button className="fml-expand-btn" onClick={()=>toggleExpand(form.id)}>
                      {isOpen?"▲":"▼"} {isOpen?"Hide":"Show"} Share &amp; Embed Links
                    </button>

                    {/* Share & embed panel */}
                    {isOpen&&(
                      <div className="fml-share-box">

                        {/* Direct page URL */}
                        <div className="fml-share-label">🔗 Direct Page Link</div>
                        <div className="fml-url-row">
                          <input className="fml-url-input" readOnly value={pageUrl}
                            onClick={e=>e.target.select()}/>
                          <button
                            className={`fml-copy-btn ${copied===`url-${form.id}`?"done":""}`}
                            onClick={()=>copy(pageUrl,`url-${form.id}`)}>
                            {copied===`url-${form.id}`?"✅ Copied":"📋 Copy"}
                          </button>
                        </div>
                        <p className="fml-hint">
                          Share on WhatsApp, Instagram bio, or link from your product page.
                        </p>

                        <div className="fml-divider"/>

                        {/* iFrame embed */}
                        <div className="fml-share-label">{"</>"}  iFrame Embed Code</div>
                        <div className="fml-embed-box">{iframeCode(form.slug)}</div>
                        <div className="fml-url-row">
                          <button
                            className={`fml-copy-btn ${copied===`embed-${form.id}`?"done":""}`}
                            style={{width:"100%",textAlign:"center"}}
                            onClick={()=>copy(iframeCode(form.slug),`embed-${form.id}`)}>
                            {copied===`embed-${form.id}`?"✅ Embed Code Copied!":"📋 Copy Embed Code"}
                          </button>
                        </div>
                        <p className="fml-hint">
                          Paste this into any webpage to embed the form inline. Customers can
                          submit without leaving the page. After submission they see the
                          thank-you page you configured.
                        </p>

                        <div className="fml-divider"/>

                        {/* Embed URL only */}
                        <div className="fml-share-label">🖼️ Embed URL (for Cognito redirect)</div>
                        <div className="fml-url-row">
                          <input className="fml-url-input" readOnly value={embedUrl}
                            onClick={e=>e.target.select()}/>
                          <button
                            className={`fml-copy-btn ${copied===`eurl-${form.id}`?"done":""}`}
                            onClick={()=>copy(embedUrl,`eurl-${form.id}`)}>
                            {copied===`eurl-${form.id}`?"✅ Copied":"📋 Copy"}
                          </button>
                        </div>
                        <p className="fml-hint">
                          Use this as the embed src value in your own custom iframe, or as the
                          Cognito Forms redirect URL.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bottom create button */}
              <button
                onClick={()=>router.push("/admin/form-settings/new")}
                style={{width:"100%",padding:"14px",border:"2px dashed #334155",
                  borderRadius:14,background:"none",color:"#64748B",fontSize:14,
                  fontWeight:600,cursor:"pointer",fontFamily:"inherit",
                  transition:"all 0.18s"}}
                onMouseOver={e=>{e.currentTarget.style.borderColor="#6366F1";e.currentTarget.style.color="#818CF8";}}
                onMouseOut={e=>{e.currentTarget.style.borderColor="#334155";e.currentTarget.style.color="#64748B";}}>
                ➕ Create Another Form
              </button>
            </>)}
          </div>
        </div>
      </div>

      {confirmDel&&(
        <div className="admin-confirm-overlay">
          <div className="admin-confirm-box">
            <div className="admin-confirm-icon">🗑️</div>
            <div className="admin-confirm-title">Delete &ldquo;{confirmDel.form_name}&rdquo;?</div>
            <p className="admin-confirm-sub">
              Settings will be removed. Existing orders are kept. Cannot be undone.
            </p>
            <div className="admin-confirm-btns">
              <button className="btn-admin-ghost" onClick={()=>setConfirmDel(null)}>Cancel</button>
              <button className="btn-admin-delete" style={{padding:"10px 24px"}}
                onClick={()=>confirmDelete(confirmDel.id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast&&(
        <div className={`admin-toast ${toast.type}`}>
          {toast.type==="success"?"✅":"❌"} {toast.msg}
        </div>
      )}
    </>
  );
}