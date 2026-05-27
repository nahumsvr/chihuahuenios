"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/actions/auth/logout";

export default function Navbar({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const isActive = (path: string) => {
    return pathname === path ? "btn-primary" : "btn-ghost";
  };

  return (
    <div className="top-0 z-50 sticky bg-base-100 shadow-md border-base-200 border-b navbar">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="lg:hidden btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="z-[1] bg-base-100 shadow mt-3 p-2 rounded-box w-52 menu menu-sm dropdown-content"
          >
            <li>
              <Link href="/">Buscar Viajes</Link>
            </li>
            <li>
              <Link href="/rutas">Rutas Disponibles</Link>
            </li>
            <li>
              <Link href="/viajes">Todos los Viajes</Link>
            </li>
          </ul>
        </div>
        <Link
          href="/"
          className="gap-2 font-black text-primary text-xl btn btn-ghost"
        >
          <span>🚌</span> Chihuahueños
        </Link>
      </div>
      <div className="hidden lg:flex navbar-center">
        <ul className="gap-2 px-1 menu menu-horizontal">
          <li>
            <Link href="/" className={`btn btn-sm ${isActive("/")}`}>
              Buscar
            </Link>
          </li>
          <li>
            <Link href="/rutas" className={`btn btn-sm ${isActive("/rutas")}`}>
              Rutas
            </Link>
          </li>
          <li>
            <Link
              href="/viajes"
              className={`btn btn-sm ${isActive("/viajes")}`}
            >
              Viajes
            </Link>
          </li>
        </ul>
      </div>
      <div className="gap-2 navbar-end">
        {!isAuthenticated ? (
          <>
            <Link href="/login" className="btn-outline btn btn-sm">
              Ingresar
            </Link>
            <Link href="/register" className="btn btn-sm btn-primary">
              Registrarse
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="avatar placeholder" title="Mi Cuenta">
              <div className="bg-primary shadow-sm rounded-full w-8 text-primary-content cursor-pointer">
                <span className="text-xs">USR</span>
              </div>
            </div>
            <button
              onClick={() => logoutAction()}
              className="hover:bg-error/10 text-error btn btn-sm btn-ghost"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
