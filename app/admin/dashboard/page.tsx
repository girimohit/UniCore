"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, CalendarCheck, Bell, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"

const kpiData = [
  {
    title: "Total Students",
    value: "2,543",
    change: "+12.5%",
    trend: "up",
    icon: GraduationCap,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "Total Faculty",
    value: "145",
    change: "+4.2%",
    trend: "up",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/20",
  },
  {
    title: "Avg. Attendance",
    value: "87%",
    change: "-1.2%",
    trend: "down",
    icon: CalendarCheck,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Active Notices",
    value: "12",
    change: "+2 new",
    trend: "neutral",
    icon: Bell,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/20",
  },
]

const chartData = [
  { name: "Mon", attendance: 85 },
  { name: "Tue", attendance: 88 },
  { name: "Wed", attendance: 92 },
  { name: "Thu", attendance: 90 },
  { name: "Fri", attendance: 84 },
  { name: "Sat", attendance: 78 },
]

const recentActivity = [
  {
    user: "Dr. Sarah Smith",
    action: "uploaded marks for",
    target: "CS-A (Sem 4)",
    time: "2 mins ago",
    avatar: "SS",
  },
  {
    user: "Admin",
    action: "approved leave for",
    target: "John Doe",
    time: "1 hour ago",
    avatar: "AD",
  },
  {
    user: "System",
    action: "generated report",
    target: "Monthly Attendance",
    time: "3 hours ago",
    avatar: "SY",
  },
  {
    user: "Prof. Brown",
    action: "scheduled class",
    target: "Physics 101",
    time: "5 hours ago",
    avatar: "PB",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button>Download Report</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className={kpi.trend === "up" ? "text-green-500" : kpi.trend === "down" ? "text-red-500" : "text-blue-500"}>
                    {kpi.change}
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px' }}
                />
                <Bar
                    dataKey="attendance"
                    fill="currentColor"
                    className="fill-primary"
                    radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary mr-4 ring-2 ring-white dark:ring-slate-900">
                    {activity.avatar}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} <span className="text-foreground font-medium">{activity.target}</span>
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" size="sm">
                View All Activity <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
