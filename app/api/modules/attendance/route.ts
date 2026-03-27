import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';

/**
 * Attendance Module API Boundary.
 * Enforces Feature Flags strictly, throwing 403 Forbidden if the
 * institution has explicitly disabled the 'attendance' module.
 */
export const GET = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'FACULTY', 'STUDENT'], async (req, context, user) => {
  try {
    // 1. Feature Flag Validation
    const moduleActive = await isModuleEnabled(user.institutionId, 'attendance');
    if (!moduleActive) {
      return NextResponse.json({
        error: 'Forbidden: The Attendance module is currently disabled for this institution.'
      }, { status: 403 });
    }

    // 2. Safely Process Module Logic (e.g. Fetch recent logs)
    // We filter by tenant_id aggressively
    const attendanceLogs = await prisma.attendanceRecord.findMany({
      where: {
        institutionId: user.institutionId,
      },
      take: 50,
      orderBy: { attendanceDate: 'desc' }
    });

    return NextResponse.json({
      module: 'Attendance',
      status: 'Active',
      data: attendanceLogs
    });

  } catch (error) {
    console.error('Attendance API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
