import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, User, GraduationCap, ChevronRight } from "lucide-react";
import { getAcademicLabel, formatCycleLabel } from "@/lib/utils/academic";

export default async function StudentSubjectsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== "STUDENT") {
    redirect(`/${tenant}/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: {
      id: true,
      name: true,
      academic_system: true,
      academicStructure: true,
    },
  });

  if (!institution) notFound();

  const student = await prisma.studentProfile.findUnique({
    where: { user_id: session.user_id },
    include: { course: true },
  });

  if (!student) notFound();

  const academic = getAcademicLabel(
    (institution.academicStructure as any) || institution.academic_system,
  );

  const subjects = student.course_id
    ? await prisma.subject.findMany({
        where: {
          courseId: student.course_id,
          cycleNumber: student.semester ?? undefined, // match semester
        },
        include: {
          taughtBy: {
            include: {
              facultyProfile: {
                include: {
                  user: {
                    select: { identifier: true },
                  },
                },
              },
            },
            take: 1,
          },
        },
        orderBy: { name: "asc" },
      })
    : [];

  const subjectStyles = [
    {
      color: "bg-emerald-500",
      light: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    {
      color: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    {
      color: "bg-amber-500",
      light: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    {
      color: "bg-purple-500",
      light: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    {
      color: "bg-rose-500",
      light: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
    {
      color: "bg-indigo-500",
      light: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="px-2">
        <h1 className="text-3xl font-display font-black text-foreground tracking-tight">
          My Subjects 📚
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          {student.course ? (
            <>
              <span className="text-foreground tracking-tight">
                {student.course.name}
              </span>
              {student.semester
                ? ` · ${formatCycleLabel(academic.type, student.semester)}`
                : ""}{" "}
              ·{" "}
            </>
          ) : null}
          {institution.name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.length === 0 ? (
          <Card className="col-span-full border-dashed border-border p-20 text-center bg-card/10 backdrop-blur-md rounded-[2.5rem]">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground opacity-20 mb-6" />
            <h3 className="text-xl font-display font-black text-foreground">
              No subjects found
            </h3>
            <p className="text-muted-foreground font-medium mt-2 max-w-sm mx-auto">
              Your course subjects have not been assigned for this academic
              period yet.
            </p>
          </Card>
        ) : (
          subjects.map((sub, i) => {
            const style = subjectStyles[i % subjectStyles.length];
            const facultyName =
              sub.taughtBy[0]?.facultyProfile?.user?.identifier ?? null;
            return (
              <Card
                key={sub.id}
                className="group border-border/40 bg-card/40 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer rounded-[2rem]"
              >
                <div
                  className={`h-1.5 w-full ${style.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                ></div>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${style.light} ${style.text} ${style.border}`}
                    >
                      {sub.code}
                    </span>
                    <div
                      className={`p-2.5 rounded-2xl ${style.light} ${style.text} shadow-inner`}
                    >
                      <BookOpen className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-black text-foreground mb-3 group-hover:grad-purple transition-all duration-500">
                    {sub.name}
                  </h3>

                  <div className="space-y-6 mt-8">
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 group-hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-card border border-border/40 flex items-center justify-center text-muted-foreground shrink-0 shadow-sm">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                          Faculty
                        </p>
                        <p className="text-sm font-bold text-foreground truncate">
                          {facultyName ?? (
                            <span className="text-muted-foreground italic font-normal">
                              Not assigned
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/40 flex justify-between items-center px-1">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary opacity-60" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          {sub.cycleNumber
                            ? formatCycleLabel(academic.type, sub.cycleNumber)
                            : "—"}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-300">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
