"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, MoreHorizontal, BookOpen } from "lucide-react"

const subjectsData = [
  { code: "CS101", name: "Data Structures", credits: 4, program: "B.Tech CSE", semester: "3rd", type: "Core" },
  { code: "CS102", name: "Algorithms", credits: 4, program: "B.Tech CSE", semester: "4th", type: "Core" },
  { code: "EC201", name: "Digital Electronics", credits: 3, program: "B.Tech ECE", semester: "3rd", type: "Core" },
  { code: "MA101", name: "Calculus", credits: 4, program: "Common", semester: "1st", type: "Core" },
]

export default function SubjectsPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Subjects</h2>
        <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Subject
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4 flex flex-row gap-4">
            <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search subjects..." 
                    className="pl-8" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <Select className="w-[150px]">
                <option value="">Semester</option>
                <option value="1">1st Sem</option>
                <option value="2">2nd Sem</option>
            </Select>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Subject Name</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subjectsData.map((sub) => (
                        <TableRow key={sub.code}>
                            <TableCell className="font-mono text-xs">{sub.code}</TableCell>
                            <TableCell className="font-medium flex items-center gap-2">
                                <BookOpen className="h-3 w-3 text-muted-foreground" />
                                {sub.name}
                            </TableCell>
                            <TableCell>{sub.credits}</TableCell>
                            <TableCell>{sub.program}</TableCell>
                            <TableCell>{sub.semester}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
