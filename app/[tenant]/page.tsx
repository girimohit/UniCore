/**
 * Tenant index page — redirects visitors to the tenant login page.
 * Handles: localhost:3000/amity → localhost:3000/amity/login
 */
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantIndexPage({ params }: PageProps) {
  const { tenant } = await params;
  redirect(`/${tenant}/login`);
}
