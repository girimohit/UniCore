import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';
import { CreateExamSchema } from '@/lib/validations/exams';

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

    const { searchParams } = new URL(req.url);
    const termId = searchParams.get('termId');
    const courseId = searchParams.get('courseId');

    const exams = await prisma.exam.findMany({
      where: { 
        institutionId: user.institutionId,
        ...(termId && { termId }),
        ...(courseId && { courseId }),
      },
      include: {
        course: true,
        subject: true,
        term: true,
        _count: {
          select: { examResults: true }
        }
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
 * - Schedules a new exam with strict date validation against the Academic Term
 */
export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'exams');
    if (!active) {
       return NextResponse.json({ error: 'Exams module disabled' }, { status: 403 });
    }

    const json = await req.json();
    const validation = CreateExamSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { name, examDate, courseId, subjectId, termId, maxMarks, passingMarks, examType } = validation.data;

    // 1. Fetch Academic Term once to validate ownership and date boundaries
    const term = await prisma.academicTerm.findFirst({
      where: { id: termId, institutionId: user.institutionId }
    });

    if (!term) {
      return NextResponse.json({ error: 'Valid Academic Term required' }, { status: 400 });
    }

    // 2. STRICT BOUND CHECK: Ensure examDate falls within the term duration
    const examDateTime = examDate.getTime();
    if (examDateTime < term.startDate.getTime() || examDateTime > term.endDate.getTime()) {
      return NextResponse.json({ 
        error: `Exam date must be between ${term.startDate.toLocaleDateString()} and ${term.endDate.toLocaleDateString()} for the selected academic term (${term.name}).`
      }, { status: 400 });
    }

    // 3. Create the exam
    const exam = await prisma.exam.create({
      data: {
        name,
        examDate,
        institutionId: user.institutionId,
        courseId,
        subjectId,
        termId,
        maxMarks,
        passingMarks,
        examType
      }
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error('Exam POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
