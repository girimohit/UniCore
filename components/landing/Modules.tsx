"use client";

const MODULES = [
  {
    badge: "● Academic",
    badgeClass: "tag-purple",
    title: "Academic Management",
    desc: "Full-cycle tracking from enrollment to graduation — grades, transcripts, credits, degree audits, and timetables, all interconnected.",
    pills: ["Grade Book", "Transcripts", "Timetables", "Degree Audit", "Enrollment"],
    accent: "#7c5cbf",
    glow: "rgba(124,92,191,0.10)",
  },
  {
    badge: "● HR Suite",
    badgeClass: "tag-cyan",
    title: "Faculty & Staff",
    desc: "Manage payroll, leave management, performance reviews, and contract renewals — all from a unified HR dashboard.",
    pills: ["Payroll", "Leave Mgmt", "Reviews", "Contracts", "Departments"],
    accent: "#0ea5c9",
    glow: "rgba(14,165,201,0.08)",
  },
  {
    badge: "● Finance",
    badgeClass: "tag-pink",
    title: "Fee Management",
    desc: "Automate fee collection, generate invoices, track overdue payments, and reconcile with your existing accounting tools.",
    pills: ["Invoicing", "Payments", "Waivers", "Reconcile", "Reports"],
    accent: "#d4608a",
    glow: "rgba(212,96,138,0.08)",
  },
  {
    badge: "● Attendance",
    badgeClass: "tag-amber",
    title: "Attendance Engine",
    desc: "Bulk attendance pipelines handling thousands of daily records with automated notifications and shortage alerts.",
    pills: ["Daily Roll", "Bulk Import", "Alerts", "Reports", "RFID-ready"],
    accent: "#d4922a",
    glow: "rgba(212,146,42,0.08)",
  },
  {
    badge: "● Exams",
    badgeClass: "tag-purple",
    title: "Examination Hub",
    desc: "Schedule exams, assign halls, publish results, and generate hall tickets — the entire exam cycle in one place.",
    pills: ["Scheduling", "Hall Tickets", "Results", "Grading", "Rank Lists"],
    accent: "#7c5cbf",
    glow: "rgba(124,92,191,0.10)",
  },
  {
    badge: "● Library",
    badgeClass: "tag-cyan",
    title: "Resource Center",
    desc: "Physical and digital catalog management with RFID integration, inter-library loans, and borrowing analytics.",
    pills: ["Catalog", "RFID", "Loans", "Fines", "E-Books"],
    accent: "#0ea5c9",
    glow: "rgba(14,165,201,0.08)",
  },
];

export default function Modules() {
  return (
    <section id="modules" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="tag tag-pink mb-4">Module Ecosystem</div>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4">
            Everything in One Platform
          </h2>
          <p className="max-w-lg mx-auto text-lg font-light"
            style={{ color: "var(--text-secondary)" }}>
            Powerful, specialized modules that snap into your institution's platform. Enable only what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m) => (
            <div
              key={m.title}
              className="uc-card p-7 relative overflow-hidden group cursor-pointer"
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${m.accent}40`;
                el.style.boxShadow = `0 20px 60px ${m.glow}`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "";
                el.style.boxShadow = "";
              }}
            >
              {/* Background glow blob */}
              <div
                className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: m.accent, filter: "blur(48px)" }}
              />

              <div className={`tag ${m.badgeClass} mb-5`}>{m.badge}</div>
              <h3 className="font-display font-bold text-xl mb-3"
                style={{ color: "var(--text-primary)" }}>{m.title}</h3>
              <p className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--text-secondary)" }}>{m.desc}</p>

              <div className="flex flex-wrap gap-2">
                {m.pills.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border"
                    style={{
                      background: "var(--bg-elevated)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
