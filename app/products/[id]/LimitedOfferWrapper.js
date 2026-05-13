"use client";
import { useState } from "react";
import { LimitedOffer } from "@/app/components/product-detail/Sections";
import OrderModal from "@/app/components/product-detail/OrderModal";

export default function LimitedOfferWrapper({ product }) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <LimitedOffer product={product} onOrder={() => setModal(true)} />
      {modal && <OrderModal product={product} onClose={() => setModal(false)} />}
    </>
  );
}
