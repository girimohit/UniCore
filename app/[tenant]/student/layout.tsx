import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { getActiveInstitutionModules } from "@/lib/modules/loader";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

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
  const modules = await getActiveInstitutionModules(institution.id);

  const session = await getCurrentUser();
  if (!session) {
    redirect(`/${tenant}/login`);
  }

  if (session.role !== "STUDENT" && session.role !== "ADMIN") {
    return notFound();
  }
  // No need to fetch studentProfile separately if not used for name

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, username: true, avatarUrl: true }
  });

  return (
    <SidebarProvider>
      <div className="h-screen bg-background text-foreground flex overflow-hidden relative transition-colors duration-500">
        {/* Background Ambient Orbs (Landing Page Style) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-100 z-0">
          <div
            className="absolute -top-24 -left-20 w-100 h-100 rounded-full opacity-[0.08]"
            style={{
              background: "radial-gradient(circle, var(--uc-purple), transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <div
            className="absolute top-1/2 -right-20 w-75 h-75 rounded-full opacity-[0.05]"
            style={{
              background: "radial-gradient(circle, var(--uc-cyan), transparent 70%)",
              filter: "blur(50px)",
            }}
          />
        </div>

        <Sidebar
          institutionId={institution.id}
          urlSlug={tenant}
          role="student"
          username={user?.name || user?.username || "Student"}
          initialModules={modules}
        />
        <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          <Topbar institution={institution} user={user as any} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background/30 backdrop-blur-[2px]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
