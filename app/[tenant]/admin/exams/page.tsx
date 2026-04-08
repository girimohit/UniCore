import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ExamManager from "./ExamManager";

import { isModuleEnabled } from "@/lib/modules/loader";
import { ShieldAlert } from "lucide-react";

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

  const active = await isModuleEnabled(institution.id, 'exams');
  if (!active) {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <ShieldAlert className="w-16 h-16 text-amber-500 opacity-50" />
            <h2 className="text-2xl font-bold">Exams Module Disabled</h2>
            <p className="text-muted-foreground">This module is currently disabled. Enable it in settings to manage examinations.</p>
        </div>
    );
  }

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
