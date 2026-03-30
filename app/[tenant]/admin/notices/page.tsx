import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import NoticesClient from './NoticesClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function AdminNoticesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true },
  });

  if (!institution) return notFound();

  const notices = await prisma.notice.findMany({
    where: { institutionId: institution.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Notice Board
          </h1>
          <p className="text-lg text-muted-foreground mt-2 font-medium">
            Broadcast announcements to students and faculty at <span className="text-primary">{institution.name}</span>
          </p>
        </div>
        <Link href={`/${tenant}/admin/notices/create`}>
          <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all font-bold gap-2">
            <Plus className="w-5 h-5" />
            Create Notice
          </Button>
        </Link>
      </div>

      <NoticesClient initialNotices={notices} tenant={tenant} />
    </div>
  );
}
