import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, User as UserIcon } from "lucide-react"
import { isModuleEnabled } from '@/lib/modules/loader';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;

// Range for the absolute timeline grid
const START_HOUR = 8;
const END_HOUR = 19;
const TOTAL_HOURS = END_HOUR - START_HOUR;

const SUBJECT_COLORS = [
  {
    bg:     'bg-violet-100/80 dark:bg-violet-500/[.13]',
    text:   'text-violet-900 dark:text-violet-200',
    meta:   'text-violet-700 dark:text-violet-300',
    border: 'border-violet-300/70 dark:border-violet-400/[.2]',
    pill:   'bg-violet-200/60 dark:bg-violet-400/[.13] text-violet-900 dark:text-violet-200 border-violet-300/60 dark:border-violet-400/25',
    dot:    'bg-violet-400',
  },
  {
    bg:     'bg-emerald-100/80 dark:bg-emerald-500/[.12]',
    text:   'text-emerald-900 dark:text-emerald-200',
    meta:   'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300/70 dark:border-emerald-400/[.2]',
    pill:   'bg-emerald-200/60 dark:bg-emerald-400/[.13] text-emerald-900 dark:text-emerald-200 border-emerald-300/60 dark:border-emerald-400/25',
    dot:    'bg-emerald-400',
  },
  {
    bg:     'bg-sky-100/80 dark:bg-sky-500/[.13]',
    text:   'text-sky-900 dark:text-sky-200',
    meta:   'text-sky-700 dark:text-sky-300',
    border: 'border-sky-300/70 dark:border-sky-400/[.2]',
    pill:   'bg-sky-200/60 dark:bg-sky-400/[.13] text-sky-900 dark:text-sky-200 border-sky-300/60 dark:border-sky-400/25',
    dot:    'bg-sky-400',
  },
  {
    bg:     'bg-orange-100/80 dark:bg-orange-500/[.12]',
    text:   'text-orange-900 dark:text-orange-200',
    meta:   'text-orange-700 dark:text-orange-300',
    border: 'border-orange-300/70 dark:border-orange-400/[.2]',
    pill:   'bg-orange-200/60 dark:bg-orange-400/[.13] text-orange-900 dark:text-orange-200 border-orange-300/60 dark:border-orange-400/25',
    dot:    'bg-orange-400',
  },
  {
    bg:     'bg-rose-100/80 dark:bg-rose-500/[.12]',
    text:   'text-rose-900 dark:text-rose-200',
    meta:   'text-rose-700 dark:text-rose-300',
    border: 'border-rose-300/70 dark:border-rose-400/[.2]',
    pill:   'bg-rose-200/60 dark:bg-rose-400/[.13] text-rose-900 dark:text-rose-200 border-rose-300/60 dark:border-rose-400/25',
    dot:    'bg-rose-400',
  },
  {
    bg:     'bg-teal-100/80 dark:bg-teal-500/[.12]',
    text:   'text-teal-900 dark:text-teal-200',
    meta:   'text-teal-700 dark:text-teal-300',
    border: 'border-teal-300/70 dark:border-teal-400/[.2]',
    pill:   'bg-teal-200/60 dark:bg-teal-400/[.13] text-teal-900 dark:text-teal-200 border-teal-300/60 dark:border-teal-400/25',
    dot:    'bg-teal-400',
  },
  {
    bg:     'bg-purple-100/80 dark:bg-purple-500/[.12]',
    text:   'text-purple-900 dark:text-purple-200',
    meta:   'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300/70 dark:border-purple-400/[.2]',
    pill:   'bg-purple-200/60 dark:bg-purple-400/[.13] text-purple-900 dark:text-purple-200 border-purple-300/60 dark:border-purple-400/25',
    dot:    'bg-purple-400',
  },
  {
    bg:     'bg-amber-100/80 dark:bg-amber-500/[.11]',
    text:   'text-amber-900 dark:text-amber-200',
    meta:   'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300/70 dark:border-amber-400/[.2]',
    pill:   'bg-amber-200/60 dark:bg-amber-400/[.13] text-amber-900 dark:text-amber-200 border-amber-300/60 dark:border-amber-400/25',
    dot:    'bg-amber-400',
  },
  {
    bg:     'bg-fuchsia-100/80 dark:bg-fuchsia-500/[.12]',
    text:   'text-fuchsia-900 dark:text-fuchsia-200',
    meta:   'text-fuchsia-700 dark:text-fuchsia-300',
    border: 'border-fuchsia-300/70 dark:border-fuchsia-400/[.2]',
    pill:   'bg-fuchsia-200/60 dark:bg-fuchsia-400/[.13] text-fuchsia-900 dark:text-fuchsia-200 border-fuchsia-300/60 dark:border-fuchsia-400/25',
    dot:    'bg-fuchsia-400',
  },
  {
    bg:     'bg-slate-200/70 dark:bg-slate-500/[.13]',
    text:   'text-slate-900 dark:text-slate-200',
    meta:   'text-slate-600 dark:text-slate-300',
    border: 'border-slate-300/70 dark:border-slate-400/[.2]',
    pill:   'bg-slate-300/50 dark:bg-slate-400/[.13] text-slate-900 dark:text-slate-200 border-slate-400/50 dark:border-slate-400/25',
    dot:    'bg-slate-400',
  },
];

function getColorForSubject(subjectId: string) {
  let hash = 0;
  for (let i = 0; i < subjectId.length; i++) {
    hash = subjectId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

function timeToHour(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

export default async function StudentTimetablePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'STUDENT') {
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

  const student = await prisma.student.findUnique({
      where: { userId: session.userId }
  });

  if (!student) notFound();

  let timetable = null;

  if (student.courseId && student.semester) {
      timetable = await prisma.timetable.findUnique({
          where: {
              institutionId_courseId_semester: {
                  institutionId: institution.id,
                  courseId: student.courseId,
                  semester: student.semester
              }
          },
          include: {
              entries: {
                  include: {
                      subject: true,
                      faculty: {
                          include: {
                              user: { select: { name: true } }
                          }
                      }
                  },
                  orderBy: { startTime: 'asc' }
              }
          }
      });
  }

  const timelineMarkers = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i);

  return (
    <div className="space-y-6 pb-12 text-foreground animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div className="px-2">
        <h1 className="text-2xl font-display font-black tracking-tight">Weekly Timetable 🗓️</h1>
        <p className="text-muted-foreground font-medium text-sm mt-0.5">Your schedule at {institution.name}.</p>
      </div>

      {!student.courseId || !student.semester ? (
          <div className="p-12 text-center border rounded-3xl bg-card">
              <h3 className="text-xl font-bold">Not Enrolled</h3>
              <p className="text-muted-foreground">You have not been assigned to a course or semester yet.</p>
          </div>
      ) : !timetable || timetable.entries.length === 0 ? (
          <div className="p-12 text-center border rounded-3xl bg-card">
              <h3 className="text-xl font-bold">No Schedule Found</h3>
              <p className="text-muted-foreground">The administrator has not published your timetable yet.</p>
          </div>
      ) : (
        <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden rounded-[2.5rem]">
            <CardContent className="p-0">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
                    <div className="min-w-[1200px] pb-6">
                         {/* Header Timeline */}
                        <div className="grid grid-cols-[80px_1fr] border-b border-border/40 bg-muted/20">
                            <div className="p-4 font-black text-muted-foreground flex items-center justify-center uppercase text-[10px] tracking-[0.2em] opacity-50">
                                TIME
                            </div>
                            <div className="relative w-full h-12 flex items-end pb-2">
                                {timelineMarkers.map((hour, idx) => (
                                    <div 
                                        key={hour} 
                                        className="absolute text-[10px] font-black text-muted-foreground tracking-tight -translate-x-1/2"
                                        style={{ left: `${(idx / TOTAL_HOURS) * 100}%` }}
                                    >
                                        {hour.toString().padStart(2, '0')}:00
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Grid Rows */}
                        <div className="relative">
                            {/* Vertical Grid Lines for aesthetic precision */}
                            <div className="absolute top-0 bottom-0 left-[80px] right-0 pointer-events-none">
                                {timelineMarkers.map((hour, idx) => (
                                    <div 
                                        key={hour} 
                                        className="absolute top-0 bottom-0 border-l border-border/10 border-dashed"
                                        style={{ left: `${(idx / TOTAL_HOURS) * 100}%` }}
                                    />
                                ))}
                            </div>

                            {DAYS.map((day, idx) => {
                                const dayEntries = timetable!.entries.filter(e => e.day === day);
                                
                                return (
                                    <div key={idx} className="grid grid-cols-[80px_1fr] border-b border-border/10 last:border-0 group/row hover:bg-muted/5 transition-colors relative z-10">
                                        <div className="p-4 font-black text-foreground flex items-center justify-center border-r border-border/20 bg-card/20 sticky left-0 z-20 shadow-[10px_0_20px_auto_rgba(0,0,0,0.02)] backdrop-blur-md">
                                            <span className="text-xs font-display tracking-widest text-muted-foreground group-hover/row:text-primary transition-colors">{day.substring(0,3)}</span>
                                        </div>
                                        
                                        <div className="relative w-full min-h-[110px] py-2">
                                            {dayEntries.length === 0 ? (
                                                <div className="absolute inset-x-8 inset-y-2 rounded-3xl border border-dashed border-border/10 flex items-center justify-center text-muted-foreground/10 text-[10px] font-black tracking-[0.3em] pointer-events-none">
                                                    FREE
                                                </div>
                                            ) : (
                                                dayEntries.map((slot, sIdx) => {
                                                    const color = getColorForSubject(slot.subjectId);
                                                    
                                                    const start = timeToHour(slot.startTime);
                                                    const end = timeToHour(slot.endTime);
                                                    const left = ((start - START_HOUR) / TOTAL_HOURS) * 100;
                                                    const width = ((end - start) / TOTAL_HOURS) * 100;
                                                    
                                                    return (
                                                        <div
                                                            key={sIdx}
                                                            className={`absolute top-1.5 bottom-1.5 rounded-xl border backdrop-blur-sm ${color.bg} ${color.border} px-3 py-2 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group/card`}
                                                            style={{ left: `calc(${left}% + 2px)`, width: `calc(${width}% - 4px)` }}
                                                        >
                                                            <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                                                <span className={`flex items-center gap-1 text-[10.5px] font-black tracking-tight ${color.meta}`}>
                                                                    <Clock className="w-2.5 h-2.5" />
                                                                    {slot.startTime}–{slot.endTime}
                                                                </span>
                                                                {slot.type && (
                                                                    <span className={`text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${color.pill}`}>
                                                                        {slot.type}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="text-[12.5px] font-bold leading-snug tracking-tight truncate text-foreground">
                                                                {slot.subject.name}
                                                            </p>

                                                            <div className="flex flex-col gap-0.5 mt-1.5">
                                                                {slot.faculty?.user?.name && (
                                                                    <span className="flex items-center gap-1.5 text-[10.5px] font-semibold truncate text-muted-foreground">
                                                                        <UserIcon className="w-3 h-3 text-emerald-500 shrink-0" />
                                                                        {slot.faculty.user.name}
                                                                    </span>
                                                                )}
                                                                {slot.room && (
                                                                    <span className="flex items-center gap-1.5 text-[10.5px] font-semibold truncate text-muted-foreground">
                                                                        <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                                                                        {slot.room}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  )
}


// PREVIOUS VERSIONS & EXPERIMENTS PRESERVED BELOW AS PER USER REQUEST

// import { prisma } from '@/lib/db';
// import { notFound, redirect } from 'next/navigation';
// import { getCurrentUser } from '@/lib/auth-server';
// import { Card, CardContent } from "@/components/ui/card"
// import { Clock, MapPin, User as UserIcon } from "lucide-react"
// import { isModuleEnabled } from '@/lib/modules/loader';

// const DAYS_EXP = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
// const START_HOUR_EXP = 8; // 08:00 AM
// const END_HOUR_EXP = 18;  // 06:00 PM
// const TOTAL_HOURS_EXP = END_HOUR_EXP - START_HOUR_EXP;

// const COLORS_EXP = [
//   "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20 hover:shadow-emerald-500/20",
//   "bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/20 hover:shadow-blue-500/20",
//   "bg-purple-500/10 text-purple-700 border-purple-500/20 hover:bg-purple-500/20 hover:shadow-purple-500/20",
//   "bg-rose-500/10 text-rose-700 border-rose-500/20 hover:bg-rose-500/20 hover:shadow-rose-500/20",
//   "bg-indigo-500/10 text-indigo-700 border-indigo-500/20 hover:bg-indigo-500/20 hover:shadow-indigo-500/20",
//   "bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/20 hover:shadow-amber-500/20",
//   "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 hover:bg-cyan-500/20 hover:shadow-cyan-500/20",
//   "bg-slate-500/10 text-slate-700 border-slate-500/20 hover:bg-slate-500/20 hover:shadow-slate-500/20",
// ];

// function getColorForSubjectExp(subjectId: string) {
//     let hash = 0;
//     for (let i = 0; i < subjectId.length; i++) {
//         hash = subjectId.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     const index = Math.abs(hash) % COLORS_EXP.length;
//     return COLORS_EXP[index];
// }

// function calculateGridSpanExp(startTime: string, endTime: string) {
//     const parseTime = (timeStr: string) => {
//         const [hours, mins] = timeStr.split(':').map(Number);
//         return hours + (mins / 60);
//     };
//     const start = parseTime(startTime);
//     const end = parseTime(endTime);
//     const mathStart = Math.max(START_HOUR_EXP, start);
//     const mathEnd = Math.min(END_HOUR_EXP, end);
//     const startPercentage = ((mathStart - START_HOUR_EXP) / TOTAL_HOURS_EXP) * 100;
//     const durationPercentage = ((mathEnd - mathStart) / TOTAL_HOURS_EXP) * 100;
//     return {
//         left: `${startPercentage}%`,
//         width: `${durationPercentage}%`
//     };
// }
