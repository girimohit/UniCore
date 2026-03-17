import { resolveTenant } from '@/lib/tenant/resolver';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-server';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AttendanceChart } from "@/components/student/attendance-chart"
import { getAcademicLabel } from "@/lib/utils/academic";

export default async function StudentAttendancePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'STUDENT') {
    redirect(`/${tenant}/login`);
  }

  const institution = await resolveTenant(tenant);
  if (!institution) notFound();

  const academic = getAcademicLabel(institution.academic_system);

  const student = await prisma.studentProfile.findUnique({
    where: { user_id: session.user_id },
    include: {
      attendances: {
        include: {
          subject: true
        }
      }
    }
  });

  if (!student) notFound();

  // Aggregate attendance by subject
  const subjectsMap: Record<string, any> = {};
  
  // Get all subjects for the student's current course assignment
  const courseSubjects = student.course_id ? await prisma.subject.findMany({
    where: { courseId: student.course_id }
  }) : [];

  // Color palette for charts
  const colors = [
    { color: "#10b981", bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
    { color: "#3b82f6", bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
    { color: "#f59e0b", bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
    { color: "#8b5cf6", bg: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-100" },
    { color: "#ef4444", bg: "bg-red-500", light: "bg-red-50", text: "text-red-700", border: "border-red-100" },
  ];

  courseSubjects.forEach((s, i) => {
    const palette = colors[i % colors.length];
    subjectsMap[s.id] = {
      id: s.id,
      name: s.name,
      code: s.code,
      attended: 0,
      total: 0,
      ...palette
    };
  });

  // Calculate attended/total counts
  student.attendances.forEach(a => {
    if (subjectsMap[a.subjectId]) {
      subjectsMap[a.subjectId].total++;
      if (a.status === 'PRESENT') {
        subjectsMap[a.subjectId].attended++;
      }
    }
  });

  const processedSubjects = Object.values(subjectsMap);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-black">My Attendance 👋</h1>
            <p className="text-slate-500">Track your class attendance for this {academic.label.toLowerCase()} at {institution.name}.</p>
        </div>
        <div className="w-48 text-black">
             <Select defaultValue="curr">
                <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder={`Select ${academic.label}`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="curr">
                      {academic.label} {student.semester ?? 'Current'}
                    </SelectItem>
                </SelectContent>
             </Select>
        </div>
      </div>

      {processedSubjects.length === 0 ? (
        <CardContent className="p-16 flex flex-col items-center justify-center text-center gap-4 border border-slate-200 rounded-xl bg-white">
          <CalendarCheck className="h-10 w-10 text-emerald-500 opacity-30" />
          <p className="text-sm font-medium text-slate-500 max-w-xs">No attendance records found. Make sure you are enrolled in a course and subjects are assigned.</p>
        </CardContent>
      ) : (
        <AttendanceChart subjects={processedSubjects} />
      )}
    </div>
  );
}

// Re-importing missing Icon for empty state
import { CalendarCheck } from "lucide-react";
