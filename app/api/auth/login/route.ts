import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTenantContext } from "@/lib/tenant";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { identifier, password, subdomain } = await req.json();

    if (!identifier || !password || !subdomain) {
      return NextResponse.json(
        { error: "Identifier, password, and subdomain are required" },
        { status: 400 },
      );
    }

    // Fetch tenant securely (throws if inactive or not found)
    let institution;
    try {
      institution = await getTenantContext(subdomain);
    } catch (err: unknown) {
      if (err instanceof Error) {return NextResponse.json({ error: err.message }, { status: 403 });}
      return NextResponse.json({ error: "Something went wrong" }, { status: 403 });
    }

    if (!institution) {
      return NextResponse.json({ error: "Institution context invalid" }, { status: 404 });
    }

    // Lookup user scoped explicitly to that tenant using their unique identifier
    const user = await prisma.user.findFirst({
      where: {
        identifier,
        tenant_id: institution.id, // Ensure we use the institution ID or tenant_id correctly based on the schema
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify bcrypt hash
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Allow login for both ACTIVE and TEMP (first-time) users
    if (user.status !== "ACTIVE" && user.status !== "TEMP") {
      return NextResponse.json({ error: "User is not active" }, { status: 403 });
    }

    // Generate JWT tied structurally to the specific tenant and role
    const token = signToken({
      user_id: user.id,
      tenant_id: user.tenant_id,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        identifier: user.identifier,
        role: user.role,
        tenant_id: user.tenant_id,
        status: user.status,
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
