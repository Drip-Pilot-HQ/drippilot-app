import { Container } from "@/components/branding/Container";
import { Zap, Target, Plug } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description:
      "Launch your first campaign in under 10 minutes with our AI-powered campaign builder.",
  },
  {
    icon: Target,
    title: "Unmatched Deliverability",
    description:
      "Our advanced algorithms ensure your messages land in the primary inbox, not spam.",
  },
  {
    icon: Plug,
    title: "Seamless CRMs Integrations",
    description:
      "Connects flawlessly with 100+ CRMs using Zapier, Make or n8n via Webhooks.",
  },
];

export const WhyChoose = () => {
  return (
    <section
      className="py-16 md:py-24 lg:py-32 bg-white text-slate-900"
      id="why-drippilot"
    >
      <Container className="pb-16 lg:pb-32">
        <div className="text-center mb-10 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20 uppercase tracking-widest shadow-sm">
            Why Us
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif tracking-tight leading-[1.1]">
            Why choose <span className="italic text-gradient">Drip Pilot?</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            The intelligent choice for modern sales teams who demand results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group text-center p-8 rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/10">
                <reason.icon className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold mb-3 text-slate-900">
                {reason.title}
              </h3>

              <p className="text-slate-500 leading-relaxed text-sm">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
