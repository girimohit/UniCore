import { redirect } from 'next/navigation';

export default async function StudentRootPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  
  // Student module is now multi-page. Redirecting to the dashboard as entry point.
  redirect(`/student/dashboard`);
}
