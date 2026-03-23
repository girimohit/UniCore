"use client";

import { useState } from "react";
import { 
  UserPlus, Upload, CheckCircle, XCircle, 
  Loader2, Eye, EyeOff, Search, GraduationCap,
  Download, FileText, Check, AlertCircle
} from "lucide-react";
import CSVUpload from "@/components/admin/CSVUpload";

interface FacultyManagerProps {
  departments: { id: string; name: string }[];
  tenantId: string;
}

export default function FacultyManager({ departments }: FacultyManagerProps) {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "csv">("list");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  // Form state
  const [form, setForm] = useState({
    name: "",
    employee_number: "",
    email: "",
    department: "",
  });

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const res = await fetch("/api/faculty", {
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
        setForm({ name: "", employee_number: "", email: "", department: "" });
        setActiveTab("list");
      }
    } catch (err) {
      setErrors([{ employee_number: form.employee_number, error: "Network error" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVImport = async (entries: any[]) => {
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const res = await fetch("/api/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
      });
      const data = await res.json();
      setResults(data.created ?? []);
      setErrors(data.errors ?? []);
      // Always switch to list tab to show results/errors summary
      setActiveTab("list");
    } catch (err) {
      setErrors([{ employee_number: "CSV", error: "Upload failed" }]);
    } finally {
      setLoading(false);
    }
  };

  const downloadCredentials = () => {
    const header = "Name,Employee Number,Faculty ID,Temp Password";
    const rows = results.map(r => `${r.name},${r.employee_number},${r.identifier},${r.temp_password}`);
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "faculty_credentials.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
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
              Register New Faculty
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Dr. John Smith"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Employee Number</label>
                  <input
                    required
                    value={form.employee_number}
                    onChange={e => setForm(f => ({ ...f, employee_number: e.target.value }))}
                    placeholder="e.g. EMP001"
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
                    placeholder="john@college.edu"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Department</label>
                  <select
                    required
                    value={form.department}
                    onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a Department</option>
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-fit px-8 bg-primary text-primary-foreground font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Add Faculty</>}
              </button>
            </form>
          </div>
        )}

        {activeTab === "csv" && (
          <div className="glass rounded-3xl p-8 border border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CSVUpload 
              title="Bulk Faculty Import"
              templateFileName="faculty_import_template.csv"
              onUpload={handleCSVImport}
              schema={[
                { key: "name", label: "Name", required: true },
                { key: "employee_number", label: "Employee Number", required: true },
                { key: "email", label: "Email", required: true },
                { key: "department", label: "Department", required: true },
              ]}
            />
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-6 animate-in fade-in duration-300">
             {/* Results Summary */}
             {results.length > 0 && (
                <div className="p-6 glass rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                      {results.length} Faculty Created
                    </h3>
                    <button 
                      onClick={downloadCredentials}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                    >
                      <Download className="w-4 h-4" /> Export Credentials
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-emerald-500/10">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-emerald-500/10">
                        <tr>
                          <th className="px-3 py-2">ID</th>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Temp Password</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map(r => (
                          <tr key={r.identifier} className="border-b border-emerald-500/10">
                            <td className="px-3 py-2 font-mono font-bold">{r.identifier}</td>
                            <td className="px-3 py-2">{r.name}</td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <code className="font-mono">{showPasswords[r.identifier] ? r.temp_password : "••••••••••"}</code>
                                <button onClick={() => togglePassword(r.identifier)} className="opacity-40 hover:opacity-100">
                                  {showPasswords[r.identifier] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
             )}

             {errors.length > 0 && (
                <div className="p-6 glass rounded-2xl border border-destructive/20 bg-destructive/5">
                   <h3 className="font-bold flex items-center gap-2 text-destructive mb-4">
                     <XCircle className="w-5 h-5" /> {errors.length} Errors Encountered
                   </h3>
                   <div className="space-y-2">
                      {errors.map((err, i) => (
                        <div key={i} className="text-xs p-3 rounded-lg bg-destructive/10 text-destructive/80 font-medium">
                          <span className="font-bold">{err.employee_number}</span>: {err.error}
                        </div>
                      ))}
                   </div>
                </div>
             )}

            <div className="glass rounded-3xl p-12 border border-border/50 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-secondary/10">
                <GraduationCap className="w-12 h-12 text-primary opacity-40" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Faculty Management</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Add faculty members and manage their accounts. Temporary passwords will be generated for new members.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
