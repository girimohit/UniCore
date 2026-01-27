import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <h1 className="text-3xl font-bold mb-6">Settings</h1>
       
       <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
             </CardTitle>
             <CardDescription>Manage global application preferences.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                   <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Toggle application theme</p>
                   </div>
                   <Button variant="outline" size="sm">Toggle</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                   <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">Manage email alerts</p>
                   </div>
                   <Button variant="outline" size="sm">Configure</Button>
                </div>
             </div>
          </CardContent>
       </Card>
    </div>
  )
}
