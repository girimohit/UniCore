"use client"

import { Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function StudentHeader({ setIsSidebarOpen }: { setIsSidebarOpen: (open: boolean) => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between bg-white/80 px-6 backdrop-blur-md transition-all">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden text-slate-500 hover:text-slate-900"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden md:block">
            Welcome back, John! 👋
            </h1>
            <p className="text-sm text-slate-500 hidden md:block">Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full border border-violet-100 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
            Spring Semester 2024
        </div>

        <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
        >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-500 border-2 border-white"></span>
        </Button>
      </div>
    </header>
  )
}
