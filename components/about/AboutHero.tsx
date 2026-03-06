import React from "react";
import { Container } from "@/components/branding/Container";

export const AboutHero = () => {
  return (
    <section className="bg-white py-24 pt-48 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent skew-x-12 transform origin-right"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-2/3 bg-linear-to-r from-secondary/5 to-transparent -skew-x-12 transform origin-left"></div>

      <Container className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-10 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          THE DRIP PILOT MISSION
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 font-serif leading-tight">
          Human Ingenuity, <br className="hidden md:block" />
          <span className="italic text-primary">AI Precision.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
          We are building the future of outbound sales. A platform where
          artificial intelligence amplifies human connection, rather than
          replacing it.
        </p>
      </Container>
    </section>
  );
};
