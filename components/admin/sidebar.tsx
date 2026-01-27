"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Bell,
  Wallet,
  BarChart3,
  Building,
  Settings,
  X,
} from "lucide-react"

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Departments", href: "/admin/departments", icon: Building2 },
  { name: "Programs", href: "/admin/programs", icon: GraduationCap },
  { name: "Subjects", href: "/admin/subjects", icon: BookOpen },
  { name: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { name: "Timetable", href: "/admin/timetable", icon: CalendarDays },
  { name: "Notices", href: "/admin/notices", icon: Bell },
  { name: "Fees", href: "/admin/fees", icon: Wallet },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Tenant Profile", href: "/admin/tenant", icon: Building },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-white dark:bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r bg-card shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 dark:bg-slate-900",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <span className="text-2xl">⚡</span> Unicore
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {sidebarLinks.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    AD
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">Admin User</span>
                    <span className="text-xs text-muted-foreground">admin@unicore.com</span>
                </div>
            </div>
        </div>
      </aside>
    </>
  )
}
