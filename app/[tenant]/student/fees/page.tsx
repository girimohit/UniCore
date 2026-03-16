import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  History,
  CreditCard,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function StudentFeesPage({ params }: { params: Promise<{ tenant: string }> }) {
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fees & Payments 💳</h1>
          <p className="text-slate-500 font-medium">Manage your tuition fees and transaction history.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            Make a Payment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Due Card */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
             <div className="h-1.5 w-full bg-rose-500"></div>
             <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                        <Wallet className="h-5 w-5" />
                    </div>
                      <Badge variant="destructive" className="animate-pulse">Overdue</Badge>
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-black text-slate-900">$1,250</h3>
                    <p className="text-sm font-medium text-slate-500">Outstanding Balance</p>
                </div>
             </CardContent>
        </Card>

        {/* Next Payment Card */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
             <div className="h-1.5 w-full bg-amber-500"></div>
             <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                      <span className="text-xs font-bold text-slate-400">Due in 12 days</span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-black text-slate-900">$450</h3>
                    <p className="text-sm font-medium text-slate-500">Next Installment</p>
                </div>
             </CardContent>
        </Card>

        {/* Paid This Year Card */}
        <Card className="group border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
             <div className="h-1.5 w-full bg-emerald-500"></div>
             <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                      <span className="text-xs font-bold text-emerald-600">On Track</span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-black text-slate-900">$3,400</h3>
                    <p className="text-sm font-medium text-slate-500">Total Paid (2025)</p>
                </div>
             </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden text-black bg-white">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-slate-400" />
                <h3 className="font-bold text-slate-900">Recent Transactions</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:text-indigo-700 hover:bg-indigo-50">
                View All
            </Button>
        </div>
        <Table>
            <TableHeader className="bg-slate-50/50">
                <TableRow>
                    <TableHead className="font-bold">Transaction ID</TableHead>
                    <TableHead className="font-bold">Description</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold text-right">Amount</TableHead>
                    <TableHead className="font-bold text-center">Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[
                    { id: "TXN-88219", desc: "Spring Semester Tuition", date: "May 12, 2025", amount: "$1,100", status: "Completed", type: "Tuition" },
                    { id: "TXN-88042", desc: "Library Late Fee", date: "May 10, 2025", amount: "$15", status: "Completed", type: "Late Fee" },
                    { id: "TXN-87912", desc: "Lab Equipment Deposit", date: "May 05, 2025", amount: "$150", status: "Pending", type: "Deposit" },
                    { id: "TXN-87501", desc: "Hostel Maintenance", date: "Apr 28, 2025", amount: "$300", status: "Completed", type: "Accommodation" },
                ].map((txn) => (
                    <TableRow key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-slate-400">{txn.id}</TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900">{txn.desc}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest">{txn.type}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium">{txn.date}</TableCell>
                        <TableCell className="text-right font-black text-slate-900">{txn.amount}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant={txn.status === 'Completed' ? 'success' : 'warning'} className="text-[10px]">
                                {txn.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                <Download className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </Card>
    </div>
  );
}
