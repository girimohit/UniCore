import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'], async (req, context, user) => {
  try {
    const courses = await prisma.course.findMany({
      where: { tenant_id: user.tenant_id },
      include: { department: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];
    
    const created = [];
    const errors = [];

    for (const item of items) {
      try {
        if (!item.name || !item.code || !item.department) {
           errors.push({ ...item, error: 'Name, Code, and Department are required' });
           continue;
        }

        // Find department by name or code
        const dept = await prisma.department.findFirst({
          where: {
            tenant_id: user.tenant_id,
            OR: [
              { name: item.department },
              { code: item.department }
            ]
          }
        });

        if (!dept) {
          errors.push({ ...item, error: `Department "${item.department}" not found` });
          continue;
        }

        const course = await prisma.course.create({
          data: {
            name: item.name,
            code: item.code.toUpperCase(),
            tenant_id: user.tenant_id,
            departmentId: dept.id,
          }
        });
        created.push(course);
      } catch (err: any) {
        if (err.code === 'P2002') {
          errors.push({ ...item, error: 'Course code already exists' });
        } else {
          errors.push({ ...item, error: err.message });
        }
      }
    }

    return NextResponse.json({ created, errors });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
