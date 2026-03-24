import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { BookOpen, CalendarCheck, GraduationCap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function FacultyDashboard({ params }: { params: Promise<{ tenant: string }> }) {
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

  // Fetch faculty profile and assigned subjects
  const faculty = await prisma.facultyProfile.findUnique({
    where: { user_id: session.user_id },
    include: {
      taughtSubjects: {
        include: {
          subject: {
            include: { course: true }
          }
        }
      }
    }
  });

  const assignedSubjects = faculty?.taughtSubjects.map(ts => ts.subject) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div className="absolute top-0 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10 opacity-60"></div>
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Faculty Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-2 font-medium">
            Welcome back, <span className="text-primary font-bold">{(session as any).name || "Faculty Member"}</span>
          </p>
        </div>
        <div className="px-4 py-2 glass rounded-2xl border border-border/40 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{institution.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-50 transition-opacity duration-500 group-hover:opacity-100"></div>
          <h3 className="text-muted-foreground text-sm font-medium relative z-10 mb-2">My Subjects</h3>
          <p className="text-4xl font-black relative z-10 tracking-tight text-foreground">{assignedSubjects.length}</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-50 transition-opacity duration-500 group-hover:opacity-100"></div>
          <h3 className="text-muted-foreground text-sm font-medium relative z-10 mb-2">Pending Attendance</h3>
          <p className="text-4xl font-black relative z-10 tracking-tight text-foreground">1</p>
        </div>
        {/* ... rest of cards unchanged ... */}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          My Assigned Subjects
        </h2>
        
        {assignedSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedSubjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/${tenant}/faculty/attendance?subjectId=${subject.id}`}
                className="group glass p-8 rounded-[2.5rem] border border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                   <span className="text-[10px] font-black px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                     {subject.code}
                   </span>
                   <div className="p-2.5 rounded-2xl bg-secondary/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                      <CalendarCheck className="w-4 h-4" />
                   </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{subject.name}</h3>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 opacity-70">
                   <GraduationCap className="w-3 h-3" />
                   {subject.course.name}
                </p>

                <div className="mt-8 pt-6 border-t border-border/20 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">Mark Attendance</span>
                   <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass p-12 rounded-[2.5rem] border border-dashed border-border/50 text-center">
             <BookOpen className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-4" />
             <p className="text-muted-foreground font-medium">No subjects assigned yet.</p>
          </div>
        )}
      </div>
      
      <div className="glass rounded-3xl border border-white/5 p-8 mt-8 relative overflow-hidden bg-black/40">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
        <h3 className="text-xl font-bold mb-4 relative z-10">Quick Actions</h3>
        <div className="flex space-x-4 relative z-10">
          <Link href={`/${tenant}/faculty/attendance`} className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">Take Attendance</Link>
          <button className="px-5 py-2.5 bg-background hover:bg-accent border border-border/50 text-foreground rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all">Enter Grades</button>
        </div>
      </div>
    </div>
  );
}
