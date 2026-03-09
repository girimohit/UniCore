"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2, Building, Mail, Lock, Globe, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<{ tenantSlug: string, identifier: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/institutions/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institution_name: formData.get("institutionName"),
          slug: formData.get("subdomain"),
          admin_name: formData.get("adminName"),
          admin_email: formData.get("adminEmail"),
          password: formData.get("adminPassword"),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await res.json();
      // Show success screen with credentials instead of auto-redirect
      setSuccessData({
        tenantSlug: data.tenant_slug,
        identifier: data.credentials.identifier
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
        <div className="w-full max-w-md relative z-10 glass p-8 sm:p-10 rounded-[28px] shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="font-display font-black text-3xl mb-4" style={{ color: "var(--text-primary)" }}>
            Registration Complete!
          </h1>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Your institution workspace has been successfully provisioned.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left mb-8 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-wider mb-1 opacity-70">Your Admin ID</p>
            <p className="font-mono text-2xl font-bold tracking-wider mb-4 text-[#7c5cbf]">{successData.identifier}</p>
            <p className="text-sm opacity-80">
              Please save this Admin ID securely. You will use it to log in to your workspace at <strong className="text-white">{successData.tenantSlug}.unicore.app</strong>
            </p>
          </div>
          <a href={`http://${successData.tenantSlug}.localhost:3000/login`} className="btn-primary w-full justify-center !py-3.5 shadow-xl inline-flex items-center gap-2">
            Proceed to Login <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-30 orb" style={{ background: "var(--uc-purple)", filter: "blur(100px)" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-30 orb-2" style={{ background: "var(--uc-cyan)", filter: "blur(100px)" }} />
      <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full opacity-20 orb-3" style={{ background: "var(--uc-pink)", filter: "blur(100px)" }} />

      <div className="w-full max-w-md relative z-10 glass p-8 sm:p-10 rounded-[28px] shadow-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-white bg-gradient-to-br from-[#7c5cbf] to-[#d4608a] shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-amber-300" />
              U
            </div>
          </Link>
          <h1 className="font-display font-black text-3xl mb-2 tracking-tight" style={{ color: "var(--text-primary)" }}>
            Create Workspace
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Register your institution to get started
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 text-sm rounded-xl" style={{ background: "rgba(346.8, 77.2%, 49.8%, 0.1)", color: "hsl(var(--destructive))", border: "1px solid rgba(346.8, 77.2%, 49.8%, 0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Institution Name</label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input name="institutionName" required type="text" className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-shadow" placeholder="e.g. Stanford University" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }} />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Workspace Subdomain</label>
            <div className="relative flex items-center">
              <Globe className="absolute left-3.5 w-4 h-4 opacity-50" />
              <input name="subdomain" required type="text" className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-[105px] text-sm focus:outline-none focus:ring-2 transition-shadow" placeholder="stanford" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }} />
              <span className="absolute right-4 text-sm font-medium opacity-50">.unicore.app</span>
            </div>
          </div>
          
          <div className="h-px w-full my-4" style={{ background: "var(--border-subtle)" }} />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Admin Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input name="adminName" required type="text" className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-shadow" placeholder="John Doe" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input name="adminEmail" required type="email" className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-shadow" placeholder="admin@stanford.edu" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Admin Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input name="adminPassword" required type="password" minLength={8} className="w-full bg-transparent border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-shadow" placeholder="••••••••" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-4 !py-3.5 shadow-xl">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Registration <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm mt-8" style={{ color: "var(--text-secondary)" }}>
          Already have an account? <Link href="/login" className="font-semibold transition-colors hover:text-[#7c5cbf]">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
