"use client";

import Link from "next/link";
import { ViajeConDisponibilidad } from "@/entities";

interface ViajeCardProps {
  viaje: ViajeConDisponibilidad;
}

export default function ViajeCard({ viaje }: ViajeCardProps) {
  const date = new Date(viaje.fecha_hora_salida);
  const startTimeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = date.toLocaleDateString();

  let durationMinutes = viaje.duracion;
  let endDate: Date;

  if (viaje.fecha_hora_llegada) {
    endDate = new Date(viaje.fecha_hora_llegada);
    if (!durationMinutes) {
      durationMinutes = Math.round(
        (endDate.getTime() - date.getTime()) / 60000,
      );
    }
  } else {
    durationMinutes = durationMinutes || 120; // Default 2 horas
    endDate = new Date(date.getTime() + durationMinutes * 60000);
  }

  const endTimeString = endDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const durationString = `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();

  return (
    <div className="bg-base-100 shadow-xl hover:shadow-2xl border border-base-200 transition-all hover:-translate-y-1 card">
      <div className="flex-row flex-wrap justify-between items-center gap-4 card-body">
        <div className="flex flex-col min-w-[140px]">
          <div className="flex items-baseline gap-2">
            <h2 className="mb-0 font-bold text-primary text-2xl card-title">
              {startTimeString}
            </h2>
            <span className="font-medium text-xs text-base-content/50">
              Llegada {endTimeString}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-base-content/70">{dateString}</span>
            <span className="shadow-sm badge-outline font-bold badge badge-primary badge-sm">
              {durationString}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="flex justify-center items-center gap-2">
            <span className="font-semibold">{viaje.ruta.origen}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-base-content/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
            <span className="font-semibold">{viaje.ruta.destino}</span>
          </div>
        </div>

        <div className="min-w-[120px] text-center">
          <div className="font-black text-success text-2xl">
            $ {Number(viaje.precio_boleto || 0).toFixed(2)}
          </div>
          <div className="text-xs text-base-content/60">Precio por boleto</div>
        </div>

        <div className="min-w-[120px] text-center">
          <div
            className={`text-lg font-bold ${viaje.asientos_disponibles > 10 ? "text-success" : "text-error"}`}
          >
            {viaje.asientos_disponibles} / {viaje.total_asientos}
          </div>
          <div className="text-xs text-base-content/60">
            Asientos Disponibles
          </div>
        </div>

        <div className="justify-end card-actions">
          <Link href={`/viaje/${viaje.id}`} className="btn btn-primary">
            Ver Asientos
          </Link>
        </div>
      </div>
    </div>
  );
}
