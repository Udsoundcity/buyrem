"use client";
import { useState } from "react";

export default function EmbedLinkCard({ slug }) {
  const [copied, setCopied] = useState("");

  const origin   = typeof window !== "undefined" ? window.location.origin : "https://buyrem.com";
  const pageUrl  = `${origin}/order/${slug}`;
  const embedUrl = `${origin}/order/${slug}/embed`;

  const iframeCode = `<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="700"\n  frameborder="0"\n  style="border:none;border-radius:16px;"\n  title="Order Form"\n></iframe>`;

  const copy = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="admin-form-card" style={{ marginTop:20 }}>
      <div className="admin-form-card-title">🔗 Share & Embed</div>
      <p className="admin-input-hint" style={{ marginBottom:20 }}>
        Share the direct link or embed the form inside any webpage using the iframe code.
      </p>

      <div className="admin-field">
        <label className="admin-label">Customer Order Page</label>
        <div style={{ display:"flex", gap:8 }}>
          <input className="admin-input" value={pageUrl} readOnly style={{ color:"#4ADE80" }}/>
          <button className="btn-admin-ghost" style={{ flexShrink:0 }}
            onClick={() => copy(pageUrl, "url")}>
            {copied === "url" ? "✅ Copied" : "📋 Copy"}
          </button>
        </div>
        <p className="admin-input-hint">Share on WhatsApp, Instagram bio, or link from product page.</p>
      </div>

      <div className="admin-field" style={{ marginTop:16 }}>
        <label className="admin-label">iFrame Embed Code</label>
        <textarea className="admin-textarea" value={iframeCode} readOnly rows={5}
          style={{ fontFamily:"monospace", fontSize:12, color:"#4ADE80",
            background:"#0F172A", border:"1px solid #334155" }}/>
        <button className="btn-admin-primary" style={{ marginTop:8 }}
          onClick={() => copy(iframeCode, "iframe")}>
          {copied === "iframe" ? "✅ Copied!" : "📋 Copy Embed Code"}
        </button>
        <p className="admin-input-hint" style={{ marginTop:6 }}>
          Paste into any webpage to embed this form. On submission, customers see the thank-you page inline.
        </p>
      </div>
    </div>
  );
}
