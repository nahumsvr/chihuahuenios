"use server";

import { API_URL, TOKEN_NAME } from "@/constants";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function createRutaAction(prevState: unknown, formData: FormData) {
  const origen = formData.get("origen")?.toString().trim();
  const destino = formData.get("destino")?.toString().trim();

  if (!origen || !destino) {
    return { error: "Origen y destino son obligatorios" };
  }

  if (origen.toLowerCase() === destino.toLowerCase()) {
    return { error: "El origen y el destino no pueden ser iguales" };
  }

  const token = (await cookies()).get(TOKEN_NAME)?.value;

  try {
    const response = await fetch(`${API_URL}/api/rutas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ origen, destino }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Error al crear la ruta" };
    }

    revalidateTag("rutas");

    return { success: true, ruta: data };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Error al crear la ruta",
    };
  }
}
