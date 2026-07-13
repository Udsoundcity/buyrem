"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NIGERIAN_STATES } from "@/lib/constants/nigerian-states";
import styles from "./OrderForm.module.css";

const NG_PHONE_REGEX = /^(?:\+234\d{10}|0\d{10})$/;
function normalizePhone(raw) { return raw.replace(/[\s-]/g, ""); }

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", maximumFractionDigits: 0,
  }).format(amount);
}

function validate(form, fieldConfig = {}) {
  const cfg = { full_name:true, phone:true, address:true, state:true, ...fieldConfig };
  const errors = {};

  const name = form.full_name.trim();
  if (cfg.full_name && !name)
    errors.full_name = "Full name is required.";
  else if (name && name.split(/\s+/).length < 2)
    errors.full_name = "Please enter your first and last name.";

  const phone = normalizePhone(form.phone);
  if (cfg.phone && !phone)
    errors.phone = "Phone number is required.";
  else if (phone && !NG_PHONE_REGEX.test(phone))
    errors.phone = "Enter a valid Nigerian phone number, e.g. 08012345678.";

  if (cfg.address && !form.address.trim())
    errors.address = "Delivery address is required.";
  else if (form.address.trim() && form.address.trim().length < 8)
    errors.address = "Please enter a more complete address.";

  if (cfg.state && !form.state)
    errors.state = "Please select your state.";

  if (!form.tier_id)
    errors.tier_id = "Please select a quantity option.";

  return errors;
}

// ── Tier Selector ─────────────────────────────────────────────────
function TierSelector({ tiers, displayStyle, value, onChange, error }) {
  if (!tiers?.length) {
    return (
      <div className={styles.noTiers}>
        No quantity options have been set up yet.
      </div>
    );
  }

  if (displayStyle === "dropdown") {
    return (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${styles.select} ${error ? styles.fieldError : ""}`}
      >
        <option value="">Select an option</option>
        {tiers.map(t => (
          <option key={t.id} value={t.id}>
            {t.label} — {formatNaira(t.price)}
          </option>
        ))}
      </select>
    );
  }

  // bullet or checkbox style
  const isCheckbox = displayStyle === "checkbox";
  return (
    <div className={`${styles.tierList} ${error ? styles.tierListError : ""}`}>
      {tiers.map(t => {
        const selected = value === t.id;
        return (
          <label
            key={t.id}
            className={`${styles.tierOption} ${selected ? styles.tierSelected : ""}`}
          >
            <input
              type="radio"
              name="tier"
              value={t.id}
              checked={selected}
              onChange={() => onChange(t.id)}
              className={styles.srOnly}
            />
            <span className={`${styles.tierIndicator} ${isCheckbox ? styles.tierCheckbox : styles.tierBullet} ${selected ? styles.tierIndicatorSelected : ""}`}>
              {selected && (
                <svg viewBox="0 0 24 24" className={styles.tierCheck} fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span className={styles.tierLabel}>
              {t.label} <strong className={styles.tierPrice}>{formatNaira(t.price)}</strong>
            </span>
          </label>
        );
      })}
    </div>
  );
}

// ── Main Form ─────────────────────────────────────────────────────
export default function OrderForm({ settings, slug, variant = "page", redirectTo = "/order-confirmed" }) {
  const router = useRouter();

  // Admin-configured redirect takes priority; prop is the fallback
  const finalRedirect = settings?.redirect_url?.trim() || redirectTo;
  const [form, setForm]       = useState({ full_name:"", phone:"", address:"", state:"", tier_id:"" });
  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(key, value) {
    setForm(p => ({ ...p, [key]: value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
    setSubmitError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    const errs = validate(form, settings?.field_config);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: orderId, error } = await supabase.rpc("create_order", {
        p_slug:      slug,
        p_full_name: form.full_name.trim(),
        p_phone:     normalizePhone(form.phone),
        p_address:   form.address.trim(),
        p_state:     form.state,
        p_tier_id:   form.tier_id,
      });

      if (error) throw error;

      const target = new URL(finalRedirect, window.location.origin);
target.searchParams.set("ref", orderId);
target.searchParams.set("name", form.full_name.trim());

const destination = target.toString();

if (window.self !== window.top) {
  // Running inside an iframe: redirect the parent page
  window.top.location.href = destination;
} else {
  // Running as a normal page
  router.push(`${target.pathname}${target.search}`);
}
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong sending your order. Please try again.");
      setSubmitting(false);
    }
  }

  const isEmbed = variant === "embed";
  const fieldConfig = { full_name:true, phone:true, address:true, state:true, ...(settings?.field_config || {}) };

  return (
    <div className={isEmbed ? styles.wrapEmbed : styles.wrap}>

      {/* Product info */}
      {!isEmbed && (
        <div className={styles.header}>
          
        </div>
      )}

      {settings?.product_name && (
        <div className={styles.product}>
          <p className={styles.productName}>{settings.product_name}</p>
          {settings.promo_message && (
            <p className={styles.promoMsg}>{settings.promo_message}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className={styles.form}>

        {/* Tier selector */}
        <div className={styles.field}>
          <label className={styles.label}>
            Select Quantity <span className={styles.req}>*</span>
          </label>
          <TierSelector
            tiers={settings?.tiers}
            displayStyle={settings?.display_style || "bullet"}
            value={form.tier_id}
            onChange={id => update("tier_id", id)}
            error={errors.tier_id}
          />
          {errors.tier_id && <p className={styles.error}>{errors.tier_id}</p>}
        </div>

        {/* Full Name */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="full_name">
            Full Name
            {!fieldConfig.full_name && <span className={styles.optional}> (optional)</span>}
            {fieldConfig.full_name  && <span className={styles.req}> *</span>}
          </label>
          <input
            id="full_name" type="text" autoComplete="name"
            placeholder="e.g. Chidinma Okafor"
            className={`${styles.input} ${errors.full_name ? styles.fieldError : ""}`}
            value={form.full_name} onChange={e => update("full_name", e.target.value)}
          />
          {errors.full_name && <p className={styles.error}>{errors.full_name}</p>}
        </div>

        {/* Phone */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">
            Phone Number
            {!fieldConfig.phone && <span className={styles.optional}> (optional)</span>}
            {fieldConfig.phone  && <span className={styles.req}> *</span>}
          </label>
          <input
            id="phone" type="tel" inputMode="tel" autoComplete="tel"
            placeholder="08012345678"
            className={`${styles.input} ${errors.phone ? styles.fieldError : ""}`}
            value={form.phone} onChange={e => update("phone", e.target.value)}
          />
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}
        </div>

        {/* Address */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="address">
            Address
            {!fieldConfig.address && <span className={styles.optional}> (optional)</span>}
            {fieldConfig.address  && <span className={styles.req}> *</span>}
          </label>
          <textarea
            id="address" rows={3} autoComplete="street-address"
            placeholder="House number, street, city / area"
            className={`${styles.textarea} ${errors.address ? styles.fieldError : ""}`}
            value={form.address} onChange={e => update("address", e.target.value)}
          />
          {errors.address && <p className={styles.error}>{errors.address}</p>}
        </div>

        {/* State */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="state">
            State
            {!fieldConfig.state && <span className={styles.optional}> (optional)</span>}
            {fieldConfig.state  && <span className={styles.req}> *</span>}
          </label>
          <select
            id="state"
            className={`${styles.select} ${errors.state ? styles.fieldError : ""}`}
            value={form.state} onChange={e => update("state", e.target.value)}
          >
            <option value="">Select your state</option>
            {NIGERIAN_STATES.map(s => (
              <option key={s} value={s}>{s === "FCT" ? "FCT (Abuja)" : s}</option>
            ))}
          </select>
          {errors.state && <p className={styles.error}>{errors.state}</p>}
        </div>

        {/* Server error */}
        {submitError && (
          <div className={styles.serverError}>⚠️ {submitError}</div>
        )}

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting
            ? <><span className={styles.spinner} /> Placing order…</>
            : "✅ Place My Order"}
        </button>

  
      </form>
    </div>
  );
}