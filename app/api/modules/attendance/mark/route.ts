import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';
import { AttendanceStatus } from '@prisma/client';

export const POST = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'], async (req, context, user) => {
    try {
        const active = await isModuleEnabled(user.institutionId, 'attendance');
        if (!active) {
            return NextResponse.json({ error: 'Attendance module disabled' }, { status: 403 });
        }

        const { subjectId, date, records, termId } = await req.json();
        // records: Array<{ studentId: string, status: AttendanceStatus }>

        if (!subjectId || !date || !Array.isArray(records)) {
            return NextResponse.json({ error: 'Improper payload' }, { status: 400 });
        }

        // Optional term validation
        if (termId) {
            const term = await prisma.academicTerm.findFirst({
                where: { id: termId, institutionId: user.institutionId }
            });
            if (!term) {
                return NextResponse.json({ error: 'Invalid academic term for this tenant' }, { status: 400 });
            }
        }

        // Resolve the subject to get its courseId
        const subject = await prisma.subject.findFirst({
            where: { id: subjectId, institutionId: user.institutionId },
            select: { id: true, courseId: true }
        });

        if (!subject) {
            return NextResponse.json({ error: 'Subject not found for this tenant' }, { status: 404 });
        }

        // Filter: only students enrolled in the subject's course
        const studentIds = records.map((r: any) => r.studentId);
        const enrolledStudents = await prisma.student.findMany({
            where: {
                id: { in: studentIds },
                courseId: subject.courseId,
                user: { institutionId: user.institutionId }
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
            validRecords.map((record: any) => prisma.attendanceRecord.upsert({
                where: {
                    studentId_subjectId_attendanceDate: {
                        studentId: record.studentId,
                        subjectId: subjectId,
                        attendanceDate: new Date(date)
                    }
                },
                update: {
                    status: record.status,
                    termId: termId || undefined
                },
                create: {
                    institutionId: user.institutionId,
                    studentId: record.studentId,
                    subjectId: subjectId,
                    attendanceDate: new Date(date),
                    status: record.accountStatus,
                    termId: termId || undefined
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
