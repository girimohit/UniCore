import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

export const PATCH = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const { academic_system } = await req.json();

    if (!['SEMESTER', 'ANNUAL'].includes(academic_system)) {
      return NextResponse.json({ error: 'Invalid academic system value' }, { status: 400 });
    }

    const updatedInstitution = await prisma.institution.update({
      where: { id: user.tenant_id },
      data: { academic_system }
    });

    return NextResponse.json({ 
      message: 'Institution settings updated successfully',
      institution: updatedInstitution 
    });

  } catch (error) {
    console.error('Settings Update Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
