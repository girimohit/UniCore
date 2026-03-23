import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import type { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';
import { SubjectService } from '@/lib/services/subject-service';
import { sendEmail, getStudentActivationEmailTemplate } from '@/lib/mail';
import { resolveTenant } from '@/lib/tenant/resolver';
import { getTenantUrl } from '@/lib/config';

// GET /api/students – list all students for admin's tenant
export const GET = withAuth(['ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  const students = await prisma.user.findMany({
    where: { tenant_id: user.tenant_id, role: 'STUDENT' },
    include: {
      studentProfile: { include: { course: true } }
    },
    orderBy: { created_at: 'desc' }
  });

  return NextResponse.json({
    students: students.map((s) => ({
      id: s.id,
      identifier: s.identifier,
      email: s.email,
      status: s.status,
      roll_number: s.studentProfile?.roll_number,
      semester: s.studentProfile?.semester,
      course: s.studentProfile?.course?.name ?? null,
    }))
  });
});

// POST /api/students – bulk create students from CSV array (admin only)
export const POST = withAuth(['ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  const body = await req.json();
  const entries: Array<{
    name: string;
    roll_number: string;
    email: string;
    course: string;
    semester: string;
  }> = Array.isArray(body) ? body : [body];

  if (entries.length === 0)
    return NextResponse.json({ error: 'No entries provided' }, { status: 400 });

  const results: Array<{ name: string; roll_number: string; email: string; activation_link: string }> = [];
  const errors: Array<{ roll_number: string; error: string }> = [];

  for (const entry of entries) {
    const { name, roll_number, email, course, semester } = entry;

    if (!name || !roll_number || !email) {
      errors.push({ roll_number: roll_number ?? '?', error: 'Missing required fields (name, roll_number, email)' });
      continue;
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Resolve course by name if provided
        let courseRecord = null;
        if (course) {
          courseRecord = await tx.course.findFirst({
            where: { tenant_id: user.tenant_id, name: { equals: course } }
            // where: { tenant_id: user.tenant_id, name: { equals: course, mode: 'insensitive' } }
          });
        }

        // Create User with roll_number as identifier, status PENDING_ACTIVATION
        const newUser = await tx.user.create({
          data: {
            tenant_id: user.tenant_id,
            identifier: roll_number, // Roll number IS the identifier for students
            password_hash: '',        // Empty — set during activation
            role: 'STUDENT',
            email,
            status: 'PENDING_ACTIVATION',
          }
        });

        // Validate semester/cycleNumber if provided
        if (semester) {
          await SubjectService.validateCycleNumber(user.tenant_id, parseInt(semester));
        }

        // Create StudentProfile
        await tx.studentProfile.create({
          data: {
            user_id: newUser.id,
            roll_number,
            course_id: courseRecord?.id ?? null,
            semester: semester ? parseInt(semester) : null,
          }
        });

        // Generate a unique, expiring activation token
        const token = randomBytes(32).toString('hex');
        await tx.invitationToken.create({
          data: {
            tenant_id: user.tenant_id,
            email,
            role: 'STUDENT',
            token,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        });

        // Trigger Activation Email
        const institution = await resolveTenant(user.tenant_id);
        const activationLink = getTenantUrl(user.tenant_id as any, 'student/activate') + `?token=${token}`;
        
        await sendEmail({
          to: email,
          subject: `Activate your student account at ${institution?.name || 'Unicore'}`,
          html: getStudentActivationEmailTemplate(institution?.name || 'Unicore', activationLink, name)
        });

        results.push({ name, roll_number, email, activation_link: activationLink });
      });
    } catch (err: any) {
      errors.push({
        roll_number: roll_number ?? '?',
        error: err.code === 'P2002'
          ? 'Roll number or email already exists'
          : err.message,
      });
    }
  }

  return NextResponse.json({
    created: results,
    errors,
    message: `${results.length} students created, ${errors.length} failed.`
  }, { status: 201 });
});
