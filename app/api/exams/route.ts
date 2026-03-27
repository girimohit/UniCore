import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const { name, date, courseId, subjectId, termId } = await req.json();

    // 1. Basic validation
    if (!name || !date || !courseId || !subjectId || !termId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Validate Term belongs to the same tenant
    const term = await prisma.academicTerm.findFirst({
      where: {
        id: termId,
        institutionId: user.institutionId
      }
    });

    if (!term) {
      return NextResponse.json({ error: 'Valid Academic Term for this tenant is required' }, { status: 400 });
    }

    // 3. Create Exam
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

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY', 'STUDENT'], async (req, context, user) => {
  try {
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
