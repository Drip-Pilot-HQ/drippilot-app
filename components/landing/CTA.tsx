import React from "react";
import { Container } from "@/components/branding/Container";
import { Button } from "@/components/branding/Button";

export const CTA = () => {
  return (
    <section className="flex items-center py-24 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
      <Container className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Stop sending messages.
          <br />
          Start starting conversations.
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
          Join 10,000+ sales professionals who are closing more deals with less
          effort.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="md">
            Get Started
          </Button>
          <Button
            variant="dark"
            size="md"
            className="border border-white/20 hover:bg-white/20 backdrop-blur-sm"
          >
            Request demo
          </Button>
        </div>
      </Container>
    </section>
  );
};
