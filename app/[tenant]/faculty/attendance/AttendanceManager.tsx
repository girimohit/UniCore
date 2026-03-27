"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckSquare,
  Calendar,
  Users,
  Save,
  Filter,
  Loader2,
  CheckCircle,
} from "lucide-react";

interface Student {
  id: string;
  rollNumber: string;
  user: { name: string; username: string };
  courseId: string | null;
  semester: number | null;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  courseId: string;
  academicCycle: number;
}

interface Period {
  id: string;
  name: string;
}

interface AttendanceManagerProps {
  subjects: Subject[];
  students: Student[];
  periods: Period[];
}
export default function AttendanceManager({
  subjects,
  students,
  periods,
}: AttendanceManagerProps) {
  const searchParams = useSearchParams();
  const initialSubjectId =
    searchParams.get("subjectId") || (subjects[0]?.id ?? "");

  const [subjectId, setSubjectId] = useState(initialSubjectId);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [termId, setTermId] = useState("");

  // Sync with search params if they change
  useEffect(() => {
    const sId = searchParams.get("subjectId");
    if (sId) setSubjectId(sId);
  }, [searchParams]);
  const [statuses, setStatuses] = useState<
    Record<string, "PRESENT" | "ABSENT">
  >({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleStatus = (studentId: string, status: "PRESENT" | "ABSENT") => {
    setStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const filteredStudents = students.filter(
    (s) =>
      s.courseId === selectedSubject?.courseId &&
      s.semester === (selectedSubject?.academicCycle ?? 1),
  );

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    setError("");

    const records = filteredStudents.map((s: Student) => ({
      studentId: s.id,
      status: statuses[s.id] ?? "PRESENT",
    }));

    try {
      const res = await fetch("/api/modules/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          date,
          records,
          ...(termId ? { termId } : {}),
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save attendance.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Controls */}
      <div className="xl:col-span-1 space-y-5 glass rounded-3xl p-8 border border-border/50 shadow-xl shadow-primary/5 h-fit">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground tracking-wide uppercase">
            Select Subject
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
          >
            {subjects.map((s: Subject) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground tracking-wide uppercase">
            Date
          </label>
          <div className="flex items-center gap-3 border border-border/50 rounded-xl px-4 h-12 bg-background/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <Calendar className="h-5 w-5 text-primary shrink-0" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-sm font-semibold w-full focus:outline-none text-foreground"
            />
          </div>
        </div>

        {/* Academic Term Filter */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground tracking-wide uppercase flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            Academic Term
            <span className="text-[10px] font-normal text-muted-foreground normal-case ml-1">
              (optional)
            </span>
          </label>
          <select
            value={termId}
            onChange={(e) => setTermId(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="">All Terms</option>
            {periods.map((p: Period) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-xs font-semibold text-destructive bg-destructive/10 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        {saved && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 rounded-xl px-4 py-2">
            <CheckCircle className="w-4 h-4" />
            <p className="text-xs font-semibold">Attendance saved!</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading || filteredStudents.length === 0}
          className="w-full mt-2 flex justify-center items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-primary text-primary-foreground px-4 h-12 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Save className="h-5 w-5" /> Save Records
            </>
          )}
        </button>
      </div>

      {/* Roster Table */}
      <div className="xl:col-span-2 glass border border-border/50 rounded-3xl shadow-xl shadow-primary/5 flex flex-col overflow-hidden max-h-[70vh]">
        <div className="p-6 border-b border-border/50 bg-background/30 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-md">
          <div>
            <h3 className="font-extrabold text-xl text-foreground tracking-tight">
              Status
            </h3>
            {termId && (
              <p className="text-xs text-primary font-semibold mt-0.5">
                Filtered by:{" "}
                {periods.find((p: Period) => p.id === termId)?.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
               onClick={() =>
                 setStatuses(
                   Object.fromEntries(filteredStudents.map((s: Student) => [s.id, "PRESENT"])),
                 )
               }
               className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
             >
               Mark All Present
             </button>
             <button
               onClick={() =>
                 setStatuses(
                   Object.fromEntries(filteredStudents.map((s: Student) => [s.id, "ABSENT"])),
                 )
               }
               className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
             >
               Mark All Absent
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-medium">
              <Users className="w-10 h-10 mx-auto opacity-30 mb-3" />
              No students found for this subject and cycle/semester.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-foreground">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-extrabold tracking-widest sticky top-0 z-10 backdrop-blur-xl">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl border-b border-border/50">
                    Roll No
                  </th>
                  <th className="px-6 py-4 border-b border-border/50">Name</th>
                  <th className="px-6 py-4 rounded-tr-xl border-b border-border/50 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredStudents.map((student: Student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-primary/5 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      {student.rollNumber}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap font-bold text-foreground">
                      <div className="flex flex-col">
                        <span>{student.user.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{student.user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center gap-3">
                        <label className="flex items-center justify-center cursor-pointer relative">
                          <input
                            type="radio"
                            name={`att-${student.id}`}
                            className="peer sr-only"
                            value="PRESENT"
                            checked={
                              !statuses[student.id] ||
                              statuses[student.id] === "PRESENT"
                            }
                            onChange={() => handleStatus(student.id, "PRESENT")}
                          />
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-background border-2 border-border/50 text-muted-foreground peer-checked:bg-emerald-500/10 peer-checked:border-emerald-500 peer-checked:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-sm">
                            P
                          </div>
                        </label>
                        <label className="flex items-center justify-center cursor-pointer relative">
                          <input
                            type="radio"
                            name={`att-${student.id}`}
                            className="peer sr-only"
                            value="ABSENT"
                            checked={statuses[student.id] === "ABSENT"}
                            onChange={() => handleStatus(student.id, "ABSENT")}
                          />
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-background border-2 border-border/50 text-muted-foreground peer-checked:bg-rose-500/10 peer-checked:border-rose-500 peer-checked:text-rose-500 hover:border-rose-500/50 transition-all shadow-sm">
                            A
                          </div>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
