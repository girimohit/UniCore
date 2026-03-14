import Link from 'next/link';
import { getActiveInstitutionModules } from '@/lib/modules/loader';
import * as Icons from 'lucide-react';
import { LogoutButton } from '@/components/auth/LogoutButton';

interface SidebarProps {
  tenantId: string;
  role: string;
}

export default async function Sidebar({ tenantId, role }: SidebarProps) {
  const modules = await getActiveInstitutionModules(tenantId);

  const staticLinks = [
    { name: 'Dashboard', path: `/${role}/dashboard`, icon: 'LayoutDashboard' },
  ];

  return (
    <aside className="w-72 glass border-r border-border/50 hidden md:flex flex-col h-full shadow-2xl transition-all duration-300 relative z-10">
      <div className="p-8 border-b border-border/50 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
        <h2 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary to-accent uppercase drop-shadow-sm">
          {role} PANEL
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1.5 px-4 z-10 relative">
          {staticLinks.map((link) => {
            const Icon = (Icons as any)[link.icon] || Icons.Circle;
            return (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent group transition-all duration-300"
                >
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={2.5} />
                  {link.name}
                </Link>
              </li>
            );
          })}

          <li className="pt-6 pb-3">
            <h3 className="px-4 text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">
              Modules
            </h3>
          </li> 

          {modules.map((moduleItem) => {
            const Icon = moduleItem.icon ? (Icons as any)[moduleItem.icon] : Icons.Box;
            return (
              <li key={moduleItem.id}>
                <Link
                  href={`/${role}${moduleItem.routePath}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent group transition-all duration-300"
                >
                  {Icon && <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={2.5} />}
                  {moduleItem.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-border/50 bg-background/30 mt-auto">
         <LogoutButton />

      </div>
    </aside>
  );
}
