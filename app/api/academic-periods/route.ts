import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

// GET /api/academic-periods - List all periods for tenant
export const GET = withAuth(['SUPER_ADMIN', 'ADMIN'], async (req, context, user) => {
  try {
    const periods = await prisma.academicTerm.findMany({
      where: { institutionId: user.institutionId },
      orderBy: { startDate: 'desc' }
    });

    return NextResponse.json(periods);
  } catch (error) {
    console.error('Academic Periods GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST /api/academic-periods - Create period
export const POST = withAuth(['SUPER_ADMIN', 'ADMIN'], async (req, context, user) => {
  try {
    const { name, type, startDate, endDate } = await req.json();

    // Basic validation
    if (!name || !type || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['SEMESTER', 'YEAR', 'TERM'].includes(type)) {
      return NextResponse.json({ error: 'Invalid period type' }, { status: 400 });
    }

    const term = await prisma.academicTerm.create({
      data: {
        name,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        institutionId: user.institutionId
      }
    });

    return NextResponse.json(term, { status: 201 });
  } catch (error) {
    console.error('Academic Period POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
