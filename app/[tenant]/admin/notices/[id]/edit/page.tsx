import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import NoticeForm from '../../NoticeForm';

export default async function EditNoticePage({ params }: { params: Promise<{ tenant: string, id: string }> }) {
  const { tenant, id } = await params;

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true }
  });

  if (!institution) return notFound();

  const notice = await prisma.notice.findUnique({
    where: { id, institutionId: institution.id }
  });

  if (!notice) return notFound();

  return (
    <div className="pb-10">
      <NoticeForm tenant={tenant} initialData={notice} />
    </div>
  );
}
