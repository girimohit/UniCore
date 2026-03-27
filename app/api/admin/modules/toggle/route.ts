import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";
import { SYSTEM_MODULES } from "@/lib/modules/registry";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { moduleId, isActive } = await req.json();

    if (!moduleId || typeof isActive !== "boolean") {
      return new NextResponse("Invalid request", { status: 400 });
    }

    const moduleDef = SYSTEM_MODULES[moduleId];
    if (!moduleDef) {
      return new NextResponse("Module not found", { status: 404 });
    }

    if (moduleDef.type === 'CORE' && !isActive) {
      return new NextResponse("Cannot disable core modules", { status: 400 });
    }

    // Upsert the subscription record
    const updated = await prisma.moduleSubscription.upsert({
      where: {
        institutionId_moduleId: {
          institutionId: user.institutionId,
          moduleId: moduleId,
        },
      },
      update: {
        isActive: isActive,
      },
      create: {
        institutionId: user.institutionId,
        moduleId: moduleId,
        isActive: isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[MODULE_TOGGLE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
