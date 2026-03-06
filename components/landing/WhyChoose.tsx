import React from "react";
import { Container } from "@/components/branding/Container";
import { Zap, Target, Plug } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description:
      "Launch your first campaign in under 5 minutes with our AI-powered templates.",
    color: "primary",
  },
  {
    icon: Target,
    title: "Unmatched Deliverability",
    description:
      "Our advanced algorithms ensure your emails land in the primary inbox, not spam.",
    color: "secondary",
  },
  {
    icon: Plug,
    title: "Seamless Integrations",
    description:
      "Connects flawlessly with Salesforce, HubSpot, and 100+ other tools via Zapier.",
    color: "accent",
  },
];

export const WhyChoose = () => {
  return (
    <section
      className="flex items-center py-24 bg-white text-slate-900"
      id="why-drippilot"
    >
      <Container>
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold mb-6 border border-white/20 uppercase tracking-wider">
            Why Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why choose Drip Pilot?
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            The intelligent choice for modern sales teams who demand results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center p-6 group">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                <reason.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-slate-400">{reason.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
