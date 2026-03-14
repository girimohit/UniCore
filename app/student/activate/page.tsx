"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { KeyRound, Phone, Hash, ShieldCheck, Loader2, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";

export default function StudentActivatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [phase, setPhase] = useState<"validating" | "form" | "success" | "error">("validating");
  const [tokenInfo, setTokenInfo] = useState<{ email: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    roll_number: "",
    password: "",
    confirm_password: "",
    phone_number: "",
  });
  const [formError, setFormError] = useState("");

  // Step 1: Validate the token on page load
  useEffect(() => {
    if (!token) {
      setErrorMessage("No activation token found in the URL.");
      setPhase("error");
      return;
    }

    fetch(`/api/auth/activate?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(data.error || "Invalid activation link.");
          setPhase("error");
        } else {
          setTokenInfo({ email: data.email });
          setPhase("form");
        }
      })
      .catch(() => {
        setErrorMessage("Could not validate activation link.");
        setPhase("error");
      });
  }, [token]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (form.password !== form.confirm_password) {
      setFormError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...form }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Activation failed.");
      } else {
        setPhase("success");
        // Auto-redirect to dashboard after 2s
        setTimeout(() => router.push(data.redirect || "/"), 2000);
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bg = (
    <div className="fixed inset-0" style={{ background: "var(--bg-base)" }}>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20" style={{ background: "var(--uc-purple)", filter: "blur(120px)" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20" style={{ background: "var(--uc-cyan)", filter: "blur(120px)" }} />
    </div>
  );

  if (phase === "validating") {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {bg}
        <div className="z-10 text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 opacity-60" style={{ color: "var(--text-primary)" }} />
          <p style={{ color: "var(--text-secondary)" }}>Validating your activation link…</p>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {bg}
        <div className="z-10 glass p-8 rounded-2xl max-w-md w-full text-center">
          <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Link Invalid</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{errorMessage}</p>
          <a href="/" className="btn-primary w-full justify-center !py-3 inline-flex">Go to Homepage</a>
        </div>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {bg}
        <div className="z-10 glass p-8 rounded-2xl max-w-md w-full text-center">
          <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Account Activated!</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Redirecting you to your dashboard…</p>
          <Loader2 className="w-5 h-5 animate-spin mx-auto mt-4 opacity-40" />
        </div>
      </div>
    );
  }

  // Phase: form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {bg}
      <div className="z-10 glass p-8 sm:p-10 rounded-[28px] max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-black text-2xl"
            style={{ background: "linear-gradient(135deg, #7c5cbf, #d4608a)" }}>
            U
          </div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>Activate Your Account</h1>
          {tokenInfo && (
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Setting up account for <strong>{tokenInfo.email}</strong>
            </p>
          )}
        </div>

        <form onSubmit={handleActivate} className="space-y-4">
          {/* Roll Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
              Roll Number
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="text"
                required
                value={form.roll_number}
                onChange={(e) => setForm((p) => ({ ...p, roll_number: e.target.value }))}
                placeholder="e.g. CS2023001"
                className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-shadow"
                style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
              Set Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Min. 8 characters"
                className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-shadow"
                style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
              Confirm Password
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="password"
                required
                value={form.confirm_password}
                onChange={(e) => setForm((p) => ({ ...p, confirm_password: e.target.value }))}
                placeholder="Re-enter password"
                className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-shadow"
                style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
              Phone Number <span className="normal-case opacity-60">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="tel"
                value={form.phone_number}
                onChange={(e) => setForm((p) => ({ ...p, phone_number: e.target.value }))}
                placeholder="+91 9876543210"
                className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-shadow"
                style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          {formError && (
            <div className="text-sm p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              {formError}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3.5 mt-2 shadow-xl">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Activate Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
