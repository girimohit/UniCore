import { ThemeToggle } from '@/components/theme-toggle';
import { Institution } from '@prisma/client';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default function Topbar({ institution }: { institution: Institution }) {
  return (
    <header className="glass h-20 px-8 flex items-center justify-between sticky top-0 z-20 border-b border-border/40 shadow-sm transition-colors duration-300">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-foreground md:hidden tracking-tight">
          {institution.name}
        </h1>
        <div className="hidden md:block">
            {/* Context breadcrumb or page title could go here if hydrated dynamically */}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-foreground tracking-tight">
            {institution.name}
          </span>
          <span className="text-[10px] font-semibold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full mt-0.5">
            Active Tenantj
          </span>
        </div>
        
        <div className="h-8 w-px bg-border/60 mx-2 hidden sm:block"></div>

        <ThemeToggle />
        
        <div className="flex items-center gap-4 bg-background/50 backdrop-blur-md border border-border/40 px-3 py-1.5 rounded-full shadow-sm">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform duration-300">
            U
          </div>
          <div className="h-4 w-px bg-border/60"></div>
          <LogoutButton variant="icon" />
        </div>
      </div>
    </header>
  );
}
