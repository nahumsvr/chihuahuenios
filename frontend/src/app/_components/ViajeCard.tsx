"use client";

import Link from "next/link";
import { ViajeConDisponibilidad } from "@/entities";

interface ViajeCardProps {
  viaje: ViajeConDisponibilidad;
}

export default function ViajeCard({ viaje }: ViajeCardProps) {
  const date = new Date(viaje.fecha_hora_salida);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString();

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 transition-all hover:-translate-y-1 hover:shadow-2xl">
      <div className="card-body flex-row justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="card-title text-2xl font-bold text-primary mb-1">
            {timeString}
          </h2>
          <p className="text-base-content/70 text-sm">{dateString}</p>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{viaje.ruta.origen}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="font-semibold">{viaje.ruta.destino}</span>
          </div>
          <p className="text-sm mt-1">
            <span className="badge badge-neutral badge-sm mr-2">Directo</span>
            Autobús de Primera
          </p>
        </div>

        <div className="text-center min-w-[120px]">
          <div className="text-2xl font-black text-success">$ {Math.floor(Math.random() * (1200 - 500) + 500)}</div>
          <div className="text-xs text-base-content/60">Precio Simulado</div>
        </div>

        <div className="text-center min-w-[120px]">
          <div className={`text-lg font-bold ${viaje.asientos_disponibles > 10 ? 'text-success' : 'text-error'}`}>
            {viaje.asientos_disponibles} / {viaje.total_asientos}
          </div>
          <div className="text-xs text-base-content/60">Asientos Disponibles</div>
        </div>

        <div className="card-actions justify-end">
          <Link href={`/viaje/${viaje.id}`} className="btn btn-primary">
            Ver Asientos
          </Link>
        </div>
      </div>
    </div>
  );
}
