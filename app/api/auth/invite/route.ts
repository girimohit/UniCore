import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTenantContext } from '@/lib/tenant';
import { getTenantUrl } from '@/lib/config';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, role, subdomain } = await req.json();

    if (!email || !role || !subdomain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Explicitly validate role assignment bounds (only Admins can do this, to be protected by middleware later)
    if (!['FACULTY', 'STUDENT', 'INSTITUTION_ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role assignment' }, { status: 400 });
    }

    const institution = await getTenantContext(subdomain);
    if (!institution) {
      return NextResponse.json({ error: 'Tenant context invalid' }, { status: 404 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email, tenant_id: institution.id }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists in this institution' }, { status: 409 });
    }

    // Generate random secure hex token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Set expiration (e.g., 48 hours from now)
    const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const invitation = await prisma.invitationToken.create({
      data: {
        email,
        role: role as any,
        token,
        tenant_id: institution.id,
        expires_at
      }
    });

    // In a real system, you would TRIGGER EMAIL SENDING HERE
    // Ex: await sendEmail(email, `Join ${institution.name} ERP!`, `Link: ${getTenantUrl(subdomain, 'accept-invite')}?token=${token}`);

    return NextResponse.json({ 
      message: 'Invitation generated successfully',
      debug_link: `${getTenantUrl(subdomain, 'accept-invite')}?token=${token}` // For local testing only
    }, { status: 201 });

  } catch (error) {
    console.error('Invite Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
