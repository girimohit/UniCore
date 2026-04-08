"use client";

const TESTIMONIALS = [
  {
    quote: "The multi-tenant architecture means each of our three campuses has its own isolated environment, yet we manage everything from a single admin panel. The timetable module alone saved us hours of manual scheduling.",
    name: "Dr. Ankit Sharma",
    role: "Dean of Academics, NIT Patna",
    initials: "AS",
    grad: "from-[#7c5cbf] to-[#d4608a]",
  },
  {
    quote: "The modular system is amazing — we started with just Attendance and Courses, then flipped on Exams and Results when we were ready. Zero downtime, zero migration headaches.",
    name: "Prof. Meera Joshi",
    role: "HOD Computer Science, IIT Indore",
    initials: "MJ",
    grad: "from-[#0ea5c9] to-[#7c5cbf]",
  },
  {
    quote: "As a student, seeing my entire week on the dynamic timetable with color-coded subjects, faculty names, and room numbers — it felt like Google Calendar for college. Finally a system that respects our time.",
    name: "Riya Patel",
    role: "B.Tech Student, IIIT Hyderabad",
    initials: "RP",
    grad: "from-[#2a9e75] to-[#0ea5c9]",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4" style={{ background: "var(--bg-elevated)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="tag tag-amber mb-4">Testimonials</div>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4">
            Loved by Institutions
          </h2>
          <p className="max-w-lg mx-auto text-lg font-light"
            style={{ color: "var(--text-secondary)" }}>
            Here's what administrators actually say after going live.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="uc-card p-7 flex flex-col gap-6"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,92,191,0.25)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "";
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#d4922a] text-sm">★</span>
                ))}
              </div>

              <p className="text-sm leading-relaxed italic flex-1"
                style={{ color: "var(--text-secondary)" }}>
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    font-display font-bold text-sm text-white bg-gradient-to-br ${t.grad} flex-shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
