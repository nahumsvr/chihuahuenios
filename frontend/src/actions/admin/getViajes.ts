"use server";

import { API_URL, TOKEN_NAME } from "@/constants";
import { cookies } from "next/headers";
import { ViajeConDisponibilidad } from "@/entities";

export async function getViajesAdminAction(
  ruta_id?: string
): Promise<ViajeConDisponibilidad[]> {
  const token = (await cookies()).get(TOKEN_NAME)?.value;

  if (!token) return [];

  try {
    const query = ruta_id ? `?ruta_id=${ruta_id}` : "";
    const response = await fetch(`${API_URL}/api/viajes/all${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return [];

    return response.json();
  } catch {
    return [];
  }
}
