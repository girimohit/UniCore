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

    if (!studentId || !courseId || semester == null) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, courseId, semester' },
        { status: 400 }
      );
    }

    const student = await prisma.user.findFirst({
      where: { id: studentId, institutionId: user.institutionId, role: 'STUDENT' },
      include: { student: true }
    });

    if (!student || !student.student) {
      return NextResponse.json(
        { error: 'Student not found in this tenant' },
        { status: 404 }
      );
    }

    // Ensure course belongs to this tenant
    const course = await prisma.course.findFirst({
      where: { id: courseId, institutionId: user.institutionId }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found in this tenant' },
        { status: 404 }
      );
    }

    // Validate semester/academicCycle
    try {
      await SubjectService.validateCycleNumber(user.institutionId, parseInt(String(semester)));
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Update student
    const updated = await prisma.student.update({
      where: { id: student.student.id },
      data: {
        courseId: courseId,
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
