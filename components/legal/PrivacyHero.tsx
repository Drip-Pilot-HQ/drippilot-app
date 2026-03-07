import { Container } from "@/components/branding/Container";
import { ShieldCheck } from "lucide-react";

export const PrivacyHero = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden mesh-gradient py-24">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none"></div>

      <Container className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 tracking-widest uppercase shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          Legal & Compliance
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.1] text-slate-900">
          Your Privacy is <br className="hidden md:block" />
          <span className="text-gradient font-serif transition-all italic">
            Our Priority
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Last Updated: March 7, 2024
        </p>
      </Container>
    </section>
  );
};
