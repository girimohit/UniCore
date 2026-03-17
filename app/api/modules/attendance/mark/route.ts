import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';
import { AttendanceStatus } from '@prisma/client';

export const POST = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.tenant_id, 'attendance');
    if (!active) {
       return NextResponse.json({ error: 'Attendance module disabled' }, { status: 403 });
    }

    const { subjectId, date, records, periodId } = await req.json();
    // records: Array<{ studentId: string, status: AttendanceStatus }>

    if (!subjectId || !date || !Array.isArray(records)) {
        return NextResponse.json({ error: 'Improper payload' }, { status: 400 });
    }

    // Optional period validation
    if (periodId) {
        const period = await prisma.academicPeriod.findFirst({
            where: { id: periodId, tenant_id: user.tenant_id }
        });
        if (!period) {
            return NextResponse.json({ error: 'Invalid academic period for this tenant' }, { status: 400 });
        }
    }

    // Process all marks sequentially (could be a transaction mapping)
    const transaction = await prisma.$transaction(
        records.map(record => prisma.attendance.upsert({
            where: {
                studentId_subjectId_date: {
                    studentId: record.studentId,
                    subjectId: subjectId,
                    date: new Date(date)
                }
            },
            update: {
                status: record.status,
                periodId: periodId || undefined
            },
            create: {
                tenant_id: user.tenant_id,
                studentId: record.studentId,
                subjectId: subjectId,
                date: new Date(date),
                status: record.status,
                periodId: periodId || undefined
            }
        }))
    );

    return NextResponse.json({ message: 'Attendance marked successfully', updatedCount: transaction.length }, { status: 201 });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
