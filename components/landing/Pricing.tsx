import Link from "next/link";
import { ChevronRight } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "for 3 months",
    desc: "Perfect for small institutions just getting started.",
    features: [
      "Up to 200 students",
      "3 core modules",
      "Community support",
      "Standard sub-domain",
    ],
    cta: "Get Started Free",
    href: "/register",
    featured: false,
  },
  {
    name: "Professional",
    price: "₹9,999",
    period: "per month, billed annually",
    desc: "Full-featured suite for growing schools and colleges.",
    features: [
      "Up to 2,500 students",
      "All modules",
      "Fee & Payroll Management",
      "Automated Report Cards",
      "24/7 Priority Support",
    ],
    cta: "Start 14-Day Trial",
    href: "/register?plan=pro",
    featured: true,
  },
  {
    name: "Institutional",
    price: "Custom",
    period: "tailored to your scale",
    desc: "For large university networks and multi-campus institutions.",
    features: [
      "10,000+ students",
      "Multi-campus orchestration",
      "Custom branding & domains",
      "Advanced API & Webhooks",
      "Dedicated Success Manager",
    ],
    cta: "Speak to Sales",
    href: "/contact",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="tag tag-purple mb-4">Pricing</div>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4">
            Simple, Transparent
          </h2>
          <p
            className="max-w-lg mx-auto text-lg font-light"
            style={{ color: "var(--text-secondary)" }}
          >
            No hidden fees. No surprise bills. Scale with full confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`uc-card p-8 relative overflow-hidden ${p.featured ? "md:-mt-4 md:mb-4" : ""}`}
              style={
                p.featured
                  ? {
                      borderColor: "rgba(124,92,191,0.38)",
                      background: "var(--bg-elevated)",
                      boxShadow:
                        "0 0 0 1px rgba(124,92,191,0.15), 0 24px 80px rgba(124,92,191,0.10)",
                    }
                  : {}
              }
            >
              {p.featured && (
                <>
                  <div
                    className="absolute top-0 inset-x-0 h-0.5"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--uc-purple), var(--uc-pink))",
                    }}
                  />
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--uc-purple), var(--uc-pink))",
                    }}
                  >
                    Most Popular
                  </div>
                </>
              )}

              <div className="mb-6">
                <p
                  className="text-sm font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {p.name}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className={`font-display font-black text-5xl tracking-tight
                    ${p.featured ? "grad-purple" : ""}`}
                    style={!p.featured ? { color: "var(--text-primary)" } : {}}
                  >
                    {p.price}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {p.period}
                </p>
              </div>

              <p
                className="text-sm mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                {p.desc}
              </p>

              <ul className="flex flex-col gap-3 mb-8">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{
                        background: "rgba(42,158,117,0.12)",
                        color: "var(--uc-emerald)",
                        border: "1px solid rgba(42,158,117,0.22)",
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={p.href}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl
                  text-sm font-semibold transition-all duration-200
                  ${
                    p.featured
                      ? "btn-primary !rounded-xl !py-3 w-full justify-center"
                      : "btn-ghost !rounded-xl !py-3 w-full justify-center"
                  }`}
              >
                {p.cta} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
