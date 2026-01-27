"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarCheck, BookOpen, AlertCircle, ArrowRight, Clock, MapPin, TrendingUp, Bell } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, John! 👋</h1>
            <p className="text-slate-500">Here's what's happening in your academic life today.</p>
        </div>
        <div className="flex items-center gap-2">
             <Button variant="outline" className="bg-white">
                View Timetable
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                <Clock className="w-4 h-4 mr-2" /> Class in 45m
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Attendance Card */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
             <div className="h-1.5 w-full bg-emerald-500"></div>
             <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                     <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <CalendarCheck className="h-5 w-5" />
                    </div>
                     <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Good
                     </span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900">87%</h3>
                    <p className="text-sm font-medium text-slate-500">Overall Attendance</p>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
                    <TrendingUp className="h-3 w-3 mr-1" /> +2% from last month
                </div>
             </CardContent>
        </Card>

        {/* Classes Card */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
             <div className="h-1.5 w-full bg-blue-500"></div>
             <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                     <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <BookOpen className="h-5 w-5" />
                    </div>
                     <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        Today
                     </span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900">04</h3>
                    <p className="text-sm font-medium text-slate-500">Classes Scheduled</p>
                </div>
                 <div className="mt-4 flex items-center text-xs font-medium text-blue-600">
                    <Clock className="h-3 w-3 mr-1" /> Next: Algorithms (11:00 AM)
                </div>
             </CardContent>
        </Card>

        {/* Fees Card */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
             <div className="h-1.5 w-full bg-rose-500"></div>
             <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                     <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                     <span className="text-xs font-bold px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 animate-pulse">
                        Due
                     </span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900">$450</h3>
                    <p className="text-sm font-medium text-slate-500">Pending Fees</p>
                </div>
                <Button variant="link" className="px-0 h-auto mt-4 text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center">
                    Pay Now <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
             </CardContent>
        </Card>

        {/* Notices Card */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
             <div className="h-1.5 w-full bg-amber-500"></div>
             <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                     <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                        <Bell className="h-5 w-5" />
                    </div>
                     <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        New
                     </span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900">03</h3>
                    <p className="text-sm font-medium text-slate-500">Unread Notices</p>
                </div>
                 <div className="mt-4 flex items-center text-xs font-medium text-amber-600 truncate">
                    Exams postponed due to rain...
                </div>
             </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Today's Schedule List */}
        <div className="md:col-span-2 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Today's Schedule</h3>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">View Full Timetable</Button>
             </div>
             
            <div className="space-y-3">
                 {[
                    { time: "09:00 AM", subject: "Data Structures", room: "LH-101", status: "Completed", color: "text-slate-400 bg-slate-50 border-slate-200" },
                    { time: "10:00 AM", subject: "Digital Electronics", room: "LH-203", status: "Ongoing", color: "text-blue-700 bg-blue-50 border-blue-200" },
                    { time: "11:00 AM", subject: "Algorithms", room: "LH-105", status: "Upcoming", color: "text-slate-600 bg-white border-slate-200" },
                    { time: "02:00 PM", subject: "Physics Lab", room: "Lab-3", status: "Upcoming", color: "text-slate-600 bg-white border-slate-200" },
                 ].map((cls, i) => (
                    <div key={i} className={`group flex items-center p-4 rounded-xl border transition-all hover:bg-slate-50 ${cls.color} ${cls.status === 'Ongoing' ? 'ring-2 ring-blue-100' : ''}`}>
                        <div className="w-24 text-sm font-bold text-slate-500">{cls.time}</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{cls.subject}</h4>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                <MapPin className="h-3 w-3" /> {cls.room}
                            </div>
                        </div>
                        <div>
                             <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                                 cls.status === 'Ongoing' ? 'bg-blue-600 text-white' : 
                                 cls.status === 'Completed' ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 text-slate-600'
                             }`}>
                                {cls.status}
                             </span>
                        </div>
                    </div>
                 ))}
            </div>
        </div>

        {/* Recent Notices List */}
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Recent Notices</h3>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">View All</Button>
             </div>

             <div className="space-y-3">
                {[
                    { title: "End semester examination schedule released", date: "2 days ago", tag: "Exam", important: true },
                    { title: "Holiday declared for tomorrow due to rain", date: "1 day ago", tag: "General", important: true },
                    { title: "Library books due date extended", date: "3 days ago", tag: "Library", important: false },
                ].map((notice, i) => (
                    <Card key={i} className="group border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                    notice.important ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                                }`}>
                                    {notice.tag}
                                </span>
                                <span className="text-xs text-slate-400">{notice.date}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                {notice.title}
                            </p>
                        </CardContent>
                    </Card>
                ))}
             </div>
        </div>
      </div>
    </div>
  )
}
