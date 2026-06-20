"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export default function AdminSettings() {
  const [pixel,   setPixel]   = useState("");
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { setPixel(d.metaPixel || ""); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ metaPixel: pixel }),
      });
      const d = await res.json();
      setSaving(false);
      if (res.ok) showToast("Settings saved!");
      else showToast(d.error || "Failed to save.", "error");
    } catch {
      setSaving(false);
      showToast("Network error.", "error");
    }
  };

  return (
    <div className="admin-wrap">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            <div className="admin-topbar-title">⚙️ Site Settings</div>
            <div className="admin-topbar-sub">Meta Pixel, tracking, and global configuration</div>
          </div>
          <button className="btn-admin-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "💾 Save Settings"}
          </button>
        </div>

        <div className="admin-content" style={{ maxWidth:800 }}>

          {/* Meta Pixel */}
          <div className="admin-form-card">
            <div className="admin-form-card-title">📊 Meta Pixel (Facebook Ads)</div>
            <p className="admin-input-hint" style={{ marginBottom:16, lineHeight:1.7 }}>
              Paste your complete Meta Pixel base code below. It will be automatically injected
              into the <code style={{ color:"#818CF8" }}>&lt;head&gt;</code> of every page on your store.
              Go to <strong>Meta Events Manager → Your Pixel → Setup → Install Code Manually</strong> and copy the full script block.
            </p>

            {loading ? (
              <div style={{ padding:24, textAlign:"center", color:"#94A3B8" }}>Loading…</div>
            ) : (
              <>
                <div className="admin-field">
                  <label className="admin-label">Pixel Base Code</label>
                  <textarea
                    className="admin-textarea"
                    style={{ minHeight:200, fontFamily:"monospace", fontSize:12, lineHeight:1.6 }}
                    value={pixel}
                    onChange={e => setPixel(e.target.value)}
                    placeholder={`<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
...
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->`}
                  />
                </div>

                {pixel && (
                  <div style={{ padding:"12px 16px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:10, marginTop:8 }}>
                    <div style={{ fontSize:13, color:"#4ADE80", fontWeight:700, marginBottom:6 }}>
                      ✓ Pixel code detected — will be injected on next deploy
                    </div>
                    <div style={{ fontSize:12, color:"#94A3B8", lineHeight:1.6 }}>
                      • Fires <code style={{ color:"#818CF8" }}>PageView</code> on every page automatically<br/>
                      • Works on all pages including <code style={{ color:"#818CF8" }}>/order-confirmed</code><br/>
                      • To add custom events (AddToCart, Purchase), contact your developer
                    </div>
                  </div>
                )}

                {!pixel && (
                  <div style={{ padding:"12px 16px", background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:10, marginTop:8 }}>
                    <div style={{ fontSize:12, color:"#FCD34D", lineHeight:1.7 }}>
                      ⚠️ No pixel code saved yet. Paste your Meta Pixel code above to start tracking visitors from Meta Ads.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* How to find pixel */}
          <div className="admin-form-card" style={{ background:"rgba(99,102,241,0.04)", border:"1px solid rgba(99,102,241,0.15)" }}>
            <div className="admin-form-card-title" style={{ color:"#818CF8" }}>📖 How to find your Pixel code</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                "Go to business.facebook.com → Events Manager",
                "Select your Pixel → Click 'Setup' → 'Install Code Manually'",
                "Copy the entire code block (everything from <!-- Meta Pixel Code --> to <!-- End Meta Pixel Code -->)",
                "Paste it in the box above and click Save Settings",
                "Redeploy your site — the pixel will fire on every page visit",
              ].map((step, i) => (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ width:22, height:22, borderRadius:"50%", background:"rgba(99,102,241,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#818CF8", flexShrink:0 }}>{i+1}</span>
                  <span style={{ fontSize:13, color:"#94A3B8", lineHeight:1.6 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
            <button className="btn-admin-primary" onClick={save} disabled={saving} style={{ padding:"12px 32px" }}>
              {saving ? "Saving…" : "💾 Save Settings"}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type==="success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}
