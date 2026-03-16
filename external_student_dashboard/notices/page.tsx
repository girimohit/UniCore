"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, Info, StickyNote } from "lucide-react"

const notices = [
    { title: "End Semester Exams Postponed", date: "Today, 10:30 AM", priority: "high", category: "Exam", desc: "Due to heavy rains, the exams scheduled for tomorrow are postponed. New dates will be announced soon. Please keep checking the portal for further updates regarding the revised schedule.", color: "bg-rose-500", light: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
    { title: "Library Due Date Extended", date: "Yesterday, 04:00 PM", priority: "medium", category: "Library", desc: "You can return the borrowed books by next Monday without any late fine. This applies to all books issued before the 20th.", color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
    { title: "Campus Recruitment Drive", date: "2 days ago", priority: "high", category: "Placement", desc: "TCS and Infosys are visiting campus on 25th. Register on the portal immediately. Preliminary rounds will be held in the main auditorium.", color: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" },
    { title: "Holiday on Friday", date: "3 days ago", priority: "low", category: "General", desc: "The college remains closed on Friday on account of Good Friday.", color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
]

export default function StudentNotices() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notices Board</h1>
        <p className="text-slate-500">Stay updated with the latest announcements and circulars.</p>
      </div>

      <div className="grid gap-6">
        {notices.map((notice, i) => (
             <Card key={i} className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className={`h-1.5 w-full ${notice.color}`}></div>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {notice.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs">
                                <span className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${notice.light} ${notice.text} ${notice.border}`}>
                                    {notice.category}
                                </span>
                                <span className="text-slate-400 font-medium flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {notice.date}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                             {notice.priority === 'high' && (
                                <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 font-bold">
                                    High Priority
                                </Badge>
                             )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="hidden md:block p-3 bg-slate-50 rounded-lg h-fit text-slate-400">
                             <StickyNote className="h-5 w-5" />
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {notice.desc}
                        </p>
                    </div>
                </CardContent>
             </Card>
        ))}
      </div>
    </div>
  )
}
