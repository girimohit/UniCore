import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { token, password, firstName, lastName, identifierNo } = await req.json();

    if (!token || !password || !firstName || !lastName || !identifierNo) {
      return NextResponse.json({ error: 'Missing required profile fields' }, { status: 400 });
    }

    // 1. Validate the Token
    const invitation = await prisma.invitationToken.findUnique({
      where: { token }
    });

    if (!invitation || invitation.isUsed) {
      return NextResponse.json({ error: 'Invalid or already used invitation token' }, { status: 400 });
    }

    if (new Date() > invitation.expires_at) {
      return NextResponse.json({ error: 'Invitation token has expired' }, { status: 400 });
    }

    // 2. Wrap consumption and creations in transaction
    await prisma.$transaction(async (tx) => {
      // Hash incoming password
      const hashedPassword = await hashPassword(password);

      // Create the root User entity
      const newUser = await tx.user.create({
        data: {
          email: invitation.email,
          password: hashedPassword,
          role: invitation.role,
          tenant_id: invitation.tenant_id
        }
      });

      // Create specific sub-profile based on Role
      if (invitation.role === 'STUDENT') {
        await tx.student.create({
          data: {
            userId: newUser.id,
            tenant_id: invitation.tenant_id,
            firstName,
            lastName,
            enrollmentNo: identifierNo // enrollment number
          }
        });
      } else if (invitation.role === 'FACULTY') {
        await tx.faculty.create({
          data: {
            userId: newUser.id,
            tenant_id: invitation.tenant_id,
            firstName,
            lastName,
            employeeNo: identifierNo // employee number
          }
        });
      }

      // Mark token as consumed
      await tx.invitationToken.update({
        where: { id: invitation.id },
        data: { isUsed: true }
      });
    });

    return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Identifier (Enrollment/Employee No) already exists for this tenant' }, { status: 409 });
    }
    console.error('Accept Invite Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
