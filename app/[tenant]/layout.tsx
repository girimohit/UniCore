import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// export const metadata: Metadata = {
//   title: "UNICORE",
//   description: "Multi-tenant SaaS ERP for Educational Institutions",
// };


export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant } = await params;

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { name: true },
  });

  if (!institution) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: `${institution.name} | UNICORE`,
    description: `Dashboard for ${institution.name}`,
  };
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  // In Next.js 15, params is a Promise — must be awaited
  const { tenant } = await params;

  // Validate that the tenant slug actually exists in the DB
  // Gives a clean 404 for unknown slugs (e.g. /randomjunk/anything)
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true },
  });

  if (!institution) {
    notFound();
  }
  return <>{children}</>;
}
