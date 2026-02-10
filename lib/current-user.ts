import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Used for routing / authorization.
 * Returns null if user is not onboarded yet.
 */
export async function getCurrentUserOrNull() {
  const { userId } = await auth();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { clerkId: userId },
    include: { tenant: true },
  });
}

/**
 * Used when user MUST exist.
 * Throws if user is not onboarded.
 */
export async function getCurrentUser() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    throw new Error("User not onboarded");
  }
  return user;
}






// import prisma from "@/lib/prisma";
// import { auth, currentUser } from "@clerk/nextjs/server";

// export async function getCurrentUser() {
//     const { userId } = await auth();
//     if (!userId) {
//         throw new Error("Not authenticated");
//     }

//     let user = await prisma.user.findUnique({
//         where: { clerkId: userId },
//         include: { tenant: true },
//     });

//     if (user) return user;

//     const clerkUser = await currentUser();
//     if (!clerkUser) {
//         throw new Error("Clerk user not found");
//     }

//     const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
//     const name =
//         clerkUser.fullName ??
//         `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();

//     // TEMP: first tenant (you already marked this as temporary)
//     const tenant = await prisma.tenant.findFirst();
//     if (!tenant) {
//         throw new Error("No tenant found");
//     }

//     return prisma.user.create({
//         data: {
//             clerkId: userId,
//             email,
//             name,
//             tenantId: tenant.id,
//             role: "STUDENT",
//         },
//         include: { tenant: true },
//     });
// }

// export async function getCurrentUserOrNull() {
//   const { userId } = await auth();
//   if (!userId) return null;

//   return prisma.user.findUnique({
//     where: { clerkId: userId },
//   });
// }

// // import prisma from "@/lib/prisma";
// // import { auth, currentUser } from "@clerk/nextjs/server"

// // export async function getCurrentUser() {
// //     const { userId } = await auth();
// //     if (!userId) {
// //         throw new Error("Not Authenticated!");
// //     }
// //     let user = await prisma.user.findUnique({
// //         where: { clerkId: userId },
// //         include: { tenant: true },
// //     });


// //     if (user) {
// //         // console.log("✅ User already exists in DB:", user);
// //         console.log("✅ User already exists in DB:", user.email);
// //         return user;
// //     }


// //     // ----------------- kinda second part --------------------
// //     const clerkUser = await currentUser();
// //     if (!clerkUser) {
// //         throw new Error("clerk user not found!");
// //     }
// //     console.log("------------------clerkUser==================")
// //     console.log(clerkUser.firstName)
// //     console.log(clerkUser.emailAddresses[0]?.emailAddress ?? "");
// //     // else pick name and email
// //     const name = clerkUser.fullName
// //         ?? `${clerkUser.firstName} ?? ""}${clerkUser.lastName
// //             ?? ""}`.trim() ?? "new user";

// //     const email = clerkUser.emailAddresses[0].emailAddress ?? "";

// //     const tenant = await prisma.tenant.findFirst();
// //     if (!tenant) {
// //         throw new Error("No tenant found");
// //     }

// //     user = await prisma.user.create({
// //         data: {
// //             clerkId: userId,
// //             tenantId: tenant.id,
// //             email: email,
// //             name: name,
// //             role: "STUDENT",
// //         },
// //         include: { tenant: true },
// //     })
// //     return user;
// // }