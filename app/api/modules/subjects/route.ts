import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

// Note: Subjects do not possess a top-level module control in `SYSTEM_MODULES` because they're intrinsically part of Courses right now.
// Access controls check if the underlying Courses module is active or rely on RBAC.

export const GET = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'], async (req, context, user) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: {
        institutionId: user.institutionId
      },
      include: {
        course: true // Include nested Course info
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const { name, code, courseId } = await req.json();

    if (!name || !code || !courseId) {
        return NextResponse.json({ error: 'Name, Code, and Course ID required' }, { status: 400 });
    }

    // Strict Tenant Validation: Does this Course belong to the current Tenant?
    const course = await prisma.course.findFirst({
        where: { id: courseId, institutionId: user.institutionId }
    });

    if (!course) {
        return NextResponse.json({ error: 'Invalid Course context' }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        courseId,
        institutionId: user.institutionId
      }
    });

    return NextResponse.json({ message: 'Subject created successfully', subject }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Subject code already exists' }, { status: 409 });
    }
    console.error('Error creating subject:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
