import { API_URL } from "@/constants";
import { ViajeConDisponibilidad } from "@/entities";
import ViajeCard from "@/app/_components/ViajeCard";

export default async function ViajesPage() {
  let viajes: ViajeConDisponibilidad[] = [];
  try {
    const resViajes = await fetch(`${API_URL}/api/viajes/disponibles`, {
      next: { tags: ['viajes'] }
    });
    if (resViajes.ok) {
      viajes = await resViajes.json();
    }
  } catch (error) {
    console.error("Error fetching all viajes", error);
  }

  return (
    <main className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-primary drop-shadow-md">
            Todos los Viajes
          </h1>
          <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
            Explora todas las rutas y horarios disponibles actualmente.
          </p>
        </div>

        <section className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-base-content">Catálogo General</h2>
            <p className="text-base-content/70">
              Listado completo de viajes programados
            </p>
          </div>

          {viajes.length > 0 ? (
            <div className="flex flex-col gap-4">
              {viajes.map((viaje) => (
                <ViajeCard key={viaje.id} viaje={viaje} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-base-100 rounded-xl border border-base-200 shadow-sm">
              <div className="text-5xl mb-4">🚷</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No se encontraron viajes</h3>
              <p className="text-base-content/70">
                La API no retornó viajes o no hay salidas programadas.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
