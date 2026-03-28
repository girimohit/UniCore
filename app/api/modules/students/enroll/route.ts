import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';

/**
 * POST /api/modules/students/enroll
 * - Update student course/semester enrollment
 */
export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'students');
    if (!active) {
       return NextResponse.json({ error: 'Student module disabled' }, { status: 403 });
    }

    const { studentId, courseId, semester } = await req.json();

    if (!studentId || !courseId) {
      return NextResponse.json({ error: 'Student ID and Course ID are required' }, { status: 400 });
    }

    // Verify student belongs to this institution
    const targetUser = await prisma.user.findFirst({
        where: { id: studentId, institutionId: user.institutionId, role: 'STUDENT' },
        include: { student: true }
    });

    if (!targetUser || !targetUser.student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    // Update Student record
    const updated = await prisma.student.update({
      where: { id: targetUser.student.id },
      data: {
        courseId,
        semester: semester ? parseInt(String(semester)) : null
      }
    });

    return NextResponse.json({ message: 'Enrollment updated successfully', updated });
  } catch (error) {
    console.error('Enrollment Update Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
