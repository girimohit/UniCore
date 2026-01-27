"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle2, AlertCircle, History, Download, CreditCard } from "lucide-react"

export default function StudentFees() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fee Status</h1>
            <p className="text-slate-500">Manage your tuition and hostel fees.</p>
        </div>
        <Button className="bg-slate-900 text-white hover:bg-slate-800">
            <Download className="mr-2 h-4 w-4" /> Download Statement
        </Button>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
            {/* Summary Card */}
            <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="h-1.5 w-full bg-slate-900"></div>
                <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-slate-500 font-medium mb-1">Total Outstanding</p>
                            <h3 className="text-4xl font-bold text-slate-900">$450.00</h3>
                        </div>
                        <div className="p-3 bg-slate-100 rounded-xl text-slate-900">
                            <Wallet className="h-6 w-6" />
                        </div>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-500">Paid: <span className="text-slate-900">$2,550</span></span>
                            <span className="text-slate-500">Total: <span className="text-slate-900">$3,000</span></span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
                        </div>
                        <p className="text-xs text-slate-500 text-right">85% Paid</p>
                    </div>

                    <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-11 rounded-lg">
                        Processing Payment...
                    </Button>
                </CardContent>
            </Card>

            {/* Pending Invoice Card */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    Pending Invoices
                </h3>
                <Card className="border border-red-200 shadow-sm bg-red-50/30">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3">
                                <div className="p-2 bg-white rounded-lg border border-red-100 text-red-600 h-fit">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Semester 4 Tuition Fee</h4>
                                    <p className="text-xs text-red-600 font-medium mt-1">Due: 25 Dec 2024</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-slate-900">$450</span>
                        </div>
                         <div className="flex gap-3 mt-4 ml-11">
                            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">Pay Now</Button>
                            <Button size="sm" variant="outline" className="bg-white border-slate-200">View Details</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
       </div>

       {/* History */}
       <div className="space-y-4">
          <div className="flex items-center gap-2">
             <h3 className="font-bold text-slate-900 text-lg">Payment History</h3>
          </div>
          
          <Card className="border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-bold text-slate-500">Date</th>
                                <th className="p-4 font-bold text-slate-500">Description</th>
                                <th className="p-4 font-bold text-slate-500">Amount</th>
                                <th className="p-4 font-bold text-slate-500">Method</th>
                                <th className="p-4 font-bold text-slate-500">Status</th>
                                <th className="p-4 font-bold text-slate-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                             {[
                                { date: "15 Oct 2024", desc: "Exam Fee", amt: "$50.00", method: "Credit Card", status: "Paid" },
                                { date: "01 Sep 2024", desc: "Semester 3 Tuition", amt: "$1,200.00", method: "Bank Transfer", status: "Paid" },
                                { date: "10 Aug 2024", desc: "Library Fine", amt: "$15.00", method: "UPI", status: "Paid" },
                             ].map((tx, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-900">{tx.date}</td>
                                    <td className="p-4 font-medium text-slate-700">{tx.desc}</td>
                                    <td className="p-4 font-bold text-slate-900">{tx.amt}</td>
                                    <td className="p-4 text-slate-500 flex items-center gap-2">
                                        <CreditCard className="h-3 w-3" /> {tx.method}
                                    </td>
                                    <td className="p-4">
                                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 font-bold">
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> {tx.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
          </Card>
       </div>
    </div>
  )
}
