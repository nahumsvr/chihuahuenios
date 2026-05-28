"use client";

import { useState, useEffect, useCallback } from "react";
import { RutaResumen, ViajeConDisponibilidad } from "@/entities";
import { getViajesAdminAction } from "@/actions/admin/getViajes";
import { deleteViajeAction } from "@/actions/admin/deleteViaje";
import { Trash2, AlertTriangle, Search } from "lucide-react";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminViajesList({ rutas }: { rutas: RutaResumen[] }) {
  const [viajes, setViajes] = useState<ViajeConDisponibilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [rutaIdFilter, setRutaIdFilter] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchViajes = useCallback(async () => {
    setLoading(true);
    const data = await getViajesAdminAction(rutaIdFilter || undefined);
    setViajes(data);
    setLoading(false);
  }, [rutaIdFilter]);

  useEffect(() => {
    fetchViajes();
  }, [fetchViajes]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este viaje? Esta acción no se puede deshacer.")) {
      return;
    }
    
    setErrorMsg(null);
    setDeletingId(id);
    const result = await deleteViajeAction(id);
    
    if (result.error) {
      setErrorMsg(result.error);
    } else {
      await fetchViajes();
    }
    setDeletingId(null);
  };

  return (
    <div className="bg-base-100/60 backdrop-blur-xl border border-base-content/5 rounded-2xl p-6 shadow-2xl mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-base-content">Viajes Programados</h2>
        
        {/* Filtro por ruta */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
          <select
            value={rutaIdFilter}
            onChange={(e) => setRutaIdFilter(e.target.value)}
            className="select select-bordered select-sm w-full pl-9 bg-base-100/50 border-base-content/10 text-base-content focus:border-warning"
          >
            <option value="">Todas las rutas</option>
            {rutas.map((r) => (
              <option key={r.id} value={r.id}>
                {r.origen} → {r.destino}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="alert bg-error/15 border-error/20 text-error flex items-center gap-3 mb-6 p-3 rounded-lg text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="py-10 flex justify-center">
          <span className="loading loading-spinner loading-lg text-warning"></span>
        </div>
      ) : viajes.length === 0 ? (
        <div className="text-center py-10 text-base-content/60">
          No se encontraron viajes.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-left text-sm text-base-content/80">
            <thead className="text-base-content/60 uppercase bg-base-content/5">
              <tr>
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Ruta</th>
                <th className="py-3 px-4 font-semibold">Salida</th>
                <th className="py-3 px-4 font-semibold text-center">Asientos</th>
                <th className="py-3 px-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {viajes.map((v) => (
                <tr key={v.id} className="border-b border-base-content/5">
                  <td className="py-3 px-4 font-mono">#{v.id}</td>
                  <td className="py-3 px-4 font-medium text-base-content">
                    {v.ruta.origen} → {v.ruta.destino}
                  </td>
                  <td className="py-3 px-4">{formatFecha(v.fecha_hora_salida)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="badge badge-sm badge-outline border-base-content/20 text-base-content/80">
                      {v.asientos_disponibles}/{v.total_asientos} libres
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {v.has_sold_boletos ? (
                      <span className="text-xs text-base-content/50 italic" title="No se puede eliminar porque ya tiene boletos vendidos">
                        Con ventas
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDelete(v.id)}
                        disabled={deletingId === v.id}
                        className="btn btn-ghost btn-xs text-error hover:bg-error/20"
                        title="Eliminar Viaje"
                      >
                        {deletingId === v.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
