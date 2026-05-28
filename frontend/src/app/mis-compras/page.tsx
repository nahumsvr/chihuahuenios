import { getMisComprasAction } from "@/actions/boletos/getMisCompras";
import { DescargarBoleto } from "@/app/_components/BoletoCard";
import { CompraResumen } from "@/entities";
import { ShoppingBag, Ticket } from "lucide-react";

export const metadata = {
  title: "Mis Compras — Chihuahueños",
  description: "Consulta y descarga tus boletos de autobús.",
};

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

function CompraCard({ compra }: { compra: CompraResumen }) {
  const boletoData = {
    codigo_boleto: compra.codigo_boleto,
    numero_asiento: compra.numero_asiento,
    precio: compra.precio,
    viaje: compra.viaje,
  };

  return (
    <div className="bg-base-100/60 backdrop-blur-xl border border-base-content/5 rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-base-content/60 text-xs font-semibold uppercase tracking-wider mb-1">
            {formatFecha(compra.viaje.fecha_hora_salida)}
          </p>
          <h2 className="text-base-content text-xl font-black">
            {compra.viaje.ruta.origen}{" "}
            <span className="text-base-content/50">→</span>{" "}
            {compra.viaje.ruta.destino}
          </h2>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="text-base-content/60 text-xs">Asiento</p>
          <p className="text-primary text-2xl font-black">
            {compra.numero_asiento}
          </p>
        </div>
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-base-content/5 rounded-lg p-3 text-center">
          <p className="text-base-content/60 text-xs mb-1">Precio</p>
          <p className="text-base-content text-sm font-bold">
            ${Number(compra.precio).toFixed(2)}
          </p>
        </div>
        <div className="bg-base-content/5 rounded-lg p-3 text-center">
          <p className="text-base-content/60 text-xs mb-1">Duración</p>
          <p className="text-base-content text-sm font-bold">
            {Math.floor(compra.viaje.duracion / 60)}h{" "}
            {compra.viaje.duracion % 60}min
          </p>
        </div>
        <div className="bg-base-content/5 rounded-lg p-3 text-center">
          <p className="text-base-content/60 text-xs mb-1">Viaje ID</p>
          <p className="text-base-content text-sm font-bold">#{compra.viaje.id}</p>
        </div>
      </div>

      {/* Código + botón descarga */}
      <div className="border-t border-base-content/5 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Ticket className="h-4 w-4 text-primary shrink-0" />
            <p
              className="font-mono text-xs text-base-content/60 truncate"
              title={compra.codigo_boleto}
            >
              {compra.codigo_boleto}
            </p>
          </div>
          <DescargarBoleto boleto={boletoData} />
        </div>
      </div>
    </div>
  );
}

export default async function MisComprasPage() {
  const compras = await getMisComprasAction();

  return (
    <main className="min-h-screen bg-base-200 py-12 px-4">
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-base-content">Mis Compras</h1>
            <p className="text-sm text-base-content/70">
              {compras.length === 0
                ? "No tienes boletos aún"
                : `${compras.length} boleto${compras.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Lista de compras */}
        {compras.length === 0 ? (
          <div className="text-center py-20 bg-base-100/50 rounded-2xl border border-base-content/5">
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-base-content text-xl font-bold mb-2">
              Sin compras todavía
            </h2>
            <p className="text-base-content/60 text-sm mb-6">
              Cuando compres un boleto, aparecerá aquí.
            </p>
            <a href="/" className="btn btn-primary btn-sm">
              Buscar Viajes
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {compras.map((compra) => (
              <CompraCard key={compra.id} compra={compra} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
