"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Filter, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const feesData = [
  { id: 1, student: "Alice Johnson", rollNo: "CS21001", program: "B.Tech CSE", amount: 45000, status: "Paid", date: "12 Dec 2023" },
  { id: 2, student: "Bob Smith", rollNo: "CS21002", program: "B.Tech CSE", amount: 45000, status: "Pending", date: "-" },
  { id: 3, student: "Charlie Brown", rollNo: "EC21001", program: "B.Tech ECE", amount: 42000, status: "Overdue", date: "-" },
  { id: 4, student: "Dana White", rollNo: "ME21001", program: "B.Tech ME", amount: 40000, status: "Paid", date: "10 Dec 2023" },
]

export default function FeesPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Fees Management</h2>
        <Button className="gap-2">
            <Plus className="h-4 w-4" /> Record Payment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4 opacity-80">
                    <span className="text-sm font-medium">Total Collected</span>
                    <Wallet className="h-4 w-4" />
                </div>
                <div className="text-3xl font-bold">$1,245,000</div>
                <p className="text-xs mt-1 opacity-70">This academic year</p>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4 text-muted-foreground">
                    <span className="text-sm font-medium">Pending Dues</span>
                    <Wallet className="h-4 w-4" />
                </div>
                <div className="text-3xl font-bold text-orange-500">$340,000</div>
                <p className="text-xs mt-1 text-muted-foreground">450 students pending</p>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4 text-muted-foreground">
                    <span className="text-sm font-medium">Overdue</span>
                    <Wallet className="h-4 w-4" />
                </div>
                <div className="text-3xl font-bold text-red-500">$45,000</div>
                <p className="text-xs mt-1 text-muted-foreground">CRITICAL: 24 students</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4 flex flex-row gap-4">
            <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search students..." 
                    className="pl-8" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <Select className="w-[150px]">
                <option value="">Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
            </Select>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Roll No</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {feesData.map((fee) => (
                        <TableRow key={fee.id}>
                            <TableCell className="font-medium">{fee.student}</TableCell>
                            <TableCell>{fee.rollNo}</TableCell>
                            <TableCell>{fee.program}</TableCell>
                            <TableCell>${fee.amount.toLocaleString()}</TableCell>
                            <TableCell>{fee.date}</TableCell>
                            <TableCell>
                                <Badge variant={fee.status === 'Paid' ? 'success' : fee.status === 'Overdue' ? 'destructive' : 'warning'}>
                                    {fee.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm">Invoice</Button>
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
