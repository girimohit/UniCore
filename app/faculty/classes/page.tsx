"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, ChevronRight, BarChart3, Clock } from "lucide-react"

const classes = [
    { code: "CS201", name: "Data Structures", sem: "Semester 4", students: 45, next: "Today, 09:00 AM", color: "bg-indigo-600", light: "bg-indigo-50", text: "text-indigo-600" },
    { code: "CS202", name: "Algorithms", sem: "Semester 4", students: 42, next: "Today, 11:00 AM", color: "bg-blue-600", light: "bg-blue-50", text: "text-blue-600" },
    { code: "CS101", name: "Intro to Programming", sem: "Semester 2", students: 55, next: "Tomorrow, 10:00 AM", color: "bg-cyan-600", light: "bg-cyan-50", text: "text-cyan-600" },
    { code: "CS405", name: "Advanced Database", sem: "Semester 6", students: 30, next: "Wed, 02:00 PM", color: "bg-purple-600", light: "bg-purple-50", text: "text-purple-600" },
]

export default function FacultyClasses() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Classes</h1>
            <p className="text-slate-500">Manage your assigned subjects and students.</p>
        </div>
        <Button variant="outline" className="bg-white">
            View Archive
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, i) => (
             <Card key={i} className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className={`h-1.5 w-full ${cls.color}`}></div>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${cls.light} ${cls.text} border-${cls.text.split('-')[1]}-100`}>
                            {cls.code}
                        </span>
                        <div className="p-2 rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">{cls.name}</h3>
                    <p className="text-sm font-medium text-slate-500 mb-6">{cls.sem}</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                             <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                                <Users className="h-3 w-3" /> Students
                             </div>
                             <p className="text-lg font-bold text-slate-900">{cls.students}</p>
                        </div>
                         <div className="p-3 bg-slate-50 rounded-lg">
                             <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
                                <BarChart3 className="h-3 w-3" /> Avg. Att
                             </div>
                             <p className="text-lg font-bold text-emerald-600">88%</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Clock className="h-3 w-3" /> Next Class: <span className="text-slate-900">{cls.next}</span>
                    </div>
                </CardContent>
                <CardFooter className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                    <Button className="flex-1 bg-white text-slate-700 border hover:bg-slate-50 hover:text-indigo-600 shadow-sm font-semibold">
                        Students
                    </Button>
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                        Dashboard <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </CardFooter>
             </Card>
        ))}
      </div>
    </div>
  )
}

function MoreHorizontal({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
    )
}
