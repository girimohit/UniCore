"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

const FOOTER_LINKS = {
  Product:  ["Features", "Modules", "Pricing", "Changelog", "Roadmap"],
  Company:  ["About", "Blog", "Careers", "Press", "Contact"],
  Developers: ["API Docs", "SDK", "Webhooks", "Status Page", "GitHub"],
  Legal:    ["Privacy", "Terms", "Security", "Cookies"],
};

export default function Footer() {
  return (
    <footer className="border-t px-6 sm:px-8 pt-12 sm:pt-20 pb-10"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 pr-4">
            <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center
                font-display font-black text-sm text-white
                bg-gradient-to-br from-[var(--uc-purple)] to-[var(--uc-pink)]
                shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-[var(--uc-amber)]" />
                U
              </div>
              <span className="font-display font-black text-lg tracking-tight"
                style={{ color: "var(--text-primary)" }}>UNICORE</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs md:max-w-none"
              style={{ color: "var(--text-muted)" }}>
              The multi-tenant ERP for education institutions that demand absolute security, performance, and scale at the next level.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([col, links]) => (
            <div key={col} className="col-span-1">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 opacity-80"
                style={{ color: "var(--text-primary)" }}>{col}</p>
              <ul className="flex flex-col gap-2">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#"
                      className="text-sm transition-all hover:translate-x-1 inline-block"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = "var(--text-primary)";
                        e.currentTarget.style.fontWeight = "600";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = "var(--text-muted)";
                        e.currentTarget.style.fontWeight = "400";
                      }}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 pt-10 border-t"
          style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              © 2026 Semantic Systems Inc. All rights reserved.
            </p>
            <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">
              Built for sub-second performance
            </p>
          </div>

          <div className="flex gap-3">
            {["X", "in", "gh", "yt"].map((icon) => (
              <button
                key={icon}
                className="w-10 h-10 rounded-xl border text-sm font-bold transition-all
                  hover:scale-110 active:scale-95"
                style={{
                  borderColor: "var(--border-medium)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-muted)",
                  fontFamily: "monospace",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(124,92,191,0.10)";
                  el.style.borderColor = "rgba(124,92,191,0.30)";
                  el.style.color = "var(--uc-purple)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.background = "var(--bg-elevated)";
                  el.style.borderColor = "var(--border-medium)";
                  el.style.color = "var(--text-muted)";
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
