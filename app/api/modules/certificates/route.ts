import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

/**
 * GET /api/modules/certificates
 * - Lists all certificates for the institution
 */
export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { institutionId: user.institutionId },
      include: {
        student: { include: { user: true } },
        course: true
      },
      orderBy: { issueDate: 'desc' }
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
