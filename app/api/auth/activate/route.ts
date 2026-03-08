import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import type { NextRequest } from 'next/server';

// GET /api/auth/activate?token=xyz — validates a token and returns basic info
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const invitation = await prisma.invitationToken.findUnique({ where: { token } });

  if (!invitation) {
    return NextResponse.json({ error: 'Invalid activation link' }, { status: 404 });
  }
  if (invitation.used) {
    return NextResponse.json({ error: 'This link has already been used' }, { status: 410 });
  }
  if (invitation.expires_at < new Date()) {
    return NextResponse.json({ error: 'Activation link has expired' }, { status: 410 });
  }

  return NextResponse.json({
    valid: true,
    email: invitation.email,
    role: invitation.role,
    tenant_id: invitation.tenant_id,
  });
}

// POST /api/auth/activate — activates the student account
export async function POST(req: NextRequest) {
  try {
    const { token, roll_number, password, confirm_password, phone_number } = await req.json();

    if (!token || !roll_number || !password || !confirm_password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (password !== confirm_password) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const invitation = await prisma.invitationToken.findUnique({ where: { token } });

    if (!invitation || invitation.used) {
      return NextResponse.json({ error: 'Invalid or already used activation link' }, { status: 410 });
    }
    if (invitation.expires_at < new Date()) {
      return NextResponse.json({ error: 'Activation link has expired' }, { status: 410 });
    }

    // Find the user by email + tenant
    const user = await prisma.user.findFirst({
      where: {
        email: invitation.email,
        tenant_id: invitation.tenant_id,
        role: 'STUDENT',
      },
      include: { studentProfile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Student account not found' }, { status: 404 });
    }

    // Verify roll_number matches what admin registered
    if (user.studentProfile?.roll_number !== roll_number) {
      return NextResponse.json({ error: 'Roll number does not match our records' }, { status: 401 });
    }

    const hashedPassword = await hashPassword(password);

    // Transactionally activate the account
    await prisma.$transaction([
      // 1. Set password and mark active
      prisma.user.update({
        where: { id: user.id },
        data: { password_hash: hashedPassword, status: 'ACTIVE' }
      }),
      // 2. Update phone on student profile
      prisma.studentProfile.update({
        where: { user_id: user.id },
        data: { phone: phone_number ?? null }
      }),
      // 3. Mark invitation token as used
      prisma.invitationToken.update({
        where: { token },
        data: { used: true }
      }),
    ]);

    // Issue JWT for auto-login after activation
    const jwtToken = signToken({
      user_id: user.id,
      tenant_id: user.tenant_id,
      role: 'STUDENT',
    });

    const response = NextResponse.json({
      message: 'Account activated successfully',
      redirect: `/${user.tenant_id}/student/dashboard`
    });

    response.cookies.set({
      name: 'auth_token',
      value: jwtToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (error) {
    console.error('Activation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
