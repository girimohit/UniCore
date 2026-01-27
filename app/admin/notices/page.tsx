"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pin, Calendar, Users } from "lucide-react"

const notices = [
  {
    id: 1,
    title: "Semester Exams Postponed",
    content: "Due to heavy rains, the end semester exams scheduled for next week have been postponed. New dates will be announced shortly.",
    date: "24 Dec 2023",
    audience: "All Students",
    priority: "High",
    author: "Registrar Office",
  },
  {
    id: 2,
    title: "Holiday Declaration",
    content: "The college will remain closed on 25th Dec for Christmas.",
    date: "23 Dec 2023",
    audience: "All Staff & Students",
    priority: "Medium",
    author: "Admin",
  },
  {
    id: 3,
    title: "Library Books Return",
    content: "Students are requested to return all borrowed books before the winter break starts.",
    date: "20 Dec 2023",
    audience: "Students",
    priority: "Low",
    author: "Librarian",
  },
]

export default function NoticesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Notices</h2>
        <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Notice
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notices.map((notice) => (
            <Card key={notice.id} className="group hover:shadow-lg transition-all border-l-4" style={{
                borderLeftColor: notice.priority === 'High' ? '#ef4444' : notice.priority === 'Medium' ? '#f59e0b' : '#3b82f6'
            }}>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <Badge variant={notice.priority === 'High' ? 'destructive' : notice.priority === 'Medium' ? 'warning' : 'secondary'}>
                            {notice.priority} Priority
                        </Badge>
                        <Pin className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{notice.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                        {notice.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {notice.date}
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {notice.audience}
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
