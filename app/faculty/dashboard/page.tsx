"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Clock, CheckCircle2, AlertCircle, ArrowRight, MoreHorizontal, Calendar } from "lucide-react"

export default function FacultyDashboard() {
  return (
    <div className="space-y-8">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Good Morning, Dr. Turing 👋</h1>
            <p className="text-slate-500">Here's a summary of your schedule and tasks for today.</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" className="text-slate-600 bg-white">View Calendar</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Notice</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Classes Today</p>
                    <h3 className="text-3xl font-bold text-slate-900">03</h3>
                    <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> Next: 10:00 AM
                    </div>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Users className="w-6 h-6" />
                </div>
            </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Pending Attendance</p>
                    <h3 className="text-3xl font-bold text-slate-900">01</h3>
                    <div className="flex items-center gap-1 mt-2 text-xs font-bold text-amber-600 bg-amber-50 w-fit px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" /> Action Required
                    </div>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
            </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Students</p>
                    <h3 className="text-3xl font-bold text-slate-900">142</h3>
                    <p className="text-xs text-slate-400 mt-2">Across 4 subjects</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Users className="w-6 h-6" />
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Today's Schedule */}
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> Today's Schedule
            </h2>
            <div className="space-y-4">
                {[
                    { time: "09:00 AM - 10:00 AM", subject: "Data Structures (CS201)", loc: "Lecture Hall 101", status: "Completed", students: "42/45 Present" },
                    { time: "11:00 AM - 12:00 PM", subject: "Algorithms (CS202)", loc: "Lecture Hall 105", status: "Upcoming", students: "--" },
                    { time: "02:00 PM - 04:00 PM", subject: "Review Meeting", loc: "Conference Room B", status: "Upcoming", students: "Faculty Only" },
                ].map((item, i) => (
                    <div key={i} className="group flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors shadow-sm">
                        <div className="w-32 flex-shrink-0 border-r border-slate-100 pr-4">
                            <p className="text-sm font-bold text-slate-900">{item.time.split(' - ')[0]}</p>
                            <p className="text-xs text-slate-500">{item.time.split(' - ')[1]}</p>
                        </div>
                        <div className="flex-1 px-4">
                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.subject}</h4>
                            <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">{item.loc}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs">{item.students}</span>
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            {item.status === "Completed" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                    Done
                                </span>
                            ) : (
                                <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-100 hover:bg-indigo-50">
                                    View details
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
         </div>

         {/* Pending Actions */}
         <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" /> Pending Tasks
            </h2>
            <Card className="border-0 shadow-md bg-amber-50/50">
                <CardContent className="p-0">
                    <div className="p-4 border-b border-amber-100 last:border-0 hover:bg-white transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-800 text-sm">Mark Attendance</h4>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">High</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-3">Data Structures (Yesterday)</p>
                        <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white h-8 text-xs font-bold">Mark Now</Button>
                    </div>
                     <div className="p-4 border-b border-amber-100 last:border-0 hover:bg-white transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-800 text-sm">Upload Syllabus</h4>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Medium</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-3">CS202 Algorithms</p>
                        <Button size="sm" variant="outline" className="w-full border-slate-300 text-slate-600 h-8 text-xs font-bold hover:bg-slate-50">Upload</Button>
                    </div>
                </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
