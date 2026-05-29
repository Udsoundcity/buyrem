"use client";
import { useState } from "react";
import OrderModal from "./OrderModal";

function scrollToForm() {
  document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" });
}

export default function OrderTrigger({ product, label = <>
  <i className="fa-solid fa-cart-shopping"></i> Order Now — Pay on Delivery
</> }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (product?.formLink) {
      scrollToForm();
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <button className="btn-wa" onClick={handleClick}>
        {product?.formLink ? "📋 Fill Order Form ↓" : label}
      </button>
      {open && <OrderModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}