import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';
import { z } from 'zod';

const TimetableEntrySchema = z.object({
  id: z.string().optional(),
  subjectId: z.string(),
  facultyId: z.string().optional().nullable(),
  day: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string().optional().nullable(),
  type: z.string().default('THEORY'),
});

const TimetableSchema = z.object({
  courseId: z.string(),
  semester: z.number().int().positive(),
  entries: z.array(TimetableEntrySchema)
});

export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'STUDENT', 'FACULTY'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'timetable');
    if (!active) {
       return NextResponse.json({ error: 'Timetable module disabled' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const semesterStr = searchParams.get('semester');

    if (!courseId || !semesterStr) {
      return NextResponse.json({ error: 'courseId and semester are required' }, { status: 400 });
    }

    const semester = parseInt(semesterStr, 10);

    const timetable = await prisma.timetable.findUnique({
      where: {
        institutionId_courseId_semester: {
          institutionId: user.institutionId,
          courseId,
          semester
        }
      },
      include: {
        entries: {
          include: {
            subject: true,
            faculty: {
               include: {
                   user: {
                       select: { name: true, username: true }
                   }
               }
            }
          }
        }
      }
    });

    return NextResponse.json({ timetable });
  } catch (error) {
    console.error('Timetable GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'timetable');
    if (!active) {
       return NextResponse.json({ error: 'Timetable module disabled' }, { status: 403 });
    }

    const json = await req.json();
    const validation = TimetableSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { courseId, semester, entries } = validation.data;

    const result = await prisma.$transaction(async (tx) => {
        // Find or create timetable
        const timetable = await tx.timetable.upsert({
            where: {
                institutionId_courseId_semester: {
                    institutionId: user.institutionId,
                    courseId,
                    semester
                }
            },
            update: {},
            create: {
                institutionId: user.institutionId,
                courseId,
                semester
            }
        });

        // Current entries in DB
        const existingEntries = await tx.timetableEntry.findMany({
            where: { timetableId: timetable.id }
        });

        const incomingIds = entries.map(e => e.id).filter(id => id);
        
        // Delete entries not in incoming list
        const entriesToDelete = existingEntries.filter(e => !incomingIds.includes(e.id));
        if (entriesToDelete.length > 0) {
            await tx.timetableEntry.deleteMany({
                where: { id: { in: entriesToDelete.map(e => e.id) } }
            });
        }

        // Upsert entries
        const processedEntries = [];
        for(let entry of entries) {
            if(entry.id) {
                const updated = await tx.timetableEntry.update({
                    where: { id: entry.id },
                    data: {
                        subjectId: entry.subjectId,
                        facultyId: entry.facultyId || null,
                        day: entry.day,
                        startTime: entry.startTime,
                        endTime: entry.endTime,
                        room: entry.room || null,
                        type: entry.type
                    }
                });
                processedEntries.push(updated);
            } else {
                const created = await tx.timetableEntry.create({
                    data: {
                        timetableId: timetable.id,
                        subjectId: entry.subjectId,
                        facultyId: entry.facultyId || null,
                        day: entry.day,
                        startTime: entry.startTime,
                        endTime: entry.endTime,
                        room: entry.room || null,
                        type: entry.type
                    }
                });
                processedEntries.push(created);
            }
        }

        return { timetable, entries: processedEntries };
    });

    return NextResponse.json({ 
      message: `Successfully saved timetable`,
      timetable: result
    }, { status: 201 });

  } catch (error) {
    console.error('Timetable POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
