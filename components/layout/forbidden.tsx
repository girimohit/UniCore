"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function ForbiddenPage({ 
  message = "You don't have permission to access this resource." 
}: { 
  message?: string 
}) {
  const params = useParams();
  const tenant = params?.tenant as string;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background relative overflow-hidden font-display">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 z-0">
        <div 
          className="absolute -top-24 -left-20 w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, var(--uc-purple), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center">
          <div className="p-6 rounded-[32px] bg-amber-500/10 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <ShieldAlert className="w-20 h-20 text-amber-500" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Access Denied</h1>
          <h2 className="text-xl font-bold text-foreground/80 tracking-tight">Restricted Area</h2>
          <p className="text-muted-foreground font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link 
            href={tenant ? `/admin/dashboard` : "/"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>

        <div className="pt-8 flex justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
          <span>Security Level: Alpha</span>
          <span>•</span>
          <span>Audit Logged</span>
        </div>
      </div>
    </div>
  );
}
