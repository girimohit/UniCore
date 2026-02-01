import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { authorize } from "@/lib/authorize";
import { createCourse } from ". /service";

export async function POST(req: NextRequest) {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tenantId = req.headers.get("x-tenant-id")!;
    const body = await req.json();

    await authorize({
        clerkId: userId,
        tenantId,
        moduleKey: "COURSE",
        permission: "create",
    });

    const course = await createCourse(tenantId, body);
    return NextResponse.json(course);
}
