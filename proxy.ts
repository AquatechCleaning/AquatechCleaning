import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

async function getAdminToken(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const secureCookie = request.nextUrl.protocol === "https:";

  return (
    (await getToken({ req: request, secret, secureCookie })) ||
    (await getToken({ req: request, secret, cookieName: "__Secure-next-auth.session-token" })) ||
    (await getToken({ req: request, secret, cookieName: "next-auth.session-token" }))
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getAdminToken(request);

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
