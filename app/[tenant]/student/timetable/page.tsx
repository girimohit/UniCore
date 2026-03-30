import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin } from "lucide-react"

const staticSchedule = [
    { day: "Mon", slots: [
        { time: "09-10", sub: "Data Structures", hall: "LH-101", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        { time: "10-11", sub: "Digital Elec.", hall: "LH-203", color: "bg-blue-50 text-blue-700 border-blue-200" },
        { time: "11-12", sub: "Algorithms", hall: "LH-105", color: "bg-purple-50 text-purple-700 border-purple-200" },
        null, // Lunch
        { time: "02-04", sub: "Physics Lab", hall: "Lab-3", color: "bg-rose-50 text-rose-700 border-rose-200 col-span-2" },
    ]},
    { day: "Tue", slots: [
        { time: "09-10", sub: "Maths", hall: "LH-101", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
        null,
        { time: "11-12", sub: "Data Structures", hall: "LH-101", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        null,
        { time: "02-03", sub: "Algorithms", hall: "LH-105", color: "bg-purple-50 text-purple-700 border-purple-200" },
    ]},
     { day: "Wed", slots: [
        { time: "09-10", sub: "Digital Elec.", hall: "LH-203", color: "bg-blue-50 text-blue-700 border-blue-200" },
        { time: "10-11", sub: "Algorithms", hall: "LH-105", color: "bg-purple-50 text-purple-700 border-purple-200" },
        null,
        { time: "01-02", sub: "Library", hall: "", color: "bg-slate-50 text-slate-600 border-slate-200" },
        { time: "02-03", sub: "Maths", hall: "LH-101", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    ]},
     { day: "Thu", slots: [
        { time: "09-11", sub: "Computer Lab", hall: "Lab-1", color: "bg-amber-50 text-amber-700 border-amber-200 col-span-2" },
        { time: "11-12", sub: "Maths", hall: "LH-101", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
        null,
        { time: "02-03", sub: "Data Structures", hall: "LH-101", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    ]},
    { day: "Fri", slots: [
        { time: "09-10", sub: "Algorithms", hall: "LH-105", color: "bg-purple-50 text-purple-700 border-purple-200" },
        { time: "10-11", sub: "Physics", hall: "LH-203", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
        { time: "11-12", sub: "Digital Elec.", hall: "LH-203", color: "bg-blue-50 text-blue-700 border-blue-200" },
        null,
        { time: "02-04", sub: "Sports", hall: "Ground", color: "bg-lime-50 text-lime-700 border-lime-200 col-span-2" },
    ]},
]

export default async function StudentTimetablePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getCurrentUser();

  if (!session || session.role !== 'STUDENT') {
    redirect(`/login`);
  }

  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true }
  });

  if (!institution) notFound();

  return (
    <div className="space-y-10 pb-10 text-foreground">
      <div className="px-2">
        <h1 className="text-3xl font-display font-black tracking-tight">Weekly Timetable 🗓️</h1>
        <p className="text-muted-foreground font-medium mt-1">Your class schedule for the current semester at {institution.name}.</p>
      </div>

      <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-xl overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
                <div className="min-w-[900px]">
                     {/* Header */}
                    <div className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-border/40 bg-muted/30">
                        <div className="p-6 font-black text-muted-foreground text-center uppercase text-[10px] tracking-[0.2em] opacity-60">Day</div>
                        {["09:00", "10:00", "11:00", "12:00", "01:00"].map(t => (
                            <div key={t} className="p-6 font-black text-foreground text-center text-sm tracking-tight">{t}</div>
                        ))}
                    </div>

                    {/* Grid */}
                    {staticSchedule.map((day, idx) => (
                        <div key={idx} className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-border/20 last:border-0 group/row hover:bg-muted/10 transition-colors">
                            <div className="p-6 font-black text-foreground flex items-center justify-center border-r border-border/20 bg-card/20 sticky left-0 z-10 w-24 md:w-auto shadow-xl group-hover/row:bg-primary/5 transition-colors">
                                <span className="text-sm font-display">{day.day}</span>
                            </div>
                            <div className="col-span-5 grid grid-cols-5 p-4 gap-4">
                                {day.slots.map((slot, sIdx) => {
                                    if(!slot) return (
                                        <div key={sIdx} className="bg-muted/20 rounded-2xl border border-dashed border-border/40 flex items-center justify-center text-muted-foreground/30 text-[10px] font-black tracking-[0.2em]">
                                            BREAK
                                        </div>
                                    )
                                    return (
                                        <div key={sIdx} className={`group relative rounded-3xl p-5 border ${slot.color.replace('bg-', 'bg-opacity-10 bg-').replace('text-', 'text-opacity-90 text-')} ${slot.time.includes('02-04') || slot.time.includes('09-11') ? 'col-span-2' : ''} shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 flex flex-col justify-between min-h-[120px] overflow-hidden`}>
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                                 <Clock className="w-10 h-10" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 opacity-70">
                                                <Clock className="w-3 h-3" /> {slot.time}
                                            </span>
                                            <div className="relative z-10">
                                                <p className="font-black text-base font-display leading-tight mb-2">{slot.sub}</p>
                                                <p className="text-[10px] uppercase tracking-widest font-black flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <MapPin className="w-3 h-3 text-primary" /> {slot.hall}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
