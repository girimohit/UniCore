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
  GraduationCap
} from "lucide-react";
import { getAcademicLabel } from '@/lib/utils/academic';
import Link from 'next/link';

export default async function StudentDashboard({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'STUDENT') {
    redirect(`/${tenant}/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true, academic_system: true }
  });

  if (!institution) notFound();

  const student = await prisma.studentProfile.findUnique({
    where: { user_id: session.user_id },
    include: {
      user: { select: { identifier: true, email: true } },
      course: { select: { name: true } },
      _count: {
        select: {
          attendances: true,
          enrolledCourses: true,
          grades: true
        }
      },
      attendances: {
        where: { status: 'PRESENT' },
        select: { id: true }
      },
      grades: {
        select: { score: true }
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
  const attendanceCount = student._count.attendances;
  const presentCount = student.attendances.length;
  const attendanceRate = attendanceCount > 0
    ? Math.round((presentCount / attendanceCount) * 100)
    : 0;
  const attendanceStatus = attendanceRate >= 75 ? 'Good' : attendanceRate >= 50 ? 'Average' : 'Low';
  const attendanceColor = attendanceRate >= 75 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : attendanceRate >= 50 ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-rose-700 bg-rose-50 border-rose-100';

  const avgGpa = student.grades.length > 0
    ? (student.grades.reduce((acc, curr) => acc + curr.score, 0) / student.grades.length / 25).toFixed(1)
    : null;

  const academic = getAcademicLabel(institution.academic_system);

  // Recent subjects for the student's course
  const recentSubjects = student.course_id ? await prisma.subject.findMany({
    where: { courseId: student.course_id },
    take: 4,
    orderBy: { name: 'asc' }
  }) : [];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {student.user.identifier}! 👋
          </h1>
          <p className="text-slate-500">
            {student.course ? (
              <><span className="font-semibold text-slate-700">{student.course.name}</span>{student.semester ? ` · ${academic.label} ${student.semester}` : ''} · </>
            ) : null}
            {institution.name}
          </p>
        </div>
        <Link href={`/${tenant}/student/subjects`}>
          <Button variant="outline" className="bg-white">
            View My Subjects
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Attendance */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="h-1.5 w-full bg-emerald-500"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full border ${attendanceColor}`}>
                {attendanceStatus}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">{attendanceRate}%</h3>
              <p className="text-sm font-medium text-slate-500">Overall Attendance</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
              <TrendingUp className="h-3 w-3 mr-1" /> {presentCount}/{attendanceCount} classes present
            </div>
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="h-1.5 w-full bg-blue-500"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {academic.label} {student.semester ?? '—'}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">{recentSubjects.length}</h3>
              <p className="text-sm font-medium text-slate-500">Active Subjects</p>
            </div>
            <Link href={`/${tenant}/student/subjects`} className="mt-4 flex items-center text-xs font-medium text-blue-600 hover:underline">
              View all subjects <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>

        {/* Grades */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="h-1.5 w-full bg-violet-500"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                GPA
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">{avgGpa ?? '—'}</h3>
              <p className="text-sm font-medium text-slate-500">
                {student.grades.length > 0 ? `Avg across ${student.grades.length} grade(s)` : 'No grades yet'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notices placeholder */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="h-1.5 w-full bg-amber-500"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Bell className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                Notices
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">—</h3>
              <p className="text-sm font-medium text-slate-500">No new notices</p>
            </div>
            <Link href={`/${tenant}/student/notices`} className="mt-4 flex items-center text-xs font-medium text-amber-600 hover:underline">
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section: Subjects list + Attendance overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Subjects */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">My Subjects</h3>
            <Link href={`/${tenant}/student/subjects`}>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">View All</Button>
            </Link>
          </div>

          {recentSubjects.length === 0 ? (
            <Card className="border border-slate-200 bg-white p-8 text-center text-slate-400">
              <BookOpen className="w-8 h-8 mx-auto opacity-30 mb-2" />
              <p className="text-sm font-medium">No subjects for your course yet.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentSubjects.map((sub, i) => {
                const colors = ['border-l-emerald-500', 'border-l-blue-500', 'border-l-violet-500', 'border-l-amber-500'];
                return (
                  <div key={sub.id} className={`bg-white border border-slate-200 border-l-4 ${colors[i % colors.length]} rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow`}>
                    <div>
                      <p className="font-bold text-slate-900">{sub.name}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{sub.code}</p>
                    </div>
                    <Link href={`/${tenant}/student/attendance`}>
                      <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-indigo-600">
                        View Attendance
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Attendance breakdown card */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Quick Stats</h3>
          <Card className="border border-slate-200 shadow-sm bg-white text-black">
            <CardContent className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Course</span>
                <span className="text-sm font-bold text-slate-900 text-right max-w-[60%] truncate">
                  {student.course?.name ?? <span className="text-slate-400 italic">Not assigned</span>}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">{academic.label}</span>
                <span className="text-sm font-bold text-slate-900">
                  {student.semester ?? <span className="text-slate-400 italic">—</span>}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Roll Number</span>
                <span className="text-sm font-mono font-bold text-indigo-600">{student.roll_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Attendance</span>
                <span className={`text-sm font-bold ${attendanceRate >= 75 ? 'text-emerald-600' : attendanceRate >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {attendanceRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Grades recorded</span>
                <span className="text-sm font-bold text-slate-900">{student.grades.length}</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all ${attendanceRate >= 75 ? 'bg-emerald-500' : attendanceRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  {attendanceRate < 75 ? `⚠ Need ${75 - attendanceRate}% more to meet 75% requirement` : '✓ Attendance requirement met'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
