import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { randomBytes } from 'crypto';
import { SubjectService } from '@/lib/services/subject-service';
import { sendEmail, getStudentActivationEmailTemplate } from '@/lib/mail';
import { resolveTenant } from '@/lib/tenant/resolver';
import { getTenantUrl } from '@/lib/config';
import { isModuleEnabled } from '@/lib/modules/loader';

/**
 * GET /api/modules/students
 * - Lists all students for the institution
 */
export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'students');
    if (!active) {
       return NextResponse.json({ error: 'Student module disabled' }, { status: 403 });
    }

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
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

/**
 * POST /api/modules/students
 * - Bulk or single creation of students from payload
 */
export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'students');
    if (!active) {
       return NextResponse.json({ error: 'Student module disabled' }, { status: 403 });
    }

    const body = await req.json();
    const entries = Array.isArray(body) ? body : [body];

    if (entries.length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const results = [];
    const errors = [];

    const institution = await resolveTenant(user.institutionId);

    for (const entry of entries) {
      const { name, rollNumber, email, course, semester, dateOfBirth, gender } = entry;

      if (!name || !rollNumber || !email) {
        errors.push({ rollNumber: rollNumber ?? '?', error: 'Missing required fields (name, rollNumber, email)' });
        continue;
      }

      try {
        const studentResult = await prisma.$transaction(async (tx) => {
          // Resolve course by name or code if provided
          let courseRecord = null;
          if (course) {
            courseRecord = await tx.course.findFirst({
              where: { 
                institutionId: user.institutionId, 
                OR: [{ name: course }, { code: course }] 
              }
            });
          }

          // Create User with roll_number as username, status PENDING_ACTIVATION
          const newUser = await tx.user.create({
            data: {
              institutionId: user.institutionId,
              username: rollNumber,
              name,
              passwordHash: '', // Set on activation
              role: 'STUDENT',
              email,
              accountStatus: 'PENDING_ACTIVATION',
            }
          });

          // Validate semester if provided
          if (semester) {
            await SubjectService.validateCycleNumber(user.institutionId, parseInt(semester));
          }

          // Create Student profile
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

          // Generate activation token
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

          const activationLink = getTenantUrl(institution?.slug || (user.institutionId as any), 'accept-invite') + `?token=${token}`;
          
          return { name, rollNumber, email, activationLink };
        });

        // Outside transaction to ensure SMTP failures don't roll back the DB
        try {
          await sendEmail({
            to: studentResult.email,
            subject: `Activate your student account at ${institution?.name || 'Unicore'}`,
            html: getStudentActivationEmailTemplate(institution?.name || 'Unicore', studentResult.activationLink, studentResult.name, studentResult.rollNumber)
          });
        } catch (emailErr) {
          console.error('Email failed to send for student:', studentResult.email, emailErr);
        }

        results.push(studentResult);
      } catch (err: any) {
        errors.push({
          rollNumber: rollNumber ?? '?',
          error: err.code === 'P2002' ? 'Roll number or email already exists' : err.message,
        });
      }
    }

    return NextResponse.json({
      created: results,
      errors,
      message: `${results.length} students created, ${errors.length} failed.`
    }, { status: 201 });
  } catch (error) {
    console.error('Error in student creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
