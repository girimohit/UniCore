"use client"

import { useState } from "react"
import { FacultySidebar } from "@/components/faculty/sidebar"
import { FacultyHeader } from "@/components/faculty/header"

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50/50">
      <FacultySidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <FacultyHeader setIsSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto px-6 py-8 bg-white text-slate-900">
             <div className="mx-auto max-w-7xl animate-in fade-in duration-500 slide-in-from-bottom-2">
                {children}
             </div>
        </main>
      </div>
    </div>
  )
}
