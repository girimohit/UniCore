"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, Book } from "lucide-react"

export default function FacultyProfile() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Profile</h1>
            <p className="text-slate-500">Manage your personal and academic details.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center h-fit">
                <CardContent className="p-8">
                    <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-400 mb-4 border-4 border-white shadow-sm">
                        AT
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Dr. Alan Turing</h2>
                    <p className="text-slate-500 font-medium text-sm">Professor</p>
                    <p className="text-slate-400 text-xs mt-1">Computer Science Dept</p>
                    
                    <div className="mt-6 space-y-2">
                        <Button className="w-full bg-slate-900 text-white">Edit Photo</Button>
                        <Button variant="outline" className="w-full">Change Password</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 border-0 shadow-lg">
                <CardContent className="p-8 space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 border-b pb-2 mb-4">Personal Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input defaultValue="Alan Turing" className="pl-9" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Designation</label>
                            <div className="relative">
                                <Book className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input defaultValue="Professor" className="pl-9" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input defaultValue="alan.turing@unicore.edu" className="pl-9" />
                        </div>
                    </div>

                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input defaultValue="+1 (555) 123-4567" className="pl-9" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8">Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
      </div>
    </div>
  )
}
