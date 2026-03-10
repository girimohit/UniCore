import { resolveTenant } from '@/lib/tenant/resolver';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function DepartmentsPage({ params }: { params: { tenant: string } }) {
  const institution = await resolveTenant(params.tenant);

  if (!institution) {
    notFound();
  }

  // Render directly server-side for speed
  const departments = await prisma.department.findMany({
    where: { tenant_id: institution.tenant_id },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Departments
          </h1>
          <p className="text-muted-foreground mt-2">Manage academic groupings across {institution.name}.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add Department
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {departments.length === 0 ? (
           <div className="p-8 text-center text-muted-foreground">
             No departments found. Create one to get started.
           </div>
        ) : (
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted text-foreground text-xs uppercase bg-accent/50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Code</th>
                <th scope="col" className="px-6 py-4 font-medium">Name</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                    {dept.code}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-foreground">
                    {dept.name}
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
        )}
      </div>
    </div>
  );
}
