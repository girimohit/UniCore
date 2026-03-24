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

      // Check if user already exists (pre-created by admin)
      const existingUser = await tx.user.findFirst({
        where: { 
          email: invitation.email,
          tenant_id: invitation.tenant_id
        }
      });

      let userId = '';
      if (existingUser) {
        // Update existing user
        await tx.user.update({
          where: { id: existingUser.id },
          data: {
            password_hash: hashedPassword,
            status: 'ACTIVE',
            name: `${firstName} ${lastName}`,
            identifier: identifier // Students might be able to confirm/set this
          }
        });
        userId = existingUser.id;
      } else {
        // Create the root User entity
        const newUser = await tx.user.create({
          data: {
            email: invitation.email,
            password_hash: hashedPassword,
            role: invitation.role,
            tenant_id: invitation.tenant_id,
            identifier: identifier, // Login identifier
            name: `${firstName} ${lastName}`,
            status: 'ACTIVE'
          }
        });
        userId = newUser.id;
      }

      // Create or Update specific sub-profile based on Role
      if (invitation.role === 'STUDENT') {
        const existingProfile = await tx.studentProfile.findUnique({ where: { user_id: userId } });
        if (existingProfile) {
          await tx.studentProfile.update({
            where: { user_id: userId },
            data: { roll_number: identifier }
          });
        } else {
          await tx.studentProfile.create({
            data: {
              user_id: userId,
              roll_number: identifier,
            }
          });
        }
      } else if (invitation.role === 'FACULTY') {
        const existingProfile = await tx.facultyProfile.findUnique({ where: { user_id: userId } });
        if (existingProfile) {
          await tx.facultyProfile.update({
            where: { user_id: userId },
            data: { employee_number: identifier }
          });
        } else {
          await tx.facultyProfile.create({
            data: {
              user_id: userId,
              employee_number: identifier,
            }
          });
        }
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
