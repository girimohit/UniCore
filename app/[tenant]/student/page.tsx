import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { DashboardView, AttendanceView, PlaceholderView } from '@/components/student/student-views';

export default async function StudentHubPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ tenant: string }>,
  searchParams: Promise<{ view?: string }>
}) {
  const { tenant } = await params;
  const { view = 'dashboard' } = await searchParams;
  const session = await getCurrentUser();

  // 1. Basic Auth & Tenant Validation
  if (!session || session.role !== 'STUDENT') {
    redirect(`/${tenant}/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true }
  });

  if (!institution) notFound();

  // 2. Fetch Student Profile with aggregated data (needed for multiple views)
  const student = await prisma.studentProfile.findUnique({
    where: { user_id: session.user_id },
    include: {
      user: { select: { identifier: true } },
      _count: {
        select: {
          attendances: true,
          enrolledCourses: true,
          grades: true
        }
      },
      attendances: {
        where: { status: 'PRESENT' },
        select: { id: true }
      },
      grades: {
        select: { score: true }
      }
    }
  });

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">Profile Not Found</h2>
          <p className="text-slate-500">We couldn't find your student profile. Please contact your campus administrator.</p>
        </Card>
      </div>
    );
  }

  // 3. Render View based on selection
  switch (view) {
    case 'dashboard':
      return <DashboardView student={student} institution={institution} />;
    case 'attendance':
      const subjects = await prisma.subject.findMany({
        where: { tenant_id: institution.id },
        orderBy: { name: 'asc' }
      });
      return <AttendanceView subjects={subjects} />;
    case 'timetable':
      return <PlaceholderView title="My Timetable" />;
    case 'subjects':
      return <PlaceholderView title="My Subjects" />;
    case 'notices':
      return <PlaceholderView title="Notices" />;
    case 'fees':
      return <PlaceholderView title="Fees & Payments" />;
    case 'profile':
      return <PlaceholderView title="My Profile" />;
    default:
      return <DashboardView student={student} institution={institution} />;
  }
}
