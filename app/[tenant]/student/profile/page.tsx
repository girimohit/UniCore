import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, User, Shield, BookOpen, GraduationCap, Hash, CalendarDays } from "lucide-react"
import * as Icons from "lucide-react";
import { getAcademicLabel } from '@/lib/utils/academic';

export default async function StudentProfilePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'STUDENT') {
    redirect(`/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true, academicSystem: true, academicStructure: true }
  });

  if (!institution) notFound();

  const student = await prisma.student.findUnique({
    where: { userId: session.userId },
    include: {
      user: { select: { name: true, username: true, email: true, accountStatus: true, avatarUrl: true } },
      course: { select: { name: true, code: true } }
    }
  });

  if (!student) notFound();

  const academic = getAcademicLabel(institution.academicStructure as any || institution.academicSystem);
  const initials = (student.user.name || student.user.username).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10">
      <div className="px-2 text-foreground">
        <h1 className="text-3xl font-display font-black tracking-tight">My Profile 👤</h1>
        <p className="text-muted-foreground font-medium mt-1">Your academic identity at {institution.name}.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Avatar + Meta Card */}
        <div className="md:col-span-1 space-y-8">
          <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-sm overflow-hidden text-center rounded-[2.5rem]">
            <div className="h-32 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>
            <div className="px-8 pb-8 relative">
              <div className="w-28 h-28 rounded-3xl bg-card p-1.5 mx-auto -mt-14 relative shadow-2xl border border-border/40 rotate-1 group-hover:rotate-0 transition-transform">
                <div className="w-full h-full rounded-2xl bg-muted overflow-hidden flex items-center justify-center text-primary font-black text-3xl shadow-inner">
                  {student.user.avatarUrl ? (
                    <img src={student.user.avatarUrl} alt={student.user.name} className="w-full h-full object-cover" />
                  ) : initials}
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-2xl font-display font-black text-foreground tracking-tight">{student.user.name}</h3>
                <p className="text-xs font-mono text-muted-foreground opacity-60">@{student.user.username}</p>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-70">
                  {student.course?.name ?? 'No course assigned'}
                  {student.semester ? ` · ${academic.label} ${student.semester}` : ''}
                </p>
                <div className="pt-4">
                  <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 py-1.5 px-4 rounded-full inline-block uppercase tracking-[0.2em] shadow-sm">
                    {student.rollNumber}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Status badge */}
          <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60">Status</span>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border tracking-widest uppercase flex items-center gap-1.5 ${
                  student.user.accountStatus === 'ACTIVE'
                    ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${student.user.accountStatus === 'ACTIVE' ? 'bg-emerald-500 pulse-dot' : 'bg-amber-500'}`} />
                  {student.user.accountStatus}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Card */}
        <div className="md:col-span-2">
          <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-border/40 px-8 py-6">
              <CardTitle className="text-xl font-display font-black text-foreground tracking-tight">Academic Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/40">
              {[
                {
                  icon: User,
                  label: 'Full Identity',
                  value: student.user.name,
                },
                {
                  icon: Mail,
                  label: 'Email',
                  value: student.user.email ?? '—',
                },
                {
                   icon: GraduationCap,
                   label: 'Gender',
                   value: student.gender ?? 'Not specified',
                },
                {
                   icon: CalendarDays,
                   label: 'Date of Birth',
                   value: student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not specified',
                },
                {
                  icon: Shield,
                  label: 'Universal Roll No.',
                  value: student.rollNumber,
                  mono: true,
                },
                {
                  icon: BookOpen,
                  label: 'Enrolled Program',
                  value: student.course ? `${student.course.name} (${student.course.code})` : 'Not assigned',
                },
                {
                  icon: Hash,
                  label: academic.label,
                  value: student.semester != null ? String(student.semester) : 'Not assigned',
                },
                {
                  icon: Icons.Building,
                  label: 'Parent Institution',
                  value: institution.name,
                },
              ].map(({ icon: Icon, label, value, mono }: any) => (
                <div key={label} className="flex items-center gap-6 py-6 px-8 group transition-colors hover:bg-muted/30">
                  <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform group-hover:bg-primary/5 group-hover:text-primary">
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60 mb-1">{label}</p>
                    <p className={`text-base font-bold text-foreground truncate ${mono ? 'font-mono text-primary' : ''}`}>{value}</p>
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
