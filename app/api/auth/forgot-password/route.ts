import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signResetToken } from '@/lib/auth';
import { sendEmail, getPasswordResetEmailTemplate } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email, subdomain } = await req.json();

    if (!email || !subdomain) {
      return NextResponse.json({ error: 'Email and subdomain are required' }, { status: 400 });
    }

    // 1. Find user within the specified institution (scoped by the subdomain/slug)
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        institution: {
          slug: subdomain
        }
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        institution: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    // Security: even if user isn't found, we return a generic success message 
    // to prevent email enumeration attacks.
    if (!user || !user.email) {
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    // 2. Generate stateless token
    const token = signResetToken(user.id, user.passwordHash);

    // 3. Construct reset link
    // Note: In production, use the actual origin. For now, we assume standard pattern.
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = req.headers.get('host') || 'localhost:3000';
    // const resetLink = `${protocol}://${host}/${user.institution.slug}/reset-password?token=${token}`;
    const resetLink = `${protocol}://${host}/${subdomain}/reset-password?token=${token}`;

    // 4. Send Email
    await sendEmail({
      to: user.email,
      subject: `Password Reset - ${user.institution.name}`,
      html: getPasswordResetEmailTemplate(user.institution.name, resetLink),
    });

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
