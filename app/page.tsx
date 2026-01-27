import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  BarChart3,  
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Menu,
  Sparkles,
  Zap,
  Globe
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-violet-200 selection:text-violet-900 overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
              <LayoutDashboard size={22} />
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Unicore</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="#features" className="hover:text-violet-600 transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-violet-600 transition-colors">Testimonials</Link>
            <Link href="#pricing" className="hover:text-violet-600 transition-colors">Pricing</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-violet-700 shadow-sm transition-colors hover:bg-white/80">
                <Sparkles size={14} className="text-fuchsia-500" />
                <span>Reimagining Education Management</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                The <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">Colorful</span> Future of <br className="hidden md:inline" />
                Institute ERP
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 max-w-[800px] mx-auto leading-relaxed">
                Unicore brings vibrancy to your daily operations. Streamline everything from admissions to analytics with an interface that's as beautiful as it is powerful.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                <Link
                  href="/register"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-lg font-bold text-white shadow-lg shadow-violet-500/40 transition-all hover:shadow-violet-500/60 hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-lg font-bold text-slate-700 shadow-lg shadow-slate-200/50 transition-all hover:bg-slate-50 hover:scale-105 border border-slate-100"
                >
                  View Live Demogfd
                </Link>
              </div>
            </div>

            {/* Dashboard Preview with Glassmorphism */}
            <div className="mt-20 relative mx-auto max-w-6xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-30"></div>
              <div className="relative rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/20 bg-white/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-4 h-6 w-96 bg-white/50 rounded-md"></div>
                </div>
                <div className="aspect-[16/9] w-full bg-white/30 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-6 p-8 w-full h-full">
                    {/* Mock UI Elements */}
                    <div className="col-span-1 bg-white/60 rounded-xl shadow-sm p-4 space-y-3">
                      <div className="h-8 w-8 rounded-lg bg-violet-100"></div>
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                      <div className="h-3 w-16 bg-slate-100 rounded"></div>
                    </div>
                    <div className="col-span-3 grid grid-rows-2 gap-6">
                      <div className="bg-white/60 rounded-xl shadow-sm p-6 flex gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="h-6 w-32 bg-slate-200 rounded"></div>
                          <div className="h-32 bg-gradient-to-r from-violet-100 to-fuchsia-50 rounded-lg"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/60 rounded-xl shadow-sm"></div>
                        <div className="bg-white/60 rounded-xl shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/50 to-white -z-20"></div>

          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <span className="text-violet-600 font-bold tracking-wider uppercase text-sm">Features</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2 mb-6 text-slate-900">Everything you need, <br /> beautifully organized.</h2>
              <p className="text-xl text-slate-600 max-w-[700px] mx-auto">
                Unicore isn't just a tool; it's a delightful experience designed to make your institute run like clockwork.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-8 w-8 text-white" />}
                color="bg-violet-500"
                title="Student Management"
                description="Manage student profiles, attendance, and academic records in one centralized, vibrant database."
              />
              <FeatureCard
                icon={<CreditCard className="h-8 w-8 text-white" />}
                color="bg-fuchsia-500"
                title="Fee Collection"
                description="Automate fee reminders, generate invoices, and accept online payments securely."
              />
              <FeatureCard
                icon={<GraduationCap className="h-8 w-8 text-white" />}
                color="bg-orange-500"
                title="Academic Planning"
                description="Create timetables, manage curriculum, and track syllabus progress effortlessly."
              />
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8 text-white" />}
                color="bg-indigo-500"
                title="Advanced Analytics"
                description="Gain insights into institute performance with real-time dashboards and reports."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-8 w-8 text-white" />}
                color="bg-emerald-500"
                title="Secure & Reliable"
                description="Enterprise-grade security with daily backups and role-based access control."
              />
              <FeatureCard
                icon={<Globe className="h-8 w-8 text-white" />}
                color="bg-cyan-500"
                title="Multi-tenant Ready"
                description="Manage multiple branches or institutes from a single master admin panel."
              />
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section id="testimonials" className="py-24 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -z-10"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -z-10"></div>

          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block p-3 rounded-2xl bg-orange-100 text-orange-600 mb-6">
                  <Zap size={24} fill="currentColor" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-slate-900">
                  Trusted by modern institutes everywhere.
                </h2>
                <div className="glass-card p-8 rounded-3xl shadow-xl relative">
                  <div className="absolute -top-4 -left-4 text-6xl text-violet-300 font-serif">"</div>
                  <p className="text-xl text-slate-700 mb-8 relative z-10 leading-relaxed">
                    Unicore has completely transformed how we manage our administrative tasks. The interface is so intuitive and colorful, my staff actually enjoys using it!
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center font-bold text-white text-xl">
                      JD
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900">John Doe</p>
                      <p className="text-slate-500">Principal, St. Xavier's High School</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="glass-card h-40 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <span className="font-bold text-xl text-slate-400">Partner {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-900 -z-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 -z-10"></div>

          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white">
              Ready to color your world?
            </h2>
            <p className="text-violet-100 text-xl max-w-[600px] mx-auto mb-10">
              Join thousands of educators who trust Unicore. Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-violet-600 shadow-lg shadow-white/10 transition-all hover:bg-violet-50 hover:scale-105"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 bg-slate-50 border-t border-slate-200 text-slate-600 text-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white">
                  <LayoutDashboard size={18} />
                </div>
                <span>Unicore</span>
              </div>
              <p className="leading-relaxed">Making education management simple, efficient, and accessible for everyone.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-6 text-base">Product</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="hover:text-violet-600 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-violet-600 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-violet-600 transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-6 text-base">Company</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="hover:text-violet-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-violet-600 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-violet-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-6 text-base">Legal</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="hover:text-violet-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-violet-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2024 Unicore Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-violet-600 transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-violet-600 transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-violet-600 transition-colors">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, color, title, description }: { icon: React.ReactNode, color: string, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-violet-200/50 transition-all duration-300 hover:-translate-y-1">
      <div className={`mb-6 p-4 rounded-2xl ${color} w-fit shadow-md group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
