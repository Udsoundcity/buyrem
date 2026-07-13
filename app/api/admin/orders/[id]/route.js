import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VALID_STATUSES = ["Submitted","Reviewed","Postponed","Delivered"];

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { global:{ fetch:(url,o={})=>fetch(url,{...o,cache:"no-store"}) } }
  );
}

// DELETE /api/admin/orders/[id]
export async function DELETE(_,{ params }) {
  try {
    const { error } = await db().from("orders").delete().eq("id",params.id);
    if (error) throw error;
    return NextResponse.json({ success:true });
  } catch(e) {
    return NextResponse.json({ error:e.message },{ status:500 });
  }
}

// PATCH /api/admin/orders/[id] — update status
export async function PATCH(req,{ params }) {
  try {
    const { status } = await req.json();
    if (!VALID_STATUSES.includes(status))
      return NextResponse.json({ error:"Invalid status." },{ status:400 });
    const { error } = await db().from("orders").update({ status }).eq("id",params.id);
    if (error) throw error;
    return NextResponse.json({ success:true });
  } catch(e) {
    return NextResponse.json({ error:e.message },{ status:500 });
  }
}