// ─────────────────────────────────────────────────────────────────
//  lib/products.js  —  SERVER ONLY
//  Locally  → reads/writes data/products.json via fs
//  Vercel   → reads/writes via Vercel KV (filesystem is read-only)
// ─────────────────────────────────────────────────────────────────
import fs   from "fs";
import path from "path";

export * from "./constants";

const FILE    = path.join(process.cwd(), "data/products.json");
const KV_KEY  = "myshop_products";

/** True when Vercel KV env vars are present (i.e. running on Vercel) */
function kvAvailable() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/** Lazy-load @vercel/kv so local dev doesn't need the package installed */
async function getKV() {
  const { kv } = await import("@supabase/supabase-js");
  return kv;
}

/** Read products.json from disk (works locally + on Vercel for reads) */
function readFile() {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

// ── Public API ────────────────────────────────────────────────────

/** Returns all products. On Vercel seeds KV from the JSON file on first run. */
export async function getAllProducts() {
  if (kvAvailable()) {
    const kv   = await getKV();
    const data = await kv.get(KV_KEY);
    if (data) return data.products || [];

    // KV is empty → first deploy. Seed it from the bundled JSON file.
    const seed = readFile();
    await kv.set(KV_KEY, seed);
    return seed.products;
  }
  // Local dev — read from file
  return readFile().products;
}

/** Returns a single product by id, or null. */
export async function getProduct(id) {
  const all = await getAllProducts();
  return all.find(p => p.id === id) || null;
}

/** Persists the full products array (replaces all). */
export async function saveAllProducts(products) {
  if (kvAvailable()) {
    const kv = await getKV();
    await kv.set(KV_KEY, { products });
  } else {
    // Local dev — write to file
    fs.writeFileSync(FILE, JSON.stringify({ products }, null, 2));
  }
}
