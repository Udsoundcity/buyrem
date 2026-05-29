import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const IMAGE_TYPES  = ["image/jpeg","image/jpg","image/png","image/webp"];
const VIDEO_TYPES  = ["video/mp4","video/webm","video/ogg","video/quicktime","video/x-msvideo"];
const IMAGE_MAX    = 5   * 1024 * 1024;   //   5 MB
const VIDEO_MAX    = 200 * 1024 * 1024;   // 200 MB
const IMAGE_BUCKET = "product-images";
const VIDEO_BUCKET = "product-videos";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file     = formData.get("file");

    if (!file)
      return NextResponse.json({ error: "No file provided." }, { status: 400 });

    const isImage = IMAGE_TYPES.includes(file.type);
    const isVideo = VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo)
      return NextResponse.json(
        { error: `Unsupported type "${file.type}". Use JPG/PNG/WebP for images or MP4/WebM/MOV for videos.` },
        { status: 400 }
      );

    const maxSize = isVideo ? VIDEO_MAX : IMAGE_MAX;
    if (file.size > maxSize) {
      const mb    = (file.size / 1024 / 1024).toFixed(1);
      const limit = isVideo ? "200 MB" : "5 MB";
      return NextResponse.json({ error: `File is ${mb} MB — max is ${limit}.` }, { status: 400 });
    }

    const ext      = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g,"") || (isVideo ? "mp4" : "jpg");
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bucket   = isVideo ? VIDEO_BUCKET : IMAGE_BUCKET;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(safeName, buffer, { contentType: file.type, upsert: false, cacheControl: "3600" });

    if (uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(safeName);
    const { data: signedData } = await supabase.storage.from(bucket).createSignedUrl(safeName, 60 * 60 * 24 * 365);

    const url = publicData?.publicUrl || signedData?.signedUrl;
    if (!url) return NextResponse.json({ error: "Could not generate URL." }, { status: 500 });

    return NextResponse.json({ url, type: isVideo ? "video" : "image" });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed." }, { status: 500 });
  }
}
