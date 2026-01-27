import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export default function NoticesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
       <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
          <Bell className="h-10 w-10" />
       </div>
       <h2 className="text-xl font-bold">Notices Board</h2>
       <p className="text-muted-foreground text-center max-w-md">
         Post detailed circulars, holiday announcements, and event updates for students and faculty.
       </p>
       <Button variant="default">Post New Notice</Button>
    </div>
  )
}
