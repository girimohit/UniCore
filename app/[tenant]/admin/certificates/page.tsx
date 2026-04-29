"use client";

import { useState, useEffect } from "react";
import { 
  Award, Search, Copy, CheckCircle2, 
  ExternalLink, Loader2, Calendar, 
  User, BookOpen, ShieldCheck, Clock
} from "lucide-react";
import { toast } from "sonner";

export default function CertificatesPage() {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/modules/certificates");
      const data = await res.json();
      setCertificates(data.certificates ?? []);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Hash copied to clipboard!");
  };

  const filtered = certificates.filter(c => 
    c.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.documentHash?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            Issued Credentials
          </h1>
          <p className="text-muted-foreground mt-1">Manage and verify all blockchain-anchored certificates.</p>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-border/40 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Anchored</p>
          <p className="text-4xl font-black text-foreground">{certificates.length}</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-border/40 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Network Status</p>
          <div className="flex items-center gap-2 text-emerald-600 font-black">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {/* HARDHAT LOCAL */}
            AMOY TESTNET
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-secondary/5 border border-border/40 p-2 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search by student, course, or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none py-2.5 pl-11 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="glass rounded-3xl p-20 border border-border/50 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Loading credentials registry...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="glass rounded-3xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/10 text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-b border-border/40">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">GPA</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Certificate Hash</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-secondary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                            {c.student?.user?.name?.[0] || <User className="w-3 h-3" />}
                          </div>
                          <span className="font-bold text-foreground">{c.student?.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full bg-blue-500/10 text-blue-700">
                          <BookOpen className="w-3 h-3" /> {c.course?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-foreground">
                          {c.certificateData?.academicPerformance?.gpa || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium" suppressHydrationWarning>
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(c.issueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {c.status === "ANCHORED" ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-tight">
                            <ShieldCheck className="w-3 h-3" /> Anchored
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-tight">
                            <Clock className="w-3 h-3 animate-pulse" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 group/hash">
                          <code className="text-[10px] font-mono bg-secondary/20 px-2 py-1 rounded-md text-muted-foreground max-w-[120px] truncate">
                            {c.documentHash}
                          </code>
                          <button 
                            onClick={() => copyToClipboard(c.documentHash)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all opacity-0 group-hover/hash:opacity-100"
                            title="Copy Hash"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a 
                          href={`/verify?hash=${c.documentHash}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-primary hover:underline"
                        >
                          Verify <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 border border-border/50 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-secondary/10 text-muted-foreground/40">
              <Award className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-xl font-bold">No Certificates Issued</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Issue your first certificate from the Student Manager to see it here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
