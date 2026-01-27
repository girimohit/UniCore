import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { UserCircle } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center gap-4 mb-8">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
             JD
          </div>
          <div>
            <h1 className="text-3xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">Administrator • Admin Access</p>
          </div>
       </div>

       <Card>
          <CardHeader>
             <CardTitle>Personal Information</CardTitle>
             <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-medium">First Name</label>
                   <Input defaultValue="John" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium">Last Name</label>
                   <Input defaultValue="Doe" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue="john.doe@example.com" disabled />
             </div>
          </CardContent>
          <CardFooter>
             <Button>Save Changes</Button>
          </CardFooter>
       </Card>
    </div>
  )
}
