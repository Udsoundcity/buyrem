import { NextResponse } from "next/server";

const TOKEN = "myshop_admin_ok";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only protect /admin/* (but not /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("admin_token")?.value;
    if (token !== TOKEN) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };