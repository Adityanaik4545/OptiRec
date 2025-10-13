// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Call API route to check session
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/check-session`, {
    headers: { cookie: req.headers.get("cookie") || "" },
  });
  const data = await res.json();

  if (!data.valid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|assets).*)"],
};
