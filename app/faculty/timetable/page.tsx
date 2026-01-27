"use client"

import { Card, CardContent } from "@/components/ui/card"

const schedule = [
    { day: "Monday", slots: [
        { time: "09-10", sub: "Data Structures", room: "LH-101", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
        { time: "11-12", sub: "Algorithms", room: "LH-105", color: "bg-blue-50 border-blue-100 text-blue-700" },
    ]},
    { day: "Tuesday", slots: [
        { time: "10-11", sub: "Intro to Prog.", room: "LH-201", color: "bg-cyan-50 border-cyan-100 text-cyan-700" },
    ]},
    { day: "Wednesday", slots: [
        { time: "02-04", sub: "Lab Session", room: "Comp Lab 2", color: "bg-purple-50 border-purple-100 text-purple-700 col-span-2" },
    ]},
    { day: "Thursday", slots: []},
    { day: "Friday", slots: [
         { time: "09-10", sub: "Data Structures", room: "LH-101", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
    ]},
]

export default function FacultyTimetable() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Weekly Timetable</h1>
        <p className="text-slate-500">Your teaching schedule for this semester.</p>
      </div>

       <div className="grid gap-6">
            {schedule.map((day, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 md:items-start p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-32 flex-shrink-0 pt-2">
                        <h3 className="font-bold text-slate-900 text-lg">{day.day}</h3>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {day.slots.length > 0 ? day.slots.map((slot, j) => (
                            <div key={j} className={`p-4 rounded-lg border ${slot.color} ${slot.time === '02-04' ? 'md:col-span-2' : ''}`}>
                                <div className="text-xs font-bold opacity-70 mb-1">{slot.time}</div>
                                <div className="font-bold text-sm mb-0.5">{slot.sub}</div>
                                <div className="text-xs font-medium opacity-80">{slot.room}</div>
                            </div>
                        )) : (
                            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 text-slate-400 text-sm font-medium italic">
                                No classes scheduled
                            </div>
                        )}
                    </div>
                </div>
            ))}
       </div>
    </div>
  )
}
