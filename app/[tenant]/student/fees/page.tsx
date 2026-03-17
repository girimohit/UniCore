import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

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
    <div className="space-y-10 pb-10 text-foreground">
      <div className="px-2">
        <h1 className="text-3xl font-display font-black tracking-tight">Fees & Payments 💳</h1>
        <p className="text-muted-foreground font-medium mt-1">Manage your tuition fees and transaction history at {institution.name}.</p>
      </div>

      <Card className="border-border/40 bg-card/40 backdrop-blur-md p-20 flex flex-col items-center justify-center text-center gap-6 rounded-[2.5rem]">
        <div className="p-4 rounded-3xl bg-primary/10 text-primary shadow-inner">
          <Wallet className="h-12 w-12 opacity-60" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-display font-black text-foreground">No payment records</h3>
          <p className="text-muted-foreground text-sm font-medium mt-1 max-w-sm mx-auto opacity-70">
            Fee records and transactions will appear here once your institution configures the fee module.
          </p>
        </div>
      </Card>
    </div>
  );
}
