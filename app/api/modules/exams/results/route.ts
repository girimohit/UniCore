import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';
import { BulkRecordResultsSchema } from '@/lib/validations/exams';

/**
 * GET /api/modules/exams/results?examId=xxx
 * - Fetches results for a specific exam
 */
export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'exams');
    if (!active) {
       return NextResponse.json({ error: 'Exams module disabled' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const examId = searchParams.get('examId');

    if (!examId) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    const exam = await prisma.exam.findUnique({
        where: { id: examId, institutionId: user.institutionId }
    });

    if (!exam) {
        return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const results = await prisma.examResult.findMany({
      where: { 
        examId,
        institutionId: user.institutionId 
      },
      include: {
        student: {
          include: {
            user: {
                select: {
                    name: true,
                    username: true
                }
            }
          }
        }
      },
      orderBy: { student: { rollNumber: 'asc' } }
    });

    return NextResponse.json({ results, exam });
  } catch (error) {
    console.error('Exam Results GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

/**
 * POST /api/modules/exams/results
 * - Bulk records student results for an exam
 */
export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'exams');
    if (!active) {
       return NextResponse.json({ error: 'Exams module disabled' }, { status: 403 });
    }

    const json = await req.json();
    const validation = BulkRecordResultsSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { examId, results } = validation.data;

    // 1. Verify exam existence and ownership
    const exam = await prisma.exam.findFirst({
      where: { id: examId, institutionId: user.institutionId }
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found or access denied' }, { status: 404 });
    }

    // 2. Perform bulk upside (delete existing for this exam and replace or use transaction)
    // To keep it simple and clean, we handle individual upserts in a transaction
    const dbResult = await prisma.$transaction(async (tx) => {
      const recorded = [];
      
      for (const item of results) {
        // Validate marks don't exceed max marks
        if (item.obtainedMarks > exam.maxMarks) {
            throw new Error(`Marks_Overflow: Student ${item.studentId} cannot have ${item.obtainedMarks} when max is ${exam.maxMarks}`);
        }

        const res = await tx.examResult.upsert({
          where: {
            examId_studentId: {
              examId,
              studentId: item.studentId
            }
          },
          update: {
            obtainedMarks: item.obtainedMarks,
            teacherRemarks: item.teacherRemarks,
          },
          create: {
            institutionId: user.institutionId,
            examId,
            studentId: item.studentId,
            obtainedMarks: item.obtainedMarks,
            teacherRemarks: item.teacherRemarks,
          }
        });
        recorded.push(res);
      }
      return recorded;
    });

    return NextResponse.json({ 
      message: `Successfully recorded ${dbResult.length} results.`,
      count: dbResult.length 
    }, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof Error && error.message.startsWith('Marks_Overflow')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Exam Results POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
