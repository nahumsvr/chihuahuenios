"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { confirmarCompraAction } from "@/actions/boletos/confirmar";

export default function CheckoutForm({ token }: { token: string }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos en segundos
  const [expired, setExpired] = useState(false);
  const [resumen, setResumen] = useState<{ viajeId?: string, numero_asiento?: number } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Leer el resumen del storage
    const storageReserva = sessionStorage.getItem("reserva_activa");
    if (storageReserva) {
      try {
        setResumen(JSON.parse(storageReserva));
      } catch (e) {
        console.error("Error parsing reserva_activa", e);
      }
    }

    // Timer regressivo
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleReturnHome = () => {
    sessionStorage.removeItem("reserva_activa");
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (expired) return;

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre");
    if (!nombre) {
      setErrorMsg("Debes ingresar el nombre del pasajero.");
      return;
    }

    // Agregar token oculto que viene de la URL
    formData.append("token", token);
    
    // Pasar viajeId para revalidar
    if (resumen?.viajeId) {
      formData.append("viajeId", String(resumen.viajeId));
    }

    setLoading(true);
    setErrorMsg(null);

    const result = await confirmarCompraAction(null, formData);

    if (result.error) {
      setErrorMsg(result.error);
      setLoading(false);
      return;
    }

    if (result.success) {
      // Guardar código del boleto para mostrarlo en la página de éxito
      if (result.codigo_boleto) {
        const reservaData = sessionStorage.getItem("reserva_activa");
        const reserva = reservaData ? JSON.parse(reservaData) : {};
        sessionStorage.setItem(
          "boleto_confirmado",
          JSON.stringify({
            ...reserva,
            codigo_boleto: result.codigo_boleto,
            boleto_id: result.boleto_id,
          })
        );
      }
      sessionStorage.removeItem("reserva_activa");
      router.push("/checkout/success");
    }
  };

  if (expired) {
    return (
      <div className="bg-base-100 p-8 rounded-xl shadow-xl border border-base-200 text-center space-y-6">
        <div className="text-6xl">⏱️</div>
        <h2 className="text-2xl font-bold text-error">Tiempo de reserva expirado</h2>
        <p className="text-base-content/70">
          Lo sentimos, los 10 minutos de tolerancia para confirmar tu boleto han finalizado. El asiento ha sido liberado.
        </p>
        <button onClick={handleReturnHome} className="btn btn-primary">
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start w-full">
      
      {/* Columna Izquierda: Formulario */}
      <div className="flex-1 w-full bg-base-100 p-8 rounded-xl shadow-lg border border-base-200">
        <h2 className="text-2xl font-bold mb-6 text-base-content">Validación de Identidad</h2>
        
        {errorMsg && (
          <div className="alert alert-error shadow-sm mb-6 text-sm">
            <span>{errorMsg}</span>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Nombre Completo del Pasajero</span>
            </label>
            <input 
              type="text" 
              name="nombre" 
              required
              placeholder="Ej. Juan Pérez" 
              className="input input-bordered w-full" 
            />
          </div>



          <button 
            type="submit" 
            className="btn btn-primary w-full text-lg h-auto py-3 mt-4 shadow-md"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Procesando transacciones...
              </>
            ) : (
              "Confirmar y Registrar Boleto"
            )}
          </button>
        </form>
      </div>

      {/* Columna Derecha: Resumen y Timer */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        
        <div className="bg-primary/10 border-2 border-primary/30 p-6 rounded-xl shadow-lg text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-primary opacity-10">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h3 className="font-bold text-primary mb-2">Tiempo Restante</h3>
          <div className="text-5xl font-black tracking-widest font-mono text-primary drop-shadow-sm">
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs mt-3 text-base-content/70 font-medium">
            Tu asiento está bloqueado temporalmente.
          </p>
        </div>

        <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-200">
          <h3 className="text-xl font-bold mb-4 border-b border-base-200 pb-2">Detalles del Viaje</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base-content/70 text-sm">Asiento Seleccionado</span>
              <span className="font-bold text-lg text-primary">{resumen?.numero_asiento || "--"}</span>
            </div>
            {/* Si tuviéramos más datos en resumen, los mostraríamos aquí */}
            <div className="flex justify-between items-center">
              <span className="text-base-content/70 text-sm">Token de Reserva</span>
              <span className="font-mono text-xs truncate max-w-[120px] text-base-content/50" title={token}>
                {token.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
