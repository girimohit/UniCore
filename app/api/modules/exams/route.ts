import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';

/**
 * GET /api/modules/exams
 * - Fetches all exams for the institution
 */
export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY', 'STUDENT'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'exams');
    if (!active) {
       return NextResponse.json({ error: 'Exams module disabled' }, { status: 403 });
    }

    const exams = await prisma.exam.findMany({
      where: { institutionId: user.institutionId },
      include: {
        course: true,
        subject: true,
        term: true
      },
      orderBy: { examDate: 'desc' }
    });
    return NextResponse.json({ exams });
  } catch (error) {
    console.error('Exams GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

/**
 * POST /api/modules/exams
 * - Schedules a new exam
 */
export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'exams');
    if (!active) {
       return NextResponse.json({ error: 'Exams module disabled' }, { status: 403 });
    }

    const { name, date, courseId, subjectId, termId } = await req.json();

    if (!name || !date || !courseId || !subjectId || !termId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate Term belongs to the same tenant
    const term = await prisma.academicTerm.findFirst({
      where: { id: termId, institutionId: user.institutionId }
    });

    if (!term) {
      return NextResponse.json({ error: 'Valid Academic Term required' }, { status: 400 });
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        examDate: new Date(date),
        institutionId: user.institutionId,
        courseId,
        subjectId,
        termId
      }
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error('Exam POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
