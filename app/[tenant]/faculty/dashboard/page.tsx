import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function FacultyDashboard({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true }
  });

  if (!institution) notFound();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div className="absolute top-0 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
          Faculty Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Welcome to <span className="text-primary">{institution.name}</span> portal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-50 transition-opacity duration-500 group-hover:opacity-100"></div>
          <h3 className="text-muted-foreground text-sm font-medium relative z-10 mb-2">My Classes Today</h3>
          <p className="text-4xl font-black relative z-10 tracking-tight text-foreground">4</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-50 transition-opacity duration-500 group-hover:opacity-100"></div>
          <h3 className="text-muted-foreground text-sm font-medium relative z-10 mb-2">Pending Attendance</h3>
          <p className="text-4xl font-black relative z-10 tracking-tight text-foreground">1</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-50 transition-opacity duration-500 group-hover:opacity-100"></div>
          <h3 className="text-muted-foreground text-sm font-medium relative z-10 mb-2">Upcoming Exams</h3>
          <p className="text-4xl font-black relative z-10 tracking-tight text-foreground">2</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-50 transition-opacity duration-500 group-hover:opacity-100"></div>
          <h3 className="text-muted-foreground text-sm font-medium relative z-10 mb-2">Average Grade</h3>
          <p className="text-4xl font-black relative z-10 tracking-tight text-foreground">78%</p>
        </div>
      </div>
      
      <div className="glass rounded-3xl border border-border/50 p-8 mt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
        <h3 className="text-xl font-bold mb-4 relative z-10">Quick Actions</h3>
        <div className="flex space-x-4 relative z-10">
          <button className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">Take Attendance</button>
          <button className="px-5 py-2.5 bg-background hover:bg-accent border border-border/50 text-foreground rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all">Enter Grades</button>
        </div>
      </div>
    </div>
  );
}
