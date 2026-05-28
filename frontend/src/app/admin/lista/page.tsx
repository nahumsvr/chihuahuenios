import { API_URL } from "@/constants";
import AdminViajesList from "../viajes/_components/AdminViajesList";
import { RutaResumen } from "@/entities";

async function getRutas(): Promise<RutaResumen[]> {
  try {
    const res = await fetch(`${API_URL}/api/rutas`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AdminViajesListaPage() {
  const rutas = await getRutas();

  return (
    <main className="bg-base-200 px-4 py-12 min-h-screen">
      {/* Glow */}
      <div className="top-0 left-1/2 fixed bg-warning/5 blur-[120px] rounded-full w-[600px] h-[300px] -translate-x-1/2 pointer-events-none" />

      <div className="z-10 relative mx-auto max-w-5xl">
        <h1 className="mb-6 font-black text-3xl text-center">
          Gestión de Viajes
        </h1>
        <AdminViajesList rutas={rutas} />
      </div>
    </main>
  );
}
