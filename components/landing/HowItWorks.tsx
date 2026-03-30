const STEPS = [
  {
    num: "01",
    title: "Register Institution",
    desc: "Sign up and configure your institution profile, subdomain, and branding in minutes.",
    grad: "from-[var(--uc-purple)] to-[var(--uc-purple-soft)]",
    color: "var(--uc-purple)",
  },
  {
    num: "02",
    title: "Pick Your Modules",
    desc: "Choose from Attendance, Exams, Library, Finance, and more — only pay for what you need.",
    grad: "from-[var(--uc-pink)] to-[var(--uc-pink-soft)]",
    color: "var(--uc-pink)",
  },
  {
    num: "03",
    title: "Invite Your Team",
    desc: "Add admins, faculty, and staff. Send branded email invitations to students automatically.",
    grad: "from-[var(--uc-cyan)] to-[var(--uc-cyan-soft)]",
    color: "var(--uc-cyan)",
  },
  {
    num: "04",
    title: "Go Live",
    desc: "Import data via CSV or API, run a quick checklist, and launch to your entire institution.",
    grad: "from-[var(--uc-emerald)] to-[var(--uc-cyan)]",
    color: "var(--uc-emerald)",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4" style={{ background: "var(--bg-elevated)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="tag tag-cyan mb-4">How It Works</div>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4">
            Up in Minutes
          </h2>
          <p className="max-w-lg mx-auto text-lg font-light"
            style={{ color: "var(--text-secondary)" }}>
            A streamlined onboarding designed for institutions, not engineers.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
            style={{ background: "var(--border-medium)" }}>
            <div className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, var(--uc-purple), var(--uc-pink), var(--uc-cyan), var(--uc-emerald))",
                opacity: 0.5,
              }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex flex-col items-center text-center relative">
                {/* Circle */}
                <div
                  className={`
                    relative z-10 w-16 h-16 rounded-full flex items-center justify-center
                    font-display font-black text-xl text-white mb-6
                    bg-gradient-to-br ${s.grad}
                    shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer
                  `}
                  style={{ boxShadow: `0 8px 24px ${s.color}33` }}
                >
                  {s.num}
                </div>

                <h3 className="font-display font-bold text-base mb-2"
                  style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
