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
    where: { tenant_id: user.tenant_id, role: 'FACULTY' },
    include: { facultyProfile: { include: { department: true } } },
    orderBy: { created_at: 'desc' }
  });

  const result = faculty.map((f) => ({
    id: f.id,
    identifier: f.identifier,
    email: f.email,
    status: f.status,
    name: f.facultyProfile
      ? `${f.facultyProfile.designation ?? ''}`
      : 'N/A',
    employee_number: f.facultyProfile?.employee_number ?? null,
    department: f.facultyProfile?.department?.name ?? null,
    designation: f.facultyProfile?.designation ?? null,
  }));

  return NextResponse.json({ faculty: result });
});

// POST /api/faculty – create one or multiple faculty (JSON or CSV parsed array)
export const POST = withAuth(['ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  const body = await req.json();

  // Accept either a single object or an array (bulk CSV upload)
  const entries: Array<{ name: string; employee_number: string; email: string; department: string }> =
    Array.isArray(body) ? body : [body];

  if (entries.length === 0) {
    return NextResponse.json({ error: 'No entries provided' }, { status: 400 });
  }

  const results: Array<{ name: string; employee_number: string; identifier: string; temp_password: string }> = [];
  const errors: Array<{ employee_number: string; error: string }> = [];

  for (const entry of entries) {
    const { name, employee_number, email, department } = entry;

    if (!name || !employee_number || !email) {
      errors.push({ employee_number: employee_number ?? '?', error: 'Missing required fields' });
      continue;
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Resolve department by name if provided
        let departmentRecord = null;
        if (department) {
          departmentRecord = await tx.department.findFirst({
            where: { tenant_id: user.tenant_id, name: { equals: department } }
            // where: { tenant_id: user.tenant_id, name: { equals: department, mode: 'insensitive' } }
          });
        }

        // Count existing faculty to generate FAC identifier
        const facCount = await tx.user.count({
          where: { tenant_id: user.tenant_id, role: 'FACULTY' }
        });
        const identifier = `FAC${String(facCount + 1).padStart(3, '0')}`;

        // Generate and hash temp password
        const tempPassword = generateTempPassword();
        const hashed = await hashPassword(tempPassword);

        // Create User record
        const newUser = await tx.user.create({
          data: {
            tenant_id: user.tenant_id,
            identifier,
            password_hash: hashed,
            role: 'FACULTY',
            email,
            status: 'TEMP', // signals must-reset
          }
        });

        // Create FacultyProfile
        await tx.facultyProfile.create({
          data: {
            user_id: newUser.id,
            employee_number,
            designation: name, // store name as designation for now
            department_id: departmentRecord?.id ?? null,
          }
        });

        // Trigger Faculty Welcome Email
        const institution = await resolveTenant(user.tenant_id);
        // const loginLink = getTenantUrl(user.tenant_id as any, 'login');
        const loginLink = getTenantUrl(institution?.name as any, 'login');

        await sendEmail({
          to: email,
          subject: `Welcome to ${institution?.name || 'Unicore'} Faculty Portal`,
          html: getFacultyWelcomeEmailTemplate(institution?.name || 'Unicore', identifier, tempPassword, loginLink)
        });

        results.push({ name, employee_number, identifier, temp_password: tempPassword });
      });
    } catch (err: any) {
      errors.push({
        employee_number,
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
