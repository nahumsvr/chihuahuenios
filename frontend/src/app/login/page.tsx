"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { loginAction } from "../../actions/auth/login";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-primary w-full font-bold mt-2 text-white"
      disabled={pending}
    >
      {pending && (
        <span className="loading loading-spinner loading-sm" />
      )}
      {pending ? "Iniciando Sesión..." : "Iniciar Sesión"}
    </button>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();

  // Redirección por query param (ej. /checkout) o por defecto a /
  const redirectPath = searchParams.get("redirect") || "/";
  const wasRegistered = searchParams.get("registered") === "true";

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [state, formAction] = useFormState(loginAction, null);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-200 px-4 py-12">
      {/* Círculos decorativos de gradiente (Glow effects) */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="card w-full max-w-md bg-base-100/60 backdrop-blur-xl border border-base-content/5 shadow-2xl p-6 z-10">
        <div className="card-body p-2 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">
              Chihuahueños
            </h1>
            <p className="text-sm text-base-content/70">
              Inicia sesión para continuar con tu compra
            </p>
          </div>

          {/* Alerta de Registro Exitoso */}
          {wasRegistered && !state?.errorMsg && (
            <div className="alert alert-success bg-success/15 border-success/20 text-success flex items-start gap-3 p-3 rounded-lg">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">
                ¡Cuenta creada con éxito! Por favor, inicia sesión.
              </div>
            </div>
          )}

          {/* Alerta de Error de Inicio de Sesión */}
          {state?.errorMsg && (
            <div className="alert alert-error bg-error/15 border-error/20 text-error flex items-start gap-3 p-3 rounded-lg">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{state.errorMsg}</div>
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-5">
            <input type="hidden" name="redirectPath" value={redirectPath} />
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="email">
                <span className="label-text font-medium text-base-content/80">
                  Correo electrónico
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-100/50 border-base-content/10 focus-within:border-primary focus-within:outline-none transition">
                <Mail className="h-4 w-4 text-base-content/50 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="grow text-base-content bg-transparent placeholder-base-content/40"
                  placeholder="correo@ejemplo.com"
                  required
                  autoComplete="username"
                />
              </label>
            </div>

            <div className="form-control w-full">
              <label className="label py-1" htmlFor="password">
                <span className="label-text font-medium text-base-content/80">
                  Contraseña
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-100/50 border-base-content/10 focus-within:border-primary focus-within:outline-none transition">
                <Lock className="h-4 w-4 text-base-content/50 pointer-events-none" />
                <input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  className="grow text-base-content bg-transparent placeholder-base-content/40"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  className="focus:outline-none hover:text-primary transition text-base-content/50"
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

            <SubmitButton />
          </form>

          <div className="text-center text-sm mt-4">
            <span className="text-base-content/70">¿No tienes una cuenta? </span>
            <Link
              href={
                redirectPath !== "/"
                  ? `/register?redirect=${encodeURIComponent(redirectPath)}`
                  : "/register"
              }
              className="text-primary font-semibold hover:underline"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-base-200">
          <div className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
