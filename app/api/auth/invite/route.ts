import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTenantContext } from '@/lib/tenant';
import { getTenantUrl } from '@/lib/config';
import crypto from 'crypto';
import { sendEmail, getInviteEmailTemplate } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email, role, subdomain } = await req.json();

    if (!email || !role || !subdomain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Explicitly validate role assignment bounds
    if (!['FACULTY', 'STUDENT', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role assignment' }, { status: 400 });
    }

    const institution = await getTenantContext(subdomain);
    if (!institution) {
      return NextResponse.json({ error: 'Tenant context invalid' }, { status: 404 });
    }

    // if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email, institutionId: institution.id }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists in this institution' }, { status: 409 });
    }

    // Generate random token
    const token = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const invitation = await prisma.userInvitation.create({
      data: {
        email,
        role: role as any,
        token,
        institutionId: institution.id,
        expiresAt
      }
    });

    // Trigger Email Sending
    const inviteLink = `${getTenantUrl(subdomain, 'accept-invite')}?token=${token}`;

    const emailResult = await sendEmail({
      to: email,
      subject: `Invitation to join ${institution.name}`,
      html: getInviteEmailTemplate(institution.name, inviteLink, role)
    });

    return NextResponse.json({
      message: 'Invitation generated and sent successfully',
      email_sent: emailResult.success,
      debug_link: inviteLink // For local testing only
    }, { status: 201 });

  } catch (error) {
    console.error('Invite Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
