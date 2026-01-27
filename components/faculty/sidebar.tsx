"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  History,
  Calendar,
  FileText,
  Bell,
  User,
  LogOut,
  X,
  BookOpen
} from "lucide-react"

const facultyLinks = [
  { 
    name: "Dashboard", 
    href: "/faculty/dashboard", 
    icon: LayoutDashboard,
    activeColor: "bg-indigo-50 text-indigo-700",
    hoverColor: "hover:bg-indigo-50 hover:text-indigo-700" 
  },
  { 
    name: "My Classes", 
    href: "/faculty/classes", 
    icon: Users,
    activeColor: "bg-blue-50 text-blue-700",
    hoverColor: "hover:bg-blue-50 hover:text-blue-700" 
  },
  { 
    name: "Mark Attendance", 
    href: "/faculty/attendance/mark", 
    icon: CheckSquare,
    activeColor: "bg-emerald-50 text-emerald-700",
    hoverColor: "hover:bg-emerald-50 hover:text-emerald-700" 
  },
  { 
    name: "Attendance History", 
    href: "/faculty/attendance/history", 
    icon: History,
    activeColor: "bg-teal-50 text-teal-700",
    hoverColor: "hover:bg-teal-50 hover:text-teal-700" 
  },
  { 
    name: "Timetable", 
    href: "/faculty/timetable", 
    icon: Calendar,
    activeColor: "bg-cyan-50 text-cyan-700",
    hoverColor: "hover:bg-cyan-50 hover:text-cyan-700" 
  },
  { 
    name: "Resources", 
    href: "/faculty/resources", 
    icon: FileText,
    activeColor: "bg-purple-50 text-purple-700",
    hoverColor: "hover:bg-purple-50 hover:text-purple-700" 
  },
  { 
    name: "Notices", 
    href: "/faculty/notices", 
    icon: Bell,
    activeColor: "bg-amber-50 text-amber-700",
    hoverColor: "hover:bg-amber-50 hover:text-amber-700" 
  },
  { 
    name: "Profile", 
    href: "/faculty/profile", 
    icon: User,
    activeColor: "bg-slate-100 text-slate-800",
    hoverColor: "hover:bg-slate-50 hover:text-slate-800" 
  },
]

interface FacultySidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function FacultySidebar({ isOpen, setIsOpen }: FacultySidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-slate-900/20 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 transform border-r border-slate-200 bg-white shadow-xl lg:shadow-none transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link href="/faculty/dashboard" className="flex items-center gap-2 font-semibold text-slate-900">
             <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <BookOpen className="h-4 w-4" />
             </div>
             <span className="text-lg tracking-tight">Unicore <span className="text-slate-400 font-normal">Faculty</span></span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Main Navigation</p>
            {facultyLinks.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? item.activeColor
                      : `text-slate-600 ${item.hoverColor}`
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-current" : "text-slate-400")} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold shadow-sm">
                    AT
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">Dr. Alan Turing</p>
                    <p className="text-xs text-slate-500 truncate">Comp. Science Dept</p>
                </div>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <LogOut className="h-4 w-4" />
                Sign Out
            </button>
        </div>
      </aside>
    </>
  )
}
