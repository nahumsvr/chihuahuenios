"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Bus, CheckCircle, AlertTriangle } from "lucide-react";
import { createViajeAction } from "@/actions/admin/createViaje";
import { RutaResumen } from "@/entities";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      {pending && <span className="loading loading-spinner loading-sm" />}
      {pending ? "Creando Viaje..." : "Crear Viaje"}
    </button>
  );
}

export default function AdminViajesForm({ rutas }: { rutas: RutaResumen[] }) {
  const [state, formAction] = useFormState(createViajeAction, null);

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
            <Bus className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Crear Viaje</h1>
            <p className="text-sm text-gray-400">Panel de administración</p>
          </div>
        </div>
      </div>

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
              ¡Viaje creado exitosamente con ID{" "}
              <strong>{state.viaje?.id}</strong>!
            </span>
          </div>
        )}

        {rutas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm mb-4">
              No hay rutas disponibles. Primero crea una ruta.
            </p>
            <a href="/admin/rutas" className="btn btn-outline btn-sm btn-warning">
              Ir a Crear Ruta
            </a>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-5">
            {/* Ruta */}
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="ruta_id">
                <span className="label-text font-medium text-gray-300">
                  Ruta
                </span>
              </label>
              <select
                id="ruta_id"
                name="ruta_id"
                required
                className="select select-bordered w-full bg-white/[0.03] border-white/10 text-white focus:border-warning"
              >
                <option value="">Selecciona una ruta</option>
                {rutas.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.origen} → {r.destino}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha y hora */}
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="fecha_hora_inicio">
                <span className="label-text font-medium text-gray-300">
                  Fecha y hora de salida
                </span>
              </label>
              <input
                type="datetime-local"
                id="fecha_hora_inicio"
                name="fecha_hora_inicio"
                required
                min={new Date().toISOString().slice(0, 16)}
                className="input input-bordered w-full bg-white/[0.03] border-white/10 text-white focus:border-warning"
              />
            </div>

            {/* Duración y Capacidad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label py-1" htmlFor="duracion">
                  <span className="label-text font-medium text-gray-300">
                    Duración (min)
                  </span>
                </label>
                <input
                  type="number"
                  id="duracion"
                  name="duracion"
                  required
                  min={1}
                  placeholder="120"
                  className="input input-bordered w-full bg-white/[0.03] border-white/10 text-white placeholder-gray-500 focus:border-warning"
                />
              </div>

              <div className="form-control w-full">
                <label className="label py-1" htmlFor="capacidad">
                  <span className="label-text font-medium text-gray-300">
                    Capacidad
                  </span>
                </label>
                <input
                  type="number"
                  id="capacidad"
                  name="capacidad"
                  required
                  min={1}
                  max={100}
                  placeholder="40"
                  className="input input-bordered w-full bg-white/[0.03] border-white/10 text-white placeholder-gray-500 focus:border-warning"
                />
              </div>
            </div>

            {/* Precio (opcional) */}
            <div className="form-control w-full">
              <label className="label py-1" htmlFor="precio_boleto">
                <span className="label-text font-medium text-gray-300">
                  Precio por boleto (MXN)
                </span>
                <span className="label-text-alt text-gray-500">
                  Opcional — se calcula automáticamente
                </span>
              </label>
              <input
                type="number"
                id="precio_boleto"
                name="precio_boleto"
                min={0}
                step="0.01"
                placeholder="240.00"
                className="input input-bordered w-full bg-white/[0.03] border-white/10 text-white placeholder-gray-500 focus:border-warning"
              />
            </div>

            <SubmitButton />
          </form>
        )}
      </div>
    </div>
  );
}
