import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY', 'STUDENT'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'courses');
    if (!active) {
       return NextResponse.json({ error: 'Courses module disabled' }, { status: 403 });
    }

    const courses = await prisma.course.findMany({
      where: { institutionId: user.institutionId },
      include: { department: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'courses');
    if (!active) {
       return NextResponse.json({ error: 'Courses module disabled' }, { status: 403 });
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
        const { name, code, department, departmentId } = entry;

        if (!name || !code || (!department && !departmentId)) {
          errors.push({ ...entry, error: 'Name, Code, and Department info are required' });
          continue;
        }

        // Find department record
        let dept = null;
        if (departmentId) {
          dept = await prisma.department.findUnique({
             where: { id: departmentId, institutionId: user.institutionId }
          });
        } else if (department) {
          dept = await prisma.department.findFirst({
            where: {
              institutionId: user.institutionId,
              OR: [
                { name: department },
                { code: department }
              ]
            }
          });
        }

        if (!dept) {
          errors.push({ ...entry, error: `Department not found` });
          continue;
        }

        const course = await prisma.course.create({
          data: {
            name,
            code: code.toUpperCase(),
            institutionId: user.institutionId,
            departmentId: dept.id,
          }
        });
        created.push(course);
      } catch (err: any) {
        if (err.code === 'P2002') {
          errors.push({ ...entry, error: 'Course code already exists' });
        } else {
          errors.push({ ...entry, error: err.message });
        }
      }
    }

    return NextResponse.json({ created, errors, message: `${created.length} courses created, ${errors.length} failed.` });
  } catch (error) {
    console.error('Error in course creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const PATCH = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const { id, name, code, departmentId } = await req.json();

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const course = await prisma.course.update({
      where: { id, institutionId: user.institutionId },
      data: {
        name,
        code: code?.toUpperCase(),
        departmentId
      }
    });

    return NextResponse.json({ course });
  } catch (error: any) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.course.delete({
      where: { id, institutionId: user.institutionId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
});
