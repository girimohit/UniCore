import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function SubjectsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
       <div className="p-4 rounded-full bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400">
          <BookOpen className="h-10 w-10" />
       </div>
       <h2 className="text-xl font-bold">Subjects Managament</h2>
       <p className="text-muted-foreground text-center max-w-md">
         Catalog all subjects, assign codes, and map them to programs.
       </p>
       <Button variant="outline">Add Subject</Button>
    </div>
  )
}
