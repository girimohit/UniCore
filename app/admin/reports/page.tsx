"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, PieChart, Pie, Cell } from "recharts"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const attendanceData = [
  { name: "Jan", value: 85 },
  { name: "Feb", value: 88 },
  { name: "Mar", value: 92 },
  { name: "Apr", value: 90 },
  { name: "May", value: 84 },
  { name: "Jun", value: 78 },
]

const feeRevenueData = [
  { name: "Sem 1", value: 450000 },
  { name: "Sem 2", value: 380000 },
  { name: "Sem 3", value: 520000 },
  { name: "Sem 4", value: 480000 },
]

const studentDistData = [
  { name: "CSE", value: 400, color: "#3b82f6" },
  { name: "ECE", value: 300, color: "#8b5cf6" },
  { name: "ME", value: 200, color: "#ef4444" },
  { name: "Common", value: 100, color: "#10b981" },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
        <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Download PDF Summary
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Attendance Trends (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={attendanceData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: "#3b82f6"}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Revenue by Semester</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={feeRevenueData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1">
             <CardHeader>
                <CardTitle>Student Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={studentDistData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {studentDistData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                    {studentDistData.map(entry => (
                        <div key={entry.name} className="flex items-center gap-1 text-xs">
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: entry.color}} />
                            {entry.name}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>System Health & Usage</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Storage Used</span>
                            <span className="text-muted-foreground">45%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[45%]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">API Requests</span>
                            <span className="text-muted-foreground">82%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[82%]" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Active Users (Realtime)</span>
                            <span className="text-muted-foreground">24%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[24%]" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
