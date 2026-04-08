"use client";

const MODULES = [
  {
    badge: "● Core",
    badgeClass: "tag-purple",
    title: "Academic Hub",
    desc: "Departments, courses, subjects, and faculty assignments — the foundational data layer that powers every other module in UniCore.",
    pills: ["Departments", "Courses", "Subjects", "Faculty", "Semesters"],
    accent: "#7c5cbf",
    glow: "rgba(124,92,191,0.10)",
  },
  {
    badge: "● Scheduling",
    badgeClass: "tag-cyan",
    title: "Dynamic Timetable",
    desc: "A high-fidelity, absolute timeline engine that renders weekly schedules with precision-positioned slot cards, faculty details, and room assignments.",
    pills: ["Timeline Grid", "Slot Cards", "Faculty Map", "Room Assign", "Today's View"],
    accent: "#0ea5c9",
    glow: "rgba(14,165,201,0.08)",
  },
  {
    badge: "● Tracking",
    badgeClass: "tag-pink",
    title: "Attendance Engine",
    desc: "Subject-wise, slot-aware attendance tracking with automated shortage alerts and real-time eligibility monitoring across courses and semesters.",
    pills: ["Daily Roll", "Subject-wise", "Shortage Alerts", "Reports", "Faculty Mark"],
    accent: "#d4608a",
    glow: "rgba(212,96,138,0.08)",
  },
  {
    badge: "● Evaluation",
    badgeClass: "tag-amber",
    title: "Exams & Results",
    desc: "Schedule exams with configurable types and max marks, publish graded results per student, and manage the entire evaluation pipeline from one hub.",
    pills: ["Scheduling", "Result Entry", "Grading", "Publishing", "Analytics"],
    accent: "#d4922a",
    glow: "rgba(212,146,42,0.08)",
  },
  {
    badge: "● Communication",
    badgeClass: "tag-purple",
    title: "Notices & Invitations",
    desc: "Role-targeted institutional notices and a secure, token-based email invitation system for onboarding students, faculty, and administrators.",
    pills: ["Notices", "Email Invites", "Role Targeting", "Token Auth", "Templates"],
    accent: "#7c5cbf",
    glow: "rgba(124,92,191,0.10)",
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
