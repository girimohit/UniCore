const STATS = [
  { num: "99.9%", label: "Uptime SLA",       grad: "from-[#7c5cbf] to-[#d4608a]" },
  { num: "150+",  label: "Institutions",     grad: "from-[#0ea5c9] to-[#7c5cbf]" },
  { num: "10M+",  label: "Records Synced",   grad: "from-[#2a9e75] to-[#0ea5c9]" },
  { num: "48ms",  label: "Avg Response",     grad: "from-[#d4922a] to-[#d4608a]" },
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
