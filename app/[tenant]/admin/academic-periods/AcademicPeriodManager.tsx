"use client";

import { useState } from "react";
import { 
  Plus, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Calendar as CalendarIcon,
  Trash2,
  X
} from "lucide-react";
import { getAcademicLabel, formatCycleLabel, AcademicSystem } from "@/lib/utils/academic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AcademicPeriod {
  id: string;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
}

interface ManagerProps {
  initialPeriods: AcademicPeriod[];
  academicSystem: AcademicSystem;
}

export default function AcademicPeriodManager({ initialPeriods, academicSystem }: ManagerProps) {
  const academic = getAcademicLabel(academicSystem);
  const [periods, setPeriods] = useState<AcademicPeriod[]>(initialPeriods);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'SEMESTER',
    start_date: '',
    end_date: ''
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/academic-periods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create period");
      }

      const newPeriod = await res.json();
      setPeriods([newPeriod, ...periods]);
      setFormData({ name: '', type: 'SEMESTER', start_date: '', end_date: '' });
      setShowForm(false);
      setMessage({ type: 'success', text: "Academic period created successfully!" });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Periods</h2>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl"
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? "Cancel" : "Add Period"}
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          message.type === 'success' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{message.text}</p>
        </div>
      )}

      {showForm && (
        <div className="glass rounded-2xl p-6 border border-border/50 animate-in zoom-in-95 duration-200">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Period Name</label>
              <Input 
                placeholder={`e.g. ${formatCycleLabel(academic.type, 1)}, ${academic.label} 2024-25`}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Type</label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="SEMESTER">SEMESTER</option>
                <option value="YEAR">YEAR</option>
                <option value="TERM">TERM</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Start Date</label>
              <Input 
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">End Date</label>
              <Input 
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <Button type="submit" disabled={loading} className="w-full rounded-xl py-6 text-lg font-bold">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                Create Academic Period
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden border border-border/50">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead>Period Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No academic periods found. Create your first one above.
                </TableCell>
              </TableRow>
            ) : (
              periods.map((period) => (
                <TableRow key={period.id}>
                  <TableCell className="font-bold">{period.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-semibold px-3 py-1 bg-primary/10 text-primary border-none">
                      {period.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(period.start_date))}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(period.end_date))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
