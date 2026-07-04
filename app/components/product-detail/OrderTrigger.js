"use client";
import { useState } from "react";
import CartIcon from "@/app/components/CartIcon";
import OrderModal from "./OrderModal";

function scrollToForm() {
  document.getElementById("product-form")?.scrollIntoView({ behavior:"smooth" });
}

export default function OrderTrigger({ product, label = "Order Now — Pay on Delivery" }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (product?.formLink) {
      scrollToForm();
    } else {
      setOpen(true);
    }
  };

  const displayLabel = product?.formLink ? "Order Now - Pay On Delivery" : label;

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          display:"inline-flex", alignItems:"center", gap:10,
          background:"#25D366", color:"#fff",
          padding:"16px 28px", borderRadius:"100px",
          border:"none", cursor:"pointer",
          fontSize:15, fontWeight:800,
          fontFamily:"'Plus Jakarta Sans',sans-serif",
          transition:"all .22s",
        }}
        onMouseOver={e => { e.currentTarget.style.background="#1ebe5d"; e.currentTarget.style.transform="translateY(-2px)"; }}
        onMouseOut={e  => { e.currentTarget.style.background="#25D366"; e.currentTarget.style.transform="translateY(0)"; }}
      >
        <CartIcon size={16} /> {displayLabel}
      </button>
      {open && <OrderModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
