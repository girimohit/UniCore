"use client"

import { Menu, Bell, Search, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FacultyHeader({ setIsSidebarOpen }: { setIsSidebarOpen: (open: boolean) => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between bg-white border-b border-slate-200 px-6 transition-all">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden text-slate-500 hover:text-slate-900"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Breadcrumb-ish title or simple search */}
        <div className="hidden md:flex items-center gap-2 text-slate-400">
             <Search className="h-4 w-4" />
             <Input 
                placeholder="Search students, classes..." 
                className="h-9 w-64 border-0 bg-slate-50 focus-visible:ring-0 focus-visible:bg-slate-100 placeholder:text-slate-400 text-sm" 
             />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-slate-500 gap-2 hidden sm:flex">
            <HelpCircle className="h-4 w-4" />
            Help
        </Button>
        <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-amber-500 border border-white"></span>
        </Button>
      </div>
    </header>
  )
}
