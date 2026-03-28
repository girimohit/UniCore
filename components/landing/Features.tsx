"use client";

const FEATURES = [
  {
    icon: "🗄",
    title: "Institution Isolation",
    desc: "Every institution gets a secure, isolated data context with Row-Level Security — no data leaks, ever.",
    glow: "rgba(124,92,191,0.25)",
    border: "rgba(124,92,191,0.4)",
    iconBg: "rgba(124,92,191,0.15)",
    iconBorder: "rgba(124,92,191,0.3)",
  },
  {
    icon: "⚡",
    title: "Edge Delivery",
    desc: "Tenant-aware middleware resolves subdomains before any server component renders, keeping latency under 50ms.",
    glow: "rgba(14,165,201,0.12)",
    border: "rgba(14,165,201,0.25)",
    iconBg: "rgba(14,165,201,0.09)",
    iconBorder: "rgba(14,165,201,0.20)",
  },
  {
    icon: "📊",
    title: "Advanced Analytics",
    desc: "Live aggregations, attendance distributions, and grade analytics scoped perfectly to each session.",
    glow: "rgba(42,158,117,0.12)",
    border: "rgba(42,158,117,0.24)",
    iconBg: "rgba(42,158,117,0.09)",
    iconBorder: "rgba(42,158,117,0.20)",
  },
  {
    icon: "🔐",
    title: "Role-Based RBAC",
    desc: "Granular access controls for Students, Faculty, and Institution Admins built deeply into every module.",
    glow: "rgba(212,96,138,0.12)",
    border: "rgba(212,96,138,0.24)",
    iconBg: "rgba(212,96,138,0.09)",
    iconBorder: "rgba(212,96,138,0.20)",
  },
  {
    icon: "🧩",
    title: "Modular System",
    desc: "Enable or disable Attendance, Library, Exams, Dorms and more — each institution picks its own stack.",
    glow: "rgba(212,146,42,0.12)",
    border: "rgba(212,146,42,0.24)",
    iconBg: "rgba(212,146,42,0.09)",
    iconBorder: "rgba(212,146,42,0.20)",
  },
  {
    icon: "📧",
    title: "Invitation Flows",
    desc: "Institutions onboard their students via branded invitation emails — no manual bulk imports needed.",
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
