"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function SetupPasswordForm({ tenant }: { tenant: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") || "User";
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword) { setError("Current temporary password is required."); return; }
    if (newPassword.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password.");

      setSuccess(true);
      setTimeout(() => {
        router.push("/login"); // Force re-login with new password to ensure fresh session
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass p-8 sm:p-10 rounded-[28px] shadow-2xl text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-display font-black mb-2" style={{ color: "var(--text-primary)" }}>
          Password Secured!
        </h1>
        <p className="text-sm opacity-70 mb-8" style={{ color: "var(--text-secondary)" }}>
          Your account is now active. Redirecting you to login...
        </p>
        <div className="w-full h-1 bg-secondary/20 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[progress_2s_ease-in-out]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass p-8 sm:p-10 rounded-[28px] shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-display font-black text-2xl tracking-tight" style={{ color: "var(--text-primary)" }}>
            Welcome, {identifier}
          </h1>
          <p className="text-sm mt-2 opacity-70" style={{ color: "var(--text-secondary)" }}>
            For your security, please update your temporary password to continue.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3 text-sm animate-in shake-in duration-300" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-60 ml-1" style={{ color: "var(--text-primary)" }}>
              Current Temporary Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter temp password"
                className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all font-mono"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div className="h-px w-full bg-border/40 my-2"></div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-60 ml-1" style={{ color: "var(--text-primary)" }}>
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-60 ml-1" style={{ color: "var(--text-primary)" }}>
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full bg-secondary/5 border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white mt-4 bg-primary shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Update & Secure Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-xs mt-8 opacity-40" style={{ color: "var(--text-primary)" }}>
          Having trouble? Contact your system administrator.
        </p>
      </div>
    </div>
  );
}

export default function SetupPasswordPage({ params }: { params: any }) {
  const tenant = params.tenant;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-bg-base">
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full opacity-25 pointer-events-none" style={{ background: "var(--uc-purple)", filter: "blur(120px)" }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full opacity-25 pointer-events-none" style={{ background: "var(--uc-cyan)", filter: "blur(120px)" }} />
      
      <Suspense fallback={<div className="glass p-10 rounded-2xl animate-pulse w-[400px] h-[400px]" />}>
        <SetupPasswordForm tenant={tenant} />
      </Suspense>
    </div>
  );
}
