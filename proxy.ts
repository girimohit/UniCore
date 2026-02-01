import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export default clerkMiddleware(async (auth, req) => {
  // auth is AuthFn → MUST be called
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Fetch tenantId from DB
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true },
  });

  if (!user?.tenantId) {
    return NextResponse.json(
      { error: "User not associated with a tenant" },
      { status: 403 }
    );
  }

  // Inject tenantId into request headers
  const headers = new Headers(req.headers);
  headers.set("x-tenant-id", user.tenantId);

  return NextResponse.next({
    request: { headers },
  });
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};