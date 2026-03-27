import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { withAuth } from '@/lib/auth-middleware';
import type { NextRequest } from 'next/server';
import { sendEmail, getFacultyWelcomeEmailTemplate } from '@/lib/mail';
import { resolveTenant } from '@/lib/tenant/resolver';
import { getTenantUrl } from '@/lib/config';

// generate temp password
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  let pass = '';
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

// GET /api/faculty – list all faculty for admin's tenant
export const GET = withAuth(['ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  const faculty = await prisma.user.findMany({
    where: { institutionId: user.institutionId, role: 'FACULTY' },
    include: { faculty: { include: { department: true } } },
    orderBy: { createdAt: 'desc' }
  });

  const result = faculty.map((f) => ({
    id: f.id,
    username: f.username,
    email: f.email,
    status: f.accountStatus,
    name: f.name,
    employeeNumber: f.faculty?.employeeNumber ?? null,
    department: f.faculty?.department?.name ?? null,
    designation: f.faculty?.designation ?? null,
    avatarUrl: f.avatarUrl,
  }));

  return NextResponse.json({ faculty: result });
});



// POST /api/faculty – create one or multiple faculty (JSON or CSV parsed array)
export const POST = withAuth(['ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  const body = await req.json();

  // Accept either a single object or an array (bulk CSV upload)
  const entries: Array<{ name: string; employeeNumber: string; email: string; department: string }> =
    Array.isArray(body) ? body : [body];

  if (entries.length === 0) {
    return NextResponse.json({ error: 'No entries provided' }, { status: 400 });
  }

  const results: Array<{ name: string; employeeNumber: string; username: string; temp_password: string }> = [];
  const errors: Array<{ employeeNumber: string; error: string }> = [];

  for (const entry of entries) {
    const { name, employeeNumber, email, department } = entry;

    if (!name || !employeeNumber || !email) {
      errors.push({ employeeNumber: employeeNumber ?? '?', error: 'Missing required fields' });
      continue;
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Resolve department by name if provided
        let departmentRecord = null;
        if (department) {
          departmentRecord = await tx.department.findFirst({
            where: { institutionId: user.institutionId, name: { equals: department } }
          });
        }

        // Count existing faculty to generate FAC username
        const facCount = await tx.user.count({
          where: { institutionId: user.institutionId, role: 'FACULTY' }
        });
        const username = `FAC${String(facCount + 1).padStart(3, '0')}`;

        // Generate and hash temp password
        const tempPassword = generateTempPassword();
        const hashed = await hashPassword(tempPassword);

        // Create User record
        const newUser = await tx.user.create({
          data: {
            institutionId: user.institutionId,
            username,
            name, // Save to User table
            passwordHash: hashed,
            role: 'FACULTY',
            email,
            accountStatus: 'TEMP', // signals must-reset
          }
        });

        // Create Faculty
        await tx.faculty.create({
          data: {
            userId: newUser.id,
            employeeNumber,
            designation: 'Faculty', // default designation
            departmentId: departmentRecord?.id ?? null,
          }
        });

        // Trigger Faculty Welcome Email
        const institution = await resolveTenant(user.institutionId);
        // const loginLink = getTenantUrl(user.institutionId as any, 'login');
        const loginLink = getTenantUrl(institution?.slug as any, 'login');

        await sendEmail({
          to: email,
          subject: `Welcome to ${institution?.name || 'Unicore'} Faculty Portal`,
          html: getFacultyWelcomeEmailTemplate(institution?.name || 'Unicore', username, tempPassword, loginLink)
        });

        results.push({ name, employeeNumber, username, temp_password: tempPassword });
      });
    } catch (err: any) {
      errors.push({
        employeeNumber,
        error: err.code === 'P2002' ? 'Employee number or email already exists' : err.message,
      });
    }
  }

  return NextResponse.json({
    created: results,
    errors,
    message: `${results.length} faculty created, ${errors.length} failed.`
  }, { status: 201 });
});
