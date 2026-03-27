import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import CourseManager from './CourseManager';

export default async function CoursesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  // Resolve institution
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true },
  });

  if (!institution) return notFound();

  // Fetch departments for the dropdown
  const departments = await prisma.department.findMany({
    where: { institutionId: institution.id },
    select: { id: true, name: true, code: true },
    orderBy: { name: 'asc' }
  });

  // Fetch courses for the list
  const courses = await prisma.course.findMany({
    where: { institutionId: institution.id },
    include: { department: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          Courses
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Manage academic programs for <span className="text-primary">{institution.name}</span>
        </p>
      </div>

      <CourseManager initialCourses={courses} departments={departments} institutionId={institution.id} />
    </div>
  );
}
