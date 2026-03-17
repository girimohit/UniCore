"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  BookOpen,
  Bell,
  Wallet,
  User,
  X,
  LogOut,
  Box,
  GraduationCap,
  Users,
  Building2,
  Settings
} from "lucide-react";
import * as Icons from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ModuleMetadata } from "@/lib/modules/registry";
import { useSidebar } from "./sidebar-context";

const studentLinks = [
  {
    name: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
    activeColor: "bg-violet-100 text-violet-700",
    hoverColor: "hover:bg-violet-50 hover:text-violet-700",
  },
  {
    name: "My Attendance",
    href: "/student/attendance",
    icon: CalendarCheck,
    activeColor: "bg-emerald-100 text-emerald-700",
    hoverColor: "hover:bg-emerald-50 hover:text-emerald-700",
  },
  {
    name: "Timetable",
    href: "/student/timetable",
    icon: CalendarDays,
    activeColor: "bg-blue-100 text-blue-700",
    hoverColor: "hover:bg-blue-50 hover:text-blue-700",
  },
  {
    name: "My Subjects",
    href: "/student/subjects",
    icon: BookOpen,
    activeColor: "bg-purple-100 text-purple-700",
    hoverColor: "hover:bg-purple-50 hover:text-purple-700",
  },
  {
    name: "Notices",
    href: "/student/notices",
    icon: Bell,
    activeColor: "bg-amber-100 text-amber-700",
    hoverColor: "hover:bg-amber-50 hover:text-amber-700",
  },
  {
    name: "Fees",
    href: "/student/fees",
    icon: Wallet,
    activeColor: "bg-rose-100 text-rose-700",
    hoverColor: "hover:bg-rose-50 hover:text-rose-700",
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User,
    activeColor: "bg-slate-200 text-slate-900",
    hoverColor: "hover:bg-slate-100 hover:text-slate-900",
  },
];

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    activeColor: "bg-violet-100 text-violet-700",
    hoverColor: "hover:bg-violet-50 hover:text-violet-700",
  },
  {
    name: "Students",
    href: "/admin/students",
    icon: Users,
    activeColor: "bg-emerald-100 text-emerald-700",
    hoverColor: "hover:bg-emerald-50 hover:text-emerald-700",
  },
  {
    name: "Faculty",
    href: "/admin/faculty",
    icon: GraduationCap,
    activeColor: "bg-blue-100 text-blue-700",
    hoverColor: "hover:bg-blue-50 hover:text-blue-700",
  },
  {
    name: "Departments",
    href: "/admin/departments",
    icon: Building2,
    activeColor: "bg-purple-100 text-purple-700",
    hoverColor: "hover:bg-purple-50 hover:text-purple-700",
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
    activeColor: "bg-amber-100 text-amber-700",
    hoverColor: "hover:bg-amber-50 hover:text-amber-700",
  },
  {
    name: "Subjects",
    href: "/admin/subjects",
    icon: Box,
    activeColor: "bg-rose-100 text-rose-700",
    hoverColor: "hover:bg-rose-50 hover:text-rose-700",
  },
  {
    name: "Exams",
    href: "/admin/exams",
    icon: Icons.ClipboardCheck,
    activeColor: "bg-indigo-100 text-indigo-700",
    hoverColor: "hover:bg-indigo-50 hover:text-indigo-700",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    activeColor: "bg-slate-200 text-slate-900",
    hoverColor: "hover:bg-slate-100 hover:text-slate-900",
  },
];

interface SidebarProps {
  tenantId: string;
  urlSlug: string;
  role: string;
  initialModules?: ModuleMetadata[];
}

export default function Sidebar({ tenantId, urlSlug, role, initialModules = [] }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border/40 bg-card/80 backdrop-blur-xl transition-all duration-300 lg:static lg:translate-x-0 pt-4 pb-4 flex flex-col shadow-xl dark:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-12 items-center justify-between px-6 mb-8">
          <Link 
            href={`/${urlSlug}/${role}/dashboard`} 
            className="flex items-center gap-2 font-bold text-xl tracking-tight hover:scale-[1.02] transition-transform"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent font-display font-black tracking-tight">
              Unicore
            </span>
          </Link>

          <button 
            className="lg:hidden p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-border">
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 opacity-70">Main Menu</p>
            {(role === "admin" ? adminLinks : studentLinks).map((item) => {
              const fullPathLabels = `/${urlSlug}${item.href}`;
              const isActive = pathname.startsWith(fullPathLabels);
              return (
                <Link
                  key={item.name}
                  href={fullPathLabels}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive ? item.activeColor : `text-slate-500 ${item.hoverColor}`,
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-transform group-hover:scale-110",
                      isActive ? "text-current" : "text-slate-400 group-hover:text-current",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}

            {initialModules.length > 0 && (
              <>
                <div className="pt-6 pb-2">
                  <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Additional Modules</p>
                </div>
                {initialModules.map((moduleItem) => {
                  const Icon = moduleItem.icon ? (Icons as any)[moduleItem.icon] : Box;
                  const linkPath = `/${urlSlug}/${role}${moduleItem.routePath}`;
                  const isActive = pathname.startsWith(linkPath);

                  return (
                    <Link
                      key={moduleItem.id}
                      href={linkPath}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                        isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-700",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-transform group-hover:scale-110",
                          isActive ? "text-current" : "text-slate-400 group-hover:text-current",
                        )}
                      />
                      {moduleItem.name}
                    </Link>
                  );
                })}
              </>
            )}
          </div>
        </div>

        <div className="px-4 mt-auto">
          <div className="bg-muted/50 backdrop-blur-md rounded-2xl p-4 border border-border/40 mb-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
                {role === "admin" ? "A" : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-foreground truncate">{role === "admin" ? "Admin User" : "Student User"}</p>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-black">{role}</p>
              </div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
