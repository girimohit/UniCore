import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';

export const GET = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.tenant_id, 'departments');
    if (!active) {
       return NextResponse.json({ error: 'Departments module disabled' }, { status: 403 });
    }

    const departments = await prisma.department.findMany({
      where: {
        tenant_id: user.tenant_id
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.tenant_id, 'departments');
    if (!active) {
       return NextResponse.json({ error: 'Departments module disabled' }, { status: 403 });
    }

    const { name, code } = await req.json();

    if (!name || !code) {
        return NextResponse.json({ error: 'Name and Code required' }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: {
        name,
        code,
        tenant_id: user.tenant_id
      }
    });

    return NextResponse.json({ message: 'Department created successfully', department }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Department code already exists' }, { status: 409 });
    }
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
