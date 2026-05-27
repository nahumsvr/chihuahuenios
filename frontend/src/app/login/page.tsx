"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardBody, Input, Button, Link } from "@heroui/react";
import { Mail, Lock, Eye, EyeOff, AlertTriangle, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirección por query param (ej. /checkout) o por defecto a /
  const redirectPath = searchParams.get("redirect") || "/";
  const wasRegistered = searchParams.get("registered") === "true";

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

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      // Guardar JWT en localStorage
      localStorage.setItem("token", data.access_token);
      
      // Redirigir a la página previa o al inicio
      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Hubo un problema al iniciar sesión. Inténtalo de nuevo.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070a] px-4 py-12">
      {/* Círculos decorativos de gradiente (Glow effects) */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/15 blur-[90px] pointer-events-none" />

      <Card className="w-full max-w-md border border-white/5 bg-black/40 backdrop-blur-xl p-4 shadow-2xl">
        <CardHeader className="flex flex-col items-center gap-1 pb-6 pt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Chihuahueños</h1>
          <p className="text-sm text-default-400 text-center">
            Inicia sesión para continuar con tu compra
          </p>
        </CardHeader>
        <CardBody>
          {/* Alerta de Registro Exitoso */}
          {wasRegistered && !errorMsg && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-success-500/20 bg-success-500/10 p-3 text-success-400">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">
                ¡Cuenta creada con éxito! Por favor, inicia sesión a continuación.
              </div>
            </div>
          )}

          {/* Alerta de Error de Inicio de Sesión */}
          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-danger-500/20 bg-danger-500/10 p-3 text-danger-400">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              type="email"
              name="email"
              id="email"
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              labelPlacement="outside"
              variant="bordered"
              isRequired
              value={email}
              onValueChange={setEmail}
              autoComplete="username"
              startContent={<Mail className="h-4 w-4 text-default-400 pointer-events-none" />}
              className="text-white"
              classNames={{
                inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-primary",
                label: "text-default-300 font-medium",
              }}
            />

            <Input
              type={isVisible ? "text" : "password"}
              name="password"
              id="password"
              label="Contraseña"
              placeholder="••••••••"
              labelPlacement="outside"
              variant="bordered"
              isRequired
              value={password}
              onValueChange={setPassword}
              autoComplete="current-password"
              startContent={<Lock className="h-4 w-4 text-default-400 pointer-events-none" />}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="Toggle password visibility"
                >
                  {isVisible ? (
                    <EyeOff className="h-4 w-4 text-default-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-default-400" />
                  )}
                </button>
              }
              classNames={{
                inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-primary",
                label: "text-default-300 font-medium",
              }}
            />

            <Button
              type="submit"
              color="primary"
              variant="solid"
              className="w-full font-bold mt-2"
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-default-400">¿No tienes una cuenta? </span>
            <Link
              href={
                redirectPath !== "/"
                  ? `/register?redirect=${encodeURIComponent(redirectPath)}`
                  : "/register"
              }
              size="sm"
              className="text-primary font-semibold hover:underline"
            >
              Regístrate aquí
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#07070a] text-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
