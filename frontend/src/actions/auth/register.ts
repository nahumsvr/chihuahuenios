"use server";

import { API_URL } from "../../constants";
import { redirect } from "next/navigation";

export async function registerAction(prevState: unknown, formData: FormData) {
  const nombre = formData.get("nombre");
  const email = formData.get("email");
  const password = formData.get("new-password");
  const redirectPath = (formData.get("redirectPath") as string) || "/";
  const identificacion = formData.get("identificacion") as File | null;

  if (!nombre || !email || !password) {
    return { errorMsg: "Todos los campos de texto son obligatorios" };
  }

  if (!identificacion || identificacion.size === 0) {
    return { errorMsg: "El documento de identidad es obligatorio para registrarse" };
  }

  if (password.toString().length < 6) {
    return { errorMsg: "La contraseña debe tener al menos 6 caracteres" };
  }

  // Construir FormData para enviar al backend como multipart/form-data
  const body = new FormData();
  body.append("nombre", nombre.toString());
  body.append("email", email.toString());
  body.append("password", password.toString());

  // Adjuntar identificación si fue proporcionada y tiene contenido
  if (identificacion && identificacion.size > 0) {
    body.append("identificacion", identificacion);
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      // NO establecer Content-Type manualmente: fetch lo configura automáticamente
      // con el boundary correcto para multipart/form-data
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      return { errorMsg: data.message || "Error al registrar el usuario" };
    }
  } catch (err: unknown) {
    return {
      errorMsg:
        err instanceof Error ? err.message : "Error al registrar la cuenta",
    };
  }

  const loginUrl =
    redirectPath !== "/"
      ? `/login?registered=true&redirect=${encodeURIComponent(redirectPath)}`
      : "/login?registered=true";

  redirect(loginUrl);
}
