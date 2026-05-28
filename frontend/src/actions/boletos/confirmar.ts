"use server";

import { API_URL } from "../../constants";
import { AuthHeaders } from "../../helpers/authHeaders";
import { revalidateTag } from "next/cache";

export async function confirmarCompraAction(prevState: unknown, formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    const token = formData.get("token") as string;
    const viajeId = formData.get("viajeId") as string;
    if (!nombre || !token) {
      return { error: "Faltan datos requeridos (nombre o token)." };
    }

    const headers = await AuthHeaders();

    const response = await fetch(`${API_URL}/api/boletos/confirmar`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, token }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        return { error: "No autorizado. Inicia sesión nuevamente.", status: 401 };
      }
      return { error: data?.message || "Ocurrió un error al confirmar la compra." };
    }

    revalidateTag("mis-compras");
    if (viajeId) {
      revalidateTag(`viaje-${viajeId}`);
    }

    return {
      success: true,
      boleto_id: data.boleto_id,
      codigo_boleto: data.codigo_boleto,
    };
  } catch (error) {
    console.error("Error en confirmarCompraAction:", error);
    return { error: "Error de conexión con el servidor." };
  }
}
