import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/settings";

export async function GET() {
  try {
    const s = await getSettings();
    return NextResponse.json(s);
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status:500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    await saveSettings(body);
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status:500 });
  }
}