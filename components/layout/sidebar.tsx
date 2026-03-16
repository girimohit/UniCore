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
} from "lucide-react";
import * as Icons from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ModuleMetadata } from "@/lib/modules/registry";

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
];

interface SidebarProps {
  tenantId: string;
  urlSlug: string;
  role: string;
  initialModules?: ModuleMetadata[];
}

export default function Sidebar({ tenantId, urlSlug, role, initialModules = [] }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-100 bg-white transition-transform duration-300 lg:static lg:translate-x-0 pt-4 pb-4 flex flex-col"
      >
        <div className="flex h-12 items-center justify-between px-6 mb-8">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-violet-200">
              <span className="text-lg">S</span>
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Unicore
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
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
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200/50">
                {role === "admin" ? "A" : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{role === "admin" ? "Admin User" : "Student User"}</p>
                <p className="text-xs text-slate-500 truncate uppercase tracking-widest font-bold font-sans">{role}</p>
              </div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
