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

  const notices = await prisma.notice.findMany({
    where: { 
      institutionId: institution.id,
      OR: [
        { targetRole: 'ALL' },
        { targetRole: 'STUDENT' },
        { targetRole: null }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-10 pb-10">
      <div className="px-2 text-foreground">
        <h1 className="text-3xl font-display font-black tracking-tight">Notices Board 📢</h1>
        <p className="text-muted-foreground font-medium mt-1">Stay updated with the latest announcements at {institution.name}.</p>
      </div>

      <div className="grid gap-6">
        {notices.length === 0 ? (
          <Card className="border-border/40 bg-card/50 backdrop-blur-md p-16 flex flex-col items-center justify-center text-center gap-4 rounded-[2rem]">
            <div className="p-4 rounded-full bg-primary/10 text-primary shadow-inner">
               <Info className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-foreground">No notices yet</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm mx-auto">
                When your institution posts notices they will appear here. Check back soon.
              </p>
            </div>
          </Card>
        ) : notices.map((notice: any) => (
             <Card key={notice.id} className="group border-border/40 bg-card/40 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-[2rem]">
                <div className="h-1.5 w-full bg-primary/50 group-hover:bg-primary transition-colors"></div>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div className="space-y-3">
                            <h3 className="text-2xl font-display font-black text-foreground group-hover:text-primary transition-colors duration-500">
                                {notice.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                                    <Calendar className="h-3.5 w-3.5" /> 
                                    {new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="hidden md:flex p-4 bg-primary/5 rounded-2xl h-fit text-primary/40 shrink-0 group-hover:text-primary transition-colors">
                             <StickyNote className="h-6 w-6" />
                        </div>
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">
                            {notice.content}
                        </div>
                    </div>
                </CardContent>
             </Card>
        ))}
      </div>
    </div>
  )
}
