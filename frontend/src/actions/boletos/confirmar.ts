"use server";

import { API_URL } from "../../constants";
import { AuthHeaders } from "../../helpers/authHeaders";

export async function confirmarCompraAction(prevState: unknown, formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    const token = formData.get("token") as string;
    const identificacion = formData.get("identificacion") as File;

    if (!nombre || !token || !identificacion) {
      return { error: "Faltan datos requeridos (nombre, token o identificación)." };
    }

    if (identificacion.size > 5 * 1024 * 1024) {
      return { error: "El archivo no debe exceder los 5MB." };
    }

    const headers = await AuthHeaders();

    // FormData ya contiene nombre, token e identificacion tal como lo envió el cliente.
    // Fetch nativo se encargará de establecer el Content-Type correcto (multipart/form-data con boundary).
    const response = await fetch(`${API_URL}/api/boletos/confirmar`, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        return { error: "No autorizado. Inicia sesión nuevamente.", status: 401 };
      }
      return { error: data?.message || "Ocurrió un error al confirmar la compra." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en confirmarCompraAction:", error);
    return { error: "Error de conexión con el servidor." };
  }
}
