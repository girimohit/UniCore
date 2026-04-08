const STATS = [
  { num: "3",     label: "User Roles",         grad: "from-[var(--uc-purple)] to-[var(--uc-pink)]" },
  { num: "5+",   label: "Modules",            grad: "from-[var(--uc-cyan)] to-[var(--uc-purple)]" },
  { num: "100%",  label: "Tenant Isolation",    grad: "from-[var(--uc-emerald)] to-[var(--uc-cyan)]" },
  // { num: "∞",     label: "Institutions",        grad: "from-[var(--uc-amber)] to-[var(--uc-pink)]" },
  { num: "48ms",     label: "Response Time",        grad: "from-[var(--uc-amber)] to-[var(--uc-pink)]" },
];

export default function Stats() {
  return (
    <div className="border-y" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-surface)" }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={s.label} className="text-center relative">
              {i > 0 && (
                <div className="hidden md:block absolute left-0 top-1/4 bottom-1/4 w-px"
                  style={{ background: "var(--border-subtle)" }} />
              )}
              <div className={`font-display font-black text-4xl md:text-5xl
                bg-gradient-to-r ${s.grad} bg-clip-text text-transparent mb-1.5`}>
                {s.num}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
