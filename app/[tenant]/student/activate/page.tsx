import { redirect } from 'next/navigation';

export default async function StudentActivateRedirect({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ tenant: string }>; 
  searchParams: Promise<{ token?: string }>; 
}) {
  const { tenant } = await params;
  const { token } = await searchParams;
  
  // Forward to the central acceptance page
  if (token) {
    redirect(`/accept-invite?token=${token}`);
  }
  
  redirect(`/login`);
}
