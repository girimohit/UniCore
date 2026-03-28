import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import type { NextRequest } from 'next/server';
import { isModuleEnabled } from '@/lib/modules/loader';

/**
 * POST /api/modules/subjects/assign
 * - Assign faculty to subject
 */
export const POST = withAuth(['ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'courses');
    if (!active) {
       return NextResponse.json({ error: 'Courses module disabled' }, { status: 403 });
    }

    const { subjectId, facultyId } = await req.json();

    if (!subjectId || !facultyId) {
      return NextResponse.json({ error: 'Subject ID and Faculty ID are required' }, { status: 400 });
    }

    // Validate ownership/tenant
    const subject = await prisma.subject.findFirst({
      where: { id: subjectId, institutionId: user.institutionId }
    });

    const faculty = await prisma.user.findFirst({
      where: { id: facultyId, institutionId: user.institutionId, role: 'FACULTY' },
      include: { faculty: true }
    });

    if (!subject || !faculty || !faculty.faculty) {
      return NextResponse.json({ error: 'Subject or Faculty not found' }, { status: 404 });
    }

    const assignment = await prisma.facultyAssignment.upsert({
      where: {
        subjectId_facultyId: {
          subjectId,
          facultyId: faculty.faculty.id
        }
      },
      update: {},
      create: {
        subjectId,
        facultyId: faculty.faculty.id
      }
    });

    return NextResponse.json({ message: 'Faculty assigned successfully', assignment }, { status: 201 });
  } catch (error: any) {
    console.error('Assignment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

/**
 * DELETE /api/modules/subjects/assign
 * - Remove faculty assignment
 */
export const DELETE = withAuth(['ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'courses');
    if (!active) {
       return NextResponse.json({ error: 'Courses module disabled' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId');
    const facultyId = searchParams.get('facultyId');

    if (!subjectId || !facultyId) {
      return NextResponse.json({ error: 'Subject ID and Faculty ID are required' }, { status: 400 });
    }

    const faculty = await prisma.faculty.findFirst({
      where: { userId: facultyId }
    });

    if (!faculty) {
      return NextResponse.json({ error: 'Faculty profile not found' }, { status: 404 });
    }

    await prisma.facultyAssignment.delete({
      where: {
        subjectId_facultyId: {
          subjectId,
          facultyId: faculty.id
        }
      }
    });

    return NextResponse.json({ message: 'Assignment removed successfully' });
  } catch (error: any) {
    console.error('Delete assignment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
