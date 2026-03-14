import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Users, GraduationCap, Building2, BookOpen } from 'lucide-react';
import InviteUser from '@/components/admin/InviteUser';

export default async function AdminDashboard({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true },
  }); 

  if (!institution) return notFound();

  // Fetch quick stats for the tenant using the correct User model
  const [studentCount, facultyCount, departmentCount, courseCount] = await Promise.all([
    prisma.user.count({ where: { tenant_id: institution.id, role: 'STUDENT' } }),
    prisma.user.count({ where: { tenant_id: institution.id, role: 'FACULTY' } }),
    prisma.department.count({ where: { tenant_id: institution.id } }),
    prisma.course.count({ where: { tenant_id: institution.id } }),
  ]);

  const stats = [
    { name: 'Total Students', value: studentCount, icon: Users, gradient: 'from-blue-500/20 to-indigo-500/20', text: 'text-blue-500' },
    { name: 'Total Faculty', value: facultyCount, icon: GraduationCap, gradient: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-500' },
    { name: 'Departments', value: departmentCount, icon: Building2, gradient: 'from-rose-500/20 to-pink-500/20', text: 'text-rose-500' },
    { name: 'Courses', value: courseCount, icon: BookOpen, gradient: 'from-amber-500/20 to-orange-500/20', text: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
          Welcome Back
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Here is what's happening at <span className="text-primary">{institution.name}</span> today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {stats.map((stat, i) => (
          <div
            key={stat.name}
            className="relative group glass rounded-3xl p-6 border border-border/50 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">{stat.name}</h3>
                <div className={`p-3 rounded-2xl bg-background/50 backdrop-blur-sm shadow-sm border border-border/20 ${stat.text}`}>
                  <stat.icon className="h-5 w-5" strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-4xl font-black text-foreground tracking-tight">
                {stat.value.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <InviteUser tenantId={tenant} />

        <div className="glass rounded-3xl p-8 border border-border/50 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-transparent"></div>
          <h3 className="text-xl font-bold text-foreground mb-3 relative z-10 transition-transform group-hover:scale-105">Module Configurations</h3>
          <p className="text-muted-foreground relative z-10 bg-accent/50 px-4 py-2 rounded-full font-medium">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
