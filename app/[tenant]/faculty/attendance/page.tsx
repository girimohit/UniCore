export const dynamic = 'force-dynamic';

import { resolveTenant } from "@/lib/tenant/resolver";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CheckSquare } from "lucide-react";
import AttendanceManager from "./AttendanceManager";
import { Suspense } from "react";

export default async function FacultyAttendancePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const institution = await resolveTenant(tenant);

  if (!institution) {
    notFound();
  }

  const [subjects, students, periods] = await Promise.all([
    prisma.subject.findMany({
      where: { institutionId: institution.id },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        courseId: true,
        academicCycle: true,
      },
    }),
    prisma.student.findMany({
      where: { user: { institutionId: institution.id } },
      include: { user: { select: { name: true, username: true } } },
      orderBy: { rollNumber: "asc" },
    }),
    prisma.academicTerm.findMany({
      where: { institutionId: institution.id },
      orderBy: { startDate: "desc" },
      select: { id: true, name: true },
    }),
  ]);

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
          Select a subject, date, and optionally an academic period to record
          attendance.
        </p>
      </div>

      <Suspense fallback={<div className="glass p-12 rounded-3xl animate-pulse flex flex-col items-center gap-4"><div className="w-12 h-12 bg-secondary/20 rounded-full" /><div className="h-4 w-48 bg-secondary/20 rounded-full" /></div>}>
        <AttendanceManager
          subjects={subjects}
          students={students}
          periods={periods}
        />
      </Suspense>
    </div>
  );
}
