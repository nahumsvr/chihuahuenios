"use server";

import { API_URL, TOKEN_NAME } from "../../constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectPath = formData.get("redirectPath") as string || "/";

  if (!email || !password) {
    return { errorMsg: "El correo y la contraseña son obligatorios" };
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { errorMsg: data.message || "Credenciales incorrectas" };
    }

    // Guardar JWT en cookie
    (await cookies()).set(TOKEN_NAME, data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (err: unknown) {
    return { errorMsg: err instanceof Error ? err.message : "Error al iniciar sesión" };
  }

  redirect(redirectPath);
}
