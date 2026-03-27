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
    where: { institutionId: user.institutionId, role: 'STUDENT' },
    include: {
      student: { include: { course: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({
    students: students.map((s) => ({
      id: s.id,
      username: s.username,
      name: s.name,
      email: s.email,
      status: s.accountStatus,
      rollNumber: s.student?.rollNumber,
      semester: s.student?.semester,
      course: s.student?.course?.name ?? null,
      dateOfBirth: s.student?.dateOfBirth,
      gender: s.student?.gender,
    }))
  });
});

// POST /api/students – bulk create students from CSV array (admin only)
export const POST = withAuth(['ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  const body = await req.json();
  const entries: Array<{
    name: string;
    rollNumber: string;
    email: string;
    course: string;
    semester: string;
    dateOfBirth?: string;
    gender?: string;
  }> = Array.isArray(body) ? body : [body];

  if (entries.length === 0)
    return NextResponse.json({ error: 'No entries provided' }, { status: 400 });

  const results: Array<{ name: string; rollNumber: string; email: string; activationLink: string }> = [];
  const errors: Array<{ rollNumber: string; error: string }> = [];

  for (const entry of entries) {
    const { name, rollNumber, email, course, semester, dateOfBirth, gender } = entry;

    if (!name || !rollNumber || !email) {
      errors.push({ rollNumber: rollNumber ?? '?', error: 'Missing required fields (name, rollNumber, email)' });
      continue;
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Resolve course by name if provided
        let courseRecord = null;
        if (course) {
          courseRecord = await tx.course.findFirst({
            where: { institutionId: user.institutionId, name: { equals: course } }
          });
        }

        // Create User with roll_number as username, status PENDING_ACTIVATION
        const newUser = await tx.user.create({
          data: {
            institutionId: user.institutionId,
            username: rollNumber,
            name,
            passwordHash: '',
            role: 'STUDENT',
            email,
            accountStatus: 'PENDING_ACTIVATION',
          }
        });

        // Validate semester/academicCycle if provided
        if (semester) {
          await SubjectService.validateCycleNumber(user.institutionId, parseInt(semester));
        }

        // Create Student
        await tx.student.create({
          data: {
            userId: newUser.id,
            rollNumber,
            courseId: courseRecord?.id ?? null,
            semester: semester ? parseInt(semester) : null,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender: gender || null,
          }
        });

        // Generate a unique, expiring activation token
        const token = randomBytes(32).toString('hex');
        await tx.userInvitation.create({
          data: {
            institutionId: user.institutionId,
            email,
            role: 'STUDENT',
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        });

        // Trigger Activation Email
        const institution = await resolveTenant(user.institutionId);
        const activationLink = getTenantUrl(institution?.slug || (user.institutionId as any), 'accept-invite') + `?token=${token}`;
        
        await sendEmail({
          to: email,
          subject: `Activate your student account at ${institution?.name || 'Unicore'}`,
          html: getStudentActivationEmailTemplate(institution?.name || 'Unicore', activationLink, name, rollNumber)
        });

        results.push({ name, rollNumber, email, activationLink: activationLink });
      });
    } catch (err: any) {
      errors.push({
        rollNumber: rollNumber ?? '?',
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
