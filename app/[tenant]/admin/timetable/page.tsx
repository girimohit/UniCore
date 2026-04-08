import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import TimetableManager from './TimetableManager';
import { isModuleEnabled } from '@/lib/modules/loader';
import { ShieldAlert } from 'lucide-react';

export default async function AdminTimetablePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true },
  });

  if (!institution) return notFound();

  const active = await isModuleEnabled(institution.id, 'timetable');
  if (!active) {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <ShieldAlert className="w-16 h-16 text-amber-500 opacity-50" />
            <h2 className="text-2xl font-bold">Timetable Module Disabled</h2>
            <p className="text-muted-foreground">The timetable module is currently disabled by the institution administrator.</p>
        </div>
    );
  }

  // Fetch courses with their subjects for the dropdowns
  const courses = await prisma.course.findMany({
    where: { institutionId: institution.id },
    include: {
        subjects: true
    },
    orderBy: { name: 'asc' }
  });

  // Fetch faculties for assignment
  const faculties = await prisma.faculty.findMany({
    where: { 
      user: {
        institutionId: institution.id,
        accountStatus: "ACTIVE"
      }
    },
    include: {
      user: {
        select: { name: true, username: true }
      },
      facultyAssignments: true
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards relative">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          Timetable Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Create and manage weekly schedules for courses at <span className="text-primary">{institution.name}</span>
        </p>
      </div>

      <TimetableManager 
        courses={courses} 
        faculties={faculties}
        institutionId={institution.id} 
      />
    </div>
  );
}
