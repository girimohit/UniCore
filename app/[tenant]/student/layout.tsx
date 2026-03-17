import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { SidebarProvider } from "@/components/layout/sidebar-context";
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
    <SidebarProvider>
      <div className="h-screen bg-background text-foreground flex overflow-hidden relative transition-colors duration-500">
        {/* Background Ambient Orbs (Landing Page Style) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-100 z-0">
          <div className="absolute -top-24 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle, var(--uc-purple), transparent 70%)", filter: "blur(50px)" }} />
          <div className="absolute top-1/2 -right-20 w-[300px] h-[300px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, var(--uc-cyan), transparent 70%)", filter: "blur(50px)" }} />
        </div>

        <Sidebar tenantId={institution.id} urlSlug={tenant} role="student" initialModules={modules} />
        <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          <Topbar institution={institution} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background/30 backdrop-blur-[2px]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
