import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, User, Shield, GraduationCap, Briefcase, Building2 } from "lucide-react"
import * as Icons from "lucide-react";

export default async function FacultyProfilePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'FACULTY') {
    redirect(`/${tenant}/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true }
  });

  if (!institution) notFound();

  const faculty = await prisma.facultyProfile.findUnique({
    where: { user_id: session.user_id },
    include: {
      user: { select: { name: true, identifier: true, email: true, status: true, avatar_url: true } },
      department: { select: { name: true, code: true } }
    }
  });

  if (!faculty) notFound();

  const initials = (faculty.user.name || faculty.user.identifier).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10">
      <div className="px-2 text-foreground">
        <h1 className="text-3xl font-display font-black tracking-tight">Faculty Profile 👨‍🏫</h1>
        <p className="text-muted-foreground font-medium mt-1">Professional profile at {institution.name}.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
          <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-sm overflow-hidden text-center rounded-[2.5rem]">
            <div className="h-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
            </div>
            <div className="px-8 pb-8 relative">
              <div className="w-28 h-28 rounded-3xl bg-card p-1.5 mx-auto -mt-14 relative shadow-2xl border border-border/40 rotate-1 group-hover:rotate-0 transition-transform">
                <div className="w-full h-full rounded-2xl bg-muted overflow-hidden flex items-center justify-center text-primary font-black text-3xl shadow-inner">
                  {faculty.user.avatar_url ? (
                    <img src={faculty.user.avatar_url} alt={faculty.user.name} className="w-full h-full object-cover" />
                  ) : initials}
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-2xl font-display font-black text-foreground tracking-tight">{faculty.user.name}</h3>
                <p className="text-xs font-mono text-muted-foreground opacity-60">@{faculty.user.identifier}</p>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-70">
                  {faculty.designation || 'Faculty Member'}
                </p>
                <div className="pt-4">
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-4 rounded-full inline-block uppercase tracking-[0.2em] shadow-sm">
                    {faculty.employee_number}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-border/40 px-8 py-6">
              <CardTitle className="text-xl font-display font-black text-foreground tracking-tight">Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/40">
              {[
                {
                  icon: User,
                  label: 'Full Name',
                  value: faculty.user.name,
                },
                {
                  icon: Mail,
                  label: 'Official Email',
                  value: faculty.user.email ?? '—',
                },
                {
                  icon: Shield,
                  label: 'Employee ID',
                  value: faculty.employee_number,
                  mono: true,
                },
                {
                  icon: Building2,
                  label: 'Department',
                  value: faculty.department?.name ?? 'Not assigned',
                },
                {
                  icon: Briefcase,
                  label: 'Designation',
                  value: faculty.designation || 'Faculty Member',
                },
                {
                  icon: GraduationCap,
                  label: 'Institution',
                  value: institution.name,
                },
              ].map(({ icon: Icon, label, value, mono }: any) => (
                <div key={label} className="flex items-center gap-6 py-6 px-8 group transition-colors hover:bg-muted/30">
                  <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform group-hover:bg-primary/5 group-hover:text-primary">
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60 mb-1">{label}</p>
                    <p className={`text-base font-bold text-foreground truncate ${mono ? 'font-mono text-emerald-500' : ''}`}>{value}</p>
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
