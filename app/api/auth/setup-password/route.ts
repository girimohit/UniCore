import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, comparePassword } from '@/lib/auth';
import { withAuth } from '@/lib/auth-middleware';
import type { NextRequest } from 'next/server';

export const POST = withAuth(['STUDENT', 'FACULTY', 'ADMIN'], async (req: NextRequest, _ctx: any, userAuth: any) => {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new passwords are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 });
    }

    // Fetch full user record to check current password and status
    const user = await prisma.user.findUnique({
      where: { id: userAuth.user_id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current (temp) password
    const isMatch = await comparePassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
    }

    // Hash new password
    const hashed = await hashPassword(newPassword);

    // Update password and set status to ACTIVE
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: hashed,
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({ message: 'Password updated successfully. You can now access your dashboard.' });
  } catch (error) {
    console.error('Setup password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
