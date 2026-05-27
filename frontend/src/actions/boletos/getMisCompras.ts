"use server";

import { API_URL, TOKEN_NAME } from "@/constants";
import { cookies } from "next/headers";
import { CompraResumen } from "@/entities";

export async function getMisComprasAction(): Promise<CompraResumen[]> {
  const token = (await cookies()).get(TOKEN_NAME)?.value;

  if (!token) return [];

  try {
    const response = await fetch(`${API_URL}/api/boletos/mis-compras`, {
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
