"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  Settings,
  BookMarked,
} from "lucide-react";
import * as Icons from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ModuleMetadata } from "@/lib/modules/registry";
import { useSidebar } from "./sidebar-context";

const SIDEBAR_COLORS = [
  {
    active: "bg-violet-500/[0.18] text-violet-600 dark:text-violet-300 dark:border dark:border-violet-400/30",
    hover:  "hover:bg-violet-500/[0.08] hover:text-violet-600 dark:hover:text-violet-300",
  },
  {
    active: "bg-emerald-500/[0.16] text-emerald-600 dark:text-emerald-300 dark:border dark:border-emerald-400/30",
    hover:  "hover:bg-emerald-500/[0.08] hover:text-emerald-600 dark:hover:text-emerald-300",
  },
  {
    active: "bg-blue-500/[0.16] text-blue-600 dark:text-blue-300 dark:border dark:border-blue-400/30",
    hover:  "hover:bg-blue-500/[0.08] hover:text-blue-600 dark:hover:text-blue-300",
  },
  {
    active: "bg-purple-500/[0.18] text-purple-600 dark:text-purple-300 dark:border dark:border-purple-400/30",
    hover:  "hover:bg-purple-500/[0.08] hover:text-purple-600 dark:hover:text-purple-300",
  },
  {
    active: "bg-amber-500/[0.15] text-amber-600 dark:text-amber-300 dark:border dark:border-amber-400/30",
    hover:  "hover:bg-amber-500/[0.08] hover:text-amber-600 dark:hover:text-amber-300",
  },
  {
    active: "bg-rose-500/[0.16] text-rose-600 dark:text-rose-300 dark:border dark:border-rose-400/30",
    hover:  "hover:bg-rose-500/[0.08] hover:text-rose-600 dark:hover:text-rose-300",
  },
  {
    active: "bg-indigo-500/[0.18] text-indigo-600 dark:text-indigo-300 dark:border dark:border-indigo-400/30",
    hover:  "hover:bg-indigo-500/[0.08] hover:text-indigo-600 dark:hover:text-indigo-300",
  },
];

const studentLinks = [
  {
    name: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Attendance",
    href: "/student/attendance",
    icon: CalendarCheck,
    moduleId: "attendance",
  },
  {
    name: "Timetable",
    href: "/student/timetable",
    icon: CalendarDays,
    moduleId: "timetable",
  },
  {
    name: "Subjects",
    href: "/student/subjects",
    icon: BookOpen,
    moduleId: "subjects",
  },
  {
    name: "Notices",
    href: "/student/notices",
    icon: Bell,
    moduleId: "notices",
  },
  {
    name: "Exams",
    href: "/student/exams",
    icon: Icons.ClipboardCheck,
    moduleId: "exams",
  },
  {
    name: "Results",
    href: "/student/results",
    icon: Wallet,
    moduleId: "results",
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User,
  },
];

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Students",
    href: "/admin/students",
    icon: Users,
    moduleId: "students",
  },
  {
    name: "Academic Terms",
    href: "/admin/academic-periods",
    icon: CalendarDays,
  },
  {
    name: "Faculty",
    href: "/admin/faculty",
    icon: GraduationCap,
    moduleId: "faculty",
  },
  {
    name: "Departments",
    href: "/admin/departments",
    icon: Building2,
    moduleId: "departments",
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
    moduleId: "courses",
  },
  {
    name: "Subjects",
    href: "/admin/subjects",
    icon: Box,
    moduleId: "subjects",
  },
  {
    name: "Notices",
    href: "/admin/notices",
    icon: Bell,
    moduleId: "notices",
  },
  {
    name: "Exams",
    href: "/admin/exams",
    icon: Icons.ClipboardCheck,
    moduleId: "exams",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const facultyLinks = [
  {
    name: "Dashboard",
    href: "/faculty/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Assigned Subjects",
    href: "/faculty/subjects",
    icon: BookMarked,
    moduleId: "attendance", // Link it to attendance module for now
  },
  {
    name: "Mark Attendance",
    href: "/faculty/attendance",
    icon: CalendarCheck,
    moduleId: "attendance",
  },
  {
    name: "Exams",
    href: "/faculty/exams",
    icon: Icons.ClipboardCheck,
    moduleId: "exams",
  },
  {
    name: "My Profile",
    href: "/faculty/profile",
    icon: User,
  },
];

interface SidebarProps {
  institutionId: string;
  urlSlug: string;
  role: string;
  username: string;
  initialModules?: ModuleMetadata[];
}

export default function Sidebar({
  institutionId,
  urlSlug,
  role,
  username,
  initialModules = [],
}: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isOpen, setIsOpen } = useSidebar();
  const currentSubjectId = searchParams.get("subjectId");

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border/40 bg-bg-base backdrop-blur-2xl transition-all duration-300 lg:static lg:translate-x-0 pt-4 pb-4 flex flex-col shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
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
            <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 opacity-70">
              Main Menu
            </p>
            {(role === "admin"
              ? adminLinks
              : role === "faculty"
                ? facultyLinks
                : studentLinks
            )
              .filter(
                (item) =>
                  !item.moduleId ||
                  initialModules.some((m) => m.id === item.moduleId),
              )
              .map((item, i) => {
                const fullPathLabels = `/${urlSlug}${item.href}`;
                const isActive = pathname.startsWith(fullPathLabels);
                const colors = SIDEBAR_COLORS[i % SIDEBAR_COLORS.length];

                return (
                  <Link
                    key={item.name}
                    href={`/${urlSlug}${item.href}`}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                      isActive
                        ? colors.active
                        : `text-slate-500 ${colors.hover}`,
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        isActive
                          ? "text-current"
                          : "text-slate-400 group-hover:text-current",
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}

            {initialModules.filter(
              (m) =>
                !adminLinks.some((al) => al.moduleId === m.id) &&
                !studentLinks.some((sl) => sl.moduleId === m.id),
            ).length > 0 && (
              <>
                <div className="pt-6 pb-2">
                  <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">
                    Additional Modules
                  </p>
                </div>
                {initialModules
                  .filter(
                    (m) =>
                      !adminLinks.some((al) => al.moduleId === m.id) &&
                      !studentLinks.some((sl) => sl.moduleId === m.id),
                  )
                  .map((moduleItem, i) => {
                    const Icon = moduleItem.icon
                      ? (Icons as any)[moduleItem.icon]
                      : Box;
                    const linkPath = `/${urlSlug}/${role}/${moduleItem.routePath}`;
                    const isActive = pathname.startsWith(linkPath);
                    const colors =
                      SIDEBAR_COLORS[
                        (i + adminLinks.length) % SIDEBAR_COLORS.length
                      ];

                    return (
                      <Link
                        key={moduleItem.id}
                        href={`/${urlSlug}${linkPath}`}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                          isActive
                            ? colors.active
                            : `text-slate-500 ${colors.hover}`,
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-transform group-hover:scale-110",
                            isActive
                              ? "text-current"
                              : "text-slate-400 group-hover:text-current",
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
                {/* <p className="text-sm font-bold text-foreground truncate">{role === "admin" ? "Admin User" : "Student User"}</p> */}
                <p className="text-sm font-bold text-foreground truncate">
                  {role === "admin" ? `${username}` : `${username}`}
                </p>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-black">
                  {role}
                </p>
              </div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
