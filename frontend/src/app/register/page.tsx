"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, AlertTriangle } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mantener el flujo de redirección si venía de otra parte (ej. checkout)
  const redirectPath = searchParams.get("redirect") || "/";

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // Validación local básica
    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar el usuario");
      }

      // Redireccionar al login con el indicador de registro exitoso
      const loginUrl = redirectPath !== "/"
        ? `/login?registered=true&redirect=${encodeURIComponent(redirectPath)}`
        : "/login?registered=true";
        
      router.push(loginUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Hubo un problema al registrar la cuenta. Inténtalo de nuevo.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070a] px-4 py-12">
      {/* Círculos decorativos de gradiente (Glow effects) */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="card w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl p-6">
        <div className="card-body p-2 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Crear Cuenta</h1>
            <p className="text-sm text-gray-400">
              Regístrate para reservar tus boletos de autobús
            </p>
          </div>

          {/* Alerta de Error de Registro */}
          {errorMsg && (
            <div className="alert alert-error bg-error/15 border-error/20 text-error flex items-start gap-3 p-3 rounded-lg">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="nombre">
                <span className="label-text font-medium text-gray-300">Nombre completo</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-white/[0.03] border-white/10 focus-within:border-primary focus-within:outline-none transition">
                <User className="h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  className="grow text-white bg-transparent placeholder-gray-500"
                  placeholder="Juan Pérez"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoComplete="name"
                />
              </label>
            </div>

            <div className="form-control w-full">
              <label className="label py-1" htmlFor="email">
                <span className="label-text font-medium text-gray-300">Correo electrónico</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-white/[0.03] border-white/10 focus-within:border-primary focus-within:outline-none transition">
                <Mail className="h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="grow text-white bg-transparent placeholder-gray-500"
                  placeholder="correo@ejemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </label>
            </div>

            <div className="form-control w-full">
              <label className="label py-1" htmlFor="new-password">
                <span className="label-text font-medium text-gray-300">Contraseña</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-white/[0.03] border-white/10 focus-within:border-primary focus-within:outline-none transition">
                <Lock className="h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type={isVisible ? "text" : "password"}
                  name="new-password"
                  id="new-password"
                  className="grow text-white bg-transparent placeholder-gray-500"
                  placeholder="Mínimo 6 caracteres"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  className="focus:outline-none hover:text-white transition text-gray-400"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="Toggle password visibility"
                >
                  {isVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full font-bold mt-2 text-white"
              disabled={isLoading}
            >
              {isLoading && <span className="loading loading-spinner loading-sm" />}
              {isLoading ? "Creando Cuenta..." : "Registrarse"}
            </button>
          </form>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-400">¿Ya tienes una cuenta? </span>
            <Link
              href={
                redirectPath !== "/"
                  ? `/login?redirect=${encodeURIComponent(redirectPath)}`
                  : "/login"
              }
              className="text-primary font-semibold hover:underline"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#07070a] text-white">
          <div className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
