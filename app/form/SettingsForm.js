"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const DISPLAY_STYLES = [
  { value:"bullet",   label:"🔘 Radio Bullets" },
  { value:"checkbox", label:"☑️  Checkboxes"   },
  { value:"dropdown", label:"📋 Dropdown"      },
];

function slugify(str) {
  return str.trim().toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function emptyTier() { return { id: crypto.randomUUID(), label:"", price:"" }; }

export default function SettingsForm({ initial = null }) {
  const router  = useRouter();
  const isEdit  = Boolean(initial?.id);

  const [formName,     setFormName]     = useState(initial?.form_name    || "");
  const [slug,         setSlug]         = useState(initial?.slug         || "");
  const [slugManual,   setSlugManual]   = useState(isEdit);
  const [productName,  setProductName]  = useState(initial?.product_name || "");
  const [promoMsg,     setPromoMsg]     = useState(initial?.promo_message || "");
  const [redirectUrl,  setRedirectUrl]  = useState(initial?.redirect_url  || "");
  const [displayStyle, setDisplayStyle] = useState(initial?.display_style || "bullet");
  const [tiers,        setTiers]        = useState(
    initial?.tiers?.length ? initial.tiers : [emptyTier()]
  );
  const [fieldConfig, setFieldConfig] = useState(
    initial?.field_config || { full_name:true, phone:true, address:true, state:true }
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast,  setToast]  = useState(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleFormNameChange = (val) => {
    setFormName(val);
    if (!slugManual) setSlug(slugify(val));
  };

  const updateTier   = (i, k, v) => setTiers(ts => ts.map((t, idx) => idx === i ? { ...t, [k]: v } : t));
  const addTier      = ()         => setTiers(ts => [...ts, emptyTier()]);
  const removeTier   = (i)        => setTiers(ts => ts.filter((_, idx) => idx !== i));
  const toggleField  = (k)        => setFieldConfig(f => ({ ...f, [k]: !f[k] }));

  const validate = () => {
    const e = {};
    if (!formName.trim())    e.formName    = "Form name is required.";
    if (!slug.trim())        e.slug        = "Slug is required.";
    if (!productName.trim()) e.productName = "Product name is required.";
    const valid = tiers.filter(t => t.label.trim() && Number(t.price) > 0);
    if (!valid.length)       e.tiers       = "Add at least one tier with a label and price.";
    return e;
  };

  const save = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);

    const validTiers = tiers
      .filter(t => t.label.trim() && Number(t.price) > 0)
      .map(t => ({ ...t, price: Number(t.price) }));

    const payload = {
      form_name: formName.trim(), slug: slugify(slug),
      product_name: productName.trim(), promo_message: promoMsg.trim(),
      redirect_url: redirectUrl.trim(),
      display_style: displayStyle, tiers: validTiers, field_config: fieldConfig,
    };

    try {
      const url    = isEdit ? `/api/admin/form-settings/${initial.id}` : "/api/admin/form-settings";
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      const data   = await res.json();

      if (res.ok) {
        showToast(isEdit ? "Form updated!" : "Form created!");
        setTimeout(() => router.push("/admin/form-settings"), 1200);
      } else {
        setErrors({ server: data.error || "Failed to save." });
        showToast(data.error || "Failed to save.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    } finally {
      setSaving(false);
    }
  };

 const [origin, setOrigin] = useState("");

useEffect(() => {
  setOrigin(window.location.origin);
}, []);

  return (
    <>
      <div className="admin-form-card">
        <div className="admin-form-card-title">🏷️ Form Identity</div>
        <p className="admin-input-hint" style={{marginBottom:16}}>Each product gets its own unique URL.</p>

        <div className="admin-field">
          <label className="admin-label">Form Name <span className="admin-req">*</span></label>
          <input className={`admin-input${errors.formName?" error":""}`} value={formName}
            onChange={e => handleFormNameChange(e.target.value)} placeholder="e.g. Vitamin C Serum Form"/>
          {errors.formName && <p className="admin-input-hint" style={{color:"#FCA5A5"}}>{errors.formName}</p>}
          <p className="admin-input-hint">Used in admin only — customers don't see this.</p>
        </div>

        <div className="admin-field">
          <label className="admin-label">URL Slug <span className="admin-req">*</span></label>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:13,color:"#94A3B8",whiteSpace:"nowrap",flexShrink:0}}>/order/</span>
            <input className={`admin-input${errors.slug?" error":""}`} value={slug}
              onChange={e => { setSlugManual(true); setSlug(e.target.value); }}
              placeholder="vitamin-c-serum" style={{fontFamily:"monospace"}}/>
          </div>
          {errors.slug && <p className="admin-input-hint" style={{color:"#FCA5A5"}}>{errors.slug}</p>}
          {slug && <p className="admin-input-hint" style={{color:"#4ADE80"}}>✓ {origin}/order/{slugify(slug)}</p>}
        </div>
      </div>

      <div className="admin-form-card">
        <div className="admin-form-card-title">📦 Product Information</div>
        <p className="admin-input-hint" style={{marginBottom:16}}>Attached to every order automatically — not editable by customers.</p>

        <div className="admin-field">
          <label className="admin-label">Product Name <span className="admin-req">*</span></label>
          <input className={`admin-input${errors.productName?" error":""}`} value={productName}
            onChange={e => setProductName(e.target.value)} placeholder="e.g. Vitamin C Glow Serum"/>
          {errors.productName && <p className="admin-input-hint" style={{color:"#FCA5A5"}}>{errors.productName}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-label">Promo Message <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:"var(--a-muted)"}}>(optional)</span></label>
          <input className="admin-input" value={promoMsg} onChange={e => setPromoMsg(e.target.value)}
            placeholder="🎉 Buy 2 Get 1 FREE — Limited Time!"/>
          <p className="admin-input-hint">Shown as a green banner at top of form.</p>
        </div>

        <div className="admin-field">
          <label className="admin-label">
            Thank You Page URL{" "}
            <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, color:"var(--a-muted)" }}>
              (optional)
            </span>
          </label>
          <input
            className="admin-input"
            value={redirectUrl}
            onChange={e => setRedirectUrl(e.target.value)}
            placeholder="https://yoursite.com/order-confirmed  or  /order-confirmed"
            type="url"
          />
          <p className="admin-input-hint">
            Where customers land after a successful submission — works for both standalone and embedded forms.
            Leave blank to use the default <code style={{ color:"#818CF8" }}>/order-confirmed</code> page.
          </p>
          {redirectUrl && (
            <div style={{ marginTop:8, padding:"9px 14px",
              background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)",
              borderRadius:8, fontSize:13, color:"#818CF8" }}>
              ✓ After submission, customers will be sent to: <strong>{redirectUrl}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="admin-form-card">
        <div className="admin-form-card-title">💰 Quantity Tiers</div>
        {errors.tiers && <p style={{color:"#FCA5A5",fontSize:13,marginBottom:12}}>⚠️ {errors.tiers}</p>}

        <div className="admin-field">
          <label className="admin-label">Display Style</label>
          <select className="admin-select" value={displayStyle} onChange={e => setDisplayStyle(e.target.value)}>
            {DISPLAY_STYLES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
          {tiers.map((tier, i) => (
            <div key={tier.id} className="admin-array-item">
              <div className="admin-array-item-title">Tier {i + 1}</div>
              <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
                <div className="admin-field" style={{flex:2,margin:0}}>
                  <label className="admin-label">Label</label>
                  <input className="admin-input" value={tier.label}
                    onChange={e => updateTier(i,"label",e.target.value)} placeholder="e.g. 1 Bottle"/>
                </div>
                <div className="admin-field" style={{flex:1,margin:0}}>
                  <label className="admin-label">Price (₦)</label>
                  <input className="admin-input" type="number" value={tier.price}
                    onChange={e => updateTier(i,"price",e.target.value)} placeholder="8500"/>
                </div>
                {tiers.length > 1 && (
                  <button onClick={() => removeTier(i)}
                    style={{padding:"10px 12px",borderRadius:8,flexShrink:0,
                      background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",
                      color:"#FCA5A5",cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="btn-admin-ghost" style={{width:"100%",justifyContent:"center",marginTop:12}} onClick={addTier}>
          + Add Tier
        </button>
      </div>

      <div className="admin-form-card">
        <div className="admin-form-card-title">📝 Required Fields</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[["full_name","Full Name"],["phone","Phone Number"],["address","Address"],["state","State"]].map(([k,label]) => (
            <label key={k} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <button type="button" onClick={() => toggleField(k)}
                style={{width:44,height:24,borderRadius:100,border:"none",cursor:"pointer",
                  background:fieldConfig[k]?"#22C55E":"#334155",position:"relative",transition:"background .2s",flexShrink:0}}>
                <span style={{position:"absolute",top:3,width:18,height:18,borderRadius:"50%",
                  background:"white",transition:"left .2s",display:"block",left:fieldConfig[k]?23:3}}/>
              </button>
              <span style={{fontSize:14,fontWeight:600,color:"var(--a-text)"}}>
                {label} <span style={{color:fieldConfig[k]?"#4ADE80":"#64748B",fontSize:12}}>({fieldConfig[k]?"required":"optional"})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {errors.server && (
        <div style={{padding:"12px 16px",background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",
          borderRadius:10,fontSize:13,color:"#FCA5A5",marginBottom:8}}>⚠️ {errors.server}</div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,paddingTop:20,borderTop:"1px solid #334155"}}>
        <button className="btn-admin-ghost" onClick={() => router.push("/admin/form-settings")}>← Cancel</button>
        <button className="btn-admin-primary" onClick={save} disabled={saving} style={{padding:"12px 32px"}}>
          {saving ? "Saving…" : isEdit ? "💾 Save Changes" : "✅ Create Form"}
        </button>
      </div>

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.type==="success"?"✅":"❌"} {toast.msg}</div>}
    </>
  );
}