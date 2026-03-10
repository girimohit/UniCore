"use client";

import { useState, useRef } from "react";
import {
  UserPlus, Upload, CheckCircle, XCircle,
  Loader2, ChevronDown, Eye, EyeOff, Download, AlertTriangle
} from "lucide-react";

interface FacultyResult {
  name: string;
  employee_number: string;
  identifier: string;
  temp_password: string;
}

interface FacultyError {
  employee_number: string;
  error: string;
}

export default function AdminFacultyPage() {
  const [tab, setTab] = useState<"manual" | "csv">("manual");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FacultyResult[]>([]);
  const [errors, setErrors] = useState<FacultyError[]>([]);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const fileRef = useRef<HTMLInputElement>(null);

  // Manual form state
  const [form, setForm] = useState({ name: "", employee_number: "", email: "", department: "" });

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
      setResults(data.created ?? []);
      setErrors(data.errors ?? []);
      if (data.created?.length > 0) setForm({ name: "", employee_number: "", email: "", department: "" });
    } catch {
      setErrors([{ employee_number: form.employee_number, error: "Network error" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setResults([]);
    setErrors([]);

    const text = await file.text();
    const lines = text.trim().split("\n").filter(Boolean);
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));

    const entries = lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim());
      const obj: any = {};
      headers.forEach((h, i) => { obj[h] = values[i] ?? ""; });
      return obj;
    });

    try {
      const res = await fetch("/api/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
      });
      const data = await res.json();
      setResults(data.created ?? []);
      setErrors(data.errors ?? []);
    } catch {
      setErrors([{ employee_number: "CSV", error: "Upload failed" }]);
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const downloadCSV = () => {
    const header = "Name,Employee Number,Faculty ID,Temp Password";
    const rows = results.map(r => `${r.name},${r.employee_number},${r.identifier},${r.temp_password}`);
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "faculty_credentials.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-display" style={{ color: "var(--text-primary)" }}>Faculty Management</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Add faculty manually or import via CSV. Temporary passwords are auto-generated.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
        {(["manual", "csv"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? "text-white shadow-md" : "opacity-60 hover:opacity-100"}`}
            style={tab === t ? { background: "linear-gradient(135deg, #7c5cbf, #d4608a)" } : { color: "var(--text-primary)" }}
          >
            {t === "manual" ? <><UserPlus className="w-4 h-4 inline -mt-0.5 mr-1.5" />Manual Add</> : <><Upload className="w-4 h-4 inline -mt-0.5 mr-1.5" />CSV Import</>}
          </button>
        ))}
      </div>

      {/* Manual Form */}
      {tab === "manual" && (
        <form onSubmit={handleManualSubmit} className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Add Faculty Member</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Full Name", key: "name", placeholder: "Dr. John Smith", type: "text" },
              { label: "Employee Number", key: "employee_number", placeholder: "EMP001", type: "text" },
              { label: "Email Address", key: "email", placeholder: "john.smith@college.edu", type: "email" },
              { label: "Department (optional)", key: "department", placeholder: "Computer Science", type: "text" },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</label>
                <input
                  type={type}
                  required={key !== "department"}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-transparent border rounded-xl py-3 px-4 text-sm focus:outline-none transition-shadow"
                  style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
                />
              </div>
            ))}
          </div>
          <button type="submit" disabled={loading} className="btn-primary !py-3">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" />Add Faculty</>}
          </button>
        </form>
      )}

      {/* CSV Upload */}
      {tab === "csv" && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>CSV Import</h2>
          <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(124,92,191,0.08)", border: "1px solid rgba(124,92,191,0.2)" }}>
            <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Expected CSV format:</p>
            <code className="text-xs" style={{ color: "var(--text-secondary)" }}>name, employee_number, email, department</code>
          </div>

          <label className="block">
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all hover:border-[#7c5cbf] hover:bg-white/5"
              style={{ borderColor: "var(--border-strong)" }}
            >
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 opacity-60" />
              ) : (
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-40" />
              )}
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {loading ? "Importing..." : "Click to upload a .csv file"}
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Results Panel */}
      {(results.length > 0 || errors.length > 0) && (
        <div className="space-y-4">
          {results.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  {results.length} Faculty Created
                </h3>
                <button onClick={downloadCSV} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-all hover:bg-white/10" style={{ border: "1px solid var(--border-strong)", color: "var(--text-secondary)" }}>
                  <Download className="w-4 h-4" /> Export Credentials
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      {["Name", "Employee No.", "Faculty ID", "Temp Password"].map(h => (
                        <th key={h} className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider opacity-60">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.identifier} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td className="py-3 px-3" style={{ color: "var(--text-primary)" }}>{r.name}</td>
                        <td className="py-3 px-3 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>{r.employee_number}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-[#7c5cbf]">{r.identifier}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-xs" style={{ color: "var(--text-primary)" }}>
                              {showPasswords[r.identifier] ? r.temp_password : "••••••••••"}
                            </code>
                            <button onClick={() => togglePassword(r.identifier)} className="opacity-50 hover:opacity-100 transition-opacity">
                              {showPasswords[r.identifier] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3 flex items-center gap-1.5 opacity-60">
                <AlertTriangle className="w-3.5 h-3.5" />
                Temporary passwords are shown only once. Faculty must reset password on first login.
              </p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold flex items-center gap-2 text-red-500 mb-4">
                <XCircle className="w-5 h-5" />
                {errors.length} Failed
              </h3>
              <div className="space-y-2">
                {errors.map((err, i) => (
                  <div key={i} className="text-sm p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--text-secondary)" }}>
                    <span className="font-mono font-bold" style={{ color: "var(--text-primary)" }}>{err.employee_number}</span>: {err.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
