"use client";

import { useState } from "react";
import { 
  ClipboardCheck, Plus, Search, Trash2, Pencil, Calendar, BookOpen, Layers, 
  Loader2, CheckCircle, XCircle, ChevronDown, BarChart3, ShieldCheck
} from "lucide-react";

interface ExamManagerProps {
  initialExams: {
    id: string;
    name: string;
    examDate: Date | string;
    examType: string;
    maxMarks: number;
    passingMarks: number;
    course?: { name: string };
    subject?: { name: string };
    term?: { name: string };
  }[];
  courses: { id: string; name: string; code: string }[];
  subjects: { id: string; name: string; code: string }[];
  periods: { id: string; name: string }[];
  institutionId: string;
}

const EXAM_TYPES = ["MID_TERM", "FINAL", "QUIZ", "INTERNAL", "PRACTICAL"];

export default function ExamManager({ initialExams, courses, subjects, periods }: ExamManagerProps) {
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [customExamType, setCustomExamType] = useState(false);
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    examDate: "",
    courseId: "",
    subjectId: "",
    termId: "",
    maxMarks: 100,
    passingMarks: 40,
    examType: "REGULAR",
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const res = await fetch("/api/modules/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      if (res.ok) {
        setResults([data]);
        setForm({ 
            name: "", 
            examDate: "", 
            courseId: "", 
            subjectId: "", 
            termId: "",
            maxMarks: 100,
            passingMarks: 40,
            examType: "REGULAR" 
        });
        setActiveTab("list");
      } else {
        setErrors([data.error || "Failed to create exam"]);
      }
    } catch (err) {
      setErrors(["Network error"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-secondary/10 rounded-2xl w-fit border border-border/40">
        {[
          { id: "list", label: "Overview", icon: Search },
          { id: "add", label: "Schedule Exam", icon: Plus },
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
                <ClipboardCheck className="w-5 h-5" />
              </div>
              Schedule New Exam
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Exam Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Mid-Term Examination"
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Date</label>
                  <input
                    required
                    type="date"
                    value={form.examDate}
                    onChange={e => setForm(f => ({ ...f, examDate: e.target.value }))}
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Exam Type</label>
                  <div className="flex gap-2">
                    {!customExamType ? (
                        <select
                            value={form.examType}
                            onChange={e => {
                                if (e.target.value === "CUSTOM") {
                                    setCustomExamType(true);
                                    setForm(f => ({ ...f, examType: "" }));
                                } else {
                                    setForm(f => ({ ...f, examType: e.target.value }));
                                }
                            }}
                            className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer"
                        >
                            <option value="REGULAR">Regular</option>
                            {EXAM_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                            <option value="CUSTOM">+ Custom Type</option>
                        </select>
                    ) : (
                        <div className="flex w-full gap-2">
                            <input
                                autoFocus
                                value={form.examType}
                                onChange={e => setForm(f => ({ ...f, examType: e.target.value.toUpperCase() }))}
                                placeholder="ENTER TYPE"
                                className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                            />
                            <button 
                                type="button"
                                onClick={() => { setCustomExamType(false); setForm(f => ({ ...f, examType: "REGULAR" })); }}
                                className="px-3 rounded-xl bg-secondary/20 hover:bg-secondary/40 text-xs font-bold"
                            >
                                Reset
                            </button>
                        </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Course</label>
                  <select
                    required
                    value={form.courseId}
                    onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Subject</label>
                  <select
                    required
                    value={form.subjectId}
                    onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Academic Term</label>
                  <select
                    required
                    value={form.termId}
                    onChange={e => setForm(f => ({ ...f, termId: e.target.value }))}
                    className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Academic Term</option>
                    {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Max Marks</label>
                  <div className="relative">
                    <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        required
                        type="number"
                        min="0"
                        value={form.maxMarks}
                        onChange={e => setForm(f => ({ ...f, maxMarks: Number(e.target.value) }))}
                        className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Passing Marks</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        required
                        type="number"
                        min="0"
                        value={form.passingMarks}
                        onChange={e => setForm(f => ({ ...f, passingMarks: Number(e.target.value) }))}
                        className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-fit px-8 bg-primary text-primary-foreground font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Schedule Exam</>}
              </button>
            </form>
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-6 animate-in fade-in duration-300">
             {(results.length > 0 || errors.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="text-sm font-bold text-emerald-700">Exam Scheduled Successfully</p>
                  </div>
                )}
                {errors.length > 0 && (
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <p className="text-sm font-bold text-destructive">{errors[0]}</p>
                  </div>
                )}
              </div>
            )}

            <div className="glass rounded-3xl p-6 border border-border/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">Examination Schedule</h3>
                    <p className="text-xs text-muted-foreground">Manage ongoing and upcoming institutional exams.</p>
                </div>
              </div>

              {(results.length > 0 ? results : initialExams).length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-border/40">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-secondary/10 border-b border-border/40 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                       <tr>
                         <th className="px-6 py-4">Exam Details</th>
                         <th className="px-6 py-4">Date & Status</th>
                         <th className="px-6 py-4">Course/Subject</th>
                         <th className="px-6 py-4 text-center">Marks Policy</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20">
                       {(results.length > 0 ? results : initialExams).map((e, i) => (
                         <tr key={i} className="hover:bg-secondary/5 transition-colors group">
                           <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="font-bold text-primary">{e.name}</span>
                                <span className="text-[10px] text-muted-foreground font-mono mt-0.5">{e.examType}</span>
                            </div>
                           </td>
                           <td className="px-6 py-4 font-medium">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  {new Date(e.examDate).toLocaleDateString()}
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary w-fit">
                                    {e.term?.name || '-'}
                                </span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex flex-col gap-1">
                               <span className="text-xs font-bold text-foreground flex items-center gap-1">
                                 <BookOpen className="w-3 h-3 text-amber-500" /> {e.course?.name}
                               </span>
                               <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                 <Layers className="w-3 h-3" /> {e.subject?.name}
                               </span>
                             </div>
                           </td>  
                           <td className="px-6 py-4">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs font-black">{e.maxMarks}</span>
                                    <div className="h-1 w-12 bg-secondary/20 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary" 
                                            style={{ width: `${(e.passingMarks/e.maxMarks)*100}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">Pass: {e.passingMarks}</span>
                                </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-primary/10 rounded-lg text-primary" title="Record Results"><BarChart3 className="w-4 h-4" /></button>
                                <button className="p-2 hover:bg-primary/10 rounded-lg text-primary"><Pencil className="w-4 h-4" /></button>
                                <button className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                    <div className="p-4 rounded-full bg-secondary/10">
                        <ClipboardCheck className="w-12 h-12 text-primary opacity-40" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">No Exams Scheduled</h3>
                        <p className="text-sm text-muted-foreground mt-1">Start by scheduling your first examination.</p>
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
