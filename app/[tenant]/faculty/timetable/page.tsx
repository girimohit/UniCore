import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, BookOpen } from "lucide-react"
import { isModuleEnabled } from '@/lib/modules/loader';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;

export default async function FacultyTimetablePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'FACULTY') {
    redirect(`/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true }
  });

  if (!institution) notFound();

  const active = await isModuleEnabled(institution.id, 'timetable');
  if (!active) {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <h2 className="text-2xl font-bold">Timetable Module Disabled</h2>
            <p className="text-muted-foreground">The timetable module is currently disabled by the institution administrator.</p>
        </div>
    );
  }

  const faculty = await prisma.faculty.findUnique({
      where: { userId: session.userId }
  });

  if (!faculty) notFound();

  // Fetch all classes this faculty teaches
  const entries = await prisma.timetableEntry.findMany({
      where: {
          facultyId: faculty.id,
          timetable: {
              institutionId: institution.id,
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
      },
      orderBy: { startTime: 'asc' }
  });

  return (
    <div className="space-y-10 pb-10 text-foreground">
      <div className="px-2">
        <h1 className="text-3xl font-display font-black tracking-tight">Teaching Schedule 🗓️</h1>
        <p className="text-muted-foreground font-medium mt-1">Your weekly master schedule at {institution.name}.</p>
      </div>

      {entries.length === 0 ? (
          <div className="p-12 text-center border rounded-3xl bg-card">
              <h3 className="text-xl font-bold">Free Schedule</h3>
              <p className="text-muted-foreground">You have not been assigned to any classes for the current active timetables.</p>
          </div>
      ) : (
        <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-xl overflow-hidden rounded-[2.5rem]">
            <CardContent className="p-0">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
                    <div className="min-w-[900px]">
                        <div className="grid grid-cols-[120px_1fr] border-b border-border/40 bg-muted/30 p-4">
                            <div className="font-black text-muted-foreground text-center uppercase tracking-[0.2em] opacity-60">Day</div>
                            <div className="font-black text-muted-foreground uppercase opacity-60">Classes to Teach</div>
                        </div>

                        {DAYS.map((day, idx) => {
                            const dayEntries = entries.filter(e => e.day === day);
                            return (
                                <div key={idx} className="grid grid-cols-[120px_1fr] border-b border-border/20 last:border-0 group/row hover:bg-muted/10 transition-colors">
                                    <div className="p-6 font-black text-foreground flex items-center justify-center border-r border-border/20 bg-card/20 min-h-[120px]">
                                        <span className="text-sm font-display tracking-widest">{day.substring(0,3)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 p-4 items-center">
                                        {dayEntries.length === 0 ? (
                                            <div className="text-muted-foreground/40 font-bold uppercase tracking-widest text-xs px-4">
                                                Free Day
                                            </div>
                                        ) : (
                                            dayEntries.map((entry, eIdx) => (
                                                <div key={eIdx} className="bg-primary/5 border border-primary/20 rounded-2xl p-4 w-[280px] shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary mb-2 bg-primary/10 w-fit px-2 py-0.5 rounded-full">
                                                        <Clock className="w-3 h-3" /> {entry.startTime} - {entry.endTime}
                                                    </div>
                                                    
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-bold text-sm leading-tight text-foreground line-clamp-2 pr-2">{entry.subject.name}</h4>
                                                        <span className="text-[9px] font-black uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{entry.type}</span>
                                                    </div>
                                                    
                                                    <div className="space-y-1 border-t border-primary/10 pt-2">
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <BookOpen className="w-3 h-3 text-emerald-500" />
                                                            <span className="truncate">{entry.timetable.course.name} (Sem {entry.timetable.semester})</span>
                                                        </div>
                                                        {entry.room && (
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <MapPin className="w-3 h-3 text-amber-500" />
                                                                <span className="truncate">{entry.room}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  )
}
