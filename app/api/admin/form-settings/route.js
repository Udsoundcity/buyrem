import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { global: { fetch: (url, o={}) => fetch(url, { ...o, cache:"no-store" }) } }
  );
}

// GET /api/admin/form-settings — list all forms
export async function GET() {
  try {
    const { data, error } = await db()
      .from("settings")
      .select("id, form_name, slug, product_name, tiers, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/admin/form-settings — create new form
export async function POST(req) {
  try {
    const body = await req.json();
    const { form_name, slug, product_name, promo_message,
            display_style, tiers, field_config, redirect_url } = body;

    if (!form_name?.trim()) return NextResponse.json({ error:"Form name is required." }, { status:422 });
    if (!slug?.trim())      return NextResponse.json({ error:"Slug is required."      }, { status:422 });

    // Ensure slug is URL-safe
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const { data, error } = await db()
      .from("settings")
      .insert({
        form_name:     form_name.trim(),
        slug:          cleanSlug,
        product_name:  product_name  || "",
        promo_message: promo_message || "",
        display_style: display_style || "bullet",
        tiers:         tiers         || [],
        field_config:  field_config  || { full_name:true, phone:true, address:true, state:true },
        redirect_url:  redirect_url  || "",
        updated_at:    new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") // unique violation on slug
        return NextResponse.json({ error:"A form with this slug already exists. Choose a different slug." }, { status:409 });
      throw error;
    }
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}