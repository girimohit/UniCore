import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

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

  // Just render children — login page needs no shell,
  // dashboard pages add their own layout via nested layouts
  return <>{children}</>;
}
