import React from "react";
import Link from "next/link";
import { Container } from "@/components/branding/Container";
import { Home, Terminal, Store, Heart, ArrowRight } from "lucide-react";

const industries = [
  {
    icon: Home,
    title: "Real Estate",
    description:
      "Automate property follow-ups and nurture buyer/seller relationships.",
  },
  {
    icon: Terminal,
    title: "SaaS & Tech",
    description:
      "Book more demos and close enterprise deals with targeted outreach.",
  },
  {
    icon: Store,
    title: "Agencies",
    description:
      "Manage multiple client campaigns from a single centralized dashboard.",
  },
  {
    icon: Heart,
    title: "Non-Profits",
    description:
      "Engage donors and volunteers with personalized communication sequences.",
  },
];

export const Solutions = () => {
  return (
    <section className="flex items-center py-24 bg-white" id="solutions">
      <Container>
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20 uppercase tracking-wider">
            Perfect For Sales Teams
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Who is Drip Pilot for?
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light leading-relaxed mb-8">
            Tailored solutions for industries that rely on high-volume,
            high-quality follow-ups.
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 font-semibold text-secondary hover:gap-3 transition-all"
          >
            View all 12 industries <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 mb-4 group-hover:border-secondary transition-colors">
                <industry.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {industry.title}
              </h3>
              <p className="text-sm text-slate-500">{industry.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
