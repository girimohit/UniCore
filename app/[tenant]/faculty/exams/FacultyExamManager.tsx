"use client";

import { useState } from "react";
import { 
  ClipboardCheck, Search, Calendar, BookOpen, Layers, 
  Loader2, XCircle, BarChart3, ArrowLeft, Save
} from "lucide-react";

interface FacultyExamManagerProps {
  initialExams: {
    id: string;
    name: string;
    examDate: Date | string;
    examType: string;
    maxMarks: number;
    passingMarks: number;
    courseId: string;
    course?: { name: string };
    subject?: { name: string };
    term?: { name: string };
    resultStatus?: string;
  }[];
  subjects: { id: string; name: string; code: string; courseId: string; courseName: string }[];
  periods: { id: string; name: string }[];
  institutionId: string;
}

export default function FacultyExamManager({ initialExams, subjects, periods }: FacultyExamManagerProps) {
  const [activeTab, setActiveTab] = useState<"list" | "results">("list");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Results Entry State
  const [selectedExam, setSelectedExam] = useState<FacultyExamManagerProps['initialExams'][0] | null>(null);
  const [students, setStudents] = useState<{id: string; studentId: string; name: string; rollNumber: string}[]>([]);
  const [marks, setMarks] = useState<Record<string, { obtainedMarks: number; teacherRemarks: string }>>({});

  const openResultsEntry = async (exam: FacultyExamManagerProps['initialExams'][0]) => {
    setSelectedExam(exam);
    setActiveTab("results");
    setLoading(true);
    setErrors([]);

    try {
      const studentRes = await fetch(`/api/modules/students?courseId=${exam.courseId}`);
      const studentData = await studentRes.json();
      
      const resultsRes = await fetch(`/api/modules/exams/results?examId=${exam.id}`);
      const resultsData = await resultsRes.json();

      if (studentRes.ok && resultsRes.ok) {
        setStudents(studentData.students);
        
        const initialMarks: Record<string, { obtainedMarks: number; teacherRemarks: string }> = {};
        studentData.students.forEach((s: { studentId: string }) => {
            if (!s.studentId) return; // Skip if user doesn't have a student profile
            const existing = resultsData.results.find((r: any) => r.studentId === s.studentId);
            initialMarks[s.studentId] = {
                obtainedMarks: existing ? existing.obtainedMarks : 0,
                teacherRemarks: existing ? existing.teacherRemarks || "" : ""
            };
        });
        setMarks(initialMarks);
      } else {
        setErrors(["Failed to load students or results"]);
      }
    } catch (err) {
      setErrors(["Network error"]);
    } finally {
      setLoading(false);
    }
  };

  const saveResults = async () => {
    if (!selectedExam) return;
    setLoading(true);
    setErrors([]);
    try {
      const payload = {
        examId: selectedExam.id,
        results: Object.entries(marks).map(([studentId, data]) => ({
            studentId,
            ...data
        }))
      };

      const res = await fetch("/api/modules/exams/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        // Just save local state, don't exit if we want to submit after
        return true;
      } else {
        setErrors([data.error || "Failed to save results"]);
        return false;
      }
    } catch (err) {
        setErrors(["Network error"]);
        return false;
    } finally {
      setLoading(false);
    }
  };

  const submitExam = async () => {
    if (!selectedExam) return;
    const confirmed = confirm("Are you sure you want to submit these marks for approval? You will not be able to edit them once submitted.");
    if (!confirmed) return;

    const saved = await saveResults();
    if (!saved) return;

    setLoading(true);
    try {
        const res = await fetch(`/api/modules/exams/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                examId: selectedExam.id, 
                status: "SUBMITTED" 
            }),
        });

        if (res.ok) {
            alert("Results submitted for approval successfully!");
            setActiveTab("list");
            window.location.reload(); // Refresh to update status in list
        } else {
            const data = await res.json();
            setErrors([data.error || "Failed to submit for approval"]);
        }
    } catch (err) {
        setErrors(["Network error"]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-8">
        {activeTab === "list" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="glass rounded-3xl p-6 border border-border/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">Assigned Subject Exams</h3>
                    <p className="text-xs text-muted-foreground">Exams for subjects you are currently teaching.</p>
                </div>
              </div>

              {initialExams.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-border/40">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-secondary/10 border-b border-border/40 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                       <tr>
                         <th className="px-6 py-4">Exam Name</th>
                         <th className="px-6 py-4">Date</th>
                         <th className="px-6 py-4">Course/Subject</th>
                         <th className="px-6 py-4 text-center">Marks Policy</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20">
                       {initialExams.map((e, i) => (
                         <tr key={i} className="hover:bg-secondary/5 transition-colors group">
                           <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="font-bold text-primary">{e.name}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-muted-foreground font-mono">{e.examType}</span>
                                    {e.resultStatus === 'SUBMITTED' && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold tracking-wider">PENDING APPROVAL</span>
                                    )}
                                    {e.resultStatus === 'PUBLISHED' && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold tracking-wider">PUBLISHED</span>
                                    )}
                                    {(!e.resultStatus || e.resultStatus === 'DRAFT') && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-bold tracking-wider">DRAFT</span>
                                    )}
                                </div>
                            </div>
                           </td>
                           <td className="px-6 py-4 font-medium">
                              <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  {new Date(e.examDate).toLocaleDateString()}
                                </span>
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
                                <button 
                                    onClick={() => openResultsEntry(e)}
                                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-primary/20 flex items-center gap-2 ml-auto"
                                >
                                    <BarChart3 className="w-3.5 h-3.5" /> {(e.resultStatus === 'PUBLISHED' || e.resultStatus === 'SUBMITTED') ? "View Results" : "Record Marks"}
                                </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                    <div className="p-4 rounded-full bg-secondary/10">
                        <Calendar className="w-12 h-12 text-primary opacity-40" />
                    </div>
                    <h3 className="text-xl font-bold">No Exams Found</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "results" && selectedExam && (
            <div className="space-y-6 animate-in fade-in duration-300">
                <button 
                    onClick={() => setActiveTab("list")}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Exams
                </button>

                <div className="glass rounded-3xl p-8 border border-border/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h3 className="text-xl font-bold">Entry: {selectedExam.name}</h3>
                            <p className="text-sm text-muted-foreground">Recording marks for {selectedExam.subject?.name} ({selectedExam.course?.name})</p>
                        </div>
                        <div className="flex gap-3">
                            {selectedExam.resultStatus !== 'SUBMITTED' && selectedExam.resultStatus !== 'PUBLISHED' && (
                                <>
                                    <button 
                                        onClick={async () => {
                                            const success = await saveResults();
                                            if(success) alert("Draft saved!");
                                        }}
                                        disabled={loading}
                                        className="bg-secondary text-secondary-foreground px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-secondary/80 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save as Draft</>}
                                    </button>
                                    <button 
                                        onClick={submitExam}
                                        disabled={loading}
                                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ClipboardCheck className="w-4 h-4" /> Submit for Approval</>}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-border/40">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/10 border-b border-border/40 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Roll No</th>
                                    <th className="px-6 py-4 w-40">Marks</th>
                                    <th className="px-6 py-4">Remarks</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-secondary/5 transition-colors">
                                        <td className="px-6 py-4 font-bold">{student.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground font-mono">{student.rollNumber}</td>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="number"
                                                min="0"
                                                max={selectedExam.maxMarks}
                                                value={marks[student.studentId]?.obtainedMarks || 0}
                                                onChange={(e) => setMarks(prev => ({
                                                    ...prev,
                                                    [student.studentId]: {
                                                        ...prev[student.studentId],
                                                        obtainedMarks: Number(e.target.value)
                                                    }
                                                }))}
                                                disabled={selectedExam.resultStatus === 'PUBLISHED' || selectedExam.resultStatus === 'SUBMITTED'}
                                                className={`w-full bg-secondary/10 border ${marks[student.studentId]?.obtainedMarks > selectedExam.maxMarks ? 'border-destructive' : 'border-border/60'} rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:disabled:ring-0 disabled:opacity-50`}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="text"
                                                placeholder="..."
                                                value={marks[student.studentId]?.teacherRemarks || ""}
                                                onChange={(e) => setMarks(prev => ({
                                                    ...prev,
                                                    [student.studentId]: {
                                                        ...prev[student.studentId],
                                                        teacherRemarks: e.target.value
                                                    }
                                                }))}
                                                disabled={selectedExam.resultStatus === 'PUBLISHED' || selectedExam.resultStatus === 'SUBMITTED'}
                                                className="w-full bg-secondary/10 border border-border/60 rounded-lg py-2 px-3 focus:outline-none disabled:opacity-50"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {marks[student.studentId]?.obtainedMarks >= selectedExam.passingMarks ? (
                                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">PASSED</span>
                                            ) : (
                                                <span className="text-[10px] font-black text-destructive bg-destructive/10 px-2 py-1 rounded-full">FAILED</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
