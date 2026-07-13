import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getDb() { return createClient(); }

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    const sb = await getDb();

    const { data, error } = await sb
      .from("settings")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(data || {});
  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const sb   = await getDb();
    const { error } = await sb
  .from("settings")
  .upsert({
    id: body.id,        // UUID or null for new form
    slug: body.slug,
    product_name: body.product_name,
    promo_message: body.promo_message,
    display_style: body.display_style,
    tiers: body.tiers,
    field_config: body.field_config,
    updated_at: new Date().toISOString(),
  });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
