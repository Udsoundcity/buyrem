// ─────────────────────────────────────────────────────────────────
//  lib/products.js  —  SERVER ONLY
//  Local dev  → reads/writes data/products.json via fs
//  Vercel     → reads/writes via Supabase (store_data table)
//
//  Required Supabase env vars (set automatically by Vercel integration):
//    NEXT_PUBLIC_SUPABASE_URL
//    SUPABASE_SERVICE_ROLE_KEY
// ─────────────────────────────────────────────────────────────────
import fs   from "fs";
import path from "path";

export * from "./constants";

const FILE    = path.join(process.cwd(), "data/products.json");
const DB_KEY  = "products";   // row key in store_data table

// ── Helpers ──────────────────────────────────────────────────────

function supabaseAvailable() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function getClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY   // service role bypasses RLS
  );
}

function readFile() {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

// ── Public API ────────────────────────────────────────────────────

/**
 * Returns all products.
 * On first Vercel deploy, automatically seeds Supabase from products.json.
 */
export async function getAllProducts() {
  if (supabaseAvailable()) {
    const sb = await getClient();
    const { data, error } = await sb
      .from("store_data")
      .select("value")
      .eq("key", DB_KEY)
      .maybeSingle();           // returns null (not error) if row missing

    if (data?.value) {
      return data.value.products || [];
    }

    // Row doesn't exist yet — seed from bundled products.json
    const seed = readFile();
    await sb
      .from("store_data")
      .upsert({ key: DB_KEY, value: seed, updated_at: new Date().toISOString() });
    return seed.products;
  }

  // Local development — use the JSON file
  return readFile().products;
}

/** Returns one product by id, or null. */
export async function getProduct(id) {
  const all = await getAllProducts();
  return all.find(p => p.id === id) || null;
}

/**
 * Saves the full products array.
 * On Vercel → upserts into Supabase store_data.
 * Locally   → writes data/products.json.
 */
export async function saveAllProducts(products) {
  if (supabaseAvailable()) {
    const sb = await getClient();
    const { error } = await sb
      .from("store_data")
      .upsert({ key: DB_KEY, value: { products }, updated_at: new Date().toISOString() });

    if (error) throw new Error(`Supabase save failed: ${error.message}`);
  } else {
    fs.writeFileSync(FILE, JSON.stringify({ products }, null, 2));
  }
}
