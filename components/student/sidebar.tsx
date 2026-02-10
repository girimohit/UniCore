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
} from "lucide-react";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

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

interface StudentSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function StudentSidebar({ isOpen, setIsOpen }: StudentSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-100 bg-white shadow-xl lg:shadow-none transition-transform duration-300 lg:static lg:translate-x-0 pt-4 pb-4 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
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
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
            {studentLinks.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
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
          </div>
        </div>

        <div className="px-4 mt-auto">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              {/* <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200/50">
                JS
              </div> */}
              <SignedIn>
                <UserButton />
              </SignedIn>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate"> {user?.firstName}</p>
                <p className="text-xs text-slate-500 truncate">Computer Science</p>
              </div>
            </div>
          </div>
          {/* <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button> */}
        </div>
      </aside>
    </>
  );
}
