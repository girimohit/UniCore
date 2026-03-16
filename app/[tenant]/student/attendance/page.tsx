import { resolveTenant } from '@/lib/tenant/resolver';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-server';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AttendanceChart } from "@/components/student/attendance-chart"

export default async function StudentAttendancePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'STUDENT') {
    redirect(`/${tenant}/login`);
  }

  const institution = await resolveTenant(tenant);
  if (!institution) notFound();

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
  
  // Initialize with all subjects from the tenant's courses if possible, 
  // or just subjects the student has attendance for.
  // For better UX, let's get all subjects for the student's course.
  const courseSubjects = student.course_id ? await prisma.subject.findMany({
    where: { courseId: student.course_id }
  }) : [];

  courseSubjects.forEach(s => {
    subjectsMap[s.id] = {
      id: s.id,
      name: s.name,
      code: s.code,
      attended: 0,
      total: 0,
      color: "#10b981", // default
      bg: "bg-emerald-500",
      light: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100"
    };
  });

  // Color palette for variety
  const colors = [
    { color: "#10b981", bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
    { color: "#3b82f6", bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
    { color: "#f59e0b", bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
    { color: "#8b5cf6", bg: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-100" },
    { color: "#ef4444", bg: "bg-red-500", light: "bg-red-50", text: "text-red-700", border: "border-red-100" },
  ];

  courseSubjects.forEach((s, i) => {
    const palette = colors[i % colors.length];
    subjectsMap[s.id] = { ...subjectsMap[s.id], ...palette };
  });

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
            <p className="text-slate-500">Track your class attendance for this semester at {institution.name}.</p>
        </div>
        <div className="w-48 text-black">
             <Select defaultValue="sem4">
                <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sem4">Semester 4</SelectItem>
                    <SelectItem value="sem3">Semester 3</SelectItem>
                </SelectContent>
             </Select>
        </div>
      </div>

      <AttendanceChart subjects={processedSubjects} />
    </div>
  );
}
