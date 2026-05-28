import { API_URL } from "@/constants";
import AdminViajesForm from "./_components/AdminViajesForm";
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

export default async function AdminViajesPage() {
  const rutas = await getRutas();

  return (
    <main className="min-h-screen bg-base-200 py-12 px-4">
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-warning/5 blur-[120px] pointer-events-none" />
      <AdminViajesForm rutas={rutas} />
    </main>
  );
}
