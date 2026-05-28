"use server";

import { API_URL, TOKEN_NAME } from "../../constants";
import { AuthHeaders } from "../../helpers/authHeaders";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function uploadProfilePictureAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return { error: "No se seleccionó ninguna imagen válida." };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { error: "La imagen no debe exceder los 5MB." };
    }

    const headers = await AuthHeaders();

    const response = await fetch(`${API_URL}/auth/profile-picture`, {
      method: "PATCH",
      headers,
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        return { error: "No autorizado. Inicia sesión nuevamente.", status: 401 };
      }
      return { error: data?.message || "Ocurrió un error al subir la foto de perfil." };
    }

    // Actualizar la cookie con el nuevo token que contiene la foto_perfil_url
    if (data.access_token) {
      (await cookies()).set(TOKEN_NAME, data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 semana
      });
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error en uploadProfilePictureAction:", error);
    return { error: "Error de conexión con el servidor." };
  }
}
