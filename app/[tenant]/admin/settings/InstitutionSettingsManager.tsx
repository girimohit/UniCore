"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface SettingsManagerProps {
  initialSettings: {
    academicSystem: 'SEMESTER' | 'ANNUAL' | 'YEARLY';
    academicStructure: {
      type: 'SEMESTER' | 'YEARLY';
      totalCycles: number;
    } | null;
  };
}

export default function InstitutionSettingsManager({ initialSettings }: SettingsManagerProps) {
  const [structure, setStructure] = useState(initialSettings.academicStructure || {
    type: initialSettings.academicSystem === 'ANNUAL' || initialSettings.academicSystem === 'YEARLY' ? 'YEARLY' : 'SEMESTER',
    totalCycles: initialSettings.academicSystem === 'ANNUAL' || initialSettings.academicSystem === 'YEARLY' ? 4 : 8
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = async () => {
    if (structure.totalCycles <= 0) {
      setMessage({ type: 'error', text: "Total cycles must be a positive integer." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/institutions/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ academicStructure: structure }),
      });

      if (!res.ok) throw new Error("Failed to update settings");

      setMessage({ type: 'success', text: "Academic structure updated successfully! Cycle counts and terminology will reflect this choice." });
      
    } catch (err) {
      setMessage({ type: 'error', text: "An error occurred while saving settings." });
    } finally {
      setLoading(false);
    }
  };

  const isChanged = JSON.stringify(structure) !== JSON.stringify(initialSettings.academicStructure || {
    type: initialSettings.academicSystem === 'ANNUAL' || initialSettings.academicSystem === 'YEARLY' ? 'YEARLY' : 'SEMESTER',
    totalCycles: initialSettings.academicSystem === 'ANNUAL' || initialSettings.academicSystem === 'YEARLY' ? 4 : 8
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div className="glass rounded-3xl p-8 border border-border/50 space-y-8">
        <section className="space-y-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-foreground">Academic Configuration</h3>
            <p className="text-sm text-muted-foreground">Define how your institution's academic timeline is structured and how many cycles it spans.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setStructure(s => ({ ...s, type: 'SEMESTER' }))}
              className={`flex flex-col p-6 rounded-2xl border-2 transition-all text-left gap-2 group ${
                structure.type === 'SEMESTER' 
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                : "border-border/40 bg-secondary/5 hover:border-border/80"
              }`}
            >
              <span className="font-bold text-lg flex items-center justify-between">
                Semester System
                {structure.type === 'SEMESTER' && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </span>
              <span className="text-xs text-muted-foreground leading-relaxed">Standard university model. Typically two semesters per year.</span>
            </button>

            <button
              onClick={() => setStructure(s => ({ ...s, type: 'YEARLY' }))}
              className={`flex flex-col p-6 rounded-2xl border-2 transition-all text-left gap-2 group ${
                structure.type === 'YEARLY' 
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                : "border-border/40 bg-secondary/5 hover:border-border/80"
              }`}
            >
              <span className="font-bold text-lg flex items-center justify-between">
                Yearly System
                {structure.type === 'YEARLY' && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </span>
              <span className="text-xs text-muted-foreground leading-relaxed">Direct annual progression. Ideal for traditional schooling or long-term programs.</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-secondary/10 border border-border/40 space-y-4">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h4 className="font-bold text-sm">Total {structure.type === 'YEARLY' ? 'Years' : 'Semesters'}</h4>
                   <p className="text-[10px] text-muted-foreground tracking-wide uppercase font-bold">Configurable Cycle Count</p>
                </div>
                <div className="w-24">
                   <input 
                      type="number"
                      min="1"
                      value={structure.totalCycles}
                      onChange={e => setStructure(s => ({ ...s, totalCycles: parseInt(e.target.value) || 1 }))}
                      className="w-full bg-background border border-border/60 rounded-xl py-2 px-3 text-center text-sm font-black focus:ring-2 focus:ring-primary/40 transition-all"
                   />
                </div>
             </div>
             <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
                This defines the maximum number of {structure.type.toLowerCase()}s a student can be enrolled in. 
                For example, a 4-year degree typically spans across 8 cycles in a semester-based model.
             </p>
          </div>
        </section>

        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex-1 mr-4">
            {message && (
              <div className={`flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-left-2 ${
                message.type === 'success' ? "text-emerald-600" : "text-rose-600"
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={loading || (!isChanged && !message)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Architecture
          </button>
        </div>
      </div>
    </div>
  );
}
