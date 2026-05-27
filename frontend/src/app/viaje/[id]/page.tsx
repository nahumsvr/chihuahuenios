import { API_URL, TOKEN_NAME } from "@/constants";
import { cookies } from "next/headers";
import { Boleto } from "@/entities";
import SeatMap from "./_components/SeatMap";
import Link from "next/link";

export default async function ViajePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  let boletos: Boleto[] = [];
  try {
    const res = await fetch(`${API_URL}/api/viajes/${id}/boletos`, {
      cache: "no-store",
    });
    if (res.ok) {
      boletos = await res.json();
    }
  } catch (error) {
    console.error("Error fetching boletos for viaje", id, error);
  }

  // Verificar autenticación
  const token = (await cookies()).get(TOKEN_NAME)?.value;
  const isAuthenticated = !!token;

  return (
    <main className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/viajes" className="btn btn-ghost btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver a Viajes
          </Link>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-primary drop-shadow-md">
            Elige tu Asiento
          </h1>
          <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
            Selecciona el asiento de tu preferencia para asegurar tu lugar.
          </p>
        </div>

        <section className="relative z-10 w-full flex justify-center">
          {boletos.length > 0 ? (
            <SeatMap 
              boletos={boletos} 
              isAuthenticated={isAuthenticated} 
              viajeId={id} 
            />
          ) : (
            <div className="text-center py-16 bg-base-100 rounded-xl border border-base-200 shadow-sm w-full max-w-2xl">
              <div className="text-5xl mb-4">🪑</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No se encontraron asientos</h3>
              <p className="text-base-content/70">
                Ocurrió un error al cargar los asientos o este viaje no existe.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
