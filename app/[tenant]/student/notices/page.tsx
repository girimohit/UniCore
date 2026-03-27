import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, Info, StickyNote } from "lucide-react"

export default async function StudentNoticesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'STUDENT') {
    redirect(`/${tenant}/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true }
  });

  if (!institution) notFound();

  // Mocking notices for now as per reference - usually these would come from a Notice model
  const mockNotices = [
    { title: "End Semester Exams Postponed", examDate: "Today, 10:30 AM", priority: "high", category: "Exam", desc: `Due to heavy rains at ${institution.name}, the exams scheduled for tomorrow are postponed. New dates will be announced soon. Please keep checking the portal for further updates regarding the revised schedule.`, color: "bg-rose-500", light: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
    { title: "Library Due Date Extended", attendanceDate: "Yesterday, 04:00 PM", priority: "medium", category: "Library", desc: "You can return the borrowed books by next Monday without any late fine. This applies to all books issued before the 20th.", color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
    { title: "Campus Recruitment Drive", attendanceDate: "2 days ago", priority: "high", category: "Placement", desc: "TCS and Infosys are visiting campus on 25th. Register on the portal immediately. Preliminary rounds will be held in the main auditorium.", color: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" },
    { title: "Holiday on Friday", attendanceDate: "3 days ago", priority: "low", category: "General", desc: "The college remains closed on Friday on account of Good Friday.", color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="px-2 text-foreground">
        <h1 className="text-3xl font-display font-black tracking-tight">Notices Board 📢</h1>
        <p className="text-muted-foreground font-medium mt-1">Stay updated with the latest announcements at {institution.name}.</p>
      </div>

      <div className="grid gap-6">
        {mockNotices.length === 0 ? (
          <Card className="border-border/40 bg-card/50 backdrop-blur-md p-16 flex flex-col items-center justify-center text-center gap-4 rounded-[2rem]">
            <div className="p-4 rounded-full bg-amber-500/10 text-amber-500 shadow-inner">
               <Info className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-foreground">No notices yet</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                When your institution posts notices they will appear here. Check back soon.
              </p>
            </div>
          </Card>
        ) : mockNotices.map((notice, i) => (
             <Card key={i} className="group border-border/40 bg-card/40 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-[2rem]">
                <div className={`h-1.5 w-full ${notice.color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div className="space-y-2">
                            <h3 className="text-xl font-display font-black text-foreground group-hover:grad-purple transition-all duration-500">
                                {notice.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <span className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${notice.light} ${notice.text} ${notice.border}`}>
                                    {notice.category}
                                </span>
                                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                                    <Calendar className="h-3.5 w-3.5" /> {notice.examDate}
                                </span>
                            </div>
                        </div>
                        
                        <div>
                             {notice.priority === 'high' && (
                                <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                                    High Priority
                                </Badge>
                             )}
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="hidden md:flex p-4 bg-muted rounded-2xl h-fit text-muted-foreground/40 shrink-0 group-hover:text-primary/40 group-hover:bg-primary/5 transition-colors">
                             <StickyNote className="h-6 w-6" />
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                            {notice.desc}
                        </p>
                    </div>
                </CardContent>
             </Card>
        ))}
      </div>
    </div>
  )
}
