"use client";

import React, { useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertTriangle,
  FileText,
  UploadCloud,
  X,
} from "lucide-react";
import { registerAction } from "../../actions/auth/register";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-primary w-full font-bold mt-2 text-white"
      disabled={pending}
    >
      {pending && <span className="loading loading-spinner loading-sm" />}
      {pending ? "Creando Cuenta..." : "Registrarse"}
    </button>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [state, formAction] = useFormState(registerAction, null);

  // Estado del archivo de identificación
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      // Crear nuevo DataTransfer para asignar el archivo al input
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;
    if (selectedFile.type === "application/pdf") {
      return <FileText className="h-5 w-5 text-error" />;
    }
    return <FileText className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070a] px-4 py-12">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="card w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl p-6">
        <div className="card-body p-2 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Crear Cuenta
            </h1>
            <p className="text-sm text-gray-400">
              Regístrate para reservar tus boletos de autobús
            </p>
          </div>

          {/* Error */}
          {state?.errorMsg && (
            <div className="alert alert-error bg-error/15 border-error/20 text-error flex items-start gap-3 p-3 rounded-lg">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{state.errorMsg}</div>
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-5" encType="multipart/form-data">
            <input type="hidden" name="redirectPath" value={redirectPath} />

            {/* Nombre */}
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="nombre">
                <span className="label-text font-medium text-gray-300">
                  Nombre completo
                </span>
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
                  autoComplete="name"
                />
              </label>
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="email">
                <span className="label-text font-medium text-gray-300">
                  Correo electrónico
                </span>
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
                  autoComplete="username"
                />
              </label>
            </div>

            {/* Contraseña */}
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="new-password">
                <span className="label-text font-medium text-gray-300">
                  Contraseña
                </span>
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
                  minLength={6}
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

            {/* Documento de identidad */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium text-gray-300">
                  Documento de identidad
                </span>
                <span className="label-text-alt text-gray-500">
                  PDF, JPG, PNG — máx. 5MB
                </span>
              </label>

              {/* Input oculto */}
              <input
                ref={fileInputRef}
                type="file"
                name="identificacion"
                id="identificacion"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Drop zone visual */}
              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`
                    flex flex-col items-center justify-center gap-3 p-6 rounded-xl
                    border-2 border-dashed cursor-pointer transition-all
                    ${
                      isDragging
                        ? "border-primary bg-primary/10 scale-[1.01]"
                        : "border-white/10 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5"
                    }
                  `}
                >
                  <UploadCloud
                    className={`h-8 w-8 transition ${
                      isDragging ? "text-primary" : "text-gray-500"
                    }`}
                  />
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      <span className="text-primary font-semibold">
                        Haz clic para subir
                      </span>{" "}
                      o arrastra tu documento
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Identificación oficial vigente
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
                  {getFileIcon()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="p-1 rounded-full hover:bg-error/20 text-gray-400 hover:text-error transition"
                    aria-label="Eliminar archivo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <SubmitButton />
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
