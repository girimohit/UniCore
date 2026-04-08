"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Save, Calendar as CalendarIcon, Clock, MapPin, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type Entry = {
  id?: string;
  subjectId: string;
  facultyId?: string | null;
  day: 'MONDAY'|'TUESDAY'|'WEDNESDAY'|'THURSDAY'|'FRIDAY'|'SATURDAY'|'SUNDAY';
  startTime: string;
  endTime: string;
  room?: string | null;
  type: string;
  
  // Optional relations populated by backend
  subject?: any;
  faculty?: any;
};

interface TimetableManagerProps {
  courses: any[];
  faculties: any[];
  institutionId: string;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;

export default function TimetableManager({ courses, faculties, institutionId }: TimetableManagerProps) {
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [entries, setEntries] = useState<Entry[]>([]);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<Entry>>({
      type: "THEORY",
      day: "MONDAY",
      startTime: "09:00",
      endTime: "10:00"
  });

  const selectedCourse = courses.find(c => c.id === courseId);
  const courseSubjects = selectedCourse?.subjects || [];

  useEffect(() => {
      if (courseId && semester) {
          fetchTimetable(courseId, parseInt(semester));
      } else {
          setEntries([]);
      }
  }, [courseId, semester]);

  const fetchTimetable = async (cId: string, sem: number) => {
      setLoading(true);
      try {
          const res = await fetch(`/api/modules/timetable?courseId=${cId}&semester=${sem}`);
          const data = await res.json();
          if (res.ok) {
              setEntries(data.timetable?.entries || []);
          } else {
              setEntries([]);
          }
      } catch (err) {
          toast.error("Failed to fetch timetable");
      } finally {
          setLoading(false);
      }
  };

  const saveTimetable = async () => {
      if (!courseId || !semester) return;
      setSaving(true);
      try {
          const res = await fetch(`/api/modules/timetable`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  courseId,
                  semester: parseInt(semester),
                  entries
              })
          });
          
          if (!res.ok) throw new Error(await res.text());
          
          toast.success("Timetable saved successfully!");
          fetchTimetable(courseId, parseInt(semester)); // reload to get DB IDs
      } catch (err) {
          toast.error("Failed to save timetable");
      } finally {
          setSaving(false);
      }
  };

  const handleAddEntry = () => {
      if (!newEntry.subjectId || !newEntry.day || !newEntry.startTime || !newEntry.endTime) {
          toast.error("Please fill all required fields");
          return;
      }
      
      const subject = courseSubjects.find((s: any) => s.id === newEntry.subjectId);
      const faculty = faculties.find((f: any) => f.id === newEntry.facultyId);
      
      setEntries(prev => [...prev, { 
          ...newEntry as Entry,
          // Storing temporarily to render names before save
          subject: subject,
          faculty: faculty
      }]);
      setIsDialogOpen(false);
      setNewEntry({ type: "THEORY", day: "MONDAY", startTime: "09:00", endTime: "10:00" });
  };

  const removeEntry = (index: number) => {
      setEntries(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block tracking-wider">Select Course</label>
          <Select value={courseId} onValueChange={(val) => { setCourseId(val); setSemester(""); }}>
            <SelectTrigger className="w-full bg-secondary/50 border-border/40 focus:ring-primary/20 h-11 rounded-xl">
              <SelectValue placeholder="Select course..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block tracking-wider">Select Semester</label>
          <Select disabled={!courseId} value={semester} onValueChange={setSemester}>
            <SelectTrigger className="w-full bg-secondary/50 border-border/40 focus:ring-primary/20 h-11 rounded-xl">
              <SelectValue placeholder="Semester..." />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {courseId && semester && (
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-lg shadow-black/5 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Weekly Schedule Grid
                  </h2>
                  <div className="flex gap-3">
                      <button
                          onClick={() => setIsDialogOpen(true)}
                          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-secondary/80 transition-all flex items-center gap-2"
                      >
                          <Plus className="w-4 h-4" /> Add Class
                      </button>
                      <button
                          onClick={saveTimetable}
                          disabled={saving}
                          className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                      </button>
                  </div>
              </div>

              {loading ? (
                  <div className="flex justify-center p-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
              ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                      {DAYS.map(day => {
                          const dayEntries = entries.filter(e => e.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                          return (
                              <div key={day} className="flex flex-col gap-3 min-h-[300px] border border-border/30 rounded-2xl bg-muted/10 p-4">
                                  <div className="font-black text-center text-sm tracking-widest text-muted-foreground uppercase border-b border-border/30 pb-3 mb-2">{day}</div>
                                  {dayEntries.length === 0 ? (
                                      <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-xs font-bold uppercase tracking-widest">
                                          Free Day
                                      </div>
                                  ) : (
                                      dayEntries.map((entry, idx) => {
                                          const globalIdx = entries.indexOf(entry);
                                          return (
                                              <div key={idx} className="group relative bg-card border border-primary/20 shadow-sm rounded-xl p-3 flex flex-col gap-2 hover:border-primary/50 transition-colors">
                                                  <button onClick={() => removeEntry(globalIdx)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                                      <Trash2 className="w-3 h-3" />
                                                  </button>
                                                  
                                                  <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-primary bg-primary/10 w-fit px-2 py-0.5 rounded-full">
                                                      <Clock className="w-3 h-3" /> {entry.startTime} - {entry.endTime}
                                                  </div>
                                                  
                                                  <div className="font-bold text-sm leading-tight text-foreground pr-4">
                                                      {entry.subject?.name || courseSubjects.find((s:any)=>s.id===entry.subjectId)?.name || "Unknown Subject"}
                                                      <span className="ml-2 text-[9px] font-black uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{entry.type}</span>
                                                  </div>
                                                  
                                                  <div className="flex flex-col gap-1 mt-1">
                                                      {entry.facultyId && (
                                                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                              <UserIcon className="w-3 h-3 text-emerald-500" />
                                                              <span className="truncate">{entry.faculty?.user?.name || faculties.find((f:any)=>f.id===entry.facultyId)?.user?.name || "Unknown"}</span>
                                                          </div>
                                                      )}
                                                      {entry.room && (
                                                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                              <MapPin className="w-3 h-3 text-amber-500" />
                                                              <span>{entry.room}</span>
                                                          </div>
                                                      )}
                                                  </div>
                                              </div>
                                          )
                                      })
                                  )}
                              </div>
                          );
                      })}
                  </div>
              )}
          </div>
      )}

      {/* Add Dialog */}
      {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-background rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-border/50 flex flex-col max-h-[90vh]">
                  <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center">
                      <h3 className="font-bold text-lg">Add Class Schedule</h3>
                      <button onClick={() => setIsDialogOpen(false)} className="text-muted-foreground hover:text-foreground">
                          ✕
                      </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto grid gap-4">
                     <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-muted-foreground">Subject *</label>
                          <Select value={newEntry.subjectId} onValueChange={(val) => setNewEntry(prev => ({...prev, subjectId: val}))}>
                              <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select subject..." />
                              </SelectTrigger>
                              <SelectContent>
                                  {courseSubjects.map((s: any) => (
                                      <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                     </div>
                     
                     <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-muted-foreground">Faculty (Optional)</label>
                          <Select value={newEntry.facultyId || "none"} onValueChange={(val) => setNewEntry(prev => ({...prev, facultyId: val === "none" ? undefined : val}))}>
                              <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select faculty..." />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="none">TBD / Unassigned</SelectItem>
                                  {faculties.map((f: any) => (
                                      <SelectItem key={f.id} value={f.id}>{f.user?.name} ({f.user?.username})</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-muted-foreground">Day *</label>
                              <Select value={newEntry.day} onValueChange={(val: any) => setNewEntry(prev => ({...prev, day: val}))}>
                                  <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select day..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                         </div>
                         <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-muted-foreground">Type</label>
                              <Select value={newEntry.type} onValueChange={(val: any) => setNewEntry(prev => ({...prev, type: val}))}>
                                  <SelectTrigger className="w-full">
                                      <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="THEORY">Theory</SelectItem>
                                      <SelectItem value="LAB">Lab / Practical</SelectItem>
                                      <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                                  </SelectContent>
                              </Select>
                         </div>
                     </div>
    
                     <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-muted-foreground">Start Time *</label>
                              <input 
                                  type="time" 
                                  value={newEntry.startTime}
                                  onChange={(e) => setNewEntry(prev => ({...prev, startTime: e.target.value}))}
                                  className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus:ring-2 focus:ring-primary/40"
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-bold uppercase text-muted-foreground">End Time *</label>
                              <input 
                                  type="time" 
                                  value={newEntry.endTime}
                                  onChange={(e) => setNewEntry(prev => ({...prev, endTime: e.target.value}))}
                                  className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus:ring-2 focus:ring-primary/40"
                              />
                          </div>
                     </div>
    
                     <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-muted-foreground">Room / Location (Optional)</label>
                          <input 
                              type="text" 
                              placeholder="e.g. Lecture Hall 101"
                              value={newEntry.room || ""}
                              onChange={(e) => setNewEntry(prev => ({...prev, room: e.target.value}))}
                              className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                     </div>
                  </div>
                  <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex justify-end gap-3">
                      <button onClick={() => setIsDialogOpen(false)} className="px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm hover:bg-secondary">
                          Cancel
                      </button>
                      <button onClick={handleAddEntry} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
                          Add to Grid
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
