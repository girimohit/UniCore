import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import type { NextRequest } from 'next/server';

// GET /api/exams/[id]/eligible-students
// Returns students enrolled in the exam's course, optionally filtered by semester.
export const GET = withAuth(
  ['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'],
  async (req: NextRequest, context: any, user: any) => {
    try {
      const examId = context.params?.id as string;

      // 1. Resolve exam and ensure it belongs to this tenant
      const exam = await prisma.exam.findFirst({
        where: { id: examId, tenant_id: user.tenant_id },
        select: { id: true, courseId: true }
      });

      if (!exam) {
        return NextResponse.json({ error: 'Exam not found for this tenant' }, { status: 404 });
      }

      // 2. Optional semester filter from query param
      const { searchParams } = new URL(req.url);
      const semesterParam = searchParams.get('semester');
      const semester = semesterParam ? parseInt(semesterParam) : undefined;

      // 3. Fetch students enrolled in the exam's course (+ optional semester)
      const students = await prisma.studentProfile.findMany({
        where: {
          course_id: exam.courseId,
          user: { tenant_id: user.tenant_id },
          ...(semester != null ? { semester } : {}),
        },
        include: {
          user: { select: { id: true, identifier: true, email: true } }
        },
        orderBy: { roll_number: 'asc' }
      });

      return NextResponse.json({
        examId,
        courseId: exam.courseId,
        semester: semester ?? null,
        students: students.map(s => ({
          studentProfileId: s.id,
          userId: s.user.id,
          identifier: s.user.identifier,
          email: s.user.email,
          roll_number: s.roll_number,
          semester: s.semester,
        }))
      });

    } catch (error) {
      console.error('Eligible students error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
);
