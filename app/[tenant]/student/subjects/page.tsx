import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User, GraduationCap, ChevronRight } from "lucide-react"

export default async function StudentSubjectsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'STUDENT') {
    redirect(`/${tenant}/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true }
  });

  if (!institution) notFound();

  const student = await prisma.studentProfile.findUnique({
    where: { user_id: session.user_id },
    include: {
      course: true
    }
  });

  if (!student) notFound();

  // Get subjects for the student's course
  const subjects = student.course_id ? await prisma.subject.findMany({
    where: { courseId: student.course_id },
    orderBy: { name: 'asc' }
  }) : [];

  // Mocking extra fields from reference but using real data for core fields
  const subjectStyles = [
    { color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    { color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    { color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    { color: "bg-purple-500", light: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    { color: "bg-rose-500", light: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    { color: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-black">My Subjects 👋</h1>
        <p className="text-slate-500">Enrolled courses for current semester at {institution.name}.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.length === 0 ? (
          <Card className="col-span-full p-12 text-center text-slate-500 border-slate-200 bg-white">
             <p className="text-lg font-semibold">No subjects currently enrolled.</p>
          </Card>
        ) : subjects.map((sub, i) => {
             const style = subjectStyles[i % subjectStyles.length];
             return (
               <Card key={sub.id} className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer text-black bg-white">
                  <div className={`h-1.5 w-full ${style.color}`}></div>
                  <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${style.light} ${style.text} ${style.border}`}>
                              {sub.code || 'SUB-101'}
                          </span>
                          <div className={`p-2 rounded-full ${style.light} ${style.text}`}>
                              <BookOpen className="h-4 w-4" />
                          </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {sub.name}
                      </h3>
                      
                      <div className="space-y-4 mt-6">
                          <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                  <User className="h-4 w-4" />
                               </div>
                               <div className="flex-1">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Faculty</p>
                                  <p className="text-sm font-bold text-slate-700">Department Faculty</p>
                               </div>
                          </div>
                          
                          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                             <div className="flex items-center gap-1.5">
                                  <GraduationCap className="h-4 w-4 text-slate-400" />
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                          4 Credits
                                  </span>
                             </div>
                             <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                          </div>
                      </div>
                  </CardContent>
               </Card>
             );
        })}
      </div>
    </div>
  )
}
