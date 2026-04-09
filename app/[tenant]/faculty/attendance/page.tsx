export const dynamic = 'force-dynamic';

import { resolveTenant } from "@/lib/tenant/resolver";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-server";
import { CheckSquare } from "lucide-react";
import AttendanceManager from "./AttendanceManager";
import { Suspense } from "react";
import { isModuleEnabled } from '@/lib/modules/loader';

export default async function FacultyAttendancePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'FACULTY') {
    redirect(`/login`);
  }

  const institution = await resolveTenant(tenant);
  if (!institution) notFound();

  const active = await isModuleEnabled(institution.id, 'attendance');
  if (!active) {
    return (
      <div className="p-12 text-center border rounded-3xl bg-card">
        <h3 className="text-xl font-bold">Module Not Enabled</h3>
        <p className="text-muted-foreground">The Attendance module has not been enabled for your institution.</p>
      </div>
    );
  }

  // 1. Get this faculty member's profile
  const facultyProfile = await prisma.faculty.findFirst({
    where: { userId: session.userId },
  });

  if (!facultyProfile) notFound();

  // 2. Get only subjects assigned to THIS faculty
  const assignments = await prisma.facultyAssignment.findMany({
    where: { facultyId: facultyProfile.id },
    include: {
      subject: {
        select: {
          id: true,
          name: true,
          code: true,
          courseId: true,
          academicCycle: true,
        },
      },
    },
  });

  const assignedSubjects = assignments.map((a) => ({
    ...a.subject,
    responsibility: a.responsibility,
  }));

  // 3. Get course IDs from assigned subjects to filter students
  const assignedCourseIds = [...new Set(assignedSubjects.map((s) => s.courseId))];

  // 4. Fetch only students enrolled in those courses
  const students = assignedCourseIds.length > 0
    ? await prisma.student.findMany({
        where: {
          courseId: { in: assignedCourseIds },
          user: { institutionId: institution.id },
        },
        include: { user: { select: { name: true, username: true } } },
        orderBy: { rollNumber: "asc" },
      })
    : [];

  // 5. Fetch academic periods
  const periods = await prisma.academicTerm.findMany({
    where: { institutionId: institution.id },
    orderBy: { startDate: "desc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20">
            <CheckSquare
              className="h-8 w-8 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
          Mark Attendance
        </h1>
        <p className="text-lg text-muted-foreground mt-3 font-medium">
          Showing subjects assigned to you. Select a subject and date to mark attendance.
        </p>
      </div>

      {assignedSubjects.length === 0 ? (
        <div className="glass p-16 rounded-3xl border border-border/40 flex flex-col items-center gap-4 text-center">
          <CheckSquare className="w-12 h-12 text-primary opacity-30" />
          <div>
            <h3 className="text-xl font-bold">No subjects assigned</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ask your admin to assign subjects to you before marking attendance.
            </p>
          </div>
        </div>
      ) : (
        <Suspense fallback={<div className="glass p-12 rounded-3xl animate-pulse flex flex-col items-center gap-4"><div className="w-12 h-12 bg-secondary/20 rounded-full" /><div className="h-4 w-48 bg-secondary/20 rounded-full" /></div>}>
          <AttendanceManager
            subjects={assignedSubjects}
            students={students}
            periods={periods}
          />
        </Suspense>
      )}
    </div>
  );
}
