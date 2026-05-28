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
      className="rounded-2xl overflow-hidden w-full max-w-md"
      style={{ 
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#111827",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
    >
      {/* Header del boleto */}
      <div
        className="px-6 py-4"
        style={{ background: "linear-gradient(135deg, #6B21A8, #4F46E5)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              🚌 Chihuahueños
            </p>
            <p className="text-xl font-black mt-1" style={{ color: "#ffffff" }}>
              {viaje.ruta.origen}{" "}
              <span style={{ color: "rgba(255,255,255,0.6)" }}>→</span>{" "}
              {viaje.ruta.destino}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.7)" }}>Asiento</p>
            <p className="text-3xl font-black" style={{ color: "#ffffff" }}>{numero_asiento}</p>
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
            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#9ca3af" }}>
              Salida
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: "#111827" }}>
              {formatFecha(viaje.fecha_hora_salida)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#9ca3af" }}>
              Llegada estimada
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: "#111827" }}>
              {formatFecha(viaje.fecha_hora_llegada)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#9ca3af" }}>
              Duración
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: "#111827" }}>
              {formatDuracion(viaje.duracion)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#9ca3af" }}>
              Precio
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: "#111827" }}>
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
          value={codigo_boleto || ""}
          size={72}
          bgColor="#f9fafb"
          fgColor="#1e1b4b"
          level="M"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "#9ca3af" }}>
            Código de boleto
          </p>
          <p
            className="font-mono text-xs break-all"
            style={{ color: "#374151" }}
            title={codigo_boleto || ""}
          >
            {codigo_boleto || "Sin código"}
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
    const { toPng } = await import("html-to-image");

    const el = printRef.current;
    const width = el.scrollWidth;
    const height = el.scrollHeight;

    const imgData = await toPng(el, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      width: width,
      height: height,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      }
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // A4 size in mm is 210 x 297
    const pdfWidth = pdf.internal.pageSize.getWidth();
    
    // Set a fixed width for the ticket in the PDF (e.g., 120mm)
    const imgWidth = 120;
    const ratio = height / width;
    const imgHeight = imgWidth * ratio;
    
    // Center the ticket horizontally
    const x = (pdfWidth - imgWidth) / 2;
    const y = 20;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save(
      `boleto-${boleto.viaje.ruta.origen}-${boleto.viaje.ruta.destino}-${(boleto.codigo_boleto || "codigo").substring(0, 8)}.pdf`
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Boleto visual (oculto en la interfaz, pero renderizado para la captura) */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <BoletoCard boleto={boleto} printRef={printRef} />
      </div>
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
