import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import AcademicPeriodManager from "./AcademicPeriodManager";

export default async function AcademicPeriodsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  // Resolve institution and fetch periods
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true, academic_system: true, academicStructure: true },
  });

  if (!institution) return notFound();

  const periods = await prisma.academicPeriod.findMany({
    where: { tenant_id: institution.id },
    orderBy: { start_date: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          Academic Periods
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Manage academic cycles and terms for <span className="text-primary">{institution.name}</span>
        </p>
      </div>

      <AcademicPeriodManager 
        initialPeriods={JSON.parse(JSON.stringify(periods))} 
        academicSystem={institution.academicStructure as any || institution.academic_system}
      />
    </div>
  );
}
