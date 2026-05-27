"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DescargarBoleto, BoletoData } from "@/app/_components/BoletoCard";

/**
 * Lee el boleto confirmado de sessionStorage y muestra el boleto descargable.
 * Si no hay datos, muestra solo el mensaje de éxito genérico.
 */
export default function CheckoutSuccessClient() {
  const [boleto, setBoleto] = useState<BoletoData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("boleto_confirmado");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        // Solo renderizar el boleto si tenemos la información del viaje completa
        if (data?.codigo_boleto && data?.viaje?.ruta) {
          setBoleto(data as BoletoData);
        }
      } catch {
        // Datos corruptos — ignorar
      }
      sessionStorage.removeItem("boleto_confirmado");
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mensaje de éxito */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-base-content">
          ¡Compra Exitosa!
        </h1>
        <p className="text-base-content/70 text-sm max-w-sm">
          Tu boleto ha sido confirmado. Descárgalo y preséntalo al abordar.
        </p>
      </div>

      {/* Boleto descargable o código simple */}
      {boleto ? (
        <DescargarBoleto boleto={boleto} />
      ) : (
        <div className="bg-base-200 rounded-xl p-4 text-center text-base-content/60 text-sm">
          El boleto ha sido registrado. Consúltalo en{" "}
          <Link href="/mis-compras" className="text-primary font-semibold hover:underline">
            Mis Compras
          </Link>
          .
        </div>
      )}

      <Link href="/" className="btn btn-ghost btn-sm">
        Volver al Inicio
      </Link>
    </div>
  );
}
