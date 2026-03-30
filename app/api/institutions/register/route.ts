import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { institution_name, slug: rawSlug, admin_name, admin_email, password } = await req.json();
    const slug = rawSlug?.toLowerCase();

    if (!institution_name || !slug || !admin_name || !admin_email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validation: 2-25 chars, lowercase alphanumeric and hyphens, no hyphen at start/end
    const slugRegex = /^[a-z0-9][a-z0-9-]{0,23}[a-z0-9]$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ error: 'Invalid workspace slug format (2-25 chars, lowercase alphanumeric and hyphens only)' }, { status: 400 });
    }

    // Calculate hashedPassword OUTSIDE the transaction for better performance
    const hashedPassword = await hashPassword(password);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if slug exists
      const existingInstitution = await tx.institution.findUnique({
        where: { slug }
      });
      if (existingInstitution) {
        throw new Error("Slug_Exists");
      }

      // 2. Create Institution
      const institution = await tx.institution.create({
        data: {
          name: institution_name,
          slug,
          status: 'ACTIVE'
        }
      });

      // 3. Generate username
      const adminCount = await tx.user.count({
        where: { role: 'ADMIN', institutionId: institution.id }
      });
      const username = `ADM${String(adminCount + 1).padStart(3, '0')}`;

      // 4. Create Admin User
      const adminUser = await tx.user.create({
        data: {
          institutionId: institution.id,
          username,
          passwordHash: hashedPassword,
          role: 'ADMIN',
          email: admin_email,
          accountStatus: 'ACTIVE'
        }
      });

      return { institution, adminUser, username };
    });

/* Previous Implementation (Commented Out)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if slug exists to provide better error
      const existingInstitution = await tx.institution.findUnique({
        where: { slug }
      });
      if (existingInstitution) {
        throw new Error("Slug_Exists");
      }

      // 2. Create Tenant
      const institution = await tx.institution.create({
        data: {
          name: institution_name,
          slug,
          status: 'ACTIVE'
        }
      });

      // 3. Generate unique admin username (ADM + count + 1)
      const adminCount = await tx.user.count({
        where: { role: 'ADMIN', institutionId: institution.id }
      });
      const username = `ADM${String(adminCount + 1).padStart(3, '0')}`;

      // 4. Create Admin User
      const hashedPassword = await hashPassword(password);
      
      const adminUser = await tx.user.create({
        data: {
          institutionId: institution.id,
          username,
          passwordHash: hashedPassword,
          role: 'ADMIN',
          email: admin_email,
          accountStatus: 'ACTIVE'
        }
      });

      return { institution, adminUser, username };
    });
*/

    return NextResponse.json({ 
      message: 'Institution registered successfully',
      tenantSlug: result.institution.slug,
      credentials: {
        username: result.username,
        email: admin_email
      }
    }, { status: 201 });

  } catch (error: any) {
    if (error.message === "Slug_Exists" || error.code === 'P2002') {
      return NextResponse.json({ error: 'Subdomain or Email already in use' }, { status: 409 });
    }
    console.error('Institution Registration API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
