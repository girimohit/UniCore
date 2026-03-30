import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTenantContext } from "@/lib/tenant";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, subdomain } = body;

    if (!username || !password || !subdomain) {
      return NextResponse.json(
        { error: "Username, password, and subdomain are required" },
        { status: 400 },
      );
    }

    // Fetch tenant securely (throws if inactive or not found)
    let institution;
    try {
      institution = await getTenantContext(subdomain);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return NextResponse.json({ error: err.message }, { status: 403 });
      }
      return NextResponse.json({ error: "Something went wrong" }, { status: 403 });
    }

    if (!institution) {
      return NextResponse.json({ error: "Institution context invalid" }, { status: 404 });
    }

    // Lookup user scoped explicitly to that tenant using their unique username
    const user = await prisma.user.findFirst({
      where: {
        username,
        institutionId: institution.id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify bcrypt hash
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Allow login for both ACTIVE and TEMP (first-time) users
    if (user.accountStatus !== "ACTIVE" && user.accountStatus !== "TEMP") {
      return NextResponse.json({ error: "User is not active" }, { status: 403 });
    }

    // Generate JWT tied structurally to the specific tenant and role
    const token = signToken({
      userId: user.id,
      institutionId: user.institutionId,
      institutionSlug: institution.slug,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        institutionId: user.institutionId,
        status: user.accountStatus,
        avatarUrl: user.avatarUrl,
      },
    });

    // Set secure HttpOnly cookie for session persistence
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
