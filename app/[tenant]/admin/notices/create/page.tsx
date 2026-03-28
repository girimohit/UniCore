import NoticeForm from '../NoticeForm';

export default async function CreateNoticePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  return (
    <div className="pb-10">
      <NoticeForm tenant={tenant} />
    </div>
  );
}
