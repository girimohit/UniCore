import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarCheck, 
  BookOpen, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  Bell,
  GraduationCap,
  Clock
} from "lucide-react";
import { getAcademicLabel, formatCycleLabel } from '@/lib/utils/academic';
import Link from 'next/link';

const SUBJECT_COLORS = [
  { bg: 'bg-violet-100/80 dark:bg-violet-500/[.13]', text: 'text-violet-900 dark:text-violet-200', border: 'border-violet-300/70 dark:border-violet-400/[.2]' },
  { bg: 'bg-emerald-100/80 dark:bg-emerald-500/[.12]', text: 'text-emerald-900 dark:text-emerald-200', border: 'border-emerald-300/70 dark:border-emerald-400/[.2]' },
  { bg: 'bg-sky-100/80 dark:bg-sky-500/[.13]', text: 'text-sky-900 dark:text-sky-200', border: 'border-sky-300/70 dark:border-sky-400/[.2]' },
  { bg: 'bg-orange-100/80 dark:bg-orange-500/[.12]', text: 'text-orange-900 dark:text-orange-200', border: 'border-orange-300/70 dark:border-orange-400/[.2]' },
  { bg: 'bg-rose-100/80 dark:bg-rose-500/[.12]', text: 'text-rose-900 dark:text-rose-200', border: 'border-rose-300/70 dark:border-rose-400/[.2]' },
  { bg: 'bg-teal-100/80 dark:bg-teal-500/[.12]', text: 'text-teal-900 dark:text-teal-200', border: 'border-teal-300/70 dark:border-teal-400/[.2]' },
  { bg: 'bg-purple-100/80 dark:bg-purple-500/[.12]', text: 'text-purple-900 dark:text-purple-200', border: 'border-purple-300/70 dark:border-purple-400/[.2]' },
  { bg: 'bg-amber-100/80 dark:bg-amber-500/[.11]', text: 'text-amber-900 dark:text-amber-200', border: 'border-amber-300/70 dark:border-amber-400/[.2]' },
  { bg: 'bg-fuchsia-100/80 dark:bg-fuchsia-500/[.12]', text: 'text-fuchsia-900 dark:text-fuchsia-200', border: 'border-fuchsia-300/70 dark:border-fuchsia-400/[.2]' },
  { bg: 'bg-slate-200/70 dark:bg-slate-500/[.13]', text: 'text-slate-900 dark:text-slate-200', border: 'border-slate-300/70 dark:border-slate-400/[.2]' },
];

function getColorForSubject(subjectId: string) {
  let hash = 0;
  for (let i = 0; i < subjectId.length; i++) {
    hash = subjectId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

export default async function StudentDashboard({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'STUDENT') {
    redirect(`/${tenant}/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true, academicSystem: true, academicStructure: true }
  });

  if (!institution) notFound();

  const student = await prisma.student.findUnique({
    where: { userId: session.userId },
    include: {
      user: { select: { username: true, email: true } },
      course: { select: { name: true } },
      _count: {
        select: {
          attendanceRecords: true,
          courseEnrollments: true,
          examResults: true
        }
      },
      attendanceRecords: {
        where: { status: 'PRESENT' },
        select: { id: true }
      },
      examResults: {
        select: { obtainedMarks: true }
      }
    }
  });

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">Profile Not Found</h2>
          <p className="text-slate-500">We couldn't find your student profile. Please contact your campus administrator.</p>
        </Card>
      </div>
    );
  }

  // Stats
  const attendanceCount = student._count.attendanceRecords;
  const presentCount = student.attendanceRecords.length;
  const attendanceRate = attendanceCount > 0
    ? Math.round((presentCount / attendanceCount) * 100)
    : 0;
  const attendanceStatus = attendanceRate >= 75 ? 'Good' : attendanceRate >= 50 ? 'Average' : 'Low';
  const attendanceColor = attendanceRate >= 75 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : attendanceRate >= 50 ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-rose-700 bg-rose-50 border-rose-100';

  const avgGpa = student.examResults.length > 0
    ? (student.examResults.reduce((acc, curr) => acc + curr.obtainedMarks, 0) / student.examResults.length / 25).toFixed(1)
    : null;

  const academic = getAcademicLabel(institution.academicStructure as any || institution.academicSystem);

  // Recent subjects for the student's course
  const recentSubjects = student.courseId ? await prisma.subject.findMany({
    where: { courseId: student.courseId },
    take: 6,
    orderBy: { name: 'asc' }
  }) : [];

  // Today's schedule
  const today = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][new Date().getDay()] as any;
  const todaySchedule = student.courseId && student.semester ? await prisma.timetableEntry.findMany({
      where: {
          timetable: {
              institutionId: institution.id,
              courseId: student.courseId,
              semester: student.semester,
          },
          day: today,
      },
      include: {
          subject: true,
          faculty: { include: { user: { select: { name: true } } } }
      },
      orderBy: { startTime: 'asc' },
      take: 3
  }) : [];

  return (
    <div className="space-y-10 pb-10">

      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 border border-white/5 shadow-2xl transition-all duration-500 group">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-500/10 z-0" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-colors duration-700 group-hover:bg-fuchsia-500/20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              Student Dashboard
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight leading-[1.1]">
                Welcome back,<br />
                <span className="grad-all">{student.user.username}</span>
              </h1>
              <p className="text-white/60 font-medium max-w-lg text-lg leading-relaxed">
                {student.course ? (
                  <><span className="text-white/90">{student.course.name}</span>{student.semester ? ` · ${formatCycleLabel(academic.type, student.semester)}` : ''} · </>
                ) : null}
                {institution.name}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
             <Link href={`/${tenant}/student/subjects`}>
              <Button className="rounded-full px-8 py-6 bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-xl shadow-white/10 transition-all hover:scale-105">
                My Subjects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Attendance */}
        <Card className="group border-border/40 bg-card/50 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500/50"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-inner">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border tracking-widest uppercase ${attendanceColor}`}>
                {attendanceStatus}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-display font-black text-foreground">{attendanceRate}%</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Attendance Rate</p>
            </div>
            <div className="mt-6 h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out fill-animate" style={{ width: `${attendanceRate}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card className="group border-border/40 bg-card/50 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-500/50"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 shadow-inner">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 tracking-widest uppercase">
                {student.semester ? formatCycleLabel(academic.type, student.semester) : '—'}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-display font-black text-foreground">{recentSubjects.length}</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Active Subjects</p>
            </div>
            <Link href={`/${tenant}/student/subjects`} className="mt-6 flex items-center text-[10px] font-black text-blue-500 uppercase tracking-widest hover:gap-2 transition-all">
              Details <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>

        {/* Today's Schedule - REPLACES GRADES and NOTICES */}
        <Card className="md:col-span-2 group border-border/40 bg-card/50 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
          <div className="absolute top-0 left-0 h-1 w-full bg-primary/50"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-black text-foreground">Today's Schedule</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Your classes for {today}</p>
                    </div>
                </div>
                <Link href={`/${tenant}/student/timetable`}>
                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:gap-2">
                        Full View <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                </Link>
            </div>
            
            <div className="grid gap-3">
                {todaySchedule.length === 0 ? (
                    <div className="py-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border/40">
                        <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">No classes today</p>
                    </div>
                ) : (
                    todaySchedule.map((entry, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/20 group/item hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="text-[10px] font-black text-muted-foreground/60 w-16 uppercase">
                                    {entry.startTime}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-foreground">{entry.subject.name}</h4>
                                    <p className="text-[10px] font-medium text-muted-foreground">{entry.faculty?.user?.name || 'TBD'} · {entry.room || 'Room TBD'}</p>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-primary/40 group-hover/item:scale-150 transition-transform" />
                        </div>
                    ))
                )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Bottom section: Subjects list + Attendance overview */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Recent Subjects */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h3 className="text-xl font-display font-black tracking-tight text-foreground">Current Subjects</h3>
            </div>
            <Link href={`/${tenant}/student/subjects`}>
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all">Full Roster</Button>
            </Link>
          </div>

          {recentSubjects.length === 0 ? (
            <Card className="border-dashed border-border p-12 text-center bg-transparent">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
              <p className="text-lg font-bold text-muted-foreground">No subjects found.</p>
              <p className="text-sm text-muted-foreground opacity-60 mt-1">Enrollment might be pending for this academic period.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {recentSubjects.map((sub, i) => {
                const color = getColorForSubject(sub.id);
                
                return (
                  <div key={sub.id} className={`group ${color.bg} border ${color.border} rounded-3xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer relative overflow-hidden active:scale-95`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                         <BookOpen className={`w-12 h-12 ${color.text}`} />
                    </div>
                    <div className="relative z-10 space-y-3">
                      <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${color.text}`}>{sub.code}</div>
                      <h4 className="font-bold text-lg text-foreground leading-tight">{sub.name}</h4>
                      <Link href={`/${tenant}/student/attendance`} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pt-2 ${color.text} opacity-70 group-hover:opacity-100`}>
                        Attendance <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats Summary Card */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
              <div className="w-1.5 h-6 bg-secondary rounded-full" />
              <h3 className="text-xl font-display font-black tracking-tight text-foreground">Summary</h3>
          </div>
          <Card className="border-border/40 shadow-xl dark:shadow-none bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                {[
                  { label: "Course", value: student.course?.name ?? "N/A", icon: GraduationCap },
                  { label: academic.label, value: student.semester ? formatCycleLabel(academic.type, student.semester) : "N/A", icon: CalendarCheck },
                  { label: "Enrollment ID", value: student.rollNumber, icon: TrendingUp },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground transition-all group-hover:bg-primary/10 group-hover:text-primary">
                        <item.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{item.label}</p>
                        <p className="font-bold text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-border/40 space-y-4">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Presence Rate</p>
                         <h4 className={`text-2xl font-display font-black ${attendanceRate >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>{attendanceRate}%</h4>
                    </div>
                    <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                        {presentCount} / {attendanceCount}
                    </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out fill-animate ${attendanceRate >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-orange-400'}`}
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
                
                <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors ${attendanceRate >= 75 ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold leading-relaxed">
                      {attendanceRate < 75 ? `Warning: You are below the 75% threshold. Take more classes to avoid eligibility issues.` : 'Great job! You have maintained a healthy attendance record this academic term.'}
                    </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
