"use client";
import { useState } from "react";
import OrderModal from "./OrderModal";

export default function OrderTrigger({ product, label = <>
  <i className="fa-solid fa-cart-shopping"></i> Order Now — Pay on Delivery
</> }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn-wa" onClick={() => setOpen(true)}>{label}</button>
      {open && <OrderModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
