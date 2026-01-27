"use client"

import { useState } from "react"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react"

const usersData = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Student", department: "Computer Science", status: "Active" },
    { id: 2, name: "Dr. Bob Smith", email: "bob@example.com", role: "Faculty", department: "Physics", status: "Active" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Student", department: "Mathematics", status: "Inactive" },
    { id: 4, name: "Dana White", email: "dana@example.com", role: "Admin", department: "Administration", status: "Active" },
    { id: 5, name: "Eve Black", email: "eve@example.com", role: "Student", department: "Computer Science", status: "Active" },
    // Add more mock data if needed
]

export default function UsersPage() {
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("All")

    const filteredUsers = usersData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
        const matchesRole = roleFilter === "All" || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">Manage system users, roles, and access.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add User
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-2 w-full md:max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search users..." 
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select 
                            value={roleFilter} 
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-[150px]"
                        >
                            <option value="All">All Roles</option>
                            <option value="Student">Student</option>
                            <option value="Faculty">Faculty</option>
                            <option value="Admin">Admin</option>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Faculty' ? 'secondary' : 'outline'}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.department}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'Active' ? 'success' : 'destructive'} className="bg-opacity-20 text-opacity-100 hover:bg-opacity-30">
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
