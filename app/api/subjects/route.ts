import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY', 'STUDENT'], async (req, context, user) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { tenant_id: user.tenant_id },
      include: { course: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ subjects });
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
        if (!item.name || !item.code || !item.course) {
           errors.push({ ...item, error: 'Name, Code, and Course are required' });
           continue;
        }

        // Find course by name or code
        const course = await prisma.course.findFirst({
          where: {
            tenant_id: user.tenant_id,
            OR: [
              { name: item.course },
              { code: item.course }
            ]
          }
        });

        if (!course) {
          errors.push({ ...item, error: `Course "${item.course}" not found` });
          continue;
        }

        const subject = await prisma.subject.create({
          data: {
            name: item.name,
            code: item.code.toUpperCase(),
            tenant_id: user.tenant_id,
            courseId: course.id,
            semester: item.semester ? parseInt(item.semester) : null,
          }
        });
        created.push(subject);
      } catch (err: any) {
        if (err.code === 'P2002') {
          errors.push({ ...item, error: 'Subject code already exists' });
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
