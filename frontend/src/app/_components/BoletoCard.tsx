"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export interface BoletoData {
  codigo_boleto: string;
  numero_asiento: number;
  precio: number;
  viaje: {
    id: number;
    fecha_hora_salida: string;
    fecha_hora_llegada: string;
    duracion: number;
    precio_boleto: number;
    ruta: {
      origen: string;
      destino: string;
    };
  };
}

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

function formatDuracion(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + "min" : ""}` : `${m}min`;
}

/**
 * Componente visual del boleto — optimizado para captura con html2canvas.
 */
export function BoletoCard({
  boleto,
  printRef,
}: {
  boleto: BoletoData;
  printRef?: React.RefObject<HTMLDivElement>;
}) {
  const { viaje, codigo_boleto, numero_asiento, precio } = boleto;

  return (
    <div
      ref={printRef}
      className="bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl w-full max-w-md"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header del boleto */}
      <div
        className="px-6 py-4"
        style={{ background: "linear-gradient(135deg, #6B21A8, #4F46E5)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
              🚌 Chihuahueños
            </p>
            <p className="text-white text-xl font-black mt-1">
              {viaje.ruta.origen}{" "}
              <span style={{ color: "rgba(255,255,255,0.6)" }}>→</span>{" "}
              {viaje.ruta.destino}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs">Asiento</p>
            <p className="text-white text-3xl font-black">{numero_asiento}</p>
          </div>
        </div>
      </div>

      {/* Cuerpo con puntos de desgarre */}
      <div
        className="relative"
        style={{
          borderTop: "2px dashed #e5e7eb",
        }}
      >
        {/* Semicírculos decorativos */}
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "-12px",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#f3f4f6",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-12px",
            right: "-12px",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#f3f4f6",
          }}
        />

        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Salida
            </p>
            <p className="text-gray-900 text-sm font-bold mt-1">
              {formatFecha(viaje.fecha_hora_salida)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Llegada estimada
            </p>
            <p className="text-gray-900 text-sm font-bold mt-1">
              {formatFecha(viaje.fecha_hora_llegada)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Duración
            </p>
            <p className="text-gray-900 text-sm font-bold mt-1">
              {formatDuracion(viaje.duracion)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Precio
            </p>
            <p className="text-gray-900 text-sm font-bold mt-1">
              ${Number(precio).toFixed(2)} MXN
            </p>
          </div>
        </div>
      </div>

      {/* Footer con QR */}
      <div
        className="px-6 py-4 flex items-center gap-4"
        style={{
          borderTop: "2px dashed #e5e7eb",
          background: "#f9fafb",
        }}
      >
        <QRCodeSVG
          value={codigo_boleto}
          size={72}
          bgColor="#f9fafb"
          fgColor="#1e1b4b"
          level="M"
        />
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">
            Código de boleto
          </p>
          <p
            className="font-mono text-xs text-gray-700 break-all"
            title={codigo_boleto}
          >
            {codigo_boleto}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Botón que genera el PDF del boleto usando jsPDF + html2canvas.
 */
export function DescargarBoleto({ boleto }: { boleto: BoletoData }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDescargar = async () => {
    if (!printRef.current) return;

    // Import dinámico para no aumentar el bundle inicial
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(
      `boleto-${boleto.viaje.ruta.origen}-${boleto.viaje.ruta.destino}-${boleto.codigo_boleto.substring(0, 8)}.pdf`
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Boleto visual (oculto para captura, visible para preview) */}
      <BoletoCard boleto={boleto} printRef={printRef} />
      <button
        onClick={handleDescargar}
        className="btn btn-primary btn-sm gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Descargar PDF
      </button>
    </div>
  );
}
