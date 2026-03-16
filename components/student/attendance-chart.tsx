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
          <Card key={sub.id || idx} className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden text-black bg-white">
            <div className={`h-1.5 w-full ${sub.bg}`}></div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{sub.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${sub.light} ${sub.text} ${sub.border}`}>
                      Theory
                    </span>
                  </div>
                </div>
                {isLow ? (
                  <div className="p-2 bg-red-50 rounded-full text-red-500" title="Low Attendance">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-50 rounded-full text-emerald-500" title="Good Standing">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div className="h-24 w-24 relative flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        cornerRadius={4}
                        stroke="none"
                      >
                        <Cell fill={sub.color} />
                        <Cell fill="#f1f5f9" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-900">{percentage}%</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium whitespace-nowrap">Attended</span>
                    <span className="font-bold text-slate-900">{sub.attended}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium whitespace-nowrap">Total Classes</span>
                    <span className="font-bold text-slate-900">{sub.total}</span>
                  </div>
                  <div className={`text-xs font-bold ${isLow ? 'text-red-600' : 'text-emerald-600'} flex items-center gap-1`}>
                    {isLow ? '⚠️ Short attendance' : '✅ On track'}
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
