"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const programsData = [
  { id: 1, name: "B.Tech CSE", department: "Computer Science", duration: "4 Years", classes: 8 },
  { id: 2, name: "B.Tech ECE", department: "Electronics & Comm.", duration: "4 Years", classes: 8 },
  { id: 3, name: "M.Tech CSE", department: "Computer Science", duration: "2 Years", classes: 4 },
  { id: 4, name: "B.Sc Mathematics", department: "Mathematics", duration: "3 Years", classes: 6 },
]

export default function ProgramsPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Programs</h2>
        <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Program
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4 flex flex-row gap-4">
            <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search programs..." 
                    className="pl-8" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <Select className="w-[200px]">
                <option value="">All Departments</option>
                <option value="cs">Computer Science</option>
                <option value="ece">Electronics</option>
            </Select>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Program Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Active Classes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {programsData.map((prog) => (
                        <TableRow key={prog.id}>
                            <TableCell className="font-medium">{prog.name}</TableCell>
                            <TableCell>{prog.department}</TableCell>
                            <TableCell>{prog.duration}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{prog.classes} Classes</Badge>
                            </TableCell>
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
