"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NoticeForm({ tenant, initialData }: { tenant: string, initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    targetRole: initialData?.targetRole || 'ALL'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData?.id ? `/api/modules/notices?id=${initialData.id}` : `/api/modules/notices`;
      const method = initialData?.id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to save notice");
      
      toast.success(initialData ? 'Notice updated successfully!' : 'Notice published successfully!');
      router.push(`/${tenant}/admin/notices`);
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href={`/${tenant}/admin/notices`} className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Notices
      </Link>

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          {initialData ? 'Edit Notice' : 'Draft New Notice'}
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Broadcast an important announcement.
        </p>
      </div>

      <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-xl rounded-[2rem] overflow-hidden">
        <form onSubmit={handleSubmit}>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <label htmlFor="title" className="text-base font-bold text-foreground">Notice Title</label>
              <Input 
                id="title" 
                placeholder="Brief, descriptive title..." 
                required 
                value={formData.title} 
                onChange={(e: any) => setFormData({...formData, title: e.target.value})}
                className="h-12 text-lg rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="targetRole" className="text-base font-bold text-foreground">Target Audience</label>
              <Select value={formData.targetRole} onValueChange={v => setFormData({...formData, targetRole: v})}>
                <SelectTrigger className="h-12 w-full sm:w-[250px] rounded-xl bg-background/50 border-border/50">
                  <SelectValue placeholder="Select audience..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Everyone</SelectItem>
                  <SelectItem value="STUDENT">Students Only</SelectItem>
                  <SelectItem value="FACULTY">Faculty Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label htmlFor="content" className="text-base font-bold text-foreground">Detailed Content</label>
              <textarea 
                id="content" 
                placeholder="Write the full announcement here. You can use multiple paragraphs..." 
                required 
                value={formData.content} 
                onChange={(e: any) => setFormData({...formData, content: e.target.value})}
                className="flex w-full min-h-[250px] resize-y rounded-xl bg-background/50 border border-border/50 text-base leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 p-4"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="lg" disabled={loading} className="rounded-full shadow-lg hover:shadow-xl transition-all font-bold gap-2 px-8">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {initialData ? 'Save Changes' : 'Publish Notice'}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
