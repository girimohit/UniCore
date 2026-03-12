import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveTenant } from '@/lib/tenant/resolver';
import { withAuth } from '@/lib/auth-middleware';

export const GET = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const url = new URL(req.url);
    const subdomain = url.searchParams.get('subdomain') || user.tenant_id;
    
    // Auth middleware already verified the user.tenant_id matches the request subdomain if provided.
    const institution = await resolveTenant(subdomain);
    if (!institution) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const departments = await prisma.department.findMany({
      where: {
        tenant_id: institution.tenant_id
      }
    });

    return NextResponse.json({ departments });

  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
