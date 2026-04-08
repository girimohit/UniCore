import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { 
  Calendar, BookOpen, Layers, ClipboardCheck, 
  ArrowRight, Info
} from "lucide-react";

export default async function StudentExamsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    return notFound();
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant }
  });

  if (!institution) return notFound();

  // 1. Get student profile to find their course
  const studentProfile = await prisma.student.findUnique({
    where: { userId: user.userId },
    select: { courseId: true }
  });

  if (!studentProfile?.courseId) {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <Info className="w-12 h-12 text-muted-foreground" />
            <h2 className="text-xl font-bold">Not Enrolled</h2>
            <p className="text-muted-foreground">You are not currently enrolled in any course. Contact administration for help.</p>
        </div>
    );
  }

  // 2. Fetch exams for their course
  const exams = await prisma.exam.findMany({
    where: { 
        institutionId: institution.id,
        courseId: studentProfile.courseId
    },
    include: {
      subject: true,
      term: true
    },
    orderBy: { examDate: 'asc' }
  });

  // Filter for upcoming vs past
  const now = new Date();
  const upcomingExams = exams.filter(e => new Date(e.examDate) >= now);
  const pastExams = exams.filter(e => new Date(e.examDate) < now);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Examination Schedule</h1>
        <p className="text-muted-foreground mt-2 text-lg">Stay updated with your upcoming subject evaluations.</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="w-2 h-8 bg-primary rounded-full" />
            Upcoming Exams
        </h2>

        {upcomingExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingExams.map(exam => (
                    <div key={exam.id} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-amber-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative bg-card border border-border/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black px-3 py-1 bg-secondary rounded-full uppercase tracking-widest">
                                    {exam.examType}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{exam.name}</h3>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <BookOpen className="w-4 h-4 text-amber-500" />
                                    <span className="font-semibold text-foreground">{exam.subject.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                    <Layers className="w-4 h-4" />
                                    {exam.term.name}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border/40 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Date</span>
                                    <span className="text-sm font-black">{new Date(exam.examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Policy</span>
                                    <span className="text-sm font-black">{exam.passingMarks}/{exam.maxMarks}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="p-12 rounded-3xl bg-secondary/10 border border-dashed border-border/60 text-center">
                <p className="text-muted-foreground font-medium">No upcoming exams found for your course.</p>
            </div>
        )}
      </section>

      {pastExams.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-border/40">
            <h2 className="text-xl font-bold text-muted-foreground">Completed Evaluations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {pastExams.map(exam => (
                    <div key={exam.id} className="bg-secondary/5 border border-border/40 rounded-2xl p-4 flex items-center justify-between hover:bg-secondary/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-secondary/20">
                                <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-xs font-bold leading-tight">{exam.name}</p>
                                <p className="text-[10px] text-muted-foreground">{exam.subject.name}</p>
                            </div>
                        </div>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                ))}
            </div>
          </section>
      )}
    </div>
  );
}
