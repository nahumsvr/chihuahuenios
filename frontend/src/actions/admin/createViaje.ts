"use server";

import { API_URL, TOKEN_NAME } from "@/constants";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function createViajeAction(
  prevState: unknown,
  formData: FormData
) {
  const ruta_id = Number(formData.get("ruta_id"));
  const fecha_hora_inicio = formData.get("fecha_hora_inicio")?.toString();
  const duracion = Number(formData.get("duracion"));
  const capacidad = Number(formData.get("capacidad"));
  const precio_boleto = formData.get("precio_boleto")
    ? Number(formData.get("precio_boleto"))
    : undefined;

  if (!ruta_id || !fecha_hora_inicio || !duracion || !capacidad) {
    return { error: "Todos los campos obligatorios deben estar completos" };
  }

  if (duracion <= 0 || capacidad <= 0) {
    return { error: "Duración y capacidad deben ser mayores a 0" };
  }

  const token = (await cookies()).get(TOKEN_NAME)?.value;

  try {
    const response = await fetch(`${API_URL}/api/viajes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ruta_id,
        fecha_hora_inicio,
        duracion,
        capacidad,
        ...(precio_boleto !== undefined && { precio_boleto }),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Error al crear el viaje" };
    }

    revalidateTag("viajes");

    return { success: true, viaje: data };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Error al crear el viaje",
    };
  }
}
