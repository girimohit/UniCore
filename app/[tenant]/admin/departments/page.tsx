import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import DepartmentManager from './DepartmentManager';

export default async function DepartmentsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  // Resolve institution
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true },
  });

  if (!institution) return notFound();

  // Fetch departments for the list
  const departments = await prisma.department.findMany({
    where: { institutionId: institution.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          Departments
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Manage academic divisions for <span className="text-primary">{institution.name}</span>
        </p>
      </div>

      <DepartmentManager initialDepartments={departments} institutionId={institution.id} />
    </div>
  );
}
