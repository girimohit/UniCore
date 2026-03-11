import { resolveTenant } from '@/lib/tenant/resolver';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { CheckSquare, Calendar, Users, Save } from 'lucide-react';

export default async function FacultyAttendancePage({ params }: { params: { tenant: string } }) {
  const institution = await resolveTenant(params.tenant);

  if (!institution) {
    notFound();
  }

  const subjects = await prisma.subject.findMany({
    where: { tenant_id: institution.tenant_id },
    orderBy: { name: 'asc' }
  });

  const mockStudents = await prisma.student.findMany({
    where: { tenant_id: institution.tenant_id },
    take: 15
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20">
             <CheckSquare className="h-8 w-8 text-primary-foreground" strokeWidth={2.5} />
          </div>
          Mark Attendance
        </h1>
        <p className="text-lg text-muted-foreground mt-3 font-medium">
           Select a subject and date to securely record the daily roster.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="xl:col-span-1 space-y-6 glass rounded-3xl p-8 border border-border/50 shadow-xl shadow-primary/5 h-fit">
           <div className="space-y-3">
             <label className="text-sm font-bold text-foreground tracking-wide uppercase">Select Subject</label>
             <select className="flex h-12 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm">
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
             </select>
           </div>
           
           <div className="space-y-3">
             <label className="text-sm font-bold text-foreground tracking-wide uppercase">Date</label>
             <div className="flex items-center gap-3 border border-border/50 rounded-xl px-4 h-12 bg-background/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <Calendar className="h-5 w-5 text-primary" />
                <input type="date" className="bg-transparent text-sm font-semibold w-full focus:outline-none text-foreground" defaultValue={new Date().toISOString().split('T')[0]} />
             </div>
           </div>

           <button className="w-full mt-6 flex justify-center items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-primary text-primary-foreground px-4 h-12 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
              <Users className="h-5 w-5" strokeWidth={2.5} />
              Load Roster
           </button>
        </div>

        {/* Roster Marking Table */}
        <div className="xl:col-span-2 glass border border-border/50 rounded-3xl shadow-xl shadow-primary/5 flex flex-col overflow-hidden max-h-[70vh]">
            <div className="p-6 border-b border-border/50 bg-background/30 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-md">
                <h3 className="font-extrabold text-xl text-foreground tracking-tight">Roster Status</h3>
                <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-secondary/80 hover:-translate-y-0.5 shadow-md transition-all duration-300 w-full sm:w-auto justify-center">
                    <Save className="h-5 w-5" strokeWidth={2.5} />
                    Save Records
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {mockStudents.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground font-medium">
                    No students found. Enroll a student to view the roster.
                  </div>
              ) : (
                <table className="w-full text-left text-sm text-foreground">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-extrabold tracking-widest sticky top-0 z-10 backdrop-blur-xl">
                    <tr>
                      <th scope="col" className="px-6 py-4 rounded-tl-xl border-b border-border/50">Roll No</th>
                      <th scope="col" className="px-6 py-4 border-b border-border/50">Name</th>
                      <th scope="col" className="px-6 py-4 rounded-tr-xl border-b border-border/50 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {mockStudents.map((student, i) => (
                      <tr key={student.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-muted-foreground group-hover:text-primary transition-colors">
                           STU-{String(student.enrollmentNo || i+1000).padStart(4, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-foreground">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex justify-center gap-3">
                               <label className="flex items-center justify-center cursor-pointer relative">
                                  <input type="radio" name={`att-${student.id}`} defaultChecked className="peer sr-only" value="P" />
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-background border-2 border-border/50 text-muted-foreground peer-checked:bg-emerald-500/10 peer-checked:border-emerald-500 peer-checked:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-sm">
                                    P
                                  </div>
                               </label>
                               <label className="flex items-center justify-center cursor-pointer relative">
                                  <input type="radio" name={`att-${student.id}`} className="peer sr-only" value="A" />
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-background border-2 border-border/50 text-muted-foreground peer-checked:bg-rose-500/10 peer-checked:border-rose-500 peer-checked:text-rose-500 hover:border-rose-500/50 transition-all shadow-sm">
                                    A
                                  </div>
                               </label>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
