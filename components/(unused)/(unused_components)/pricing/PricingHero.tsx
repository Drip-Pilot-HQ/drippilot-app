import { Container } from "@/components/branding/Container";

export const PricingHero = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden mesh-gradient">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none"></div>
      <Container className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 border border-primary/20 uppercase tracking-widest">
          Advanced Marketing Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1] text-slate-900">
          Predictable Pricing for <br />
          <span className="text-gradient font-serif transition-all">
            High-Octane
          </span>{" "}
          Teams
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Scale your outreach with precision. Choose the engine that fits your
          trajectory.
        </p>
        <span className="text-slate-500">
          All plans include 7 days free trial
        </span>
      </Container>
    </section>
  );
};
