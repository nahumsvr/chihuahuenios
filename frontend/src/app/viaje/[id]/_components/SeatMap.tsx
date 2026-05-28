"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Boleto } from "@/entities";
import { reservarBoletoAction } from "@/actions/boletos/reservar";

interface SeatMapProps {
  boletos: Boleto[];
  isAuthenticated: boolean;
  viajeId: string;
}

export default function SeatMap({ boletos, isAuthenticated, viajeId }: SeatMapProps) {
  const [selectedAsientoId, setSelectedAsientoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleSeatClick = (boleto: Boleto) => {
    // Si está ocupado o bloqueado (y bloqueado_hasta es futuro) no hacemos nada
    const isLocked = boleto.estado !== "disponible" || (boleto.bloqueado_hasta ? new Date(boleto.bloqueado_hasta) > new Date() : false);
    if (isLocked) return;

    setSelectedAsientoId(boleto.id);
    setErrorMsg(null);
  };

  const handleContinuar = async () => {
    if (!selectedAsientoId) return;

    if (!isAuthenticated) {
      sessionStorage.setItem(
        "reserva_activa",
        JSON.stringify({
          boletoId: selectedAsientoId,
          viajeId: viajeId,
        })
      );
      router.push("/login?redirectPath=/viaje/" + viajeId);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const result = await reservarBoletoAction(selectedAsientoId, viajeId);

    if (result.error) {
      setErrorMsg(result.error);
      setLoading(false);
      
      // Si es 409, refrescar la data de la página para actualizar los bloqueados
      if (result.status === 409) {
        setSelectedAsientoId(null);
        router.refresh();
      }
      return;
    }

    if (result.success && result.reserva_token) {
      const selectedBoleto = boletos.find(b => b.id === selectedAsientoId);
      sessionStorage.setItem(
        "reserva_activa",
        JSON.stringify({
          boletoId: selectedAsientoId,
          numero_asiento: selectedBoleto?.numero_asiento,
          viajeId: viajeId,
          token: result.reserva_token,
        })
      );
      router.push("/checkout?token=" + result.reserva_token);
    }
  };

  // Asumimos un bus de 4 columnas. 
  const sortedBoletos = [...boletos].sort((a, b) => a.numero_asiento - b.numero_asiento);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Mapa de asientos */}
      <div className="flex-1 w-full bg-base-100 p-8 rounded-xl shadow-lg border border-base-200 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-base-content text-center">
          Selecciona tu Asiento
        </h2>

        {/* Frente del autobús */}
        <div className="w-full max-w-[320px] mb-8 relative">
           <div className="h-12 bg-base-200 rounded-t-3xl border-2 border-b-0 border-base-300 flex items-center justify-center">
             <span className="text-base-content/50 text-xs font-semibold uppercase tracking-widest">Conductor</span>
           </div>
        </div>

        {/* Grid de asientos */}
        <div className="grid grid-cols-5 gap-x-2 gap-y-4 max-w-[320px] w-full justify-items-center">
          {sortedBoletos.map((boleto, index) => {
            const isLocked = boleto.estado !== "disponible" || (boleto.bloqueado_hasta ? new Date(boleto.bloqueado_hasta) > new Date() : false);
            const isSelected = selectedAsientoId === boleto.id;

            // Grid cols 5: Asiento | Asiento | Pasillo | Asiento | Asiento
            const colPos = index % 4;
            
            return (
              <div key={boleto.id} className="contents">
                <button
                  disabled={isLocked}
                  onClick={() => handleSeatClick(boleto)}
                  className={`
                    w-12 h-12 rounded-t-xl rounded-b-sm font-bold text-sm transition-all shadow-sm
                    border-b-4 flex items-center justify-center
                    ${isSelected 
                      ? "bg-primary text-primary-content border-primary scale-105 shadow-md" 
                      : isLocked 
                        ? "bg-base-300 text-base-content/40 border-base-300 cursor-not-allowed" 
                        : "bg-success text-success-content border-success hover:bg-success/80 hover:-translate-y-1 cursor-pointer"
                    }
                  `}
                >
                  {isLocked && !isSelected ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    boleto.numero_asiento
                  )}
                </button>
                
                {colPos === 1 && <div className="w-8"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel lateral */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-200">
          <h3 className="text-xl font-bold mb-4 text-base-content">Tu Selección</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-base-content/70">Asiento:</span>
              <span className="font-bold text-2xl text-primary">
                {selectedAsientoId 
                  ? boletos.find(b => b.id === selectedAsientoId)?.numero_asiento 
                  : "--"}
              </span>
            </div>

            {errorMsg && (
              <div className="alert alert-error shadow-sm text-sm">
                <span>{errorMsg}</span>
              </div>
            )}
            
            <button 
              className="btn btn-primary w-full mt-4 text-lg h-auto py-3"
              disabled={!selectedAsientoId || loading}
              onClick={handleContinuar}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Continuar al Pago"
              )}
            </button>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-200">
          <h4 className="font-semibold mb-4 text-base-content/80">Leyenda</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success rounded-t-xl rounded-b-sm border-b-4 border-success"></div>
              <span className="text-base-content/70">Disponible</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-t-xl rounded-b-sm border-b-4 border-primary"></div>
              <span className="text-base-content/70">Tu Selección</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-base-300 rounded-t-xl rounded-b-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-base-content/70">Ocupado / Bloqueado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
