"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { MapPin, CheckCircle, AlertTriangle } from "lucide-react";
import { createRutaAction } from "@/actions/admin/createRuta";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary w-full"
    >
      {pending && <span className="loading loading-spinner loading-sm" />}
      {pending ? "Creando..." : "Crear Ruta"}
    </button>
  );
}

export default function AdminRutasPage() {
  const [state, formAction] = useFormState(createRutaAction, null);
  const [rutasCreadas, setRutasCreadas] = useState<
    { origen: string; destino: string }[]
  >([]);

  // Si el state tiene éxito, agregar a la lista local
  if (
    state?.success &&
    state.ruta &&
    !rutasCreadas.some(
      (r) => r.origen === state.ruta.origen && r.destino === state.ruta.destino
    )
  ) {
    setRutasCreadas((prev) => [
      { origen: state.ruta.origen, destino: state.ruta.destino },
      ...prev,
    ]);
  }

  return (
    <main className="min-h-screen bg-[#07070a] py-12 px-4">
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-warning/5 blur-[120px] pointer-events-none" />

      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <MapPin className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Crear Ruta</h1>
              <p className="text-sm text-gray-400">Panel de administración</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl">
          {state?.error && (
            <div className="alert bg-error/15 border-error/20 text-error flex items-center gap-3 mb-6 p-3 rounded-lg">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span className="text-sm">{state.error}</span>
            </div>
          )}

          {state?.success && (
            <div className="alert bg-success/15 border-success/20 text-success flex items-center gap-3 mb-6 p-3 rounded-lg">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm">
                Ruta{" "}
                <strong>
                  {state.ruta?.origen} → {state.ruta?.destino}
                </strong>{" "}
                creada exitosamente
              </span>
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-5">
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="origen">
                <span className="label-text font-medium text-gray-300">
                  Ciudad de Origen
                </span>
              </label>
              <input
                type="text"
                id="origen"
                name="origen"
                required
                placeholder="Ej. Chihuahua"
                className="input input-bordered w-full bg-white/[0.03] border-white/10 text-white placeholder-gray-500 focus:border-warning"
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1" htmlFor="destino">
                <span className="label-text font-medium text-gray-300">
                  Ciudad de Destino
                </span>
              </label>
              <input
                type="text"
                id="destino"
                name="destino"
                required
                placeholder="Ej. Ciudad Juárez"
                className="input input-bordered w-full bg-white/[0.03] border-white/10 text-white placeholder-gray-500 focus:border-warning"
              />
            </div>

            <SubmitButton />
          </form>
        </div>

        {/* Historial de rutas creadas en esta sesión */}
        {rutasCreadas.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              Rutas creadas en esta sesión
            </h2>
            <div className="flex flex-col gap-2">
              {rutasCreadas.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/5"
                >
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  <span className="text-white text-sm">
                    <span className="font-medium">{r.origen}</span>
                    <span className="text-gray-400 mx-2">→</span>
                    <span className="font-medium">{r.destino}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
