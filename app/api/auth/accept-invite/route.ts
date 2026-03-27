import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { token, password, firstName, lastName, username } = await req.json();

    if (!token || !password || !firstName || !lastName || !username) {
      return NextResponse.json({ error: 'Missing required profile fields' }, { status: 400 });
    }

    // 1. Validate the Token
    const invitation = await prisma.userInvitation.findUnique({
      where: { token }
    });

    if (!invitation || invitation.isUsed) {
      return NextResponse.json({ error: 'Invalid or already used invitation token' }, { status: 400 });
    }

    if (new Date() > invitation.expiresAt) {
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
          institutionId: invitation.institutionId
        }
      });

      let userId = '';
      if (existingUser) {
        // Update existing user
        await tx.user.update({
          where: { id: existingUser.id },
          data: {
            passwordHash: hashedPassword,
            accountStatus: 'ACTIVE',
            name: `${firstName} ${lastName}`,
            username: username // Students might be able to confirm/set this
          }
        });
        userId = existingUser.id;
      } else {
        // Create the root User entity
        const newUser = await tx.user.create({
          data: {
            email: invitation.email,
            passwordHash: hashedPassword,
            role: invitation.role,
            institutionId: invitation.institutionId,
            username: username, // Login username
            name: `${firstName} ${lastName}`,
            accountStatus: 'ACTIVE'
          }
        });
        userId = newUser.id;
      }

      // Create or Update specific sub-profile based on Role
      if (invitation.role === 'STUDENT') {
        const existingProfile = await tx.student.findUnique({ where: { userId: userId } });
        if (existingProfile) {
          await tx.student.update({
            where: { userId: userId },
            data: { rollNumber: username }
          });
        } else {
          await tx.student.create({
            data: {
              userId: userId,
              rollNumber: username,
            }
          });
        }
      } else if (invitation.role === 'FACULTY') {
        const existingProfile = await tx.faculty.findUnique({ where: { userId: userId } });
        if (existingProfile) {
          await tx.faculty.update({
            where: { userId: userId },
            data: { employeeNumber: username }
          });
        } else {
          await tx.faculty.create({
            data: {
              userId: userId,
              employeeNumber: username,
            }
          });
        }
      }

      // Mark token as consumed
      await tx.userInvitation.update({
        where: { id: invitation.id },
        data: { isUsed: true }
      });

      return { username };
    });

    return NextResponse.json({
      message: 'User registered successfully!',
      username: result.username
    }, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'This username (Roll/Employee No) is already registered in this institution' }, { status: 409 });
    }
    console.error('Accept Invite Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
