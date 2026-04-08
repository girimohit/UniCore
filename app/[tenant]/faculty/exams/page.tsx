import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import FacultyExamManager from "./FacultyExamManager";

export default async function FacultyExamsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const user = await getCurrentUser();

  if (!user || user.role !== "FACULTY") {
    return notFound();
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    include: {
        academicTerms: {
            orderBy: { startDate: 'desc' },
            select: { id: true, name: true }
        }
    }
  });

  if (!institution) return notFound();

  // 1. Get subjects assigned to this faculty
  const faculty = await prisma.faculty.findUnique({
    where: { userId: user.userId },
    include: {
      facultyAssignments: {
        include: {
          subject: {
            include: {
                course: true
            }
          }
        }
      }
    }
  });

  if (!faculty) return notFound();

  const assignedSubjectIds = faculty.facultyAssignments.map(fa => fa.subjectId);

  // 2. Fetch exams for those subjects
  const exams = await prisma.exam.findMany({
    where: { 
        institutionId: institution.id,
        subjectId: { in: assignedSubjectIds }
    },
    include: {
      course: true,
      subject: true,
      term: true
    },
    orderBy: { examDate: 'desc' }
  });

  const subjects = faculty.facultyAssignments.map(fa => ({
    id: fa.subject.id,
    name: fa.subject.name,
    code: fa.subject.code,
    courseId: fa.subject.courseId,
    courseName: fa.subject.course.name
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Exam & Results</h1>
          <p className="text-muted-foreground mt-1">Manage results for your assigned subjects.</p>
        </div>
      </div>

      <FacultyExamManager 
        initialExams={exams}
        subjects={subjects}
        periods={institution.academicTerms}
        institutionId={institution.id}
      />
    </div>
  );
}
