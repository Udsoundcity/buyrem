"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TYContent() {
  const sp   = useSearchParams();
  const name = sp.get("name");
  const greeting = name ? `Thank you, ${name.split(" ")[0]}!` : "Thank you!";
  return (
    <div style={{ textAlign:"center", padding:"48px 24px",
      fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#2C1810" }}>
      <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
      <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28,
        color:"#5C3D2E", marginBottom:8 }}>{greeting}</h1>
      <p style={{ fontSize:15, color:"#7A5240", lineHeight:1.7, maxWidth:400, margin:"0 auto" }}>
        Your order has been received. We will contact you shortly to confirm.
        Payment is on delivery — no upfront charge.
      </p>
    </div>
  );
}

export default function EmbedThankYou() {
  return (
    <Suspense fallback={<div style={{ padding:32, textAlign:"center" }}>Loading…</div>}>
      <TYContent />
    </Suspense>
  );
}
