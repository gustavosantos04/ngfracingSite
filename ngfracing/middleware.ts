import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_CANDIDATES = ["session", "ngf_admin_session"] as const;

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
      return NextResponse.next();
    }

    if (!pathname.startsWith("/admin")) {
      return NextResponse.next();
    }

    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return NextResponse.next();
    }

    const hasSessionCookie = AUTH_COOKIE_CANDIDATES.some((cookieName) => {
      const value = request.cookies.get(cookieName)?.value;
      return typeof value === "string" && value.length > 0;
    });

    if (hasSessionCookie) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"]
};