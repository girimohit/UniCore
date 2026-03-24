import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { SubjectService } from '@/lib/services/subject-service';

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY', 'STUDENT'], async (req, context, user) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { tenant_id: user.tenant_id },
      include: { 
        course: true,
        taughtBy: { include: { facultyProfile: { include: { user: true } } } }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ subjects });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];
    
    const created = [];
    const errors = [];

    for (const item of items) {
      try {
        if (!item.name || !item.code || !item.course) {
           errors.push({ ...item, error: 'Name, Code, and Course are required' });
           continue;
        }

        // Find course by name or code
        const course = await prisma.course.findFirst({
          where: {
            tenant_id: user.tenant_id,
            OR: [
              { name: item.course },
              { code: item.course }
            ]
          }
        });

        if (!course) {
          errors.push({ ...item, error: `Course "${item.course}" not found` });
          continue;
        }

        const cycleNumber = item.cycleNumber ? parseInt(item.cycleNumber) : (item.semester ? parseInt(item.semester) : 1);
        
        // Tenant-based validation
        await SubjectService.validateCycleNumber(user.tenant_id, cycleNumber);

        const subject = await prisma.subject.create({
          data: {
            name: item.name,
            code: item.code.toUpperCase(),
            tenant_id: user.tenant_id,
            courseId: course.id,
            cycleNumber: cycleNumber,
          },
          include: { 
            course: true,
            taughtBy: { include: { facultyProfile: { include: { user: true } } } }
          }
        });
        created.push(subject);
      } catch (err: any) {
        if (err.code === 'P2002') {
          errors.push({ ...item, error: 'Subject code already exists' });
        } else {
          errors.push({ ...item, error: err.message });
        }
      }
    }

    return NextResponse.json({ created, errors });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const PATCH = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const body = await req.json();
    const { id, name, code, courseId, cycleNumber } = body;

    if (!id) {
      return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 });
    }

    // Validate tenant ownership
    const existing = await prisma.subject.findFirst({
      where: { id, tenant_id: user.tenant_id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    // Validate cycleNumber if provided
    if (cycleNumber !== undefined) {
      try {
        await SubjectService.validateCycleNumber(user.tenant_id, parseInt(String(cycleNumber)));
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
        ...(cycleNumber !== undefined && { cycleNumber: parseInt(String(cycleNumber)) }),
      },
      include: { 
        course: true,
        taughtBy: { include: { facultyProfile: { include: { user: true } } } }
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 });
    }

    // Validate tenant ownership
    const existing = await prisma.subject.findFirst({
      where: { id, tenant_id: user.tenant_id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    await prisma.subject.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
