import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { global: { fetch: (url, opts={}) => fetch(url, { ...opts, cache:"no-store" }) } }
  );
}

// GET /api/admin/orders?search=&state=&limit=200
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const state  = searchParams.get("state")?.trim()  || "";
    const limit  = Math.min(Number(searchParams.get("limit") || 200), 1000);

    const sb = getServiceClient();
    let query = sb
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (state)  query = query.eq("state", state);
    if (search) query = query.or(
      `full_name.ilike.%${search}%,phone.ilike.%${search}%`
    );

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/orders   body: { ids: string[] }  → bulk delete
export async function DELETE(req) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || !ids.length)
      return NextResponse.json({ error: "No IDs provided." }, { status: 400 });

    const sb = getServiceClient();
    const { error } = await sb.from("orders").delete().in("id", ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
