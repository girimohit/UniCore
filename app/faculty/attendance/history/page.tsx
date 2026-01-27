"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const history = [
    { date: "23 Oct 2024", subject: "Data Structures", time: "09:00 AM", present: 40, absent: 5, total: 45, status: "Submitted" },
    { date: "22 Oct 2024", subject: "Algorithms", time: "11:00 AM", present: 38, absent: 4, total: 42, status: "Submitted" },
    { date: "21 Oct 2024", subject: "Intro to Prog.", time: "10:00 AM", present: 50, absent: 5, total: 55, status: "Submitted" },
]

export default function AttendanceHistory() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance History</h1>
        <p className="text-slate-500">View past attendance records submitted by you.</p>
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="p-4 pl-6 font-bold text-slate-500">Date</th>
                        <th className="p-4 font-bold text-slate-500">Subject</th>
                        <th className="p-4 font-bold text-slate-500">Time</th>
                        <th className="p-4 font-bold text-slate-500">Stats</th>
                        <th className="p-4 font-bold text-slate-500">Percentage</th>
                        <th className="p-4 font-bold text-slate-500">Status</th>
                        <th className="p-4 font-bold text-slate-500">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {history.map((record, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                            <td className="p-4 pl-6 font-medium text-slate-900">{record.date}</td>
                            <td className="p-4 font-bold text-slate-800">{record.subject}</td>
                            <td className="p-4 text-slate-500">{record.time}</td>
                            <td className="p-4">
                                <span className="text-emerald-600 font-bold">{record.present} P</span> 
                                <span className="text-slate-300 mx-1">/</span> 
                                <span className="text-rose-600 font-bold">{record.absent} A</span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                     <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(record.present/record.total)*100}%` }}></div>
                                     </div>
                                     <span className="text-xs font-bold text-slate-600">{Math.round((record.present/record.total)*100)}%</span>
                                </div>
                            </td>
                             <td className="p-4">
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Submitted</Badge>
                            </td>
                             <td className="p-4">
                                <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs">View Report</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  )
}
