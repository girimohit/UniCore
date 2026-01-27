"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Mail, Phone, MapPin, User, Save, Shield, Bell, LogOut, Settings } from "lucide-react"

export default function StudentProfile() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500">Manage your personal information and preferences.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
         {/* Profile Card */}
         <div className="md:col-span-1 space-y-6">
            <Card className="border border-slate-200 shadow-sm overflow-hidden text-center group">
                <div className="h-32 bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                </div>
                <div className="px-6 pb-6 relative">
                    <div className="w-24 h-24 rounded-full bg-white p-1 mx-auto -mt-12 relative cursor-pointer shadow-md">
                        <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-slate-500 font-bold text-3xl group-hover:bg-slate-200 transition-colors">
                            JS
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                            <Camera className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 space-y-1">
                        <h3 className="text-xl font-bold text-slate-900">John Student</h3>
                        <p className="text-slate-500 text-sm font-medium">Computer Science • Sem 4</p>
                        <div className="pt-2">
                             <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 py-1 px-3 rounded-full inline-block">
                                ID: CS202245
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="border border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-2">
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-3">
                        <Settings className="h-4 w-4" /> Account Settings
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-3">
                        <Bell className="h-4 w-4" /> Notifications
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-3">
                        <Shield className="h-4 w-4" /> Privacy & Security
                    </button>
                     <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-rose-50 text-sm font-bold text-rose-600 transition-colors flex items-center gap-3 mt-1 border-t border-slate-100">
                        <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                </CardContent>
            </Card>
         </div>

         {/* Edit Form */}
         <div className="md:col-span-2">
            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-900">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">First Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input defaultValue="John" className="pl-9 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Last Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input defaultValue="Student" className="pl-9 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                         <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input defaultValue="john.student@unicore.edu" className="pl-9 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Phone Number</label>
                         <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input defaultValue="+1 (555) 000-0000" className="pl-9 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                    </div>

                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Address</label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input defaultValue="123 University Ave, Silicon Valley, CA" className="pl-9 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-sm">
                            <Save className="h-4 w-4 mr-2" /> Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
