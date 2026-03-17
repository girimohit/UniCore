import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const { name, date, courseId, subjectId, periodId } = await req.json();

    // 1. Basic validation
    if (!name || !date || !courseId || !subjectId || !periodId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Validate AcademicPeriod belongs to the same tenant
    const period = await prisma.academicPeriod.findFirst({
      where: {
        id: periodId,
        tenant_id: user.tenant_id
      }
    });

    if (!period) {
      return NextResponse.json({ error: 'Valid Academic Period for this tenant is required' }, { status: 400 });
    }

    // 3. Create Exam
    const exam = await prisma.exam.create({
      data: {
        name,
        date: new Date(date),
        tenant_id: user.tenant_id,
        courseId,
        subjectId,
        periodId
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
      where: { tenant_id: user.tenant_id },
      include: {
        course: true,
        subject: true,
        period: true
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json({ exams });
  } catch (error) {
    console.error('Exams GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
