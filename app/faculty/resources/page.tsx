"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Upload, Trash2 } from "lucide-react"

const resources = [
    { name: "Unit 1 - Introduction.pdf", subject: "Data Structures", date: "Today", size: "2.4 MB" },
    { name: "Sorting Algorithms Notes.docx", subject: "Algorithms", date: "Yesterday", size: "1.1 MB" },
    { name: "Lab Manual.pdf", subject: "Lab Session", date: "Last Week", size: "4.5 MB" },
]

export default function FacultyResources() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resources</h1>
            <p className="text-slate-500">Upload and share learning materials.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
            <Upload className="w-4 h-4" /> Upload New
        </Button>
      </div>

       <div className="grid gap-4">
            {resources.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">{res.name}</h4>
                            <p className="text-xs text-slate-500 font-medium">{res.subject} • {res.date} • {res.size}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                             <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                             <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
       </div>
    </div>
  )
}
