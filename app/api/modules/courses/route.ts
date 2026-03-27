import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';

export const GET = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'courses');
    if (!active) {
       return NextResponse.json({ error: 'Courses module disabled' }, { status: 403 });
    }

    const courses = await prisma.course.findMany({
      where: { institutionId: user.institutionId },
      include: { department: true }, // Include related Department data
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'courses');
    if (!active) {
       return NextResponse.json({ error: 'Courses module disabled' }, { status: 403 });
    }

    const { name, code, departmentId } = await req.json();

    if (!name || !code || !departmentId) {
        return NextResponse.json({ error: 'Name, Code, and Department ID required' }, { status: 400 });
    }

    // Verify department belongs to the same tenant before linking
    const department = await prisma.department.findFirst({
        where: { id: departmentId, institutionId: user.institutionId }
    });

    if (!department) {
        return NextResponse.json({ error: 'Invalid department context' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        name,
        code,
        departmentId,
        institutionId: user.institutionId
      }
    });

    return NextResponse.json({ message: 'Course created successfully', course }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Course code already exists' }, { status: 409 });
    }
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
