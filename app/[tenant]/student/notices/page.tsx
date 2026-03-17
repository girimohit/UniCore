import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent } from "@/components/ui/card"
import { Bell, StickyNote } from "lucide-react"

export default async function StudentNoticesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'STUDENT') {
    redirect(`/${tenant}/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true }
  });

  if (!institution) notFound();

  // No Notice model exists yet — show an honest empty state
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notices Board 📢</h1>
        <p className="text-slate-500 font-medium">Stay updated with the latest announcements at {institution.name}.</p>
      </div>

      <Card className="border border-slate-200 shadow-sm bg-white text-black">
        <CardContent className="p-16 flex flex-col items-center justify-center text-center gap-4">
          <div className="p-4 rounded-full bg-amber-50 text-amber-500">
            <Bell className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No notices yet</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">
              When your institution posts notices they will appear here. Check back soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
