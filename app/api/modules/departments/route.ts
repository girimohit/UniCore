import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'departments');
    if (!active) {
       return NextResponse.json({ error: 'Departments module disabled' }, { status: 403 });
    }

    const departments = await prisma.department.findMany({
      where: {
        institutionId: user.institutionId
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'departments');
    if (!active) {
       return NextResponse.json({ error: 'Departments module disabled' }, { status: 403 });
    }

    const body = await req.json();
    const entries = Array.isArray(body) ? body : [body];

    if (entries.length === 0) {
      return NextResponse.json({ error: 'No entries provided' }, { status: 400 });
    }

    const created = [];
    const errors = [];

    for (const entry of entries) {
      try {
        const { name, code } = entry;

        if (!name || !code) {
          errors.push({ ...entry, error: 'Name and Code are required' });
          continue;
        }

        const department = await prisma.department.create({
          data: {
            name,
            code: code.toUpperCase(),
            institutionId: user.institutionId,
          }
        });
        created.push(department);
      } catch (err: any) {
        if (err.code === 'P2002') {
          errors.push({ ...entry, error: 'Department code already exists' });
        } else {
          errors.push({ ...entry, error: err.message });
        }
      }
    }

    return NextResponse.json({ created, errors, message: `${created.length} departments created, ${errors.length} failed.` });
  } catch (error: any) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
