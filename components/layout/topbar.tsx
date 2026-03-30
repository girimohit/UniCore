"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";

export default function Topbar({ 
  institution, 
  user 
}: { 
  institution: { name: string; [key: string]: any }, 
  user?: { name: string; avatarUrl: string | null } 
}) {
  const { toggle } = useSidebar();

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 border-b border-border/40 bg-bg-base/80 backdrop-blur-md shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="lg:hidden p-2 rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-xl font-display font-black text-foreground md:hidden tracking-tight grad-purple">
          {institution.name}
        </h1>
        <div className="hidden md:block">
          {/* Context breadcrumb or page title could go here if hydrated dynamically */}
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-foreground tracking-tight">
            {institution.name}
          </span>
          {/* <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full mt-0.5">
            Active Workspace
          </span> */}
        </div>

        <div className="h-8 w-px bg-border/60 mx-1 hidden sm:block"></div>

        <ThemeToggle />

        <div className="flex items-center gap-2 md:gap-4 bg-muted/30 dark:bg-white/5 backdrop-blur-md border border-border/40 dark:border-white/10 px-2 py-1.5 md:px-3 rounded-full shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                (user?.name?.[0] || institution.name[0])
              )}
            </div>
            <span className="hidden sm:block text-xs font-bold text-foreground pr-1">
              {user?.name || "User"}
            </span>
          </div>
          <div className="h-4 w-px bg-border/60"></div>
          <LogoutButton variant="icon" />
        </div>
      </div>
    </header>
  );
}
