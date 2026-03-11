import { resolveTenant } from '@/lib/tenant/resolver';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { PieChart, BookOpen } from 'lucide-react';

export default async function StudentAttendancePage({ params }: { params: { tenant: string } }) {
  const institution = await resolveTenant(params.tenant);

  if (!institution) {
    notFound();
  }

  const subjects = await prisma.subject.findMany({
    where: { tenant_id: institution.tenant_id },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-primary to-accent rounded-2xl shadow-lg shadow-primary/20">
             <PieChart className="h-8 w-8 text-primary-foreground" strokeWidth={2.5} />
          </div>
          Attendance Report
        </h1>
        <p className="text-lg text-muted-foreground mt-3 font-medium">
           View your total attendance breakdown per enrolled subject.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {subjects.length === 0 ? (
           <div className="col-span-full p-12 text-center text-muted-foreground glass rounded-3xl border border-border/50 shadow-sm">
              <p className="text-lg font-semibold">No subjects currently enrolled.</p>
           </div>
         ) : subjects.map((subj, i) => {
            const mockPercentage = Math.floor(Math.random() * 40) + 60;
            const isDanger = mockPercentage < 75;

            return (
               <div 
                 key={subj.id} 
                 className="relative group glass rounded-3xl p-6 border border-border/50 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden"
                 style={{ animationDelay: `${i * 100}ms` }}
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                 <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                       <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{subj.name}</h3>
                       <p className="text-sm text-primary/80 font-bold uppercase tracking-wider mt-1">{subj.code}</p>
                    </div>
                    <div className="p-3 bg-background/50 backdrop-blur-sm border border-border/20 rounded-2xl">
                       <BookOpen className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={2.5} />
                    </div>
                 </div>

                 <div className="mt-8 space-y-4 relative z-10">
                    <div className="flex justify-between items-end">
                       <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Semester Avg</span>
                       <span className={`text-4xl font-black ${isDanger ? 'text-destructive drop-shadow-[0_0_10px_rgba(225,29,72,0.3)]' : 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`}>
                          {mockPercentage}%
                       </span>
                    </div>

                    <div className="w-full bg-accent/30 rounded-full h-3 overflow-hidden shadow-inner">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${isDanger ? 'bg-gradient-to-r from-rose-500 to-red-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`} 
                         style={{ width: `${mockPercentage}%` }} 
                       >
                         {/* Shimmer effect inside progress bar */}
                         <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                       </div>
                    </div>
                 </div>
               </div>
            );
         })}
      </div>
    </div>
  );
}
