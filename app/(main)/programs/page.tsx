import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"

export default function ProgramsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
       <div className="p-4 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
          <GraduationCap className="h-10 w-10" />
       </div>
       <h2 className="text-xl font-bold">Programs & Courses</h2>
       <p className="text-muted-foreground text-center max-w-md">
         Design academic structure, manage courses, and assign credits.
       </p>
       <Button variant="default">Add New Program</Button>
    </div>
  )
}
