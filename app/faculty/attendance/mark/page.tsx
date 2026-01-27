"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox" // Need to mock or use basic input checkbox if shadcn not fully setup for this. Using input for speed.
import { Calendar as CalendarIcon, Save } from "lucide-react"

export default function MarkAttendance() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mark Attendance</h1>
            <p className="text-slate-500">Select class and date to record student attendance.</p>
        </div>
        <div className="flex gap-3">
             <div className="bg-white border text-slate-900 px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2 shadow-sm">
                <CalendarIcon className="h-4 w-4 text-slate-500" />
                <span>Today, 24 Oct 2024</span>
             </div>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Subject</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option>CS201 - Data Structures</option>
                        <option>CS202 - Algorithms</option>
                    </select>
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Session</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option>09:00 AM - 10:00 AM</option>
                        <option>10:00 AM - 11:00 AM</option>
                    </select>
                </div>
                 <div className="flex items-end">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Load Students</Button>
                 </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white border-b border-slate-100">
                        <tr>
                            <th className="p-4 pl-6 font-bold text-slate-500 w-16">#</th>
                            <th className="p-4 font-bold text-slate-500">Student Name</th>
                            <th className="p-4 font-bold text-slate-500">Roll No</th>
                            <th className="p-4 font-bold text-slate-500 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <tr key={i} className="hover:bg-slate-50 group">
                                <td className="p-4 pl-6 font-medium text-slate-400">{i}</td>
                                <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                        S{i}
                                    </div>
                                    Student Name {i}
                                </td>
                                <td className="p-4 font-medium text-slate-600 font-mono">2024CS{100+i}</td>
                                <td className="p-4 text-center">
                                    <div className="inline-flex rounded-md p-1 bg-slate-100 border border-slate-200">
                                        <button className="px-4 py-1.5 rounded bg-emerald-500 text-white font-bold text-xs shadow-sm">Present</button>
                                        <button className="px-4 py-1.5 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors">Absent</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
             
             <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
                <Button variant="outline" className="bg-white text-slate-600">Cancel</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8">
                    <Save className="h-4 w-4 mr-2" /> Submit Attendance
                </Button>
             </div>
        </CardContent>
      </Card>
    </div>
  )
}
