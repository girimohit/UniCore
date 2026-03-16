import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import StudentManager from "./StudentManager";
import { Users } from "lucide-react";

export default async function AdminStudentsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  // Resolve institution
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true },
  });

  if (!institution) return notFound();

  // Fetch courses for the dropdown
  const courses = await prisma.course.findMany({
    where: { tenant_id: institution.id },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          Student Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Manage student enrollment, bulk import, and status for <span className="text-primary">{institution.name}</span>
        </p>
      </div>

      <StudentManager courses={courses} tenantId={institution.id} />
    </div>
  );
}
