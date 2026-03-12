import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { institution_name, slug, admin_name, admin_email, password } = await req.json();

    if (!institution_name || !slug || !admin_name || !admin_email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

      // 3. Generate unique admin identifier (ADM + count + 1)
      const adminCount = await tx.user.count({
        where: { role: 'ADMIN', tenant_id: institution.id }
      });
      const identifier = `ADM${String(adminCount + 1).padStart(3, '0')}`;

      // 4. Create Admin User
      const hashedPassword = await hashPassword(password);
      
      const adminUser = await tx.user.create({
        data: {
          tenant_id: institution.id,
          identifier,
          password_hash: hashedPassword,
          role: 'ADMIN',
          email: admin_email,
          status: 'ACTIVE'
        }
      });

      return { institution, adminUser, identifier };
    });

    return NextResponse.json({ 
      message: 'Institution registered successfully',
      tenant_slug: result.institution.slug,
      credentials: {
        identifier: result.identifier,
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
