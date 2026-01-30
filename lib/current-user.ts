import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"

export async function getCurrentUser() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Not Authenticated!");
    }
    let user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: { tenant: true },
    });


    if (user) {
        // console.log("✅ User already exists in DB:", user);
        console.log("✅ User already exists in DB:", user.email);
        return user;
    }


    // ----------------- kinda second part --------------------
    const clerkUser = await currentUser();
    if (!clerkUser) {
        throw new Error("clerk user not found!");
    }
    console.log("------------------clerkUser==================")
    console.log(clerkUser.firstName)
    console.log(clerkUser.emailAddresses[0]?.emailAddress ?? "");
    // else pick name and email
    const name = clerkUser.fullName
        ?? `${clerkUser.firstName} ?? ""}${clerkUser.lastName
            ?? ""}`.trim() ?? "new user";

    const email = clerkUser.emailAddresses[0].emailAddress ?? "";

    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
        throw new Error("No tenant found");
    }

    user = await prisma.user.create({
        data: {
            clerkId: userId,
            tenantId: tenant.id,
            email: email,
            name: name,
            role: "STUDENT",
        },
        include: { tenant: true },
    })
    return user;
}