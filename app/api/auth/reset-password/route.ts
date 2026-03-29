import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyResetToken, hashPassword } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // 1. Decode token (without verification) to get userId
    // We need the userId to fetch the user's current hash first.
    const decoded = jwt.decode(token) as { userId: string } | null;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid or malformed reset token' }, { status: 400 });
    }

    // 2. Fetch user to get their current hash
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, passwordHash: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Verify token (this checks expiry AND checks against user's current hash)
    const verified = verifyResetToken(token, user.passwordHash);
    if (!verified) {
      return NextResponse.json({ error: 'Reset link has expired or was already used' }, { status: 400 });
    }

    // 4. Hash new password and update
    const hashed = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashed
      }
    });

    return NextResponse.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
