import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { prisma } from "./db";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  const payload = verifyToken(token) as {
    user_id: string;
    tenant_id: string;
    role: string;
  } | null;

  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.user_id, tenant_id: payload.tenant_id },
  });
}
