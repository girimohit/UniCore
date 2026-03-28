"use client";

import { useState } from "react";
import { 
  BookOpen, Plus, Upload, CheckCircle, XCircle, 
  Loader2, Search, Trash2, Pencil, GraduationCap
} from "lucide-react";
import CSVUpload from "@/components/admin/CSVUpload";

interface CourseManagerProps {
  initialCourses: any[];
  departments: { id: string; name: string; code: string }[];
  institutionId: string;
}

export default function CourseManager({ initialCourses, departments }: CourseManagerProps) {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "csv">("list");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    code: "",
    department: "", // Uses name or code for the API as per route implementation
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const res = await fetch("/api/modules/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      if (data.errors && data.errors.length > 0) {
        setErrors(data.errors);
      }
      if (data.created && data.created.length > 0) {
        setResults(data.created);
        setForm({ name: "", code: "", department: "" });
        setActiveTab("list");
      }
    } catch (err) {
      setErrors([{ code: form.code, error: "Network error" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVImport = async (entries: any[]) => {
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const res = await fetch("/api/modules/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
      });
      const data = await res.json();
      setResults(data.created ?? []);
      setErrors(data.errors ?? []);
      // Always switch to list tab to show results/errors feedback
      setActiveTab("list");
    } catch (err) {
      setErrors([{ code: "CSV", error: "Upload failed" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-secondary/10 rounded-2xl w-fit border border-border/40">
        {[
          { id: "list", label: "Overview", icon: Search },
          { id: "add", label: "Add One", icon: Plus },
          { id: "csv", label: "Bulk Import", icon: Upload },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === "add" && (
          <div className="glass rounded-3xl p-8 border border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              Create Course
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Course Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. B.Tech in Computer Science"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Unique Code</label>
                  <input
                    required
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                    placeholder="e.g. BTCSE"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all font-mono uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Parent Department</label>
                  <select
                    required
                    value={form.department}
                    onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.code}>{d.name} ({d.code})</option>)}
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-fit px-8 bg-primary text-primary-foreground font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Create Course</>}
              </button>
            </form>
          </div>
        )}

        {activeTab === "csv" && (
          <div className="glass rounded-3xl p-8 border border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CSVUpload 
              title="Bulk Course Import"
              templateFileName="course_import_template.csv"
              onUpload={handleCSVImport}
              schema={[
                { key: "name", label: "Name", required: true },
                { key: "code", label: "Code", required: true },
                { key: "department", label: "Department", required: true },
              ]}
            />
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-6 animate-in fade-in duration-300">
             {/* Results Summary */}
             {(results.length > 0 || errors.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="text-sm font-bold text-emerald-700">{results.length} Courses Created</p>
                  </div>
                )}
                {errors.length > 0 && (
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <p className="text-sm font-bold text-destructive">{errors.length} Entries Failed</p>
                  </div>
                )}
              </div>
            )}

            <div className="glass rounded-3xl p-12 border border-border/50 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-secondary/10">
                <BookOpen className="w-12 h-12 text-primary opacity-40" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Academic Courses</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Programs and courses offered by the institution.
                </p>
              </div>

              {(results.length > 0 ? results : initialCourses).length > 0 && (
                <div className="w-full max-w-5xl mt-8 overflow-x-auto rounded-2xl border border-border/40">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-secondary/10 border-b border-border/40 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                       <tr>
                         <th className="px-6 py-4">Code</th>
                         <th className="px-6 py-4">Course Name</th>
                         <th className="px-6 py-4">Department</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20">
                       {(results.length > 0 ? results : initialCourses).map((c, i) => (
                         <tr key={i} className="hover:bg-secondary/5 transition-colors">
                           <td className="px-6 py-4 font-mono font-bold text-primary">{c.code}</td>
                           <td className="px-6 py-4 font-medium">{c.name}</td>
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                               <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                                 {c.department?.code || '-'}
                               </span>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-40 hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-primary/10 rounded-lg text-primary"><Pencil className="w-4 h-4" /></button>
                                <button className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
