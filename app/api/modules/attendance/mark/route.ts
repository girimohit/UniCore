import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';
import { AttendanceStatus } from '@/generated/prisma';

/**
 * GET /api/modules/attendance/mark?subjectId=&date=
 * Load existing attendance records for a specific subject + date.
 * Faculty use this to pre-populate the attendance sheet for editing.
 */
export const GET = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'attendance');
    if (!active) {
      return NextResponse.json({ error: 'Attendance module disabled' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId');
    const date = searchParams.get('date');
    const slotType = searchParams.get('slotType') || 'THEORY';

    if (!subjectId || !date) {
      return NextResponse.json({ error: 'subjectId and date are required' }, { status: 400 });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const records = await prisma.attendanceRecord.findMany({
      where: {
        institutionId: user.institutionId,
        subjectId,
        attendanceDate,
        slotType,
      },
      select: { studentId: true, status: true, termId: true },
    });

    // Return as a map: { studentId: status }
    const statusMap: Record<string, string> = {};
    let savedTermId = '';

    records.forEach((r) => { 
      statusMap[r.studentId] = r.status; 
      if (r.termId) savedTermId = r.termId;
    });

    return NextResponse.json({ statuses: statusMap, count: records.length, termId: savedTermId });
  } catch (error) {
    console.error('Error loading attendance records:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'], async (req, context, user) => {
    try {
        const active = await isModuleEnabled(user.institutionId, 'attendance');
        if (!active) {
            return NextResponse.json({ error: 'Attendance module disabled' }, { status: 403 });
        }

        const { subjectId, date, records, termId, slotType = 'THEORY' } = await req.json();
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
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const transaction = await prisma.$transaction(
            validRecords.map((record: any) => prisma.attendanceRecord.upsert({
                where: {
                    studentId_subjectId_attendanceDate_slotType: {
                        studentId: record.studentId,
                        subjectId: subjectId,
                        attendanceDate: attendanceDate,
                        slotType: slotType
                    }
                },
                update: {
                    status: record.status as AttendanceStatus,
                    termId: termId || undefined,
                    markedById: user.userId
                },
                create: {
                    institutionId: user.institutionId,
                    studentId: record.studentId,
                    subjectId: subjectId,
                    courseId: subject.courseId,
                    attendanceDate: attendanceDate,
                    status: record.status as AttendanceStatus,
                    termId: termId || undefined,
                    markedById: user.userId,
                    slotType: slotType
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
