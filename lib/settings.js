import fs   from "fs";
import path from "path";

const FILE   = path.join(process.cwd(), "data/settings.json");
const DB_KEY = "site_settings";

function supabaseAvailable() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function getClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { global: { fetch: (url, opts={}) => fetch(url, { ...opts, cache:"no-store" }) } }
  );
}

function readFile() {
  try { return JSON.parse(fs.readFileSync(FILE, "utf-8")); }
  catch { return {}; }
}

export async function getSettings() {
  if (supabaseAvailable()) {
    const sb = await getClient();
    const { data } = await sb.from("store_data").select("value").eq("key", DB_KEY).maybeSingle();
    return data?.value || readFile();
  }
  return readFile();
}

export async function saveSettings(settings) {
  if (supabaseAvailable()) {
    const sb = await getClient();
    await sb.from("store_data").upsert({
      key: DB_KEY,
      value: { ...settings, updatedAt: new Date().toISOString() },
      updated_at: new Date().toISOString(),
    });
  } else {
    fs.writeFileSync(FILE, JSON.stringify({ ...settings, updatedAt: new Date().toISOString() }, null, 2));
  }
}