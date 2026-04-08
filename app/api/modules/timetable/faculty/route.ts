import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'timetable');
    if (!active) {
       return NextResponse.json({ error: 'Timetable module disabled' }, { status: 403 });
    }

    const faculty = await prisma.faculty.findUnique({
        where: { userId: user.userId }
    });

    if (!faculty) {
        return NextResponse.json({ error: 'Faculty profile not found' }, { status: 404 });
    }

    const entries = await prisma.timetableEntry.findMany({
        where: {
            facultyId: faculty.id,
            timetable: {
                institutionId: user.institutionId,
                isActive: true
            }
        },
        include: {
            subject: true,
            timetable: {
                include: {
                    course: true
                }
            }
        }
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Timetable Faculty GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
