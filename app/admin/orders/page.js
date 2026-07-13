"use client";
import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

const STATUSES = ["Submitted","Reviewed","Postponed","Delivered"];

const STATUS_STYLE = {
  Submitted: { bg:"rgba(99,102,241,0.2)",  color:"#A5B4FC", border:"rgba(99,102,241,0.4)"  },
  Reviewed:  { bg:"rgba(245,158,11,0.2)",  color:"#FCD34D", border:"rgba(245,158,11,0.4)"  },
  Postponed: { bg:"rgba(249,115,22,0.2)",  color:"#FCA5A5", border:"rgba(249,115,22,0.4)"  },
  Delivered: { bg:"rgba(34,197,94,0.2)",   color:"#4ADE80", border:"rgba(34,197,94,0.4)"   },
};

const NG_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

function fmtDate(iso) {
  return new Date(iso).toLocaleString("en-NG",{
    day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",
  });
}
function fmtPrice(n) { return n ? `₦${Number(n).toLocaleString()}` : "—"; }

function exportCSV(orders) {
  const h = ["Name","Phone","Address","State","Product","Price","Status","Form","Date"];
  const r = orders.map(o=>[
    `"${o.full_name}"`, o.phone,
    `"${(o.address||"").replace(/"/g,'""')}"`,
    o.state, o.product_name||"", o.price||"",
    o.status||"Submitted", o.form_name||"",
    fmtDate(o.created_at),
  ]);
  const blob = new Blob([[h,...r].map(x=>x.join(",")).join("\n")],{type:"text/csv"});
  const a    = Object.assign(document.createElement("a"),{
    href: URL.createObjectURL(blob),
    download:`orders-${new Date().toISOString().slice(0,10)}.csv`,
  });
  a.click(); URL.revokeObjectURL(a.href);
}

function StatusSelect({ orderId, current, onChange }) {
  const [busy, setBusy] = useState(false);
  const s = STATUS_STYLE[current] || STATUS_STYLE.Submitted;
  const update = async (val) => {
    if (val===current) return;
    setBusy(true);
    const res = await fetch(`/api/admin/orders/${orderId}`,{
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({status:val}),
    });
    if (res.ok) onChange(orderId, val);
    setBusy(false);
  };
  return (
    <select
      value={current||"Submitted"}
      onChange={e=>update(e.target.value)}
      disabled={busy}
      style={{
        padding:"5px 24px 5px 10px",
        borderRadius:8,
        border:`1.5px solid ${s.border}`,
        background:s.bg,
        color:s.color,
        fontSize:12,
        fontWeight:700,
        cursor:"pointer",
        outline:"none",
        appearance:"none",
        WebkitAppearance:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='${encodeURIComponent(s.color)}' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat",
        backgroundPosition:"right 7px center",
        opacity:busy?0.6:1,
        fontFamily:"inherit",
        whiteSpace:"nowrap",
      }}
    >
      {STATUSES.map(st=><option key={st} value={st} style={{background:"#1E293B",color:"#E2E8F0"}}>{st}</option>)}
    </select>
  );
}

function OrderModal({ order, onClose, onStatusChange }) {
  if (!order) return null;
  const rows = [
    ["Full Name",  order.full_name],
    ["Phone",      order.phone],
    ["Address",    order.address],
    ["State",      order.state],
    ["Product",    order.product_name||"—"],
    ["Price",      fmtPrice(order.price)],
    ["Form",       order.form_name||"—"],
    ["Ordered At", fmtDate(order.created_at)],
    ["Order ID",   order.id],
  ];
  return (
    <div
      onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:500,
        display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
    >
      <div style={{background:"#1E293B",border:"1px solid #334155",borderRadius:18,
        padding:28,maxWidth:480,width:"100%",maxHeight:"88vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontSize:16,fontWeight:700,color:"#F1F5F9"}}>📦 Order Details</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#94A3B8",fontSize:24,cursor:"pointer",lineHeight:1}}>✕</button>
        </div>
        {/* Status in modal */}
        <div style={{marginBottom:18,padding:"12px 16px",background:"#0F172A",borderRadius:10,border:"1px solid #334155"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#64748B",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>
            Update Status
          </div>
          <StatusSelect
            orderId={order.id}
            current={order.status||"Submitted"}
            onChange={(id,s)=>{onStatusChange(id,s); order.status=s;}}
          />
        </div>
        {rows.map(([k,v])=>(
          <div key={k} style={{display:"grid",gridTemplateColumns:"110px 1fr",
            borderBottom:"1px solid rgba(51,65,85,0.6)",padding:"9px 0"}}>
            <span style={{fontSize:11,fontWeight:700,color:"#64748B",
              textTransform:"uppercase",letterSpacing:"0.5px",paddingRight:12,paddingTop:1}}>
              {k}
            </span>
            <span style={{fontSize:13,color:"#E2E8F0",lineHeight:1.55,wordBreak:"break-word"}}>
              {v}
            </span>
          </div>
        ))}
        <div style={{marginTop:20,display:"flex",justifyContent:"flex-end",gap:10}}>
          <button className="btn-admin-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// Mobile card for a single order
function OrderCard({ o, selected, onToggle, onView, onDelete, onStatusChange }) {
  const s = STATUS_STYLE[o.status||"Submitted"] || STATUS_STYLE.Submitted;
  return (
    <div style={{
      background:"#1E293B",
      border:`1px solid ${selected ? "rgba(99,102,241,0.5)" : "#334155"}`,
      borderRadius:14,
      padding:16,
      display:"flex",
      flexDirection:"column",
      gap:10,
    }}>
      {/* Row 1: checkbox + name + price */}
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
        <input type="checkbox" checked={selected} onChange={onToggle}
          style={{marginTop:3,cursor:"pointer",accentColor:"#6366F1",flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:700,color:"#F1F5F9",marginBottom:2}}>{o.full_name}</div>
          <div style={{fontSize:12,color:"#94A3B8"}}>{o.phone}</div>
        </div>
        <div style={{fontSize:16,fontWeight:700,color:"#E8956D",flexShrink:0}}>
          {fmtPrice(o.price)}
        </div>
      </div>

      {/* Row 2: address + state */}
      <div style={{fontSize:12,color:"#CBD5E1",lineHeight:1.5,paddingLeft:22}}>
        {o.address}
        {o.state && (
          <span style={{marginLeft:8,padding:"2px 8px",borderRadius:100,fontSize:11,fontWeight:700,
            background:"rgba(99,102,241,0.15)",color:"#A5B4FC",border:"1px solid rgba(99,102,241,0.3)"}}>
            {o.state}
          </span>
        )}
      </div>

      {/* Row 3: form name + date */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap",paddingLeft:22}}>
        {o.form_name && <span style={{fontSize:11,color:"#818CF8"}}>📋 {o.form_name}</span>}
        <span style={{fontSize:11,color:"#64748B",marginLeft:"auto"}}>{fmtDate(o.created_at)}</span>
      </div>

      {/* Row 4: status + actions */}
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",paddingLeft:22}}>
        <StatusSelect orderId={o.id} current={o.status||"Submitted"} onChange={onStatusChange}/>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          <button className="btn-admin-edit" onClick={onView} style={{fontSize:12,padding:"7px 14px"}}>
            👁️ View
          </button>
          <button className="btn-admin-delete" onClick={onDelete} style={{fontSize:12,padding:"7px 12px"}}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [stateFilter,  setStateFilter]  = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected,     setSelected]     = useState(new Set());
  const [viewing,      setViewing]      = useState(null);
  const [confirmDel,   setConfirmDel]   = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type="success") => {
    setToast({msg,type}); setTimeout(()=>setToast(null),3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search)       p.set("search",search);
    if (stateFilter)  p.set("state", stateFilter);
    if (statusFilter) p.set("status",statusFilter);
    const res  = await fetch(`/api/admin/orders?${p}`);
    const data = await res.json();
    setOrders(Array.isArray(data)?data:[]);
    setSelected(new Set());
    setLoading(false);
  },[search,stateFilter,statusFilter]);

  useEffect(()=>{const id=setTimeout(load,search?350:0);return()=>clearTimeout(id);},[load]);

  const handleStatusChange = (id, status) =>
    setOrders(prev=>prev.map(o=>o.id===id?{...o,status}:o));

  const toggleOne  = id  => setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleAll  = ()  => setSelected(s=>s.size===orders.length?new Set():new Set(orders.map(o=>o.id)));
  const allChecked = orders.length>0 && selected.size===orders.length;

  const deleteSingle = async id => {
    const res = await fetch(`/api/admin/orders/${id}`,{method:"DELETE"});
    if (res.ok) {
      setOrders(o=>o.filter(x=>x.id!==id));
      setSelected(s=>{const n=new Set(s);n.delete(id);return n;});
      showToast("Order deleted.");
    } else showToast("Failed to delete.","error");
    setConfirmDel(null);
  };

  const bulkDelete = async () => {
    const ids=[...selected];
    const res = await fetch("/api/admin/orders",{method:"DELETE",
      headers:{"Content-Type":"application/json"},body:JSON.stringify({ids})});
    if (res.ok) {
      setOrders(o=>o.filter(x=>!ids.includes(x.id)));
      setSelected(new Set());
      showToast(`${ids.length} order${ids.length>1?"s":""} deleted.`);
    } else showToast("Failed to delete.","error");
    setConfirmDel(null);
  };

  const totalRevenue   = orders.reduce((s,o)=>s+Number(o.price||0),0);
  const deliveredCount = orders.filter(o=>o.status==="Delivered").length;
  const pendingCount   = orders.filter(o=>!o.status||o.status==="Submitted").length;

  return (
    <>
      {/* ── Scoped CSS ─────────────────────────────────────────── */}
      <style>{`
        .aop-wrap { display:flex; min-height:100vh; background:#0F172A; flex-direction:row; }
        .aop-main { flex:1; display:flex; flex-direction:column; min-width:0; background:#0F172A; }
        .aop-topbar {
          background:#1E293B; border-bottom:1px solid #334155;
          padding:14px 20px; display:flex; align-items:center;
          justify-content:space-between; gap:12px; flex-wrap:wrap;
        }
        .aop-topbar-title { font-size:18px; font-weight:700; color:#F1F5F9; }
        .aop-topbar-sub   { font-size:12px; color:#94A3B8; margin-top:2px; }
        .aop-content      { padding:20px; overflow-x:hidden; }
        .aop-stats {
          display:grid; grid-template-columns:repeat(4,1fr);
          gap:12px; margin-bottom:20px;
        }
        .aop-stat {
          background:#1E293B; border:1px solid #334155;
          border-radius:12px; padding:16px 18px;
        }
        .aop-stat-label { font-size:10px; color:#64748B; margin-bottom:6px;
          text-transform:uppercase; letter-spacing:0.5px; font-weight:700; }
        .aop-stat-num   { font-size:24px; font-weight:700; line-height:1; }
        .aop-filters {
          display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap;
        }
        .aop-input {
          padding:10px 14px; background:#1E293B;
          border:1px solid #334155; border-radius:8px;
          color:#E2E8F0; font-size:13px; outline:none; font-family:inherit;
        }
        .aop-input::placeholder { color:#475569; }
        .aop-input:focus { border-color:#6366F1; }

        /* Table view */
        .aop-table-wrap {
          background:#1E293B; border:1px solid #334155;
          border-radius:14px; overflow:hidden; overflow-x:auto;
        }
        .aop-table { width:100%; border-collapse:collapse; min-width:820px; }
        .aop-table thead tr { background:#0F172A; }
        .aop-table th {
          padding:11px 14px; text-align:left; font-size:10px;
          font-weight:700; letter-spacing:1px; text-transform:uppercase;
          color:#64748B; border-bottom:1px solid #334155; white-space:nowrap;
        }
        .aop-table tbody tr {
          background:#1E293B;
          border-bottom:1px solid rgba(51,65,85,0.6);
          transition:background 0.15s;
        }
        .aop-table tbody tr:hover  { background:#243247; }
        .aop-table tbody tr:last-child { border-bottom:none; }
        .aop-table tbody tr.sel { background:rgba(99,102,241,0.1); }
        .aop-table td { padding:13px 14px; vertical-align:middle; }
        .aop-td-name  { font-weight:700; color:#F1F5F9; font-size:14px; margin-bottom:3px; }
        .aop-td-addr  { font-size:11px; color:#94A3B8; margin-top:2px; }
        .aop-td-form  { font-size:11px; color:#818CF8; margin-top:2px; }
        .aop-td-phone { font-size:13px; color:#CBD5E1; }
        .aop-td-price { font-size:14px; font-weight:700; color:#E8956D; }
        .aop-td-date  { font-size:12px; color:#94A3B8; white-space:nowrap; }
        .aop-state-badge {
          display:inline-block; padding:3px 10px; border-radius:100px;
          font-size:11px; font-weight:700;
          background:rgba(99,102,241,0.15); color:#A5B4FC;
          border:1px solid rgba(99,102,241,0.3); white-space:nowrap;
        }
        .aop-actions { display:flex; gap:6px; justify-content:flex-end; }

        /* Cards (mobile) */
        .aop-cards { display:none; flex-direction:column; gap:12px; }
        .aop-empty { padding:72px 20px; text-align:center; color:#94A3B8; font-size:14px; }

        /* Confirm/delete overlay — self-contained so it works without admin.css */
        .aop-overlay {
          position:fixed; inset:0; z-index:9999;
          background:rgba(0,0,0,0.75);
          display:flex; align-items:center; justify-content:center; padding:20px;
        }
        .aop-confirm {
          background:#1E293B; border:1px solid #334155; border-radius:18px;
          padding:32px 28px; max-width:360px; width:100%; text-align:center;
        }
        .aop-confirm-icon  { font-size:42px; margin-bottom:14px; }
        .aop-confirm-title { font-size:17px; font-weight:700; color:#F1F5F9; margin-bottom:8px; }
        .aop-confirm-sub   { font-size:13px; color:#94A3B8; margin-bottom:24px; line-height:1.6; }
        .aop-confirm-btns  { display:flex; gap:10px; justify-content:center; }
        .aop-btn-cancel {
          padding:10px 22px; border-radius:8px; background:none;
          border:1px solid #334155; color:#94A3B8; font-size:13px;
          font-weight:600; cursor:pointer; font-family:inherit;
        }
        .aop-btn-del {
          padding:10px 22px; border-radius:8px;
          background:rgba(239,68,68,.15); border:1px solid rgba(239,68,68,.3);
          color:#FCA5A5; font-size:13px; font-weight:700;
          cursor:pointer; font-family:inherit;
        }

        @media (max-width: 768px) {
          /* Stack sidebar topbar above content */
          .aop-wrap   { flex-direction:column; }
          .aop-stats  { grid-template-columns:1fr 1fr; }
          .aop-table-wrap { display:none; }
          .aop-cards  { display:flex; }
          .aop-topbar { padding:12px 14px; }
          .aop-content{ padding:14px; }
        }
        @media (max-width: 480px) {
          .aop-stats  { gap:8px; }
          .aop-stat   { padding:12px 14px; }
          .aop-stat-num { font-size:20px; }
        }
      `}</style>

      <div className="aop-wrap">
        <AdminSidebar />
        <div className="aop-main">

          {/* Topbar */}
          <div className="aop-topbar">
            <div>
              <div className="aop-topbar-title">📦 Orders</div>
              <div className="aop-topbar-sub">
                {loading ? "Loading…" : `${orders.length} order${orders.length!==1?"s":""}`}
              </div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {selected.size>0 && (
                <button className="btn-admin-delete" style={{padding:"9px 16px"}}
                  onClick={()=>setConfirmDel("bulk")}>
                  🗑️ Delete {selected.size}
                </button>
              )}
              <button className="btn-admin-ghost" onClick={()=>exportCSV(orders)}>⬇️ CSV</button>
              <button className="btn-admin-ghost" onClick={load}>🔄</button>
            </div>
          </div>

          <div className="aop-content">

            {/* Stats */}
            <div className="aop-stats">
              {[
                {label:"Total Orders", value:orders.length,                       color:"#818CF8"},
                {label:"Pending",      value:pendingCount,                        color:"#FCD34D"},
                {label:"Delivered",    value:deliveredCount,                      color:"#4ADE80"},
                {label:"Est. Revenue", value:`₦${totalRevenue.toLocaleString()}`, color:"#E8956D"},
              ].map((s,i)=>(
                <div key={i} className="aop-stat">
                  <div className="aop-stat-label">{s.label}</div>
                  <div className="aop-stat-num" style={{color:s.color}}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="aop-filters">
              <input className="aop-input" style={{flex:2,minWidth:140}}
                placeholder="🔍 Name or phone…"
                value={search} onChange={e=>setSearch(e.target.value)}/>
              <select className="aop-input" style={{flex:1,minWidth:120,cursor:"pointer"}}
                value={stateFilter} onChange={e=>setStateFilter(e.target.value)}>
                <option value="">All States</option>
                {NG_STATES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <select className="aop-input" style={{flex:1,minWidth:130,cursor:"pointer"}}
                value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="aop-empty">Loading orders…</div>
            ) : orders.length===0 ? (
              <div className="aop-empty">
                <div style={{fontSize:40,marginBottom:12}}>📭</div>
                {search||stateFilter||statusFilter ? "No orders match your filters." : "No orders yet."}
              </div>
            ) : (<>

              {/* ── DESKTOP TABLE ── */}
              <div className="aop-table-wrap">
                <table className="aop-table">
                  <thead>
                    <tr>
                      <th style={{width:38}}>
                        <input type="checkbox" checked={allChecked} onChange={toggleAll}
                          style={{cursor:"pointer",accentColor:"#6366F1"}}/>
                      </th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>State</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th style={{textAlign:"right"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o=>(
                      <tr key={o.id} className={selected.has(o.id)?"sel":""}>
                        <td>
                          <input type="checkbox" checked={selected.has(o.id)} onChange={()=>toggleOne(o.id)}
                            style={{cursor:"pointer",accentColor:"#6366F1"}}/>
                        </td>
                        <td>
                          <div className="aop-td-name">{o.full_name}</div>
                          <div className="aop-td-addr">
                            {(o.address||"").slice(0,32)}{(o.address||"").length>32?"…":""}
                          </div>
                          {o.form_name&&<div className="aop-td-form">📋 {o.form_name}</div>}
                        </td>
                        <td><span className="aop-td-phone">{o.phone}</span></td>
                        <td><span className="aop-state-badge">{o.state}</span></td>
                        <td><span className="aop-td-price">{fmtPrice(o.price)}</span></td>
                        <td>
                          <StatusSelect orderId={o.id} current={o.status||"Submitted"}
                            onChange={handleStatusChange}/>
                        </td>
                        <td><span className="aop-td-date">{fmtDate(o.created_at)}</span></td>
                        <td>
                          <div className="aop-actions">
                            <button className="btn-admin-edit" onClick={()=>setViewing(o)}
                              style={{fontSize:12,padding:"6px 12px"}}>
                              👁️ View
                            </button>
                            <button className="btn-admin-delete" onClick={()=>setConfirmDel(o.id)}
                              style={{fontSize:12,padding:"6px 10px"}}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── MOBILE CARDS ── */}
              <div className="aop-cards">
                {orders.map(o=>(
                  <OrderCard
                    key={o.id} o={o}
                    selected={selected.has(o.id)}
                    onToggle={()=>toggleOne(o.id)}
                    onView={()=>setViewing(o)}
                    onDelete={()=>setConfirmDel(o.id)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </>)}
          </div>
        </div>
      </div>

      {viewing&&(
        <OrderModal order={viewing} onClose={()=>setViewing(null)} onStatusChange={handleStatusChange}/>
      )}

      {confirmDel&&(
        <div className="aop-overlay">
          <div className="aop-confirm">
            <div className="aop-confirm-icon">🗑️</div>
            <div className="aop-confirm-title">
              {confirmDel==="bulk"
                ? `Delete ${selected.size} order${selected.size>1?"s":""}?`
                : "Delete this order?"}
            </div>
            <p className="aop-confirm-sub">This cannot be undone.</p>
            <div className="aop-confirm-btns">
              <button className="aop-btn-cancel" onClick={()=>setConfirmDel(null)}>Cancel</button>
              <button className="aop-btn-del"
                onClick={()=>confirmDel==="bulk"?bulkDelete():deleteSingle(confirmDel)}>
                Yes, Delete
              </button>
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