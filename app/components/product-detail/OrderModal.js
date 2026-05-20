"use client";
import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";   // ← constants, NOT products
import styles from "./OrderModal.module.css";

export default function OrderModal({ product, onClose }) {
  const [form, setForm] = useState({ name:"", phone:"", address:"", area:"", qty:1, notes:"" });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name    = "Please enter your name";
    if (!form.phone.trim() || form.phone.replace(/\D/g,"").length < 10)
                              e.phone   = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Please enter your delivery address";
    if (!form.area.trim())    e.area    = "Please enter your area / LGA";
    return e;
  };

  const total = (product.price * form.qty).toLocaleString();

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const msg = `🛍️ *NEW ORDER — ${product.name}*
━━━━━━━━━━━━━━
👤 *Name:* ${form.name}
📞 *Phone:* ${form.phone}
📍 *Address:* ${form.address}
🏘️ *Area / LGA:* ${form.area}
━━━━━━━━━━━━━━
🛒 *Product:* ${product.name}
🔢 *Qty:* ${form.qty}
💰 *Unit Price:* ₦${product.price.toLocaleString()}
💳 *Total:* ₦${total}
━━━━━━━━━━━━━━
💵 *Payment:* Cash on Delivery
${form.notes ? `📝 *Notes:* ${form.notes}` : ""}

Please confirm my order. Thank you! 🙏`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  };

  const field = (k) => ({
    className: `${styles.input}${errors[k] ? ` ${styles.inputError}` : ""}`,
    value: form[k],
    onChange: (e) => { set(k, e.target.value); setErrors(p => ({ ...p, [k]: "" })); },
  });

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.handle} />

        <div className={styles.header}>
          <div className={styles.productRow}>
            <div className={styles.productEmoji} style={{ background: product.bg }}>
              {product.emoji || "🛍️"}
            </div>
            <div>
              <div className={styles.productName}>{product.name}</div>
              <div className={styles.productPrice}>₦{product.price.toLocaleString()}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Quantity */}
        <div className={styles.group}>
          <label className={styles.label}>Quantity <span className={styles.req}>*</span></label>
          <div className={styles.qtyRow}>
            <button className={styles.qtyBtn} onClick={() => form.qty > 1 && set("qty", form.qty - 1)}>−</button>
            <span className={styles.qtyNum}>{form.qty}</span>
            <button className={styles.qtyBtn} onClick={() => set("qty", form.qty + 1)}>+</button>
          </div>
        </div>

        {/* Name + Phone */}
        <div className={styles.row}>
          <div className={styles.group}>
            <label className={styles.label}>Your Name <span className={styles.req}>*</span></label>
            <input {...field("name")} placeholder="e.g. Amaka Obi" />
            {errors.name && <div className={styles.err}>{errors.name}</div>}
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Phone <span className={styles.req}>*</span></label>
            <input {...field("phone")} placeholder="08012345678" type="tel" />
            {errors.phone && <div className={styles.err}>{errors.phone}</div>}
          </div>
        </div>

        {/* Address */}
        <div className={styles.group}>
          <label className={styles.label}>Delivery Address <span className={styles.req}>*</span></label>
          <input {...field("address")} placeholder="House no, street name..." />
          {errors.address && <div className={styles.err}>{errors.address}</div>}
        </div>

        {/* Area */}
        <div className={styles.group}>
          <label className={styles.label}>Area / LGA <span className={styles.req}>*</span></label>
          <input {...field("area")} placeholder="e.g. Surulere, Ikeja, Lekki..." />
          {errors.area && <div className={styles.err}>{errors.area}</div>}
        </div>

        {/* Notes */}
        <div className={styles.group}>
          <label className={styles.label}>
            Notes <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            className={styles.textarea}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Any special requests..."
          />
        </div>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total (Pay on Delivery)</span>
          <span className={styles.totalAmount}>₦{total}</span>
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit}>
         <i class="fa-solid fa-cart-shopping"></i> Send Order via WhatsApp
        </button>
        <p className={styles.note}>
          Opens WhatsApp with your order ready to send.<br />
          💵 You only pay cash when your order arrives.
        </p>
      </div>
    </div>
  );
}
