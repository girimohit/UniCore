import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { getActiveInstitutionModules } from "@/lib/modules/loader";

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
  });

  if (!institution) return notFound();

  // Fetch modules for the sidebar
  const modules = await getActiveInstitutionModules(institution.id);

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar tenantId={institution.id} urlSlug={tenant} role="student" initialModules={modules} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar institution={institution} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
