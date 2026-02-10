import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await req.json();

  const tenant = await prisma.tenant.findUnique({
    where: { code },
  });

  if (!tenant) {
    return Response.json(
      { error: "Invalid institute code" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (existing) {
    return Response.json({ success: true });
  }

  const clerk = await currentUser();
  if (!clerk) {
    return Response.json({ error: "Clerk user not found" }, { status: 400 });
  }

  await prisma.user.create({
    data: {
      clerkId: userId,
      email: clerk.emailAddresses[0].emailAddress,
      name: clerk.fullName ?? "New User",
      role: "STUDENT",
      tenantId: tenant.id,
    },
  });

  return Response.json({ success: true });
}
