"use server";

import { TOKEN_NAME } from "../../constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  (await cookies()).delete(TOKEN_NAME);
  redirect("/login");
}
