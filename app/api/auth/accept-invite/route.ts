import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { token, password, firstName, lastName, identifier } = await req.json();

    if (!token || !password || !firstName || !lastName || !identifier) {
      return NextResponse.json({ error: 'Missing required profile fields' }, { status: 400 });
    }

    // 1. Validate the Token
    const invitation = await prisma.invitationToken.findUnique({
      where: { token }
    });

    if (!invitation || invitation.used) {
      return NextResponse.json({ error: 'Invalid or already used invitation token' }, { status: 400 });
    }

    if (new Date() > invitation.expires_at) {
      return NextResponse.json({ error: 'Invitation token has expired' }, { status: 400 });
    }

    // 2. Wrap consumption and creations in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Hash incoming password
      const hashedPassword = await hashPassword(password);

      // Create the root User entity
      const newUser = await tx.user.create({
        data: {
          email: invitation.email,
          password_hash: hashedPassword,
          role: invitation.role,
          tenant_id: invitation.tenant_id,
          identifier: identifier, // Login identifier
          status: 'ACTIVE'
        }
      });

      // Create specific sub-profile based on Role
      if (invitation.role === 'STUDENT') {
        await tx.studentProfile.create({
          data: {
            user_id: newUser.id,
            roll_number: identifier,
          }
        });
      } else if (invitation.role === 'FACULTY') {
        await tx.facultyProfile.create({
          data: {
            user_id: newUser.id,
            employee_number: identifier,
          }
        });
      }

      // Mark token as consumed
      await tx.invitationToken.update({
        where: { id: invitation.id },
        data: { used: true }
      });

      return { identifier };
    });

    return NextResponse.json({ 
      message: 'User registered successfully!',
      identifier: result.identifier
    }, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'This identifier (Roll/Employee No) is already registered in this institution' }, { status: 409 });
    }
    console.error('Accept Invite Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
