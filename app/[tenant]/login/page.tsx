/**
 * Tenant-specific login page — SERVER COMPONENT
 *
 * Accessed via:
 *   localhost:3000/amity/login     (path-based)
 *   amity.unicore.app/login        (subdomain — middleware rewrites to /amity/login)
 *
 * Fetches real institution data from DB and passes it to the client form.
 */
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import StudentLoginForm from "@/components/auth/StudentLoginForm";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantLoginPage({ params }: PageProps) {
  const { tenant } = await params;

  // Fetch institution from DB — real name for branded UI
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true, slug: true, status: true },
  });

  // If slug doesn't exist at all → 404
  if (!institution) return notFound();

  return (
    <StudentLoginForm
      tenantSlug={institution.slug}
      institutionName={institution.name}
      isActive={institution.status === "ACTIVE"}
    />
  );
}
