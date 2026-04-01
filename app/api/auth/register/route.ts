import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { RegisterSchema } from '@/lib/validations/auth';

/**
 * Super Admin or Platform API route to register a new tenant.
 */
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const result = RegisterSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: result.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { institutionName, subdomain, adminEmail, adminPassword } = result.data;

    // Wrap the tenant creation and admin user provisioning in a transaction
    const dbResult = await prisma.$transaction(async (tx) => {
      // 1. Create the Institution (Tenant)
      const institution = await tx.institution.create({
        data: {
          name: institutionName,
          slug: subdomain,
        }
      });

      // 2. Hash the password for the new admin
      const hashedPassword = await hashPassword(adminPassword);

      // 3. Create the Institution Admin User connected to this Tenant
      const adminUser = await tx.user.create({
        data: {
          email: adminEmail,
          passwordHash: hashedPassword,
          role: 'ADMIN',
          institutionId: institution.id,
          username: 'admin', // default admin username
        }
      });

      return { institution, adminUser };
    });

    return NextResponse.json({ 
      message: 'Institution and Admin registered successfully',
      institutionId: dbResult.institution.id
    }, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Subdomain or Email already in use' }, { status: 409 });
    }
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
