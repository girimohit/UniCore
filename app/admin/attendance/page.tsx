"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar as CalendarIcon, Download, Filter } from "lucide-react"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Attendance Reports</h2>
        <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="uppercase text-xs font-bold text-muted-foreground pb-2">Average Attendance</CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-green-600">87%</div>
                <p className="text-xs text-muted-foreground mt-1">+2% from last week</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="uppercase text-xs font-bold text-muted-foreground pb-2">Low Attendance Alert</CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-red-600">42</div>
                <p className="text-xs text-muted-foreground mt-1">Students below 75%</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="uppercase text-xs font-bold text-muted-foreground pb-2">Total Classes Held</CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-blue-600">1,240</div>
                <p className="text-xs text-muted-foreground mt-1">This semester</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Program</label>
                    <Select><option>B.Tech CSE</option></Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Semester</label>
                    <Select><option>4th Sem</option></Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="date" className="pl-8" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="date" className="pl-8" />
                    </div>
                </div>
            </div>
            <Button>
                <Filter className="h-4 w-4 mr-2" /> Apply
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Roll No</TableHead>
                        <TableHead>Total Classes</TableHead>
                        <TableHead>Attended</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">John Doe</TableCell>
                        <TableCell>CS21001</TableCell>
                        <TableCell>45</TableCell>
                        <TableCell>42</TableCell>
                        <TableCell className="text-green-600 font-bold">93.3%</TableCell>
                        <TableCell><span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">Regular</span></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Jane Smith</TableCell>
                        <TableCell>CS21002</TableCell>
                        <TableCell>45</TableCell>
                        <TableCell>31</TableCell>
                        <TableCell className="text-red-600 font-bold">68.8%</TableCell>
                        <TableCell><span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">Low</span></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
