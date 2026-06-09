
// ─────────────────────────────────────────────────────────────────
//  lib/constants.js
//  Safe to import in BOTH server and client components.
//  No Node.js-only modules (no fs, no path).
// ─────────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = "2348060987399"; // ← your number
export const STORE_NAME      = "BuyRem";
export const STORE_TAGLINE   = "Beauty · Electronics · Health";
export const STORE_LOCATION  = "Lagos, Nigeria";

export const CATEGORIES = ["All", "Beauty", "Electronics", "Health"];

export const CAT_COLORS = {
  Beauty:      { bg: "#FAD5C4", text: "#C4714A" },
  Electronics: { bg: "#C4D5FA", text: "#3A5ACC" },
  Health:      { bg: "#C4FAD8", text: "#2A8C52" },
};

export const CAT_EMOJI = {
  All: "🛍️", Beauty: "💄", Electronics: "⚡", Health: "🌿",
};
