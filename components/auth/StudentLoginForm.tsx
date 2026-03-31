"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  // Sparkles,
  ArrowRight,
  Loader2,
  Lock,
  Hash,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Building2,
  AlertTriangle,
} from "lucide-react";

type LoginTab = "student" | "faculty" | "admin";

const TABS: {
  key: LoginTab;
  label: string;
  icon: React.ReactNode;
  identifierLabel: string;
  identifierPlaceholder: string;
}[] = [
  {
    key: "student",
    label: "Student",
    icon: <GraduationCap className="w-4 h-4" />,
    identifierLabel: "Roll Number",
    identifierPlaceholder: "e.g. CS2023001",
  },
  {
    key: "faculty",
    label: "Faculty",
    icon: <Briefcase className="w-4 h-4" />,
    identifierLabel: "Employee Number",
    identifierPlaceholder: "e.g. EMP001",
  },
  {
    key: "admin",
    label: "Admin",
    icon: <ShieldCheck className="w-4 h-4" />,
    identifierLabel: "Admin ID",
    identifierPlaceholder: "e.g. ADM001",
  },
];

const ROLE_GRADIENT: Record<LoginTab, string> = {
  student: "linear-gradient(135deg, #3b82f6, #6366f1)",
  faculty: "linear-gradient(135deg, #10b981, #059669)",
  admin: "linear-gradient(135deg, #7c5cbf, #d4608a)",
};

interface Props {
  tenantSlug: string;
  institutionName: string;
  isActive: boolean;
}

export default function StudentLoginForm({ tenantSlug, institutionName, isActive }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LoginTab>("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab: LoginTab) => {
    setActiveTab(tab);
    setIdentifier("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const currentTab = TABS.find((t) => t.key === activeTab)!;
    if (!identifier.trim()) {
      setError(`${currentTab.identifierLabel} is required.`);
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: identifier.trim(),
          password,
          subdomain: tenantSlug, // Always pre-filled — user doesn't type this
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials.");

      const role = data.user.role as string;
      const redirectMap: Record<string, string> = {
        ADMIN: `/${tenantSlug}/admin/dashboard`,
        FACULTY: `/${tenantSlug}/faculty/dashboard`,
        STUDENT: `/${tenantSlug}/student/dashboard`,
      };
      router.push(redirectMap[role] || `/`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentTab = TABS.find((t) => t.key === activeTab)!;
  const gradient = ROLE_GRADIENT[activeTab];

  // Institution inactive — show clear block message
  if (!isActive) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="glass p-10 rounded-2xl max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-400" />
          <h1 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
            Institution Inactive
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <strong>{institutionName}</strong> is currently not active. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full opacity-25 pointer-events-none"
        style={{ background: "var(--uc-purple)", filter: "blur(120px)" }}
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full opacity-25 pointer-events-none"
        style={{ background: "var(--uc-cyan)", filter: "blur(120px)" }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="glass p-8 sm:p-10 rounded-[28px] shadow-2xl">
          {/* Institution branding header — key UX difference from global login */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ background: gradient }}
            >
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1
              className="font-display font-black text-2xl tracking-tight leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {institutionName}
            </h1>
            {/* <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--text-secondary)" }}>
              Student Portal &middot; <span className="font-mono opacity-70">{tenantSlug}.unicore.app</span>
            </p> */}
          </div>

          {/* Role tabs */}
          <div
            className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl mb-7"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)" }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.key ? "text-white shadow-md" : "opacity-50 hover:opacity-80"}`}
                style={
                  activeTab === tab.key
                    ? { background: ROLE_GRADIENT[tab.key] }
                    : { color: "var(--text-primary)" }
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-5 p-3 text-sm rounded-xl"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                {currentTab.identifierLabel}
              </label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  key={activeTab + "-id"}
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentTab.identifierPlaceholder}
                  className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5cbf]/40 transition-shadow"
                  style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5cbf]/40 transition-shadow"
                  style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
                />
              </div>
              <div className="flex justify-end pr-3">
                <Link
                  href={`/forgot-password`}
                  className=" text-xs opacity-60 hover:opacity-100 transition-opacity contet"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white mt-2 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: gradient }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In as {currentTab.label} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Contextual CTAs */}
          {/* {activeTab === "student" && (
            <p className="text-center text-xs mt-6" style={{ color: "var(--text-secondary)" }}>
              First time here?{" "}
              <Link
                href={`/activate`}
                className="font-semibold hover:text-[#7c5cbf] transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                Activate your account
              </Link>
            </p>
          )} */}
        </div>

        {/* Back to global site */}
        <p className="text-center text-xs mt-5 opacity-40" style={{ color: "var(--text-secondary)" }}>
          <Link href="/" className="hover:opacity-70 transition-opacity">
            ← Back to UNICORE
          </Link>
        </p>
      </div>
    </div>
  );
}
