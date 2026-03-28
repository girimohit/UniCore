import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';
import { SubjectService } from '@/lib/services/subject-service';

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY', 'STUDENT'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'courses');
    if (!active) {
       return NextResponse.json({ error: 'Courses/Subjects module disabled' }, { status: 403 });
    }

    const subjects = await prisma.subject.findMany({
      where: { institutionId: user.institutionId },
      include: { 
        course: true,
        facultyAssignments: { include: { faculty: { include: { user: true } } } }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'courses');
    if (!active) {
       return NextResponse.json({ error: 'Courses/Subjects module disabled' }, { status: 403 });
    }

    const body = await req.json();
    const entries = Array.isArray(body) ? body : [body];
    
    if (entries.length === 0) {
      return NextResponse.json({ error: 'No entries provided' }, { status: 400 });
    }

    const created = [];
    const errors = [];

    for (const entry of entries) {
      try {
        const { name, code, course, courseId, academicCycle, semester } = entry;

        if (!name || !code || (!course && !courseId)) {
           errors.push({ ...entry, error: 'Name, Code, and Course are required' });
           continue;
        }

        // Find course
        let courseRecord = null;
        if (courseId) {
          courseRecord = await prisma.course.findUnique({
            where: { id: courseId, institutionId: user.institutionId }
          });
        } else if (course) {
          courseRecord = await prisma.course.findFirst({
            where: {
              institutionId: user.institutionId,
              OR: [
                { name: course },
                { code: course }
              ]
            }
          });
        }

        if (!courseRecord) {
          errors.push({ ...entry, error: `Course not found` });
          continue;
        }

        const cycle = academicCycle ? parseInt(academicCycle) : (semester ? parseInt(semester) : 1);
        
        // Tenant-based validation
        await SubjectService.validateCycleNumber(user.institutionId, cycle);

        const subject = await prisma.subject.create({
          data: {
            name,
            code: code.toUpperCase(),
            institutionId: user.institutionId,
            courseId: courseRecord.id,
            academicCycle: cycle,
          },
          include: { 
            course: true,
            facultyAssignments: { include: { faculty: { include: { user: true } } } }
          }
        });
        created.push(subject);
      } catch (err: any) {
        if (err.code === 'P2002') {
          errors.push({ ...entry, error: 'Subject code already exists' });
        } else {
          errors.push({ ...entry, error: err.message });
        }
      }
    }

    return NextResponse.json({ created, errors, message: `${created.length} subjects created, ${errors.length} failed.` });
  } catch (error) {
    console.error('Error in subject creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const PATCH = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'courses');
    if (!active) {
       return NextResponse.json({ error: 'Courses/Subjects module disabled' }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, code, courseId, academicCycle } = body;

    if (!id) {
      return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 });
    }

    // Validate tenant ownership
    const existing = await prisma.subject.findFirst({
      where: { id, institutionId: user.institutionId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    // Validate academicCycle if provided
    if (academicCycle !== undefined) {
      try {
        await SubjectService.validateCycleNumber(user.institutionId, parseInt(String(academicCycle)));
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    const updated = await prisma.subject.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code: code.toUpperCase() }),
        ...(courseId && { courseId }),
        ...(academicCycle !== undefined && { academicCycle: parseInt(String(academicCycle)) }),
      },
      include: { 
        course: true,
        facultyAssignments: { include: { faculty: { include: { user: true } } } }
      }
    });

    return NextResponse.json({ subject: updated });
  } catch (error) {
    console.error('Subject update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'courses');
    if (!active) {
       return NextResponse.json({ error: 'Courses/Subjects module disabled' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 });
    }

    // Validate tenant ownership
    const existing = await prisma.subject.findFirst({
      where: { id, institutionId: user.institutionId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    await prisma.subject.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Subject delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
