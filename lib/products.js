// ─────────────────────────────────────────────────────────────────
//  lib/products.js  —  SERVER ONLY
//
//  Single source of truth: Supabase store_data table, key="products"
//
//  No JSON fallback. If Supabase fails, an error is thrown so
//  the problem is visible immediately — never silently hidden.
//
//  Required env vars (Vercel + local .env.local):
//    NEXT_PUBLIC_SUPABASE_URL
//    SUPABASE_SERVICE_ROLE_KEY
// ─────────────────────────────────────────────────────────────────

export * from "./constants";

const DB_KEY = "products";

// ── Supabase client (service role — bypasses RLS) ────────────────
async function getClient() {
  const { createClient } = await import("@supabase/supabase-js");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key, {
    global: {
      // Never cache Supabase responses — always get live data
      fetch: (url, opts = {}) => fetch(url, { ...opts, cache: "no-store" }),
    },
  });
}

// ── Public API ────────────────────────────────────────────────────

/**
 * Returns all products from Supabase.
 * Returns [] if no products have been added yet.
 * Throws if the database connection fails.
 */
export async function getAllProducts() {
  const sb = await getClient();

  const { data, error } = await sb
    .from("store_data")
    .select("value")
    .eq("key", DB_KEY)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load products: ${error.message}`);
  }

  // No row yet — fresh database, no products added
  if (!data) return [];

  // Handle both storage shapes for safety:
  //   { products: [...] }   ← what saveAllProducts writes
  //   [...]                 ← raw array (shouldn't happen but guard anyway)
  if (Array.isArray(data.value)) return data.value;
  if (Array.isArray(data.value?.products)) return data.value.products;

  return [];
}

/**
 * Returns one product by id, or null if not found.
 */
export async function getProduct(id) {
  const all = await getAllProducts();
  return all.find(p => p.id === id) ?? null;
}

/**
 * Saves the full products array to Supabase.
 * Throws on failure so the admin panel surfaces the error.
 */
export async function saveAllProducts(products) {
  if (!Array.isArray(products)) {
    throw new Error("saveAllProducts: expected an array");
  }

  const sb = await getClient();

  const { error } = await sb
    .from("store_data")
    .upsert({
      key:        DB_KEY,
      value:      { products },
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(`Could not save products: ${error.message}`);
  }
}
