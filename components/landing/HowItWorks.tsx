import React from "react";
import { Container } from "@/components/branding/Container";
import { UploadCloud, Zap, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Import your leads",
    description:
      "Connect your CRM or upload a CSV. Our AI cleans and validates every lead instantly.",
    colorClass: "text-secondary border-secondary/20",
    step: "01",
  },
  {
    icon: Zap,
    title: "Automate the outreach",
    description:
      "Choose a template or let the AI generate your sequence. Configure triggers and launch.",
    colorClass: "text-primary border-primary/20",
    step: "02",
  },
  {
    icon: CheckCircle,
    title: "Close the deal",
    description:
      "Drip Pilot handles the follow-ups automatically so you engage only when leads are ready.",
    colorClass: "text-secondary border-secondary/20",
    step: "03",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white" id="how-it-works">
      <Container>
        <div className="text-center mb-12 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20 uppercase tracking-widest shadow-sm">
            Fast Setup
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 font-serif tracking-tight leading-[1.1]">
            Three steps to hyper{" "}
            <span className="italic text-gradient">growth</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Get your first campaign running in less than 10 minutes.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center"
              >
                {/* step number */}
                <div className="absolute -top-6 text-xs tracking-widest text-slate-400 font-semibold">
                  STEP {step.step}
                </div>

                {/* icon */}
                <div
                  className={`w-20 h-20 rounded-full bg-white border-4 shadow-lg flex items-center justify-center mb-8 transition-transform duration-300 hover:scale-105 ${step.colorClass}`}
                >
                  <step.icon className="w-9 h-9" />
                </div>

                {/* content */}
                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  {step.title}
                </h3>

                <p className="text-slate-500 leading-relaxed max-w-xs">
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
