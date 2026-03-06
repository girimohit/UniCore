"use client";

const TESTIMONIALS = [
  {
    quote: "UNICORE transformed how we manage 8,000 students. The tenant isolation means every department feels like it has its own platform, yet everything stays unified.",
    name: "Rajesh Kumar",
    role: "CTO, Delhi University",
    initials: "RK",
    grad: "from-[#7c5cbf] to-[#d4608a]",
  },
  {
    quote: "The attendance pipeline handles our 12,000 daily check-ins without breaking a sweat. The analytics surface insights we simply didn't have before.",
    name: "Sarah Park",
    role: "Director of IT, Seoul Institute",
    initials: "SP",
    grad: "from-[#0ea5c9] to-[#7c5cbf]",
  },
  {
    quote: "We deployed across 14 campuses in a single week. The modular setup meant we only configured what we actually needed — no bloat, no wasted budget.",
    name: "Amara Chen",
    role: "VP Technology, PanAfrica EDU",
    initials: "AC",
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
