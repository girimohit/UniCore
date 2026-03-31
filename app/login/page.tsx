"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Lock,
  Hash,
  GraduationCap,
  Briefcase,
  ShieldCheck,
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<LoginTab>("student");
  const [username, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  //   const [subdomain, setSubdomain] = useState(
  //     searchParams.get("subdomain") || "",
  //   );

  // Detect subdomain/tenant from hostname or URL path
  useEffect(() => {
    if (subdomain) return;

    const host = window.location.hostname;
    const bases = ["localhost", "unicore.app", "unicore.com"];

    // 1. Subdomain-based: e.g. amity.localhost or amity.unicore.app
    for (const b of bases) {
      if (host.endsWith(`.${b}`)) {
        setSubdomain(host.replace(`.${b}`, ""));
        return;
      }
    }

    // 2. Path-based: find segment immediately before 'login'
    //    e.g. /amity/login → ['amity','login'] → tenant = 'amity'
    const segments = window.location.pathname.split("/").filter(Boolean);
    const loginIdx = segments.indexOf("login");
    if (loginIdx > 0) {
      setSubdomain(segments[loginIdx - 1]);
      return;
    }

    // 3. Fallback: first non-reserved segment (for other pages)
    const reserved = ["login", "register", "student", "api"];
    const first = segments[0];
    if (first && !reserved.includes(first)) {
      setSubdomain(first);
    }
  }, []);

  const handleTabChange = (tab: LoginTab) => {
    setActiveTab(tab);
    setIdentifier("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError(`${currentTab.identifierLabel} is required.`);
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (!subdomain) {
      setError(
        "Could not detect your institution workspace. Please use your institution's subdomain URL.",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          subdomain,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials.");

      if (data.user.accountStatus === "TEMP") {
        setError(
          "Please activate your account first using invitation link sent to your Email by Institution Admin.",
        );
        // router.push(
        //   `/${subdomain}/setup-password?username=${encodeURIComponent(username.trim())}`,
        // );
        return;
      }

      const role = data.user.role as string;
      const redirectMap: Record<string, string> = {
        ADMIN: `/${subdomain}/admin/dashboard`,
        FACULTY: `/${subdomain}/faculty/dashboard`,
        STUDENT: `/${subdomain}/student/dashboard`,
      };
      router.push(redirectMap[role] || "/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentTab = TABS.find((t) => t.key === activeTab)!;
  const gradient = ROLE_GRADIENT[activeTab];

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="glass p-8 sm:p-10 rounded-[28px] shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-5">
            <div
              className="relative w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-white shadow-lg group-hover:scale-105 transition-all"
              style={{ background: gradient }}
            >
              <Sparkles className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-amber-300" />
              U
            </div>
          </Link>
          <h1
            className="font-display font-black text-2xl tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Sign in to UNICORE
          </h1>
          {subdomain && (
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Workspace:{" "}
              <span
                className="font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {subdomain}.unicore.app
              </span>
            </p>
          )}
        </div>

        {/* Tab switcher */}
        <div
          className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl mb-7"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? "text-white shadow-md"
                  : "opacity-50 hover:opacity-80"
              }`}
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
            <div className="flex items-center justify-between mb-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Institution Slug
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="text"
                required
                autoComplete="Institution Slug"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="e.g. DU"
                className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5cbf]/40 transition-shadow"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>
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
                autoComplete="username"
                value={username}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={currentTab.identifierPlaceholder}
                className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5cbf]/40 transition-shadow"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
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
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div className="flex justify-end mt-1 pr-3">
              <Link
                href={`/${subdomain}/forgot-password`}
                className=" text-xs opacity-80 hover:underline hover:opacity-100 transition-opacity contet"
                style={{ color: "var(--text-primary)" }}
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

        {/* Contextual footer links */}
        {/* {activeTab === "student" && (
          <p
            className="text-center text-xs mt-6"
            style={{ color: "var(--text-secondary)" }}
          >
            First time here?{" "}
            <Link
              href="/student/activate"
              className="font-semibold hover:text-[#7c5cbf] transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              Activate your account
            </Link>
          </p>
        )}
        {activeTab === "admin" && (
          <p
            className="text-center text-xs mt-6"
            style={{ color: "var(--text-secondary)" }}
          >
            New institution?{" "}
            <Link
              href="/register"
              className="font-semibold hover:text-[#7c5cbf] transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              Register your workspace
            </Link>
          </p>
        )} */}
      </div>

      <p
        className="text-center text-xs mt-5 opacity-40"
        style={{ color: "var(--text-secondary)" }}
      >
        © UNICORE · All rights reserved
      </p>
    </div>
  );
}

export default function LoginPage() {
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

      <Suspense
        fallback={
          <div className="glass p-10 rounded-2xl animate-pulse w-[400px] h-[500px]" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
