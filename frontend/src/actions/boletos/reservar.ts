"use server";

import { API_URL } from "../../constants";
import { AuthHeaders } from "../../helpers/authHeaders";
import { revalidateTag } from "next/cache";

export async function reservarBoletoAction(boletoId: number, viajeId: string) {
  try {
    const headers = await AuthHeaders();
    
    // AuthHeaders will only have a valid token if the user is authenticated.
    // However, if there's no token, we can still attempt the request and let the backend return 401.
    
    const response = await fetch(`${API_URL}/api/boletos/${boletoId}/reservar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return { error: "No autenticado", status: 401 };
      }
      if (response.status === 409) {
        return { error: "El asiento ya no está disponible", status: 409 };
      }
      return { error: data.message || "Error al reservar el asiento", status: response.status };
    }

    revalidateTag(`viaje-${viajeId}`);
    return { success: true, reserva_token: data.reserva_token };
  } catch (error) {
    console.error("Error en reservarBoletoAction:", error);
    return { error: "Error de conexión", status: 500 };
  }
}
