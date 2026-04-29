"use client";

import { useState } from "react";
import { 
  Building2, Plus, Upload, CheckCircle, XCircle, 
  Loader2, Search, Trash2, Pencil 
} from "lucide-react";
import CSVUpload from "@/components/admin/CSVUpload";

interface DepartmentManagerProps {
  initialDepartments: any[];
  institutionId: string;
}

export default function DepartmentManager({ initialDepartments }: DepartmentManagerProps) {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "csv">("list");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    code: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const departmentList = results.length > 0 ? results : initialDepartments;

  const filteredDepartments = departmentList.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const method = editingId ? "PATCH" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;

      const res = await fetch("/api/modules/departments", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (data.error) {
        setErrors([{ code: form.code, error: data.error }]);
      } else if (data.errors && data.errors.length > 0) {
        setErrors(data.errors);
      } else {
        // Refresh or update local state
        if (editingId) {
          // Success edit
          setEditingId(null);
          setForm({ name: "", code: "" });
          // In a real app we'd refresh from server or update initialDepartments
          window.location.reload(); 
        } else if (data.created && data.created.length > 0) {
          setResults(data.created);
          setForm({ name: "", code: "" });
          setActiveTab("list");
        }
      }
    } catch (err) {
      setErrors([{ code: form.code, error: "Network error" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/modules/departments?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  const startEdit = (dept: any) => {
    setEditingId(dept.id);
    setForm({ name: dept.name, code: dept.code });
    setActiveTab("add");
  };

  const handleCSVImport = async (entries: any[]) => {
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const res = await fetch("/api/modules/departments", {
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
                <Building2 className="w-5 h-5" />
              </div>
              {editingId ? "Edit Department" : "Create Department"}
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Department Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Unique Code</label>
                  <input
                    required
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                    placeholder="e.g. CSE"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all font-mono uppercase"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-fit px-8 bg-primary text-primary-foreground font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    editingId ? <><CheckCircle className="w-4 h-4" /> Save Changes</> : <><Plus className="w-4 h-4" /> Create Department</>
                  )}
                </button>
                {editingId && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ name: "", code: "" });
                      setActiveTab("list");
                    }}
                    className="w-fit px-8 bg-secondary/20 text-foreground font-bold text-sm py-3 rounded-xl hover:bg-secondary/30 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === "csv" && (
          <div className="glass rounded-3xl p-8 border border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CSVUpload 
              title="Bulk Department Import"
              templateFileName="department_import_template.csv"
              onUpload={handleCSVImport}
              schema={[
                { key: "name", label: "Name", required: true },
                { key: "code", label: "Code", required: true },
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
                        <p className="text-sm font-bold text-emerald-700">{results.length} Departments Created</p>
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
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-secondary/5 border border-border/40 p-2 rounded-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text"
                    placeholder="Search by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-none py-2.5 pl-11 pr-4 text-sm focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 border-l border-border/40">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {departmentList.length} Total Departments
                  </span>
                </div>
              </div>

              {filteredDepartments.length > 0 ? (
                <div className="glass rounded-3xl border border-border/50 overflow-hidden">
                   <table className="w-full text-sm text-left border-collapse">
                     <thead>
                       <tr className="bg-secondary/10 border-b border-border/40 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                         <th className="px-6 py-4">Code</th>
                         <th className="px-6 py-4">Department Name</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20">
                       {filteredDepartments.map((d, i) => (
                         <tr key={i} className="hover:bg-secondary/5 transition-colors group">
                           <td className="px-6 py-4 font-mono font-bold text-primary">{d.code}</td>
                           <td className="px-6 py-4 font-medium">{d.name}</td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-40 hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => startEdit(d)}
                                  className="p-2 hover:bg-primary/10 rounded-lg text-primary"
                                  title="Edit Department"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirm(d.id)}
                                  className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"
                                  title="Delete Department"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              ) : (
                <div className="glass rounded-3xl p-12 border border-border/50 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-secondary/10">
                    <Building2 className="w-12 h-12 text-primary opacity-40" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">No Departments Found</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      {searchTerm ? "No departments match your search." : "No departments registered yet."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
