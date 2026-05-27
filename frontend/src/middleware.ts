import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_NAME } from "./constants";

/**
 * Decodifica el payload de un JWT sin verificar la firma.
 * En el middleware del edge runtime no podemos usar librerías como jose,
 * así que hacemos el decode manual del payload base64url.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // Base64url → Base64 → JSON
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedRoute = pathname.startsWith("/viajes");
  const isAdminRoute = pathname.startsWith("/admin");
  const isMisComprasRoute = pathname.startsWith("/mis-compras");

  // Decodificar rol del token si existe
  let rol: string | null = null;
  if (token) {
    const payload = decodeJwtPayload(token);
    rol = (payload?.rol as string) ?? null;
  }

  // Rutas de auth: si ya está logueado, redirigir según rol
  if (isAuthRoute && token) {
    const destination = rol === "admin" ? "/admin/viajes" : "/viajes";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Rutas de usuario: requieren token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Ruta /mis-compras: solo usuarios autenticados con rol 'usuario'
  if (isMisComprasRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (rol === "admin") {
      return NextResponse.redirect(new URL("/admin/viajes", request.url));
    }
  }

  // Rutas de admin: solo rol 'admin'
  if (isAdminRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (rol !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/viajes/:path*",
    "/login",
    "/register",
    "/admin/:path*",
    "/mis-compras/:path*",
  ],
};
