import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveTenant } from '@/lib/tenant/resolver';
import { withAuth } from '@/lib/auth-middleware';

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
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
        tenant_id: institution.id
      }
    });

    return NextResponse.json({ departments });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const body = await req.json();
    console.log("boddyyyyyyy")
    console.log(body)
    
    const items = Array.isArray(body) ? body : [body];
    console.log("items")
    console.log(items)
    
    // Auth middleware already verified the user.tenant_id
    const institution = await prisma.institution.findUnique({
      where: { id: user.tenant_id },
    });

    if (!institution) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const created = [];
    const errors = [];

    for (const item of items) {
      try {
        if (!item.name || !item.code) {
           errors.push({ ...item, error: 'Name and Code are required' });
           continue;
        }

        const dept = await prisma.department.create({
          data: {
            name: item.name,
            code: item.code.toUpperCase(),
            tenant_id: institution.id,
          }
        });
        created.push(dept);
      } catch (err: any) {
        if (err.code === 'P2002') {
          errors.push({ ...item, error: 'Department code already exists' });
        } else {
          errors.push({ ...item, error: err.message });
        }
      }
    }

    return NextResponse.json({ created, errors });
  } catch (error) {
    console.error('Error in department creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
