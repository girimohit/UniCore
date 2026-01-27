"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin } from "lucide-react"

const schedule = [
    { day: "Mon", slots: [
        { time: "09-10", sub: "Data Structures", hall: "LH-101", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        { time: "10-11", sub: "Digital Elec.", hall: "LH-203", color: "bg-blue-50 text-blue-700 border-blue-200" },
        { time: "11-12", sub: "Algorithms", hall: "LH-105", color: "bg-purple-50 text-purple-700 border-purple-200" },
        null, // Lunch
        { time: "02-04", sub: "Physics Lab", hall: "Lab-3", color: "bg-rose-50 text-rose-700 border-rose-200 col-span-2" },
    ]},
    { day: "Tue", slots: [
        { time: "09-10", sub: "Maths", hall: "LH-101", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
        null,
        { time: "11-12", sub: "Data Structures", hall: "LH-101", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        null,
        { time: "02-03", sub: "Algorithms", hall: "LH-105", color: "bg-purple-50 text-purple-700 border-purple-200" },
    ]},
     { day: "Wed", slots: [
        { time: "09-10", sub: "Digital Elec.", hall: "LH-203", color: "bg-blue-50 text-blue-700 border-blue-200" },
        { time: "10-11", sub: "Algorithms", hall: "LH-105", color: "bg-purple-50 text-purple-700 border-purple-200" },
        null,
        { time: "01-02", sub: "Library", hall: "", color: "bg-slate-50 text-slate-600 border-slate-200" },
        { time: "02-03", sub: "Maths", hall: "LH-101", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    ]},
     { day: "Thu", slots: [
        { time: "09-11", sub: "Computer Lab", hall: "Lab-1", color: "bg-amber-50 text-amber-700 border-amber-200 col-span-2" },
        { time: "11-12", sub: "Maths", hall: "LH-101", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
        null,
        { time: "02-03", sub: "Data Structures", hall: "LH-101", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    ]},
    { day: "Fri", slots: [
        { time: "09-10", sub: "Algorithms", hall: "LH-105", color: "bg-purple-50 text-purple-700 border-purple-200" },
        { time: "10-11", sub: "Physics", hall: "LH-203", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
        { time: "11-12", sub: "Digital Elec.", hall: "LH-203", color: "bg-blue-50 text-blue-700 border-blue-200" },
        null,
        { time: "02-04", sub: "Sports", hall: "Ground", color: "bg-lime-50 text-lime-700 border-lime-200 col-span-2" },
    ]},
]

export default function StudentTimetable() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Weekly Timetable</h1>
        <p className="text-slate-500">Your class schedule for Semester 4.</p>
      </div>

      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                     {/* Header */}
                    <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50/50">
                        <div className="p-4 font-bold text-slate-400 text-center uppercase text-xs tracking-wider">Day</div>
                        {["09:00", "10:00", "11:00", "12:00", "01:00"].map(t => (
                            <div key={t} className="p-4 font-bold text-slate-500 text-center text-sm">{t}</div>
                        ))}
                    </div>

                    {/* Grid */}
                    {schedule.map((day, idx) => (
                        <div key={idx} className="grid grid-cols-6 border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                            <div className="p-4 font-bold text-slate-900 flex items-center justify-center border-r border-slate-100 bg-white sticky left-0 z-10 w-24 md:w-auto shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                                <span className="text-sm">{day.day}</span>
                            </div>
                            <div className="col-span-5 grid grid-cols-5 p-2 gap-2">
                                {day.slots.map((slot, sIdx) => {
                                    if(!slot) return <div key={sIdx} className="bg-slate-50/50 rounded-lg border border-slate-100/50 flex items-center justify-center text-slate-300 text-xs font-bold tracking-wider">BREAK</div>
                                    return (
                                        <div key={sIdx} className={`group rounded-lg p-3 border ${slot.color} ${slot.time.includes('02-04') || slot.time.includes('09-11') ? 'col-span-2' : ''} shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 flex flex-col justify-between min-h-[100px]`}>
                                            <span className="text-[10px] font-bold opacity-70 mb-2 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {slot.time}
                                            </span>
                                            <div>
                                                <p className="font-bold text-sm leading-tight mb-1">{slot.sub}</p>
                                                <p className="text-[10px] opacity-80 font-bold flex items-center gap-1">
                                                    <MapPin className="w-2.5 h-2.5" /> {slot.hall}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
