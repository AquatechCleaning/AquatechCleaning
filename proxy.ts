import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (pathname === "/admin/login") {
    if (!token) return NextResponse.next();

    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/admin/dashboard";
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  if (token) return NextResponse.next();

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
