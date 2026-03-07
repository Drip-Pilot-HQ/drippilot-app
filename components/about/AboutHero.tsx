import { Container } from "@/components/branding/Container";

export const AboutHero = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden mesh-gradient py-24">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none"></div>

      <Container className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 border border-primary/20 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          The Drip Pilot Mission
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.1] text-slate-900">
          Human Ingenuity, <br className="hidden md:block" />
          <span className="text-gradient font-serif transition-all italic">
            AI Precision.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
          We are building the future of outbound sales. A platform where
          artificial intelligence amplifies human connection, rather than
          replacing it.
        </p>
      </Container>
    </section>
  );
};
