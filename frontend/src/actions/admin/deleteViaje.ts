"use server";

import { API_URL, TOKEN_NAME } from "@/constants";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteViajeAction(id: number) {
  const token = (await cookies()).get(TOKEN_NAME)?.value;

  if (!token) {
    return { error: "No autorizado" };
  }

  try {
    const response = await fetch(`${API_URL}/api/viajes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let message = "Error al eliminar el viaje";
      try {
        const data = await response.json();
        message = data.message || message;
      } catch {
        // Ignorar
      }
      return { error: message };
    }

    revalidatePath("/admin/viajes");
    return { success: true };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Error al eliminar el viaje",
    };
  }
}
