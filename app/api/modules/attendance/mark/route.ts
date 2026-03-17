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

    // Resolve the subject to get its courseId
    const subject = await prisma.subject.findFirst({
        where: { id: subjectId, tenant_id: user.tenant_id },
        select: { id: true, courseId: true }
    });

    if (!subject) {
        return NextResponse.json({ error: 'Subject not found for this tenant' }, { status: 404 });
    }

    // Filter: only students enrolled in the subject's course
    const studentIds = records.map((r: any) => r.studentId);
    const enrolledStudents = await prisma.studentProfile.findMany({
        where: {
            id: { in: studentIds },
            course_id: subject.courseId,
            user: { tenant_id: user.tenant_id }
        },
        select: { id: true }
    });
    const enrolledSet = new Set(enrolledStudents.map(s => s.id));
    const validRecords = records.filter((r: any) => enrolledSet.has(r.studentId));
    const rejectedCount = records.length - validRecords.length;

    // Process only enrolled+valid students
    if (validRecords.length === 0) {
        return NextResponse.json({ error: 'No eligible students found for this subject/course.' }, { status: 400 });
    }

    // Process all marks sequentially (could be a transaction mapping)
    const transaction = await prisma.$transaction(
        validRecords.map((record: any) => prisma.attendance.upsert({
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

    return NextResponse.json({
        message: 'Attendance marked successfully',
        updatedCount: transaction.length,
        ...(rejectedCount > 0 ? { warning: `${rejectedCount} student(s) skipped — not enrolled in this course.` } : {})
    }, { status: 201 });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
