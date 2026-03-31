"use client";

import { useState, Suspense, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, CheckCircle, ArrowRight, Eye, EyeOff, AlertTriangle, Sparkles, ChevronLeft } from "lucide-react";

function ResetPasswordForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tenant = params.tenant as string;
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("No reset token found in the URL.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password.");

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${tenant}/login`);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (!token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="w-full max-w-md relative z-10 glass p-8 sm:p-10 rounded-[28px] shadow-2xl text-center">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1
            className="font-display font-black text-3xl mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Invalid Request
          </h1>
          <p className="mb-8 opacity-70" style={{ color: "var(--text-secondary)" }}>
            This reset link appears to be invalid or was missing a token.
          </p>
          <Link href={`/${tenant}/login`} className="btn-ghost w-full justify-center !py-3.5 shadow-sm inline-flex items-center gap-2">
             <ChevronLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="w-full max-w-md relative z-10 glass p-8 sm:p-10 rounded-[28px] shadow-2xl text-center">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1
            className="font-display font-black text-3xl mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Success!
          </h1>
          <p className="mb-4 opacity-70" style={{ color: "var(--text-secondary)" }}>
            Your password has been successfully reset.
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 animate-pulse mb-8" style={{ color: "var(--text-primary)" }}>
            Redirecting you to login...
          </p>
          <Link href={`/${tenant}/login`} className="btn-primary w-full justify-center !py-3.5 shadow-xl inline-flex items-center gap-2">
             Go to Login Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background Decor */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-30 orb"
        style={{ background: "var(--uc-purple)", filter: "blur(100px)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-30 orb-2"
        style={{ background: "var(--uc-cyan)", filter: "blur(100px)" }}
      />

      <div className="w-full max-w-md relative z-10 glass p-8 sm:p-10 rounded-[28px] shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c5cbf] to-[#d4608a] text-white mb-6 shadow-lg">
             <Sparkles className="w-6 h-6" />
          </div>
          <h1
            className="font-display font-black text-3xl mb-2 tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Update Password
          </h1>
          <p className="text-sm opacity-70" style={{ color: "var(--text-secondary)" }}>
             Security first! Please choose a strong, new password for your account.
          </p>
        </div>

        {error && (
          <div
            className="p-3 mb-6 text-sm rounded-xl font-bold"
            style={{
              background: "rgba(346.8, 77.2%, 49.8%, 0.1)",
              color: "hsl(var(--destructive))",
              border: "1px solid rgba(346.8, 77.2%, 49.8%, 0.2)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 transition-all font-medium"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-60 ml-1"
              style={{ color: "var(--text-primary)" }}
            >
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 transition-opacity group-focus-within:opacity-100" />
              <input
                type={showPass ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 transition-all font-medium"
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
            className="btn-primary w-full justify-center !py-3.5 shadow-xl mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Reset Password <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
       <div 
         className="min-h-screen flex items-center justify-center p-4"
         style={{ background: "var(--bg-base)" }}
       >
          <div className="glass p-10 rounded-[28px] animate-pulse w-full max-w-md h-[400px] flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-8 h-8 animate-spin opacity-20" />
             <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Securing Session...</p>
          </div>
       </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

