import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import InstitutionSettingsManager from "./InstitutionSettingsManager";
import { Settings } from "lucide-react";

export default async function AdminSettingsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  // Resolve institution
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true, academic_system: true },
  });

  if (!institution) return notFound();

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

      <InstitutionSettingsManager initialSettings={{ academic_system: institution.academic_system }} />
    </div>
  );
}
