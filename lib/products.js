
// ─────────────────────────────────────────────────────────────────
//  lib/products.js  —  SERVER ONLY
//  Uses Node.js fs/path — never import this in a "use client" file.
//  For shared constants (WHATSAPP_NUMBER, CAT_COLORS etc.)
//  import from "@/lib/constants" instead.
// ─────────────────────────────────────────────────────────────────
import fs   from "fs";
import path from "path";

// Re-export constants so server components can use one import
export * from "./constants";

const FILE = path.join(process.cwd(), "data/products.json");

function readData() {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

/** Returns all products fresh from disk on every call. */
export function getAllProducts() {
  return readData().products;
}

/** Returns one product by id, or null. */
export function getProduct(id) {
  return readData().products.find(p => p.id === id) || null;
}