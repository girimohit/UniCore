// Tenant index page — redirects visitors to the tenant login page.

import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantIndexPage({ params }: PageProps) {
  const { tenant } = await params;
  redirect(`/login`);
}
