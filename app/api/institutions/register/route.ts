import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { InstitutionRegisterSchema } from '@/lib/validations/auth';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validationResult = InstitutionRegisterSchema.safeParse(json);

    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { institution_name, slug, admin_name, admin_email, password } = validationResult.data;

    // Calculate hashedPassword OUTSIDE the transaction for better performance
    const hashedPassword = await hashPassword(password);

    const dbResult = await prisma.$transaction(async (tx) => {
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
          name: admin_name,
          email: admin_email,
          accountStatus: 'ACTIVE'
        }
      });

      return { institution, adminUser, username };
    });

    return NextResponse.json({ 
      message: 'Institution registered successfully',
      tenantSlug: dbResult.institution.slug,
      credentials: {
        username: dbResult.username,
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
