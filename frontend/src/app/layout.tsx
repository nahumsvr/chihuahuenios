import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Chihuahueños — Boletos de Autobús",
  description: "Reserva tu boleto de autobús con Chihuahueños. Viajes seguros, cómodos y puntuales.",
};

import Navbar from "./_components/Navbar";
import { cookies } from "next/headers";
import { TOKEN_NAME } from "@/constants";
import { UserRole } from "@/entities";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get(TOKEN_NAME)?.value;
  const isAuthenticated = !!token;

  let rol: UserRole | null = null;
  let nombre: string | null = null;
  let foto_perfil_url: string | null = null;
  if (token) {
    const payload = decodeJwtPayload(token);
    rol = (payload?.rol as UserRole) ?? null;
    nombre = (payload?.nombre as string) ?? null;
    foto_perfil_url = (payload?.foto_perfil_url as string) ?? null;
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased text-base-content bg-base-100 transition-colors duration-300`}>
        <Providers>
          <Navbar isAuthenticated={isAuthenticated} rol={rol} nombre={nombre} foto_perfil_url={foto_perfil_url} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
