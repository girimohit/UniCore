"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle, ChevronLeft, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const params = useParams();
  const tenant = params.tenant as string;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subdomain: tenant }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (submitted) {
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
            Check your email
          </h1>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            If an account exists for <span className="font-bold underline" style={{ color: "var(--text-primary)" }}>{email}</span>, 
            we've sent a password reset link.
          </p>
          
          <div className="space-y-4">
            <button 
                className="btn-ghost w-full justify-center !py-3.5"
                onClick={() => setSubmitted(false)}
            >
                Try a different email
            </button>
            <Link href={`/${tenant}/login`} className="btn-primary w-full justify-center !py-3.5 shadow-xl inline-flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Dynamic Background */}
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
            Forgot Password?
          </h1>
          <p className="text-sm opacity-70" style={{ color: "var(--text-secondary)" }}>
            No worries! Enter your email below and we'll send you a link to reset your password.
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-60 ml-1"
              style={{ color: "var(--text-primary)" }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@university.edu"
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
            className="btn-primary w-full justify-center !py-3.5 shadow-xl"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Send Reset Link <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <Link 
            href={`/${tenant}/login`} 
            className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
             <ChevronLeft className="w-4 h-4" /> Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}

