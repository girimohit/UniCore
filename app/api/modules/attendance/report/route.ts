import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';

export const GET = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'STUDENT'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.tenant_id, 'attendance');
    if (!active) {
       return NextResponse.json({ error: 'Attendance module disabled' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
        return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    // Safety check - if role is student, they can only view THEIR OWN report
    if (user.role === 'STUDENT') {
         const me = await prisma.student.findFirst({ where: { userId: user.id } });
         if (!me || me.id !== studentId) {
             return NextResponse.json({ error: 'Forbidden. You can only view your own report.' }, { status: 403 });
         }
    }

    // Fetch all raw logs to map calculations
    const rawAttendance = await prisma.attendance.findMany({
        where: {
            tenant_id: user.tenant_id,
            studentId: studentId
        },
        include: { subject: true }
    });

    // Grouping by Subject to inject calculation metric `(Present + Excused) / Total * 100`
    const statsBySubject: Record<string, { subjectName: string, presentCount: number, total: number }> = {};

    rawAttendance.forEach(record => {
        if (!statsBySubject[record.subjectId]) {
            statsBySubject[record.subjectId] = {
                subjectName: record.subject.name,
                presentCount: 0,
                total: 0
            };
        }

        statsBySubject[record.subjectId].total += 1;
        if (record.status === 'PRESENT' || record.status === 'EXCUSED') {
            statsBySubject[record.subjectId].presentCount += 1;
        }
    });

    const reportArray = Object.values(statsBySubject).map(stat => ({
        subjectName: stat.subjectName,
        totalClasses: stat.total,
        classesAttended: stat.presentCount,
        percentage: ((stat.presentCount / stat.total) * 100).toFixed(2)
    }));

    return NextResponse.json({ report: reportArray });
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
