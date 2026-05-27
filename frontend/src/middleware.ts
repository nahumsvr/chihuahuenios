import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_NAME } from "./constants";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_NAME)?.value;

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/viajes");

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/viajes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/viajes/:path*", "/login", "/register"],
};
