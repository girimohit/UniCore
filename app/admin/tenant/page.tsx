"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Building, Upload, Save } from "lucide-react"

export default function TenantPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tenant Profile</h2>
        <Button className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Institution Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Institution Name</label>
                    <Input defaultValue="Unicore Institute of Technology" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Institute Code</label>
                    <Input defaultValue="UIT-2023" disabled />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input defaultValue="123 Education Lane, Knowledge City" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <Input defaultValue="Techville" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Country</label>
                        <Input defaultValue="United States" />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Branding & Logistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed">
                        <Building className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="h-4 w-4" /> Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                            Recommended size: 512x512px. PNG or JPG.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Academic Year</label>
                     <div className="flex gap-4">
                        <Input defaultValue="2023-2024" />
                        <Button variant="secondary">Update Session</Button>
                     </div>
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Time Zone</label>
                    <Input defaultValue="(GMT-05:00) Eastern Time (US & Canada)" />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
