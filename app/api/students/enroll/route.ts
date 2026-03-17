import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import type { NextRequest } from 'next/server';
import { SubjectService } from '@/lib/services/subject-service';

// POST /api/students/enroll
// Body: { studentId, courseId, semester, sectionId? }
export const POST = withAuth(['ADMIN', 'SUPER_ADMIN', 'INSTITUTION_ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  try {
    const { studentId, courseId, semester, sectionId } = await req.json();

    // 1. Basic validation
    if (!studentId || !courseId || semester == null) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, courseId, semester' },
        { status: 400 }
      );
    }

    // 2. Ensure student belongs to this tenant
    const student = await prisma.user.findFirst({
      where: { id: studentId, tenant_id: user.tenant_id, role: 'STUDENT' },
      include: { studentProfile: true }
    });

    if (!student || !student.studentProfile) {
      return NextResponse.json(
        { error: 'Student not found in this tenant' },
        { status: 404 }
      );
    }

    // 3. Ensure course belongs to this tenant
    const course = await prisma.course.findFirst({
      where: { id: courseId, tenant_id: user.tenant_id }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found in this tenant' },
        { status: 404 }
      );
    }

    // 3.5 Validate semester/cycleNumber
    try {
      await SubjectService.validateCycleNumber(user.tenant_id, parseInt(String(semester)));
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // 4. Update StudentProfile
    const updated = await prisma.studentProfile.update({
      where: { id: student.studentProfile.id },
      data: {
        course_id: courseId,
        semester: parseInt(String(semester)),
      },
      include: { course: true }
    });

    return NextResponse.json({
      message: 'Student enrolled successfully',
      enrollment: {
        studentId,
        course: updated.course?.name,
        semester: updated.semester,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Enroll error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
