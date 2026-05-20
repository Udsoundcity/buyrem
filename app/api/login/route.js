import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Set ADMIN_PASSWORD in your .env.local file
// Default password is: admin123
const PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const TOKEN    = "myshop_admin_ok";

export async function GET() {
  return NextResponse.json({ message: "Use POST for login" });
}

export async function POST(req) {
  const { password } = await req.json();
  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    maxAge:   60 * 60 * 8, // 8 hours
    path:     "/",
  });
  return res;
}