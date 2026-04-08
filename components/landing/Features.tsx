"use client";

const FEATURES = [
  {
    icon: "🏫",
    title: "Multi-Tenant Architecture",
    desc: "Every institution operates in a fully isolated environment with its own subdomain, data context, and module configuration — zero cross-contamination.",
    glow: "rgba(124,92,191,0.25)",
    border: "rgba(124,92,191,0.4)",
    iconBg: "rgba(124,92,191,0.15)",
    iconBorder: "rgba(124,92,191,0.3)",
  },
  {
    icon: "🗓",
    title: "Dynamic Timetabling",
    desc: "Absolute timeline-based scheduling engine with high-fidelity slot cards, faculty mapping, room assignment, and deterministic color branding per subject.",
    glow: "rgba(14,165,201,0.12)",
    border: "rgba(14,165,201,0.25)",
    iconBg: "rgba(14,165,201,0.09)",
    iconBorder: "rgba(14,165,201,0.20)",
  },
  {
    icon: "✅",
    title: "Attendance Intelligence",
    desc: "Real-time presence tracking with automated shortage alerts, eligibility warnings, and subject-wise distribution analytics for faculty and students.",
    glow: "rgba(42,158,117,0.12)",
    border: "rgba(42,158,117,0.24)",
    iconBg: "rgba(42,158,117,0.09)",
    iconBorder: "rgba(42,158,117,0.20)",
  },
  {
    icon: "🔐",
    title: "Role-Based Access",
    desc: "Granular access control for Super Admins, Institution Admins, Faculty, and Students — each role sees only what they need, nothing more.",
    glow: "rgba(212,96,138,0.12)",
    border: "rgba(212,96,138,0.24)",
    iconBg: "rgba(212,96,138,0.09)",
    iconBorder: "rgba(212,96,138,0.20)",
  },
  {
    icon: "🧩",
    title: "Modular Registry",
    desc: "Snap-in module system where institution admins can toggle Attendance, Timetable, Exams, Results, and Notices on or off from a single settings panel.",
    glow: "rgba(212,146,42,0.12)",
    border: "rgba(212,146,42,0.24)",
    iconBg: "rgba(212,146,42,0.09)",
    iconBorder: "rgba(212,146,42,0.20)",
  },
  {
    icon: "📧",
    title: "Invitation System",
    desc: "Institutions onboard students and faculty via secure, token-based email invitations — no manual bulk imports or spreadsheets required.",
    glow: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.24)",
    iconBg: "rgba(139,92,246,0.09)",
    iconBorder: "rgba(139,92,246,0.20)",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="tag tag-purple mb-4">Core Features</div>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4">
            Unmatched Capabilities
          </h2>
          <p className="max-w-lg mx-auto text-lg font-light"
            style={{ color: "var(--text-secondary)" }}>
            Everything your institution needs, built on a metadata-driven, API-first foundation.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="uc-card p-7 group cursor-pointer"
              style={{
                "--hover-glow": f.glow,
                "--hover-border": f.border,
              } as React.CSSProperties}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = f.border;
                el.style.boxShadow = `0 20px 60px ${f.glow.replace('0.14', '0.08').replace('0.12', '0.06')}`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "";
                el.style.boxShadow = "";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 border transition-transform duration-300 group-hover:scale-110"
                style={{ background: f.iconBg, borderColor: f.iconBorder }}
              >
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-lg mb-2.5"
                style={{ color: "var(--text-primary)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
