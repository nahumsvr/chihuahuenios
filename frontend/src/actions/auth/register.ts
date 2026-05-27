"use server";

import { API_URL } from "../../constants";
import { redirect } from "next/navigation";

export async function registerAction(prevState: unknown, formData: FormData) {
  const nombre = formData.get("nombre");
  const email = formData.get("email");
  const password = formData.get("new-password");
  const redirectPath = formData.get("redirectPath") as string || "/";

  if (!nombre || !email || !password) {
    return { errorMsg: "Todos los campos son obligatorios" };
  }

  if (password.toString().length < 6) {
    return { errorMsg: "La contraseña debe tener al menos 6 caracteres" };
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { errorMsg: data.message || "Error al registrar el usuario" };
    }
  } catch (err: unknown) {
    return { errorMsg: err instanceof Error ? err.message : "Error al registrar la cuenta" };
  }

  const loginUrl = redirectPath !== "/"
    ? `/login?registered=true&redirect=${encodeURIComponent(redirectPath)}`
    : "/login?registered=true";
    
  redirect(loginUrl);
}
