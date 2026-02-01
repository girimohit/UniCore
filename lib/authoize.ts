import { MODULES, Permission } from "@/modules/registry";
import prisma from "./prisma";

export async function authorize(
    { clerkId, tenantId, moduleKey, permissions }:
        { clerkId: string; tenantId: string; moduleKey: keyof typeof MODULES; permissions: Permission }) {

    const user = await prisma.user.findUnique({
        where: { clerkId },
    });

    if (!user) throw new Error("User not found");
    if (user.tenantId != tenantId) throw new Error("Cross Tenant Access Denied!")

    const meta = MODULES[moduleKey];

    if (!meta.rolesAllowed.includes(user.role)) {
        throw new Error("Role not allowed");
    }

    if (!meta.permissions.includes(permissions)) {
        throw new Error("Permissions Denied");
    }

    return true;

}   