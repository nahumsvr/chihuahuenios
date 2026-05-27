import { API_URL } from "@/constants";
import { RutaResumen } from "@/entities";
import Link from "next/link";

export default async function RutasPage() {
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

  return (
    <main className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Rutas Disponibles Section */}
        <section className="space-y-6 pt-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-primary drop-shadow-md">Nuestras Rutas Disponibles</h2>
            <p className="text-lg text-base-content/80 mt-2">
              Conoce todos los destinos a los que viajamos diariamente
            </p>
          </div>

          {rutas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rutas.map((ruta) => (
                <div key={ruta.id} className="card bg-base-100 shadow-md border border-base-200 hover:shadow-xl transition-all">
                  <div className="card-body items-center text-center">
                    <h3 className="card-title text-xl text-primary mb-2">
                      {ruta.origen} <span className="text-base-content mx-2">→</span> {ruta.destino}
                    </h3>
                    <p className="text-sm text-base-content/70 mb-4">
                      Viajes diarios disponibles. Viaja seguro y cómodo.
                    </p>
                    <div className="card-actions">
                      <Link 
                        href={`/?origen=${encodeURIComponent(ruta.origen)}&destino=${encodeURIComponent(ruta.destino)}&fecha=${new Date().toISOString().split('T')[0]}`} 
                        className="btn btn-outline btn-primary btn-sm"
                      >
                        Buscar Salidas
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-base-100 rounded-xl border border-base-200 shadow-sm">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No se encontraron rutas</h3>
              <p className="text-base-content/70">
                La API no retornó rutas o el catálogo está vacío.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
