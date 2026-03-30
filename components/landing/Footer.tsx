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
    <footer className="border-t px-4 pt-16 pb-8"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative w-8 h-8 rounded-xl flex items-center justify-center
                font-display font-black text-sm text-white
                bg-gradient-to-br from-[var(--uc-purple)] to-[var(--uc-pink)]
                shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="absolute -top-1 -right-1 w-2.5 h-2.5 text-[var(--uc-amber)]" />
                U
              </div>
              <span className="font-display font-bold text-base"
                style={{ color: "var(--text-primary)" }}>UNICORE</span>
            </Link>
            <p className="text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}>
              The multi-tenant ERP for education institutions that demand security, performance, and scale.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([col, links]) => (
            <div key={col}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--text-primary)" }}>{col}</p>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#"
                      className="text-sm transition-colors hover:underline"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.color = "var(--text-primary)")}
                      onMouseLeave={e =>
                        (e.currentTarget.style.color = "var(--text-muted)")}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 Semantic Systems. All rights reserved.
          </p>

          <div className="flex gap-2">
            {["X", "in", "gh", "yt"].map((icon) => (
              <button
                key={icon}
                className="w-8 h-8 rounded-lg border text-xs font-bold transition-all
                  hover:scale-110"
                style={{
                  borderColor: "var(--border-medium)",
                  background: "transparent",
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
                  el.style.background = "transparent";
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
