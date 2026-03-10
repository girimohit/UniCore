/**
 * Admin Dashboard Shell Layout
 * Wraps all /[tenant]/admin/* routes with sidebar + topbar.
 */
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true, slug: true, status: true },
  });

  if (!institution) return notFound();

  return (
    <div className="h-screen bg-background flex overflow-hidden transition-colors duration-300">
      <Sidebar tenantId={institution.id} role="admin" />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar institution={institution} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
