import { cookies } from "next/headers";
import { cache } from "react";
import { TOKEN_NAME } from "../constants";

export const AuthHeaders = cache(async () => {
  const token = (await cookies()).get(TOKEN_NAME)?.value;
  return { Authorization: `Bearer ${token}` };
});
