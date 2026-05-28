import { API_URL } from "@/constants";
import AdminViajesList from "../_components/AdminViajesList";
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
    <main className="min-h-screen bg-[#07070a] py-12 px-4">
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-warning/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-3xl font-black text-white mb-6 text-center">Gestión de Viajes</h1>
        <AdminViajesList rutas={rutas} />
      </div>
    </main>
  );
}
