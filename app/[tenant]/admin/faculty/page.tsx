import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import FacultyManager from "./FacultyManager";

export default async function AdminFacultyPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  // Resolve institution
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true },
  });

  if (!institution) return notFound();

  // Fetch departments for the dropdown
  const departments = await prisma.department.findMany({
    where: { institutionId: institution.id },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          Faculty Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Add faculty manually or import via CSV. Manage staff accounts for <span className="text-primary">{institution.name}</span>
        </p>
      </div>

      <FacultyManager departments={departments} institutionId={institution.id} />
    </div>
  );
}
