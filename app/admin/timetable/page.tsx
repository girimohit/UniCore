"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Plus } from "lucide-react"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const timeSlots = ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00"]

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Timetable Management</h2>
        <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Slot
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4 flex flex-row gap-4">
            <div className="w-[200px]">
                <Select><option>B.Tech CSE - 4th Sem</option></Select>
            </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
            <div className="min-w-[800px] border rounded-lg">
                <div className="grid grid-cols-8 divide-x divide-y bg-muted/50">
                    <div className="p-4 font-bold text-center">Day / Time</div>
                    {timeSlots.map(time => (
                        <div key={time} className="p-4 font-bold text-center text-xs whitespace-nowrap flex items-center justify-center">
                            {time}
                        </div>
                    ))}
                </div>
                {days.map(day => (
                    <div key={day} className="grid grid-cols-8 divide-x border-t">
                        <div className="p-4 font-bold bg-muted/20 flex items-center justify-center">{day}</div>
                        {timeSlots.map((time, i) => (
                            <div key={time} className="p-2 min-h-[80px] relative group hover:bg-muted/10 transition-colors">
                                {day === "Monday" && i === 0 && (
                                    <div className="absolute inset-1 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded p-1 text-xs flex flex-col justify-between">
                                        <span className="font-bold text-blue-700 dark:text-blue-300">Data Structures</span>
                                        <span className="text-blue-600 dark:text-blue-400">LH-101</span>
                                    </div>
                                )}
                                {day === "Monday" && i === 2 && (
                                    <div className="absolute inset-1 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded p-1 text-xs flex flex-col justify-between">
                                        <span className="font-bold text-purple-700 dark:text-purple-300">Algorithms</span>
                                        <span className="text-purple-600 dark:text-purple-400">LH-102</span>
                                    </div>
                                )}
                                {/* Break at 1pm */}
                                {i === 3 && (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-muted-foreground text-xs uppercase tracking-widest font-bold rotate-0">
                                        Lunch
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
