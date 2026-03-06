import Link from "next/link";
import { ChevronRight, CalendarCheck } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #7c5cbf, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="uc-card p-12 md:p-16 text-center"
          style={{
            borderColor: "rgba(124,92,191,0.22)",
            background: "var(--bg-elevated)",
          }}>
          {/* Top accent bar */}
          <div className="absolute top-0 inset-x-0 h-0.5 rounded-t-[20px]"
            style={{ background: "linear-gradient(90deg, #7c5cbf, #d4608a, #d4922a, #0ea5c9)" }} />

          <div className="tag tag-purple mb-6 mx-auto">Get Started Today</div>

          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-5">
            Ready to{" "}
            <span className="grad-purple">isolate</span> and{" "}
            <span className="grad-cyan">scale</span>?
          </h2>

          <p className="text-lg font-light mb-10 max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}>
            Deploy UNICORE on our managed cloud or your own private infrastructure.
            No credit card required to start.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-base px-8 py-3.5">
              Start Building Free <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/demo" className="btn-ghost text-base px-8 py-3.5">
              <CalendarCheck className="w-4 h-4" />
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
