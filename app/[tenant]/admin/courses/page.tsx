import { resolveTenant } from '@/lib/tenant/resolver';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { BookOpen, Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function CoursesPage({ params }: { params: { tenant: string } }) {
  const institution = await resolveTenant(params.tenant);

  if (!institution) {
    notFound();
  }

  // Render directly server-side including nested department names
  const courses = await prisma.course.findMany({
    where: { tenant_id: institution.tenant_id },
    include: { department: true },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Courses
          </h1>
          <p className="text-muted-foreground mt-2">Manage academic programs acting as the parent for subjects.</p>
        </div>
        <button className="flex justify-center items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add Course
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {courses.length === 0 ? (
           <div className="p-8 text-center text-muted-foreground">
             No courses found. Ensure you have created a Department first.
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted text-foreground text-xs uppercase bg-accent/50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Code</th>
                  <th scope="col" className="px-6 py-4 font-medium">Name</th>
                  <th scope="col" className="px-6 py-4 font-medium">Department</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                      {course.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {course.department.name}
                      <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-semibold bg-secondary text-secondary-foreground rounded-full">
                        {course.department.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                          <button className="text-primary hover:text-primary/80 transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button className="text-destructive hover:text-destructive/80 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
