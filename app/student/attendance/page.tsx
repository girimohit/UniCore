"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { BookOpen, AlertCircle, CheckCircle2 } from "lucide-react"

const subjects = [
  { name: "Data Structures", attended: 28, total: 32, color: "#10b981", bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
  { name: "Algorithms", attended: 24, total: 32, color: "#3b82f6", bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
  { name: "Digital Electronics", attended: 20, total: 30, color: "#f59e0b", bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" }, // Warning
  { name: "Mathematics", attended: 26, total: 28, color: "#8b5cf6", bg: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-100" },
  { name: "Physics", attended: 15, total: 25, color: "#ef4444", bg: "bg-red-500", light: "bg-red-50", text: "text-red-700", border: "border-red-100" }, // Low
]

export default function StudentAttendance() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Attendance</h1>
            <p className="text-slate-500">Track your class attendance for this semester.</p>
        </div>
        <div className="w-48">
             <Select defaultValue="sem4">
                <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sem4">Semester 4</SelectItem>
                    <SelectItem value="sem3">Semester 3</SelectItem>
                </SelectContent>
             </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((sub, idx) => {
            const percentage = Math.round((sub.attended / sub.total) * 100)
            const data = [
                { name: "Attended", value: sub.attended },
                { name: "Missed", value: sub.total - sub.attended }
            ]
            const isLow = percentage < 75
            
            return (
                <Card key={idx} className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <div className={`h-1.5 w-full ${sub.bg}`}></div>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{sub.name}</h3>
                                <div className="flex items-center gap-2">
                                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${sub.light} ${sub.text} ${sub.border}`}>
                                        Theory
                                    </span>
                                </div>
                            </div>
                            {isLow ? (
                                <div className="p-2 bg-red-50 rounded-full text-red-500" title="Low Attendance">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                            ) : (
                                <div className="p-2 bg-emerald-50 rounded-full text-emerald-500" title="Good Standing">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                            )}
                        </div>

                         <div className="flex items-center gap-6">
                            <div className="h-24 w-24 relative flex-shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={40}
                                            paddingAngle={5}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                            cornerRadius={4}
                                            stroke="none"
                                        >
                                            <Cell fill={sub.color} />
                                            <Cell fill="#f1f5f9" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-bold text-slate-900">{percentage}%</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Attended</span>
                                    <span className="font-bold text-slate-900">{sub.attended}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Total Classes</span>
                                    <span className="font-bold text-slate-900">{sub.total}</span>
                                </div>
                                <div className={`text-xs font-bold ${isLow ? 'text-red-600' : 'text-emerald-600'} flex items-center gap-1`}>
                                    {isLow ? '⚠️ Short attendance' : '✅ On track'}
                                </div>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            )
        })}
      </div>
    </div>
  )
}
