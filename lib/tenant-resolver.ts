import prisma from "@/lib/prisma";
import { getCurrentUser } from "./current-user";

// Temporary tenant resolver
// Later this will use auth (user → tenant mapping)
export async function resolveTenant(req: Request) {
    const tenantCode = req.headers.get("x-tenant-code");
    if (!tenantCode) {
        throw new Error("Tenant code missing");
    }

    const tenant = await prisma.tenant.findUnique({
        where: { code: tenantCode },
    });

    if (!tenant) {
        throw new Error("Tenant not found");
    }
    return tenant;
}

// will uselater 
export async function resolveTenantFromAuth() {
    const userClerk = await getCurrentUser();
    return userClerk.tenantId;
}