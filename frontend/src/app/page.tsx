import { API_URL, TOKEN_NAME } from "@/constants";
import { RutaResumen, ViajeConDisponibilidad } from "@/entities";
import SearchForm from "@/app/_components/SearchForm";
import ViajeCard from "@/app/_components/ViajeCard";
import { cookies } from "next/headers";
import { ShieldCheck } from "lucide-react";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = (await cookies()).get(TOKEN_NAME)?.value;
  let rol = null;
  if (token) {
    rol = decodeJwtPayload(token)?.rol as string | null;
  }

  // Vista para el Administrador
  if (rol === "admin") {
    return (
      <main className="min-h-screen bg-[#07070a] py-20 px-4 flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-warning/5 blur-[120px] pointer-events-none" />
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-10 shadow-2xl max-w-lg w-full text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-warning/10 mx-auto">
            <ShieldCheck className="h-10 w-10 text-warning" />
          </div>
          <h1 className="text-3xl font-black text-white">Modo Administrador</h1>
          <p className="text-gray-400">
            Has iniciado sesión como administrador. Selecciona una opción del menú de navegación en la parte superior para comenzar a gestionar rutas y viajes.
          </p>
        </div>
      </main>
    );
  }

  const origen = searchParams.origen as string | undefined;
  const destino = searchParams.destino as string | undefined;
  const fecha = searchParams.fecha as string | undefined;

  let rutas: RutaResumen[] = [];
  try {
    const resRutas = await fetch(`${API_URL}/api/rutas`, {
      next: { tags: ["rutas"] },
    });
    if (resRutas.ok) {
      rutas = await resRutas.json();
    }
  } catch (error) {
    console.error("Error fetching rutas", error);
  }

  let viajes: ViajeConDisponibilidad[] = [];
  if (origen && destino && fecha) {
    try {
      const queryParams = new URLSearchParams({ origen, destino, fecha });
      const resViajes = await fetch(`${API_URL}/api/viajes?${queryParams.toString()}`, {
        cache: 'no-store'
      });
      if (resViajes.ok) {
        viajes = await resViajes.json();
      }
    } catch (error) {
      console.error("Error fetching viajes", error);
    }
  }

  return (
    <main className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-primary drop-shadow-md">
            Explorador de Rutas y Horarios
          </h1>
          <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
            Encuentra y reserva tus boletos de autobús al instante.
          </p>
        </div>

        <section className="relative z-10 -mx-4 sm:mx-0">
          <SearchForm rutas={rutas} />
        </section>

        <section className="space-y-6">
          {origen && destino && fecha && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-base-content">Resultados de tu Búsqueda</h2>
              <p className="text-base-content/70">
                Viajes de {origen} a {destino} para el {fecha}
              </p>
            </div>
          )}

          {viajes.length > 0 ? (
            <div className="flex flex-col gap-4">
              {viajes.map((viaje) => (
                <ViajeCard key={viaje.id} viaje={viaje} />
              ))}
            </div>
          ) : (
            origen && destino && fecha && (
              <div className="text-center py-16 bg-base-100 rounded-xl border border-base-200 shadow-sm">
                <div className="text-5xl mb-4">🚷</div>
                <h3 className="text-xl font-semibold text-base-content mb-2">No se encontraron viajes</h3>
                <p className="text-base-content/70">
                  Intenta con otra búsqueda.
                </p>
              </div>
            )
          )}
          
          {!origen && !destino && !fecha && (
            <div className="text-center py-20 bg-base-100 rounded-xl border border-base-200 shadow-sm">
              <div className="text-5xl mb-4">🚌</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">Comienza tu Búsqueda</h3>
              <p className="text-base-content/70 max-w-md mx-auto">
                Selecciona tus criterios de viaje en el formulario de arriba.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
