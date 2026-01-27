"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User, GraduationCap, ChevronRight } from "lucide-react"

const subjects = [
    { code: "CS201", name: "Data Structures", credits: 4, faculty: "Dr. Alan Turing", color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    { code: "CS202", name: "Algorithms", credits: 4, faculty: "Dr. Grace Hopper", color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    { code: "EC204", name: "Digital Electronics", credits: 3, faculty: "Dr. Claude Shannon", color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    { code: "MA201", name: "Discrete Math", credits: 2, faculty: "Dr. John Nash", color: "bg-purple-500", light: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
]

export default function StudentSubjects() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Subjects</h1>
        <p className="text-slate-500">Enrolled courses for current semester.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((sub, i) => (
             <Card key={i} className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
                <div className={`h-1.5 w-full ${sub.color}`}></div>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${sub.light} ${sub.text} ${sub.border}`}>
                            {sub.code}
                        </span>
                        <div className={`p-2 rounded-full ${sub.light} ${sub.text}`}>
                            <BookOpen className="h-4 w-4" />
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {sub.name}
                    </h3>
                    
                    <div className="space-y-4 mt-6">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <User className="h-4 w-4" />
                             </div>
                             <div className="flex-1">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Faculty</p>
                                <p className="text-sm font-bold text-slate-700">{sub.faculty}</p>
                             </div>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                           <div className="flex items-center gap-1.5">
                                <GraduationCap className="h-4 w-4 text-slate-400" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {sub.credits} Credits
                                </span>
                           </div>
                           <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </div>
                    </div>
                </CardContent>
             </Card>
        ))}
      </div>
    </div>
  )
}
