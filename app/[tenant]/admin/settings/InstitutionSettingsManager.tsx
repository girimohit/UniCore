"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface SettingsManagerProps {
  initialSettings: {
    academic_system: 'SEMESTER' | 'ANNUAL';
  };
}

export default function InstitutionSettingsManager({ initialSettings }: SettingsManagerProps) {
  const [academicSystem, setAcademicSystem] = useState(initialSettings.academic_system);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/institutions/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ academic_system: academicSystem }),
      });

      if (!res.ok) throw new Error("Failed to update settings");

      setMessage({ type: 'success', text: "Settings updated successfully! Terminology across the dashboard will now reflect your choice." });
      
      // Optional: Force a refresh after a short delay to update navigation/etc if needed
      // setTimeout(() => window.location.reload(), 1500);
      
    } catch (err) {
      setMessage({ type: 'error', text: "An error occurred while saving settings." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="glass rounded-3xl p-8 border border-border/50 space-y-8">
        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-foreground">Academic Structure</h3>
            <p className="text-sm text-muted-foreground">Select the primary system followed by your institution for organization and grading.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setAcademicSystem('SEMESTER')}
              className={`flex flex-col p-6 rounded-2xl border-2 transition-all text-left gap-2 ${
                academicSystem === 'SEMESTER' 
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                : "border-border/40 bg-secondary/5 hover:border-border/80"
              }`}
            >
              <span className="font-bold text-base">Semester System</span>
              <span className="text-xs text-muted-foreground leading-relaxed">Divides the academic year into two equal halves. Uses "Semester 1", "Semester 2", etc.</span>
            </button>

            <button
              onClick={() => setAcademicSystem('ANNUAL')}
              className={`flex flex-col p-6 rounded-2xl border-2 transition-all text-left gap-2 ${
                academicSystem === 'ANNUAL' 
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                : "border-border/40 bg-secondary/5 hover:border-border/80"
              }`}
            >
              <span className="font-bold text-base">Annual Year System</span>
              <span className="text-xs text-muted-foreground leading-relaxed">One continuous academic cycle per year. Uses "Year 1", "Year 2", etc.</span>
            </button>
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
            disabled={loading || academicSystem === initialSettings.academic_system && !message}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
