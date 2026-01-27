import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export default function AttendanceViewPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
       <div className="p-4 rounded-full bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
          <Calendar className="h-10 w-10" />
       </div>
       <h2 className="text-xl font-bold">Attendance Module</h2>
       <p className="text-muted-foreground text-center max-w-md">
         Attendance management features are coming soon. You'll be able to mark daily attendance and view detailed reports here.
       </p>
       <Button>View Sample Report</Button>
    </div>
  )
}
