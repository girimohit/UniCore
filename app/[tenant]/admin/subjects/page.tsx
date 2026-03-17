import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import SubjectManager from './SubjectManager';

export default async function SubjectsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  // Resolve institution
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true, academic_system: true, academicStructure: true },
  });

  if (!institution) return notFound();

  // Fetch courses for the dropdown
  const courses = await prisma.course.findMany({
    where: { tenant_id: institution.id },
    select: { id: true, name: true, code: true },
    orderBy: { name: 'asc' }
  });

  // Fetch subjects for the list
  const subjects = await prisma.subject.findMany({
    where: { tenant_id: institution.id },
    include: { course: true },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          Subjects
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Manage curriculum subjects for <span className="text-primary">{institution.name}</span>
        </p>
      </div>

      <SubjectManager 
        initialSubjects={subjects} 
        courses={courses} 
        tenantId={institution.id} 
        academicSystem={institution.academicStructure as any || institution.academic_system}
      />
    </div>
  );
}
