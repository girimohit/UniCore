import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';
import { z } from 'zod';

const StatusUpdateSchema = z.object({
  examId: z.string(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'PUBLISHED'])
});

/**
 * PATCH /api/modules/exams/status
 * - Updates the workflow status of an exam
 */
export const PATCH = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'exams');
    if (!active) {
       return NextResponse.json({ error: 'Exams module disabled' }, { status: 403 });
    }

    const json = await req.json();
    const validation = StatusUpdateSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { examId, status } = validation.data;

    // Verify exam existence and ownership
    const exam = await prisma.exam.findUnique({
      where: { id: examId, institutionId: user.institutionId }
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Role-based restrictions
    if (user.role === 'FACULTY' && status === 'PUBLISHED') {
        return NextResponse.json({ error: 'Faculty cannot publish results directly. Only Admin can publish.' }, { status: 403 });
    }

    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: { resultStatus: status }
    });

    return NextResponse.json(updatedExam);
  } catch (error) {
    console.error('Exam Status PATCH Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
