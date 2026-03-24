import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import type { NextRequest } from 'next/server';

// POST /api/subjects/assign – assign faculty to subject
export const POST = withAuth(['ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  try {
    const { subjectId, facultyId } = await req.json();

    if (!subjectId || !facultyId) {
      return NextResponse.json({ error: 'Subject ID and Faculty ID are required' }, { status: 400 });
    }

    // Validate ownership/tenant
    const subject = await prisma.subject.findFirst({
      where: { id: subjectId, tenant_id: user.tenant_id }
    });

    const faculty = await prisma.user.findFirst({
      where: { id: facultyId, tenant_id: user.tenant_id, role: 'FACULTY' },
      include: { facultyProfile: true }
    });

    if (!subject || !faculty || !faculty.facultyProfile) {
      return NextResponse.json({ error: 'Subject or Faculty not found' }, { status: 404 });
    }

    // Create assignment
    const assignment = await prisma.taughtSubject.upsert({
      where: {
        subjectId_facultyId: {
          subjectId,
          facultyId: faculty.facultyProfile.id
        }
      },
      update: {},
      create: {
        subjectId,
        facultyId: faculty.facultyProfile.id
      }
    });

    return NextResponse.json({ message: 'Faculty assigned successfully', assignment }, { status: 201 });
  } catch (error: any) {
    console.error('Assignment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// DELETE /api/subjects/assign – remove faculty assignment
export const DELETE = withAuth(['ADMIN'], async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId');
    const facultyId = searchParams.get('facultyId'); // This is the FacultyProfile.id or User.id? 
    // Let's use User.id and resolve to FacultyProfile.id for consistency with POST

    if (!subjectId || !facultyId) {
      return NextResponse.json({ error: 'Subject ID and Faculty ID are required' }, { status: 400 });
    }

    const faculty = await prisma.facultyProfile.findFirst({
        where: { user_id: facultyId }
    });

    if (!faculty) {
        return NextResponse.json({ error: 'Faculty profile not found' }, { status: 404 });
    }

    await prisma.taughtSubject.delete({
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
