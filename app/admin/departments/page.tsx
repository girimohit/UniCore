"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Trash2, Pencil } from "lucide-react"

const departmentsData = [
  { id: 1, name: "Computer Science", hod: "Dr. Alan Turing", facultyCount: 12, programs: 3 },
  { id: 2, name: "Electronics & Comm.", hod: "Dr. Heinrich Hertz", facultyCount: 8, programs: 2 },
  { id: 3, name: "Mechanical Engineering", hod: "Dr. Nikola Tesla", facultyCount: 10, programs: 2 },
  { id: 4, name: "Civil Engineering", hod: "Dr. Gustave Eiffel", facultyCount: 6, programs: 1 },
]

export default function DepartmentsPage() {
  const [search, setSearch] = useState("")

  const filteredDepts = departmentsData.filter(dept => 
    dept.name.toLowerCase().includes(search.toLowerCase()) || 
    dept.hod.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Departments</h2>
        <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Department
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search departments..." 
                    className="pl-8" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Department Name</TableHead>
                        <TableHead>Head of Dept (HoD)</TableHead>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Programs</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredDepts.map((dept) => (
                        <TableRow key={dept.id}>
                            <TableCell className="font-medium">{dept.name}</TableCell>
                            <TableCell>{dept.hod}</TableCell>
                            <TableCell>{dept.facultyCount}</TableCell>
                            <TableCell>{dept.programs}</TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
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
