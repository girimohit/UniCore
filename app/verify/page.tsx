"use client";

import { useState } from "react";
import { 
  ShieldCheck, Search, Loader2, CheckCircle2, 
  XCircle, Calendar, GraduationCap, Building2,
  ExternalLink, Hash, Info,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/verify?hash=${hash.trim()}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Verification failed");
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-4">
            <ShieldCheck className="w-4 h-4" />
            Blockchain Verification
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Verify Academic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary animate-gradient">Credentials.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Paste the certificate hash to instantly verify its authenticity and blockchain integrity.
          </p>
        </div>

        {/* Search Section */}
        <div className="glass rounded-[2rem] p-8 md:p-12 border border-white/5 shadow-2xl mb-12">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-all" />
              <div className="relative flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-primary/50 transition-all">
                <div className="pl-4 text-muted-foreground">
                  <Hash className="w-5 h-5" />
                </div>
                <input 
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  placeholder="Paste Certificate Hash (SHA-256)"
                  className="flex-1 bg-transparent border-none py-4 text-sm md:text-base focus:outline-none placeholder:text-white/20"
                />
                <button 
                  disabled={loading || !hash}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Now"}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
              <XCircle className="w-5 h-5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {result.exists ? (
              <div className="space-y-8">
                {/* Status Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="text-center md:text-left space-y-1">
                    <h2 className="text-2xl font-black text-emerald-500">Authenticity Verified</h2>
                    <p className="text-muted-foreground">This certificate is genuine and anchored to the UniCore blockchain registry.</p>
                  </div>
                  {result.isIntegrityValid && (
                    <div className="md:ml-auto px-4 py-2 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 border border-primary/30">
                      <ShieldCheck className="w-3 h-3" />
                      Integrity Valid
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Info className="w-4 h-4" /> Certificate Info
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">Student Name</p>
                          <p className="font-black text-lg">{result.dbRecord.student.user.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">Course Awarded</p>
                          <p className="font-black text-lg">{result.dbRecord.course.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-400">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">Institution</p>
                          <p className="font-black text-lg">{result.dbRecord.certificateData.institutionName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Blockchain Proof
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">On-Chain Timestamp</p>
                          <p className="font-black text-lg">{new Date(result.onChainRecord.timestamp * 1000).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide ml-1">Transaction Hash</p>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all">
                          <p className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">{result.dbRecord.transactionHash}</p>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-xs text-muted-foreground font-medium italic">
                          "This document was anchored to the blockchain on the date shown above, making it immutable and forever verifiable."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-[2rem] bg-destructive/5 border border-destructive/20 text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive mx-auto">
                  <XCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-destructive">Verification Failed</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                    The hash provided does not match any certificate in our registry. It may have been modified or is not authentic.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-20 text-center">
          <Link href="/" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
             Back to UniCore Home
          </Link>
        </div>
      </div>
    </div>
  );
}
