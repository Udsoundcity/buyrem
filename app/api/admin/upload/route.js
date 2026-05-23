import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED  = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const BUCKET   = "product-images";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file     = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // ── Validate type ──────────────────────────────────────────
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid type "${file.type}". Use JPG, PNG or WebP.` },
        { status: 400 }
      );
    }

    // ── Validate size ──────────────────────────────────────────
    if (file.size > MAX_SIZE) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      return NextResponse.json(
        { error: `File is ${mb} MB. Maximum allowed is 5 MB.` },
        { status: 400 }
      );
    }

    // ── Build a collision-proof filename ───────────────────────
    const ext      = file.name.split(".").pop().toLowerCase().replace(/[^a-z]/g, "") || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // ── Upload to Supabase Storage ─────────────────────────────
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY   // service role skips RLS
    );

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(safeName, buffer, {
        contentType: file.type,
        upsert:      false,
        cacheControl: "3600",
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // ── Return the public URL ──────────────────────────────────
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
    return NextResponse.json({ url: data.publicUrl });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed." }, { status: 500 });
  }
}
