"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface SubjectAttendance {
  id: string
  name: string
  code: string | null
  attended: number
  total: number
  color: string
  bg: string
  light: string
  text: string
  border: string
}

export function AttendanceChart({ subjects }: { subjects: SubjectAttendance[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((sub, idx) => {
        const percentage = sub.total > 0 ? Math.round((sub.attended / sub.total) * 100) : 0
        const data = [
          { name: "Attended", value: sub.attended },
          { name: "Missed", value: Math.max(0, sub.total - sub.attended) }
        ]
        const isLow = percentage < 75

        return (
          <Card key={sub.id || idx} className="group border-border/40 bg-card/50 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden rounded-[2rem]">
            <div className={`h-1.5 w-full ${sub.bg} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6 gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-black text-foreground group-hover:grad-purple transition-all duration-500">{sub.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${sub.light} ${sub.text} ${sub.border}`}>
                      Theory
                    </span>
                  </div>
                </div>
                {isLow ? (
                  <div className="p-2.5 bg-rose-500/10 rounded-2xl text-rose-500 shadow-inner" title="Low Attendance">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-inner" title="Good Standing">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-8">
                <div className="h-24 w-24 relative flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={32}
                        outerRadius={44}
                        paddingAngle={4}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        cornerRadius={6}
                        stroke="none"
                      >
                        <Cell fill={sub.color} className="drop-shadow-sm" />
                        <Cell fill="currentColor" className="text-muted/30" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-foreground">{percentage}%</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">
                    <span>Attended</span>
                    <span className="text-foreground">{sub.attended}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">
                    <span>Total</span>
                    <span className="text-foreground">{sub.total}</span>
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] pt-2 ${isLow ? 'text-rose-500' : 'text-emerald-500'} flex items-center gap-2`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${isLow ? 'bg-rose-500' : 'bg-emerald-500'} pulse-dot`} />
                    {isLow ? 'Short attendance' : 'On track'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
