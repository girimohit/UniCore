import Navbar       from "@/components/landing/Navbar";
import Hero         from "@/components/landing/Hero";
import Stats        from "@/components/landing/Stats";
import Features     from "@/components/landing/Features";
import HowItWorks   from "@/components/landing/HowItWorks";
import Modules      from "@/components/landing/Modules";
import Testimonials from "@/components/landing/Testimonials";
import Pricing      from "@/components/landing/Pricing";
import CTA          from "@/components/landing/CTA";
import Footer       from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Modules />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
