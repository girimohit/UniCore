"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Plus } from "lucide-react"

export default function FacultyNotices() {
  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notices</h1>
            <p className="text-slate-500">View and send notices to students.</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
            <Plus className="w-4 h-4" /> Create Notice
        </Button>
      </div>

       <div className="grid gap-6">
          {[1, 2].map((i) => (
             <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <Megaphone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Assignment 3 Deadline Extended</h3>
                                <p className="text-xs text-slate-500">Posted on 24 Oct for <span className="font-bold">CS201 Data Structures</span></p>
                            </div>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">Normal Priority</Badge>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 pl-[52px]">
                        The deadline for Assignment 3 has been extended by 2 days due to server maintenance. Please submit by Friday.
                    </p>
                    <div className="pl-[52px] flex gap-3 text-xs font-bold text-slate-400">
                        <span>Read by 35/45 students</span>
                    </div>
                </CardContent>
             </Card>
          ))}
       </div>
    </div>
  )
}
