"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "btn-primary" : "btn-ghost";
  };

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 border-b border-base-200">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/">Buscar Viajes</Link></li>
            <li><Link href="/rutas">Rutas Disponibles</Link></li>
            <li><Link href="/viajes">Todos los Viajes</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-black text-primary gap-2">
          <span>🚌</span> Chihuahueños
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
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
            <Link href="/viajes" className={`btn btn-sm ${isActive("/viajes")}`}>
              Viajes
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <Link href="/login" className="btn btn-sm btn-outline">
          Ingresar
        </Link>
        <Link href="/register" className="btn btn-sm btn-primary">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
