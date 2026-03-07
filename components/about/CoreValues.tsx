import { Container } from "@/components/branding/Container";
import { Eye, Lightbulb, User } from "lucide-react";

const VALUES = [
  {
    title: "Transparency",
    description:
      "Clear pricing, open roadmaps, and honest communication. We build trust by bringing our users along for the journey.",
    icon: Eye,
  },
  {
    title: "Innovation",
    description:
      "Pushing the boundaries of what's possible with AI in sales, constantly iterating to deliver cutting-edge orchestration.",
    icon: Lightbulb,
  },
  {
    title: "Human-First AI",
    description:
      "Technology should serve human relationships. Our AI is designed to enhance authenticity, not sound robotic.",
    icon: User,
  },
];

export const CoreValues = () => {
  return (
    <section className="bg-slate-50 py-24 border-y border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-40 bg-linear-to-b from-white to-transparent"></div>

      <Container className="relative z-10 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-serif tracking-tight">
          Our Core Values
        </h2>
        <p className="max-w-xl mx-auto text-slate-500 font-medium text-sm leading-relaxed">
          The principles that guide every feature we ship and every conversation
          we have.
        </p>
      </Container>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES.map((value, i) => (
            <div
              key={i}
              className="p-8 bg-white border border-slate-200 rounded-[32px] shadow-xs group hover:shadow-xl transition-all duration-500"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white duration-500">
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">
                {value.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
