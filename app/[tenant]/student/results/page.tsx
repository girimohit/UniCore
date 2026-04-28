import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { 
  BarChart3, Award, TrendingUp, BookOpen, 
  Calendar, Info, CheckCircle2, XCircle, ShieldAlert,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { isModuleEnabled } from "@/lib/modules/loader";

export default async function StudentResultsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    return notFound();
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant }
  });

  if (!institution) return notFound();

  const resultsActive = await isModuleEnabled(institution.id, 'results');
  if (!resultsActive) {
      return (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
              <ShieldAlert className="w-16 h-16 text-amber-500 opacity-50" />
              <h2 className="text-2xl font-bold">Results Module Disabled</h2>
              <p className="text-muted-foreground">The results module is currently disabled by the institution administrator.</p>
          </div>
      );
  }

  // 1. Get student profile
  const student = await prisma.student.findUnique({
    where: { userId: user.userId },
    select: { 
        id: true, 
        rollNumber: true, 
        course: true,
        certificates: {
            orderBy: { issueDate: 'desc' },
            take: 1
        }
    }
  });

  if (!student) return notFound();

  // 2. Fetch results for this student
  const results = await prisma.examResult.findMany({
    where: { 
        institutionId: institution.id,
        studentId: student.id,
        exam: {
            resultStatus: 'PUBLISHED'
        }
    },
    include: {
      exam: {
        include: {
            subject: true,
            term: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate some stats
  const totalExams = results.length;
  const passedExams = results.filter(r => r.obtainedMarks >= r.exam.passingMarks).length;
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;
  const averagePercentage = totalExams > 0 
    ? Math.round(results.reduce((acc, r) => {
        const max = r.exam.maxMarks || 1;
        return acc + (r.obtainedMarks / max);
      }, 0) / totalExams * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Academic Performance</h1>
          <p className="text-muted-foreground mt-2">Detailed breakdown of your examination results.</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-3 flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Overall Pass Rate</p>
                <p className="text-2xl font-black text-primary">{passRate}%</p>
            </div>
            <div className="h-10 w-[1px] bg-primary/20" />
            <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Average Score</p>
                <p className="text-2xl font-black text-primary">{averagePercentage}%</p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border/50 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-black">{passedExams}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase">Exams Passed</p>
            </div>
        </div>
        <div className="bg-card border border-border/50 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
                <BarChart3 className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-black">{totalExams}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase">Total Attempted</p>
            </div>
        </div>
        <div className="bg-card border border-border/50 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                <Award className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-black">{student.course?.name || "N/A"}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase">Current Program</p>
            </div>
        </div>
        <div className="bg-card border border-border/50 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
            {student.certificates.length > 0 ? (
                <>
                    <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-600">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-blue-600 flex items-center gap-1">
                            Verified Degree
                            {student.certificates[0].transactionHash && (
                                <a 
                                    href={`https://polygonscan.com/tx/${student.certificates[0].transactionHash}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Blockchain Anchored</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="p-4 rounded-2xl bg-secondary/10 text-muted-foreground">
                        <Award className="w-6 h-6 opacity-30" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-muted-foreground">No Degree Issued</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Pending Completion</p>
                    </div>
                </>
            )}
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-black flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            Detailed Results
        </h2>

        {results.length > 0 ? (
            <div className="bg-card border border-border/30 rounded-[2.5rem] overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-secondary/10 border-b border-border/40">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <th className="px-8 py-5">Examination</th>
                            <th className="px-8 py-5">Subject</th>
                            <th className="px-8 py-5 text-center">Score</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                        {results.map((res) => {
                            const percentage = Math.round((res.obtainedMarks / res.exam.maxMarks) * 100);
                            const isPassed = res.obtainedMarks >= res.exam.passingMarks;

                            return (
                                <tr key={res.id} className="hover:bg-secondary/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-extrabold text-foreground group-hover:text-primary transition-colors">{res.exam.name}</span>
                                            <span className="text-[10px] text-muted-foreground bg-secondary/30 w-fit px-2 py-0.5 rounded-md mt-1 font-mono">{res.exam.examType}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3 text-sm font-bold">
                                            <BookOpen className="w-4 h-4 text-amber-500" />
                                            {res.exam.subject.name}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-end gap-1 font-black">
                                                <span className="text-lg">{res.obtainedMarks}</span>
                                                <span className="text-[10px] text-muted-foreground mb-1">/ {res.exam.maxMarks}</span>
                                            </div>
                                            <div className="w-20 h-1 bg-secondary/30 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${isPassed ? 'bg-emerald-500' : 'bg-destructive'}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-xl w-fit ${
                                            isPassed ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'
                                        }`}>
                                            {isPassed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {isPassed ? 'PASSED' : 'FAILED'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs text-muted-foreground italic font-medium">
                                            {res.teacherRemarks || "No remarks provided."}
                                        </p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="p-20 bg-secondary/5 border border-dashed border-border/60 rounded-[3rem] text-center flex flex-col items-center space-y-4">
                <Info className="w-12 h-12 text-muted-foreground" />
                <div>
                    <h3 className="text-xl font-bold">No Records Found</h3>
                    <p className="text-sm text-muted-foreground">You haven't attempted any examinations yet or results are pending publication.</p>
                </div>
            </div>
        )}
      </section>
    </div>
  );
}
