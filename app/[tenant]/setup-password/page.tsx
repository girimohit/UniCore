"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

function SetupPasswordForm({ tenant }: { tenant: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "User";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword) {
      setError("Current temporary password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

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
        router.push(`/${tenant}/login`); 
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (success) {
    return (
      <div className="glass p-8 sm:p-10 rounded-[28px] shadow-2xl text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-display font-black mb-2" style={{ color: "var(--text-primary)" }}>
          Password Secured!
        </h1>
        <p className="text-sm opacity-70 mb-8" style={{ color: "var(--text-secondary)" }}>
          Your account is now active. Redirecting you to login...
        </p>
        <div className="w-full h-1 bg-emerald-500/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[progress_2s_ease-in-out]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative z-10 glass p-8 sm:p-10 rounded-[28px] shadow-2xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c5cbf] to-[#d4608a] text-white mb-6 shadow-lg">
           <ShieldCheck className="w-6 h-6" />
        </div>
        <h1
          className="font-display font-black text-2xl tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome, {username}
        </h1>
        <p className="text-sm mt-2 opacity-70" style={{ color: "var(--text-secondary)" }}>
          For your security, please update your temporary password to continue.
        </p>
      </div>

      {error && (
        <div
          className="p-3 mb-6 text-sm rounded-xl font-bold flex items-start gap-3"
          style={{
            background: "rgba(346.8, 77.2%, 49.8%, 0.1)",
            color: "hsl(var(--destructive))",
            border: "1px solid rgba(346.8, 77.2%, 49.8%, 0.2)",
          }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-60 ml-1"
            style={{ color: "var(--text-primary)" }}
          >
            Current Temporary Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 transition-opacity group-focus-within:opacity-100" />
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter temp password"
              className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-all font-mono"
              style={{
                borderColor: "var(--border-strong)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        <div className="h-px w-full my-2" style={{ background: "var(--border-subtle)" }} />

        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-60 ml-1"
            style={{ color: "var(--text-primary)" }}
          >
            New Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 transition-opacity group-focus-within:opacity-100" />
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: "var(--border-strong)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-60 ml-1"
            style={{ color: "var(--text-primary)" }}
          >
            Confirm New Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 transition-opacity group-focus-within:opacity-100" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: "var(--border-strong)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center !py-3.5 shadow-xl mt-4"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Update & Secure Account <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function SetupPasswordPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background Decor */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full opacity-30 orb"
        style={{ background: "var(--uc-purple)", filter: "blur(100px)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full opacity-30 orb-2"
        style={{ background: "var(--uc-cyan)", filter: "blur(100px)" }}
      />

      <Suspense
        fallback={
          <div className="glass p-10 rounded-[28px] animate-pulse w-full max-w-md h-[400px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">
              Initializing Session...
            </p>
          </div>
        }
      >
        <SetupPasswordContent params={params} />
      </Suspense>
    </div>
  );
}

async function SetupPasswordContent({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  return <SetupPasswordForm tenant={tenant} />;
}

