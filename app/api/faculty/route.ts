import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { withAuth } from '@/lib/auth-middleware';
import type { NextRequest } from 'next/server';
import { sendEmail, getInviteEmailTemplate } from '@/lib/mail';
import { resolveTenant } from '@/lib/tenant/resolver';
import { getTenantUrl } from '@/lib/config';
import crypto from 'crypto';

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



// Creates a User + Faculty stub with status INVITED, generates a UserInvitation
// token, and emails the faculty member an accept-invite link to set their password.
export const POST = withAuth(['ADMIN'], async (req: NextRequest, _ctx: any, user: any) => {
  const body = await req.json();

  // Accept either a single object or an array (bulk CSV upload)
  const entries: Array<{ name: string; employeeNumber: string; email: string; department: string }> =
    Array.isArray(body) ? body : [body];

  if (entries.length === 0) {
    return NextResponse.json({ error: 'No entries provided' }, { status: 400 });
  }

  const results: Array<{ name: string; employeeNumber: string; username: string; email_sent: boolean }> = [];
  const errors: Array<{ employeeNumber: string; error: string }> = [];

  for (const entry of entries) {
    const { name, employeeNumber, email, department } = entry;

    if (!name || !employeeNumber || !email) {
      errors.push({ employeeNumber: employeeNumber ?? '?', error: 'Missing required fields' });
      continue;
    }

    try {
      // Resolve institution info outside the transaction (read-only)
      const institution = await resolveTenant(user.institutionId);

      const txResult = await prisma.$transaction(async (tx) => {
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

        // Create User record with a placeholder password (will be set via invite link)
        const placeholderHash = await hashPassword(crypto.randomBytes(32).toString('hex'));

        const newUser = await tx.user.create({
          data: {
            institutionId: user.institutionId,
            username,
            name,
            passwordHash: placeholderHash,
            role: 'FACULTY',
            email,
            accountStatus: 'INVITED',
          }
        });

        // Create Faculty profile
        await tx.faculty.create({
          data: {
            userId: newUser.id,
            employeeNumber,
            designation: 'Faculty',
            departmentId: departmentRecord?.id ?? null,
          }
        });

        // Generate a secure invitation token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

        await tx.userInvitation.create({
          data: {
            email,
            role: 'FACULTY',
            token,
            institutionId: user.institutionId,
            expiresAt,
          }
        });

        return { username, token };
      });

      // Send invitation email (outside transaction so DB work isn't rolled back on email failure)
      const inviteLink = getTenantUrl(institution?.slug as string, `accept-invite?token=${txResult.token}`);

      const emailResult = await sendEmail({
        to: email,
        subject: `You're invited to join ${institution?.name || 'Unicore'} as Faculty`,
        html: getInviteEmailTemplate(institution?.name || 'Unicore', inviteLink, 'FACULTY'),
      });

      results.push({ name, employeeNumber, username: txResult.username, email_sent: emailResult.success });
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
