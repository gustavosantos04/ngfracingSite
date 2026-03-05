import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ Edge-safe: sem imports externos/aliases.
// Se o nome do cookie no teu projeto for diferente, ajusta aqui.
// (Eu manteria "session" como padrão mais comum do Codex.)
const AUTH_COOKIE_NAME = "session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Não é /admin → segue normal
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Libera a tela de login
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Verifica cookie de sessão
  const hasSessionCookie = request.cookies.has(AUTH_COOKIE_NAME);
  if (hasSessionCookie) {
    return NextResponse.next();
  }

  // Redireciona pro login com "next"
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};