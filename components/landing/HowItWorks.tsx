import React from "react";
import { Container } from "@/components/branding/Container";
import { UploadCloud, Zap, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "1. Import",
    description:
      "Connect your CRM or upload a CSV. Our AI cleans and validates every lead instantly.",
    colorClass: "text-secondary border-secondary/20",
  },
  {
    icon: Zap,
    title: "2. Automate",
    description:
      "Choose a template or let the AI write your sequence. Set your triggers and go live.",
    colorClass: "text-primary border-primary/20",
  },
  {
    icon: CheckCircle,
    title: "3. Close",
    description:
      "Drip Pilot handles the follow-ups. You jump in only when the lead is ready to buy.",
    colorClass: "text-secondary border-secondary/20",
  },
];

export const HowItWorks = () => {
  return (
    <section className="flex items-center py-32 bg-white" id="how-it-works">
      <Container>
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20 uppercase tracking-wider">
            Fast Setup
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Three steps to hyper-growth
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Get your first campaign running in less than 5 minutes.
          </p>
        </div>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-secondary via-primary to-accent opacity-20 hidden lg:block -translate-y-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-20 h-20 rounded-full bg-white border-4 shadow-xl flex items-center justify-center mb-8 transition-transform hover:scale-110 ${step.colorClass}`}
                >
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
