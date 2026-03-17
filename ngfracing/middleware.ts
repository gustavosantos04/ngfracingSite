import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_CANDIDATES } from "@/lib/constants";

function applySecurityHeaders(request: NextRequest, response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", "frame-ancestors 'none'; base-uri 'self'; form-action 'self'");

  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  const isHttps =
    request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https";
  if (isHttps) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  return response;
}

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
      return NextResponse.next();
    }

    if (!pathname.startsWith("/admin")) {
      return applySecurityHeaders(request, NextResponse.next());
    }

    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return applySecurityHeaders(request, NextResponse.next());
    }

    const hasSessionCookie = AUTH_COOKIE_CANDIDATES.some((cookieName) => {
      const value = request.cookies.get(cookieName)?.value;
      return typeof value === "string" && value.length > 0;
    });

    if (hasSessionCookie) {
      return applySecurityHeaders(request, NextResponse.next());
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return applySecurityHeaders(request, NextResponse.redirect(loginUrl));
  } catch {
    return applySecurityHeaders(request, NextResponse.next());
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
