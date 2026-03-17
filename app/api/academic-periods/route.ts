import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

// GET /api/academic-periods - List all periods for tenant
export const GET = withAuth(['SUPER_ADMIN', 'ADMIN'], async (req, context, user) => {
  try {
    const periods = await prisma.academicPeriod.findMany({
      where: { tenant_id: user.tenant_id },
      orderBy: { start_date: 'desc' }
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
    const { name, type, start_date, end_date } = await req.json();

    // Basic validation
    if (!name || !type || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['SEMESTER', 'YEAR', 'TERM'].includes(type)) {
      return NextResponse.json({ error: 'Invalid period type' }, { status: 400 });
    }

    const academicPeriod = await prisma.academicPeriod.create({
      data: {
        name,
        type,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        tenant_id: user.tenant_id
      }
    });

    return NextResponse.json(academicPeriod, { status: 201 });
  } catch (error) {
    console.error('Academic Period POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
