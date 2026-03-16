"use client";

import { useState } from "react";
import { 
  UserPlus, Upload, CheckCircle, XCircle, 
  Loader2, Eye, EyeOff, Search, Trash2, 
  Filter, Download, ChevronRight, GraduationCap
} from "lucide-react";
import CSVUpload from "@/components/admin/CSVUpload";

interface StudentManagerProps {
  courses: { id: string; name: string }[];
  tenantId: string;
}

export default function StudentManager({ courses }: StudentManagerProps) {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "csv">("list");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    roll_number: "",
    email: "",
    course: "", // name for the API
    semester: ""
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const res = await fetch("/api/students", {
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
        setForm({ name: "", roll_number: "", email: "", course: "", semester: "" });
        setActiveTab("list"); // Switch to list if successful
      }
    } catch (err) {
      setErrors([{ roll_number: form.roll_number, error: "Network error" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVImport = async (entries: any[]) => {
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
      });
      const data = await res.json();
      setResults(data.created ?? []);
      setErrors(data.errors ?? []);
      if (data.created?.length > 0) {
        setActiveTab("list");
      }
    } catch (err) {
      setErrors([{ roll_number: "CSV", error: "Upload failed" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-secondary/10 rounded-2xl w-fit border border-border/40">
        {[
          { id: "list", label: "Overview", icon: Search },
          { id: "add", label: "Direct Add", icon: UserPlus },
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
                <UserPlus className="w-5 h-5" />
              </div>
              Register New Student
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. John Doe"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Roll Number / Identifier</label>
                  <input
                    required
                    value={form.roll_number}
                    onChange={e => setForm(f => ({ ...f, roll_number: e.target.value }))}
                    placeholder="e.g. 2023CS001"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Course</label>
                  <select
                    required
                    value={form.course}
                    onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a Course</option>
                    {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Semester</label>
                  <input
                    type="number"
                    value={form.semester}
                    onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}
                    placeholder="e.g. 1"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-fit px-8 bg-primary text-primary-foreground font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Register Student</>}
              </button>
            </form>
          </div>
        )}

        {activeTab === "csv" && (
          <div className="glass rounded-3xl p-8 border border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CSVUpload 
              title="Bulk Student Import"
              templateFileName="student_import_template.csv"
              onUpload={handleCSVImport}
              schema={[
                { key: "name", label: "Name", required: true },
                { key: "roll_number", label: "Roll Number", required: true },
                { key: "email", label: "Email", required: true },
                { key: "course", label: "Course", required: true },
                { key: "semester", label: "Semester" },
              ]}
            />
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Results/Errors Summary */}
            {(results.length > 0 || errors.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-700">{results.length} Students Created</p>
                        <p className="text-xs text-emerald-600/80">Activation links generated</p>
                      </div>
                    </div>
                  </div>
                )}
                {errors.length > 0 && (
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-destructive/20 text-destructive">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-destructive">{errors.length} Entries Failed</p>
                        <p className="text-xs text-destructive/80">Check details below</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Placeholder for list/stats */}
            <div className="glass rounded-3xl p-12 border border-border/50 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-secondary/10">
                <GraduationCap className="w-12 h-12 text-primary opacity-40" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Manage Students</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Search, filter, and manage your student population. Currently showing success/error status of recent actions.
                </p>
              </div>
              {results.length > 0 && (
                <div className="w-full max-w-2xl mt-8 overflow-x-auto rounded-2xl border border-border/40">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-secondary/10 border-b border-border/40">
                       <tr>
                         <th className="px-4 py-3 font-bold">Roll No.</th>
                         <th className="px-4 py-3 font-bold">Name</th>
                         <th className="px-4 py-3 font-bold">Email</th>
                         <th className="px-4 py-3 font-bold">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20">
                       {results.map((r, i) => (
                         <tr key={i} className="hover:bg-secondary/5 transition-colors">
                           <td className="px-4 py-3 font-mono font-bold text-primary">{r.roll_number}</td>
                           <td className="px-4 py-3">{r.name}</td>
                           <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                           <td className="px-4 py-3">
                              <button className="text-primary hover:underline text-xs font-bold">View Invite</button>
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
