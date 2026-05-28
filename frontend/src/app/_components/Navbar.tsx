"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/entities";
import { logoutAction } from "@/actions/auth/logout";

import ThemeToggle from "./ThemeToggle";

export default function Navbar({
  isAuthenticated = false,
  rol = null,
  nombre = null,
}: {
  isAuthenticated?: boolean;
  rol?: UserRole | null;
  nombre?: string | null;
}) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/")
      ? "btn-primary"
      : "btn-ghost";

  const initials = nombre
    ? nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : rol === "admin"
      ? "ADM"
      : "USR";

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
            {rol === "admin" ? (
              <>
                <li>
                  <Link href="/admin/rutas">Crear Ruta</Link>
                </li>
                <li>
                  <Link href="/admin/viajes">Crear Viaje</Link>
                </li>
                <li>
                  <Link href="/admin/lista">Lista de Viajes</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/">Buscar Viajes</Link>
                </li>
                <li>
                  <Link href="/rutas">Rutas Disponibles</Link>
                </li>
                <li>
                  <Link href="/viajes">Todos los Viajes</Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link href="/mis-compras">Mis Compras</Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
        <Link
          href={rol === "admin" ? "/admin/viajes" : "/"}
          className="gap-2 font-black text-primary text-xl btn btn-ghost"
        >
          <span>🚌</span> Chihuahueños
          {rol === "admin" && (
            <span className="font-semibold badge badge-warning badge-sm">
              Admin
            </span>
          )}
        </Link>
      </div>

      {/* Centro: links según rol */}
      <div className="hidden lg:flex navbar-center">
        <ul className="gap-2 px-1 menu menu-horizontal">
          {rol === "admin" ? (
            <>
              <li>
                <Link
                  href="/admin/viajes"
                  className={`btn btn-sm ${isActive("/admin/viajes")}`}
                >
                  Crear Viaje
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/lista"
                  className={`btn btn-sm ${isActive("/admin/lista")}`}
                >
                  Ver Viajes
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/rutas"
                  className={`btn btn-sm ${isActive("/admin/rutas")}`}
                >
                  Crear Ruta
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/" className={`btn btn-sm ${isActive("/")}`}>
                  Buscar
                </Link>
              </li>
              <li>
                <Link
                  href="/rutas"
                  className={`btn btn-sm ${isActive("/rutas")}`}
                >
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
              {isAuthenticated && (
                <li>
                  <Link
                    href="/mis-compras"
                    className={`btn btn-sm ${isActive("/mis-compras")}`}
                  >
                    Mis Compras
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>

      {/* Derecha: auth */}
      <div className="gap-2 navbar-end">
        <ThemeToggle />

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
            <div className="dropdown dropdown-end" title={nombre ?? undefined}>
              <div
                tabIndex={0}
                role="button"
                className={`avatar placeholder cursor-pointer`}
              >
                <div
                  className={`${
                    rol === "admin"
                      ? "bg-warning text-warning-content"
                      : "bg-primary text-primary-content"
                  } shadow-sm rounded-full w-8`}
                >
                  <span className="text-xs">{initials}</span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="z-[1] bg-base-100 shadow mt-3 p-2 rounded-box w-52 menu menu-sm dropdown-content"
              >
                {nombre && (
                  <li className="px-4 py-2 text-xs text-base-content/60 menu-title">
                    {nombre}
                  </li>
                )}
                {rol !== "admin" && (
                  <li>
                    <Link href="/mis-compras">Mis Compras</Link>
                  </li>
                )}
                <li>
                  <button onClick={() => logoutAction()} className="text-error">
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
