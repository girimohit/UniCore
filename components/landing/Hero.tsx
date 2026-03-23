"use client";

import Link from "next/link";
import { ChevronRight, MonitorSmartphone, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-4 overflow-hidden text-center">

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb absolute -top-32 -left-24 w-[600px] h-[600px] rounded-full opacity-[0.2]"
          style={{ background: "radial-gradient(circle, #7c5cbf, transparent 70%)", filter: "blur(80px)" }} />
        <div className="orb orb-2 absolute top-16 -right-16 w-[500px] h-[500px] rounded-full opacity-[0.18]"
          style={{ background: "radial-gradient(circle, #0ea5c9, transparent 70%)", filter: "blur(80px)" }} />
        <div className="orb orb-3 absolute -bottom-16 left-1/3 w-[450px] h-[450px] rounded-full opacity-[0.16]"
          style={{ background: "radial-gradient(circle, #d4608a, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Badge */}
      <div className="fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8
        border text-sm font-medium"
        style={{
          background: "var(--bg-elevated)",
          borderColor: "var(--border-medium)",
          color: "var(--uc-purple)"
        }}>
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[#7c5cbf] inline-block" />
        v2.0 — The Next-Gen Education ERP is live
      </div>

      {/* Headline */}
      <h1 className="fade-up delay-1 font-display font-black leading-[1.06] tracking-tight
        text-5xl sm:text-6xl md:text-7xl lg:text-[82px] max-w-5xl mb-6">
        One Platform.<br />
        <span className="grad-all">Every Institution.</span>
      </h1>

      {/* Sub */}
      <p className="fade-up delay-2 max-w-xl text-lg sm:text-xl font-light mb-10 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}>
        UNICORE is a multi-tenant ERP for education — isolated environments, modular
        features, and role-based access for students, faculty, and admins.
      </p>

      {/* CTA buttons */}
      <div className="fade-up delay-3 flex flex-col sm:flex-row gap-4 items-center mb-20">
        <Link href="/register" className="btn-primary text-base px-8 py-3.5">
          Register Your Institution <ChevronRight className="w-4 h-4" />
        </Link>
        <Link href="/demo" className="btn-ghost text-base px-8 py-3.5">
          <MonitorSmartphone className="w-4 h-4" />
          Live Demo
        </Link>
      </div>

      {/* Trust strip */}
      <div className="fade-up delay-4 flex flex-wrap justify-center gap-x-8 gap-y-2 mb-16">
        {["No credit card required", "Free up to 200 students", "Deploy in minutes"].map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-sm"
            style={{ color: "var(--text-muted)" }}>
            <span className="text-[#2a9e75]">✓</span> {t}
          </span>
        ))}
      </div>

      {/* Dashboard mock */}
      <div className="fade-up delay-5 w-full max-w-5xl rounded-2xl overflow-hidden border shadow-2xl"
        style={{
          borderColor: "var(--border-medium)",
          background: "var(--bg-surface)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.3), 0 0 0 1px var(--border-subtle)"
        }}>
        {/* Titlebar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#f43f5e]" />
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          </div>
          <div className="flex-1 mx-4">
            <div className="mx-auto w-48 h-5 rounded-md text-xs flex items-center justify-center
              font-mono"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-muted)",
                border: "1px solid var(--border-subtle)"
              }}>
              demo.unicore.app/admin
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[200px_1fr] h-56">
          {/* Sidebar */}
          <div className="border-r p-3 flex flex-col gap-1.5"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
            {[
              { icon: "⊞", label: "Dashboard", active: true, color: "#7c5cbf" },
              { icon: "👥", label: "Students",   active: false },
              { icon: "📚", label: "Courses",    active: false },
              { icon: "✓",  label: "Attendance", active: false },
              { icon: "📊", label: "Analytics",  active: false },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all"
                style={{
                  background: item.active ? "rgba(124,92,191,0.12)" : "transparent",
                  color: item.active ? "#7c5cbf" : "var(--text-muted)",
                }}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="p-4 grid grid-cols-3 gap-3 content-start">
            {[
              { label: "Total Students", value: "12,489", pct: 72,
                grad: "from-[#7c5cbf] to-[#d4608a]" },
              { label: "Active Courses",  value: "342",    pct: 55,
                grad: "from-[#0ea5c9] to-[#7c5cbf]" },
              { label: "Attendance Rate", value: "94.2%",  pct: 88,
                grad: "from-[#2a9e75] to-[#0ea5c9]" },
            ].map((c) => (
              <div key={c.label} className="rounded-xl p-3 border"
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)"
                }}>
                <p className="text-[11px] mb-1" style={{ color: "var(--text-muted)" }}>{c.label}</p>
                <p className={`font-display font-black text-xl bg-gradient-to-r ${c.grad}
                  bg-clip-text text-transparent`}>{c.value}</p>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--border-subtle)" }}>
                  <div className={`h-full rounded-full bg-gradient-to-r ${c.grad} fill-animate`}
                    style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
