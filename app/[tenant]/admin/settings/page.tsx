import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import InstitutionSettingsManager from "./InstitutionSettingsManager";
import ModuleManager from "@/components/admin/modules/ModuleManager";
import { Settings, Box } from "lucide-react";
import { getActiveInstitutionModules } from "@/lib/modules/loader";

export default async function AdminSettingsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  // Resolve institution
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true, academicSystem: true, academicStructure: true },
  });

  if (!institution) return notFound();

  const activeModules = await getActiveInstitutionModules(institution.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Institution Settings
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Configure global preferences for <span className="text-primary">{institution.name}</span>
        </p>
      </div>

      <InstitutionSettingsManager 
        initialSettings={{ 
          academicSystem: institution.academicSystem,
          academicStructure: institution.academicStructure as any 
        }} 
      />

      <div className="pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 mb-6">
          <Box className="w-6 h-6 text-primary" />
          Feature Modules
        </h2>
        <ModuleManager initialModules={activeModules} />
      </div>
    </div>
  );
}
