import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, User, Shield, BookOpen, GraduationCap, Hash } from "lucide-react"
import { getAcademicLabel } from '@/lib/utils/academic';

export default async function StudentProfilePage({ params }: { params: Promise<{ tenant: string }> }) {
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
      user: { select: { identifier: true, email: true, status: true } },
      course: { select: { name: true, code: true } }
    }
  });

  if (!student) notFound();

  const academic = getAcademicLabel(institution.academic_system);
  const initials = student.user.identifier.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || student.roll_number.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-black">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile 👤</h1>
        <p className="text-slate-500 font-medium">Your academic identity at {institution.name}.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Avatar + Meta Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border border-slate-200 shadow-sm overflow-hidden text-center text-black bg-white">
            <div className="h-32 bg-gradient-to-br from-indigo-800 to-slate-900 relative overflow-hidden"></div>
            <div className="px-6 pb-6 relative">
              <div className="w-24 h-24 rounded-full bg-white p-1 mx-auto -mt-12 relative shadow-md">
                <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-indigo-600 font-black text-3xl">
                  {initials}
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-xl font-bold text-slate-900">{student.user.identifier}</h3>
                <p className="text-slate-500 text-sm font-medium">
                  {student.course?.name ?? 'No course assigned'}
                  {student.semester ? ` · ${academic.label} ${student.semester}` : ''}
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 py-1 px-3 rounded-full inline-block uppercase tracking-widest">
                    {student.roll_number}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Status badge */}
          <Card className="border border-slate-200 shadow-sm text-black bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">Account Status</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                  student.user.status === 'ACTIVE'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                    : 'text-amber-700 bg-amber-50 border-amber-100'
                }`}>
                  {student.user.status}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Card */}
        <div className="md:col-span-2">
          <Card className="border border-slate-200 shadow-sm text-black bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 pt-0 divide-y divide-slate-100">
              {[
                {
                  icon: User,
                  label: 'Identifier / Name',
                  value: student.user.identifier,
                },
                {
                  icon: Mail,
                  label: 'Email Address',
                  value: student.user.email ?? '—',
                },
                {
                  icon: Shield,
                  label: 'Roll Number',
                  value: student.roll_number,
                  mono: true,
                },
                {
                  icon: BookOpen,
                  label: 'Course',
                  value: student.course ? `${student.course.name} (${student.course.code})` : 'Not assigned',
                },
                {
                  icon: Hash,
                  label: academic.label,
                  value: student.semester != null ? String(student.semester) : 'Not assigned',
                },
                {
                  icon: GraduationCap,
                  label: 'Institution',
                  value: institution.name,
                },
              ].map(({ icon: Icon, label, value, mono }) => (
                <div key={label} className="flex items-center gap-4 py-4 px-2">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                    <p className={`text-sm font-bold text-slate-800 truncate ${mono ? 'font-mono text-indigo-600' : ''}`}>{value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
