"use client"

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Megaphone, Calendar } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NoticesClient({ initialNotices, tenant }: { initialNotices: any[], tenant: string }) {
  const [notices, setNotices] = useState(initialNotices);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    
    try {
      const res = await fetch(`/api/modules/notices?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotices(notices.filter(n => n.id !== id));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (notices.length === 0) {
    return (
      <Card className="border-border/40 bg-card/50 backdrop-blur-md p-16 flex flex-col items-center justify-center text-center gap-4 rounded-[2rem]">
        <div className="p-4 rounded-full bg-primary/10 text-primary shadow-inner">
           <Megaphone className="h-10 w-10" />
        </div>
        <div>
          <h3 className="text-xl font-display font-black text-foreground">No active notices</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm mx-auto">
            Click the "Create Notice" button to broadcast an announcement to your institution.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {notices.map((notice) => (
        <Card key={notice.id} className="group border-border/40 bg-card/40 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-[2rem]">
          <div className="h-1.5 w-full bg-primary/80 group-hover:bg-primary transition-colors"></div>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-black text-foreground group-hover:text-primary transition-colors duration-500">
                  {notice.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                    TARGET: {notice.targetRole || 'ALL'}
                  </Badge>
                  <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/${tenant}/admin/notices/${notice.id}/edit`}>
                  <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:bg-muted">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" className="rounded-full shadow-sm" onClick={() => handleDelete(notice.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground font-medium leading-relaxed">
              <p className="whitespace-pre-wrap">{notice.content}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
