import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
       <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
          <Building2 className="h-10 w-10" />
       </div>
       <h2 className="text-xl font-bold">Departments</h2>
       <p className="text-muted-foreground text-center max-w-md">
         Manage detailed department information, heads, and faculty assignments here.
       </p>
       <Button variant="outline">Create Department</Button>
    </div>
  )
}
