"use client";

import { useState, useEffect } from "react";
import { 
  UserPlus, Upload, CheckCircle, XCircle, 
  Loader2, Search, GraduationCap, Pencil, X, BookOpen
} from "lucide-react";
import CSVUpload from "@/components/admin/CSVUpload";
import { getAcademicLabel, formatCycleLabel, AcademicSystem } from "@/lib/utils/academic";

interface StudentManagerProps {
  courses: { id: string; name: string }[];
  tenantId: string;
  academicSystem: AcademicSystem;
}

interface Student {
  id: string;
  identifier: string;
  email: string | null;
  status: string;
  roll_number: string;
  semester: number | null;
  course: string | null;
}

export default function StudentManager({ courses, academicSystem }: StudentManagerProps) {
  const academic = getAcademicLabel(academicSystem);
  const [activeTab, setActiveTab] = useState<"list" | "add" | "csv">("list");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);

  // Student list
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Enroll modal
  const [enrollTarget, setEnrollTarget] = useState<Student | null>(null);
  const [enrollForm, setEnrollForm] = useState({ courseId: "", semester: "" });
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    roll_number: "",
    email: "",
    course: "",
    semester: ""
  });

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data.students ?? []);
    } catch {
      // silently fail — table will show empty
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "list") fetchStudents();
  }, [activeTab]);

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
      if (data.errors?.length > 0) setErrors(data.errors);
      if (data.created?.length > 0) {
        setResults(data.created);
        setForm({ name: "", roll_number: "", email: "", course: "", semester: "" });
        setActiveTab("list");
      }
    } catch {
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
      if (data.created?.length > 0) setActiveTab("list");
    } catch {
      setErrors([{ roll_number: "CSV", error: "Upload failed" }]);
    } finally {
      setLoading(false);
    }
  };

  const openEnroll = (student: Student) => {
    const matchedCourse = courses.find(c => c.name === student.course);
    setEnrollTarget(student);
    setEnrollForm({
      courseId: matchedCourse?.id ?? "",
      semester: student.semester ? String(student.semester) : "",
    });
    setEnrollError("");
    setEnrollSuccess("");
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollTarget) return;
    setEnrollLoading(true);
    setEnrollError("");
    setEnrollSuccess("");
    try {
      const res = await fetch("/api/students/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: enrollTarget.id,
          courseId: enrollForm.courseId,
          semester: parseInt(enrollForm.semester),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollSuccess("Enrollment updated successfully.");
        // Refresh list after 800ms and close
        setTimeout(() => {
          setEnrollTarget(null);
          fetchStudents();
        }, 800);
      } else {
        setEnrollError(data.error || "Failed to update enrollment.");
      }
    } catch {
      setEnrollError("Network error.");
    } finally {
      setEnrollLoading(false);
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
        {/* ADD TAB */}
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
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. John Doe" className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Roll Number / Identifier</label>
                  <input required value={form.roll_number} onChange={e => setForm(f => ({ ...f, roll_number: e.target.value }))} placeholder="e.g. 2023CS001" className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Email Address</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Course</label>
                  <select value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer">
                    <option value="">Select a Course</option>
                    {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">{academic.label}</label>
                  <select
                    value={form.semester}
                    onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select {academic.label}</option>
                    {Array.from({ length: academic.totalCycles }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {formatCycleLabel(academic.type, num)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-fit px-8 bg-primary text-primary-foreground font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Register Student</>}
              </button>
            </form>
          </div>
        )}

        {/* CSV TAB */}
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
                { key: "semester", label: academic.label },
              ]}
            />
          </div>
        )}

        {/* LIST TAB */}
        {activeTab === "list" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Results/Errors after add */}
            {(results.length > 0 || errors.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="text-sm font-bold text-emerald-700">{results.length} Students Created</p>
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

            <div className="glass rounded-3xl border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">All Students</h3>
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{students.length}</span>
                </div>
              </div>

              {studentsLoading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading students...
                </div>
              ) : students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                  <GraduationCap className="w-10 h-10 text-primary opacity-30" />
                  <p className="text-sm text-muted-foreground font-medium">No students yet. Add one above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/10 text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-b border-border/40">
                      <tr>
                        <th className="px-6 py-4">Name / ID</th>
                        <th className="px-6 py-4">Roll Number</th>
                        <th className="px-6 py-4">Course</th>
                        <th className="px-6 py-4">{academic.label}</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {students.map(s => (
                        <tr key={s.id} className="hover:bg-secondary/5 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="font-bold text-foreground">{s.identifier}</p>
                            <p className="text-xs text-muted-foreground">{s.email ?? '—'}</p>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-primary">{s.roll_number ?? '—'}</td>
                          <td className="px-6 py-4">
                            {s.course ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-amber-500/10 text-amber-700">
                                <BookOpen className="w-3 h-3" /> {s.course}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Not assigned</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {s.semester != null ? (
                              <span className="text-sm font-bold">{formatCycleLabel(academic.type, s.semester)}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openEnroll(s)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                              <Pencil className="w-3 h-3" /> Enroll
                            </button>
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

      {/* Enrollment Modal */}
      {enrollTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-border/50 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-foreground">Assign Enrollment</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  <span className="font-bold text-primary">{enrollTarget.identifier}</span> · {enrollTarget.roll_number}
                </p>
              </div>
              <button
                onClick={() => setEnrollTarget(null)}
                className="p-2 rounded-xl hover:bg-secondary/20 text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Course</label>
                <select
                  required
                  value={enrollForm.courseId}
                  onChange={e => setEnrollForm(f => ({ ...f, courseId: e.target.value }))}
                  className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">{academic.label}</label>
                <select
                  required
                  value={enrollForm.semester}
                  onChange={e => setEnrollForm(f => ({ ...f, semester: e.target.value }))}
                  className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select {academic.label}</option>
                  {Array.from({ length: academic.totalCycles }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {formatCycleLabel(academic.type, num)}
                    </option>
                  ))}
                </select>
              </div>

              {enrollError && (
                <p className="text-xs font-semibold text-destructive bg-destructive/10 rounded-xl px-4 py-2">{enrollError}</p>
              )}
              {enrollSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 rounded-xl px-4 py-2">
                  <CheckCircle className="w-4 h-4" />
                  <p className="text-xs font-semibold">{enrollSuccess}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEnrollTarget(null)}
                  className="flex-1 py-3 rounded-xl border border-border/60 text-sm font-bold text-muted-foreground hover:bg-secondary/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrollLoading}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {enrollLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Enrollment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
