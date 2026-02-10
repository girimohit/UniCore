"use client"

import { useState } from "react"
import { StudentSidebar } from "@/components/student/sidebar"
import { StudentHeader } from "@/components/student/header"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const user = getCurrentUserOrNull(); // ✅ SAFE


  return (
    <div className="flex h-screen bg-white">
      <StudentSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <StudentHeader setIsSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 scroll-smooth">
          <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
