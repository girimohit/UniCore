import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

export const PATCH = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const { academic_system, academicStructure } = await req.json();

    const data: any = {};
    
    if (academic_system) {
      if (!['SEMESTER', 'ANNUAL', 'YEARLY'].includes(academic_system)) {
        return NextResponse.json({ error: 'Invalid academic system value' }, { status: 400 });
      }
      data.academic_system = academic_system;
    }

    if (academicStructure) {
      const { type, totalCycles } = academicStructure;
      if (!['SEMESTER', 'YEARLY'].includes(type)) {
        return NextResponse.json({ error: 'Invalid academic structure type' }, { status: 400 });
      }
      if (typeof totalCycles !== 'number' || totalCycles <= 0) {
        return NextResponse.json({ error: 'Total cycles must be a positive integer' }, { status: 400 });
      }
      data.academicStructure = academicStructure;
      // Also sync legacy academic_system for compatibility
      data.academic_system = type === 'YEARLY' ? 'YEARLY' : 'SEMESTER';
    }

    const updatedInstitution = await prisma.institution.update({
      where: { id: user.tenant_id },
      data
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
