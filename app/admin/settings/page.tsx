"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bell, Shield, Monitor as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600">
                    <Bell className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">Email Alerts</label>
                        <p className="text-xs text-muted-foreground">Receive daily summaries</p>
                    </div>
                    <div className="h-5 w-9 rounded-full bg-primary/20 p-0.5">
                         <div className="h-4 w-4 rounded-full bg-primary shadow-sm" />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">SMS Notifications</label>
                        <p className="text-xs text-muted-foreground">For urgent notices</p>
                    </div>
                     <div className="h-5 w-9 rounded-full bg-muted p-0.5 transition-colors">
                         <div className="h-4 w-4 rounded-full bg-white shadow-sm translate-x-0 transition-transform" />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600">
                    <Shield className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Password Expiry</label>
                    <div className="flex items-center gap-2">
                         <Input type="number" defaultValue="90" className="w-20" />
                         <span className="text-sm text-muted-foreground">days</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium">2FA Required</label>
                        <p className="text-xs text-muted-foreground">For admin accounts</p>
                    </div>
                    <div className="h-5 w-9 rounded-full bg-primary/20 p-0.5">
                         <div className="h-4 w-4 rounded-full bg-primary shadow-sm" />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600">
                    <SettingsIcon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Maintenance Mode</label>
                    <div className="flex items-center justify-between border rounded p-3">
                         <span className="text-sm text-muted-foreground">Only admins can login</span>
                          <div className="h-5 w-9 rounded-full bg-muted p-0.5 transition-colors">
                            <div className="h-4 w-4 rounded-full bg-white shadow-sm translate-x-0 transition-transform" />
                        </div>
                    </div>
                </div>
                <Button variant="destructive" size="sm" className="w-full">Clear Cache</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
