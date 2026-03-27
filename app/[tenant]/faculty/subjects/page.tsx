import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { resolveTenant } from "@/lib/tenant/resolver";
import {
  BookOpen,
  CalendarCheck,
  GraduationCap,
  ChevronRight,
  BookMarked,
} from "lucide-react";
import Link from "next/link";

export default async function FacultySubjectsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== "FACULTY") {
    redirect(`/${tenant}/login`);
  }

  const institution = await resolveTenant(tenant);
  if (!institution) notFound();

  // Fetch faculty and assigned subjects
  const faculty = await prisma.faculty.findUnique({
    where: { userId: session.userId },
    include: {
      facultyAssignments: {
        include: {
          subject: {
            include: { course: true },
          },
        },
      },
    },
  });

  const assignedSubjects = faculty?.facultyAssignments.map((fs) => fs.subject) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20">
            <BookMarked
              className="h-8 w-8 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
          Assigned Subjects
        </h1>
        <p className="text-lg text-muted-foreground mt-3 font-medium">
          View all subjects assigned to you and manage student attendance.
        </p>
      </div>

      <div className="space-y-6">
        {assignedSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedSubjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/${tenant}/faculty/attendance?subjectId=${subject.id}`}
                className="group glass p-8 rounded-[2.5rem] border border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                    {subject.code}
                  </span>
                  <div className="p-2.5 rounded-2xl bg-secondary/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {subject.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 opacity-70">
                  <GraduationCap className="w-3 h-3" />
                  {subject.course.name}
                </p>

                <div className="mt-8 pt-6 border-t border-border/20 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Mark Attendance
                  </span>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass p-12 rounded-[2.5rem] border border-dashed border-border/50 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">
              No subjects assigned yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
