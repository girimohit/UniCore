import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN'], async (req, context, user) => {
  try {
    const { id } = await context.params;

    const period = await prisma.academicTerm.findFirst({
      where: {
        id,
        institutionId: user.institutionId
      }
    });

    if (!period) {
      return NextResponse.json({ error: 'Academic period not found' }, { status: 404 });
    }

    return NextResponse.json(period);
  } catch (error) {
    console.error('Academic Period GET ID Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
