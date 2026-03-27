import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ExamManager from "./ExamManager";

export default async function ExamsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    include: {
      courses: {
        select: { id: true, name: true, code: true }
      },
      subjects: {
        select: { id: true, name: true, code: true }
      },
      academicTerms: {
        orderBy: { startDate: 'desc' },
        select: { id: true, name: true }
      }
    }
  });

  if (!institution) return notFound();

  const exams = await prisma.exam.findMany({
    where: { institutionId: institution.id },
    include: {
      course: true,
      subject: true,
      term: true
    },
    orderBy: { examDate: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Exam Management</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage examinations for courses and subjects.</p>
        </div>
      </div>

      <ExamManager 
        initialExams={exams}
        courses={institution.courses}
        subjects={institution.subjects}
        periods={institution.academicTerms}
        institutionId={institution.id}
      />
    </div>
  );
}
