"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Bookmark,
  Plus,
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Trash2,
  Pencil,
  GraduationCap,
  Calendar,
  UserPlus,
} from "lucide-react";
import CSVUpload from "@/components/admin/CSVUpload";
import { getAcademicLabel, formatCycleLabel } from "@/lib/utils/academic";

interface SubjectManagerProps {
  initialSubjects: any[];
  courses: { id: string; name: string; code: string }[];
  faculty: {
    id: string;
    name: string;
    username: string;
    faculty: { departmentId: string | null } | null;
  }[];
  institutionId: string;
  academicSystem: any;
}

export default function SubjectManager({
  initialSubjects,
  courses,
  faculty,
  academicSystem,
}: SubjectManagerProps) {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "csv">("list");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [assigningSubject, setAssigningSubject] = useState<any | null>(null);
  const [assigningLoading, setAssigningLoading] = useState(false);
  const [assigningResponsibility, setAssigningResponsibility] = useState('THEORY');
  const [subjects, setSubjects] = useState<any[]>(initialSubjects);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const academic = getAcademicLabel(academicSystem);

  // Form state
  const [form, setForm] = useState({
    name: "",
    code: "",
    course: "", // Uses name or code for the API
    academicCycle: "1",
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const url = "/api/modules/subjects";
      const method = editingId ? "PATCH" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;

      // Map course code to courseId for PATCH if needed,
      // but the API currently handles 'course' string for POST.
      // Let's ensure the API or our body handles this correctly.
      // For PATCH, we added 'courseId' support.
      if (editingId) {
        const courseObj = courses.find(
          (c) => c.code === form.course || c.id === form.course,
        );
        (body as any).courseId = courseObj?.id;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.error || (data.errors && data.errors.length > 0)) {
        setErrors(data.errors || [{ error: data.error }]);
      } else {
        // Success
        if (editingId) {
          setResults([data.subject]);
          setSubjects((prev) => prev.map((s) => (s.id === editingId ? data.subject : s)));
          setEditingId(null);
        } else {
          const created = data.created || [];
          setResults(created);
          setSubjects((prev) => [...created, ...prev]);
        }
        setForm({ name: "", code: "", course: "", academicCycle: "1" });
        setActiveTab("list");
      }
    } catch (err) {
      setErrors([{ code: form.code, error: "Network error" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject: any) => {
    setEditingId(subject.id);
    setForm({
      name: subject.name,
      code: subject.code,
      course: subject.course?.code || subject.courseId,
      academicCycle: String(subject.academicCycle || 1),
    });
    setActiveTab("add");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/modules/subjects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        // Simple way: just clear results or re-fetch.
        // For now, let's just clear the results to show it's gone if it was just added.
        setResults((prev) => prev.filter((s) => s.id !== id));
        // Note: initialSubjects won't be updated without a refresh or parent state update.
      }
    } catch (err) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCSVImport = async (entries: any[]) => {
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const res = await fetch("/api/modules/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
      });
      const data = await res.json();
      setResults(data.created ?? []);
      setErrors(data.errors ?? []);
    } catch (err) {
      setErrors([{ code: "CSV", error: "Upload failed" }]);
    } finally {
      // Always switch to list tab to show results/errors summary
      setActiveTab("list");
      setLoading(false);
    }
  };

  const handleAssignFaculty = async (facultyId: string) => {
    if (!assigningSubject) return;
    setAssigningLoading(true);
    try {
      const res = await fetch("/api/modules/subjects/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: assigningSubject.id,
          facultyId,
          responsibility: assigningResponsibility || 'THEORY',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const updatedSubjects = subjects.map((s) => {
          if (s.id === assigningSubject.id) {
            const facultyMember = faculty.find((f) => f.id === facultyId);
            return {
              ...s,
              facultyAssignments: [
                ...(s.facultyAssignments || []),
                { 
                  faculty: { ...facultyMember, user: facultyMember },
                  responsibility: assigningResponsibility,
                },
              ],
            };
          }
          return s;
        });
        setSubjects(updatedSubjects);
        setAssigningResponsibility('THEORY');
        setAssigningSubject(null);
      }
    } catch (err) {
      alert("Assignment failed");
    } finally {
      setAssigningLoading(false);
    }
  };

  const handleRemoveAssignment = async (subjectId: string, facultyUserId: string) => {
    if (!confirm("Remove this faculty assignment?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/modules/subjects/assign?subjectId=${subjectId}&facultyId=${facultyUserId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubjects((prev) =>
          prev.map((s) => {
            if (s.id === subjectId) {
              return {
                ...s,
                facultyAssignments: s.facultyAssignments.filter((t: any) => t.faculty.user.id !== facultyUserId),
              };
            }
            return s;
          })
        );
      }
    } catch (err) {
      alert("Removal failed");
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
                {editingId ? (
                  <Pencil className="w-5 h-5" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </div>
              {editingId ? "Edit Subject" : "Create Subject"}
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">
                    Subject Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Data Structures & Algorithms"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">
                    Unique Code
                  </label>
                  <input
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, code: e.target.value }))
                    }
                    placeholder="e.g. CS201"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all font-mono uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">
                    Underlying Course
                  </label>
                  <select
                    required
                    value={form.course}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, course: e.target.value }))
                    }
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">
                    {academic.label} (Cycle)
                  </label>
                  <select
                    required
                    value={form.academicCycle}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, academicCycle: e.target.value }))
                    }
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer"
                  >
                    {Array.from(
                      { length: academic.totalCycles },
                      (_, i) => i + 1,
                    ).map((num) => (
                      <option key={num} value={num}>
                        {academic.label} {num}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted-foreground ml-1 italic">
                    Mapping this subject to a specific{" "}
                    {academic.label.toLowerCase()}.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-fit px-8 bg-primary text-primary-foreground font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />{" "}
                      {editingId ? "Save Changes" : "Create Subject"}
                    </>
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({
                        name: "",
                        code: "",
                        course: "",
                        academicCycle: "1",
                      });
                      setActiveTab("list");
                    }}
                    className="px-8 bg-secondary/20 text-foreground font-bold text-sm py-3 rounded-xl hover:bg-secondary/30 transition-all"
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
              title="Bulk Subject Import"
              templateFileName="subject_import_template.csv"
              onUpload={handleCSVImport}
              schema={[
                { key: "name", label: "Name", required: true },
                { key: "code", label: "Code", required: true },
                { key: "course", label: "Course", required: true },
                { key: "academicCycle", label: academic.label, required: true },
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
                    <p className="text-sm font-bold text-emerald-700">
                      {results.length} Subjects Created
                    </p>
                  </div>
                )}
                {errors.length > 0 && (
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <p className="text-sm font-bold text-destructive">
                      {errors.length} Entries Failed
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="glass rounded-3xl p-12 border border-border/50 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-secondary/10">
                <Bookmark className="w-12 h-12 text-primary opacity-40" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Academic Subjects</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Course subjects and curriculum items.
                </p>
              </div>

              {(results.length > 0 ? results : subjects).length > 0 && (
                <div className="w-full max-w-6xl mt-8 overflow-x-auto rounded-2xl border border-border/40">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/10 border-b border-border/40 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Code</th>
                        <th className="px-6 py-4">Subject Name</th>
                        <th className="px-6 py-4">Course</th>
                        <th className="px-6 py-4">{academic.label}</th>
                        <th className="px-6 py-4">Faculty Assigned</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {(results.length > 0 ? results : subjects).map(
                        (s, i) => (
                          <tr
                            key={i}
                            className="hover:bg-secondary/5 transition-colors"
                          >
                            <td className="px-6 py-4 font-mono font-bold text-primary">
                              {s.code}
                            </td>
                            <td className="px-6 py-4 font-medium">{s.name}</td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">
                                {s.course?.code || "-"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              {s.academicCycle ? formatCycleLabel(academic.type, s.academicCycle) : "-"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-2">
                                {s.facultyAssignments?.length > 0 ? (
                                  s.facultyAssignments.map((t: any) => (
                                    <div
                                      key={t.faculty.user.id}
                                      className="flex items-center gap-2 group/tag px-2 py-1 rounded-lg bg-primary/5 border border-primary/10"
                                    >
                                      <span className="text-[10px] font-bold text-primary">
                                        {t.faculty.user.name}
                                      </span>
                                      <button
                                        onClick={() => handleRemoveAssignment(s.id, t.faculty.user.id)}
                                        className="opacity-0 group-hover/tag:opacity-100 transition-opacity text-destructive"
                                      >
                                        <XCircle className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-muted-foreground italic">
                                    Not assigned
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-40 hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setAssigningSubject(s)}
                                  title="Assign Faculty"
                                  className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-600 transition-colors"
                                >
                                  <UserPlus className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(s)}
                                  className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(s.id)}
                                  className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {assigningSubject && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass w-full max-w-md p-8 border border-border/50 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">Assign Faculty</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Assigning to <span className="text-primary font-bold">{assigningSubject.name}</span>
                </p>
              </div>
              <button
                onClick={() => setAssigningSubject(null)}
                className="p-2 hover:bg-secondary/20 rounded-xl transition-colors"
              >
                <XCircle className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Responsibility Picker */}
            <div className="mb-4 space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Teaching Responsibility</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['THEORY', 'LAB', 'TUTORIAL'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAssigningResponsibility(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      assigningResponsibility === r
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary/10 text-muted-foreground hover:bg-secondary/20'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="e.g. THEORY, LAB, or Viva / Mon+Wed slots..."
                value={assigningResponsibility}
                onChange={(e) => setAssigningResponsibility(e.target.value)}
                className="w-full bg-secondary/5 border border-border/60 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {(() => {
                const filteredFaculty = faculty.filter(
                  (f) =>
                    f.faculty?.departmentId ===
                    assigningSubject.course?.departmentId
                );

                if (filteredFaculty.length === 0) {
                  return (
                    <div className="p-8 text-center bg-secondary/5 rounded-2xl border border-dashed border-border/60">
                      <p className="text-sm text-muted-foreground italic">
                        No faculty found in the same department (
                        <span className="font-bold text-foreground">
                          {assigningSubject.course?.department?.name ||
                            "this department"}
                        </span>
                        ).
                      </p>
                    </div>
                  );
                }

                return filteredFaculty.map((f) => {
                  const isAssigned = assigningSubject.facultyAssignments?.some(
                    (t: any) => t.faculty.user.id === f.id
                  );
                  return (
                    <button
                      key={f.id}
                      disabled={isAssigned || assigningLoading}
                      onClick={() => handleAssignFaculty(f.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        isAssigned
                          ? "bg-emerald-500/5 border-emerald-500/20 opacity-60"
                          : "bg-secondary/5 border-border/40 hover:border-primary/40 hover:bg-secondary/10"
                      }`}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-bold">{f.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {f.username}
                        </span>
                      </div>
                      {isAssigned ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Plus className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  );
                });
              })()}
            </div>

            <div className="mt-8">
              <button
                onClick={() => setAssigningSubject(null)}
                className="w-full py-3 bg-secondary/10 hover:bg-secondary/20 text-foreground font-bold text-sm rounded-xl transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
