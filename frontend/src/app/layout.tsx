import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
  if (token) {
    const payload = decodeJwtPayload(token);
    rol = (payload?.rol as UserRole) ?? null;
    nombre = (payload?.nombre as string) ?? null;
  }

  return (
    <html lang="es" data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar isAuthenticated={isAuthenticated} rol={rol} nombre={nombre} />
        {children}
      </body>
    </html>
  );
}
