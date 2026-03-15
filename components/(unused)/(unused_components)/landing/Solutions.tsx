import { Container } from "@/components/branding/Container";
import {
  Home,
  Terminal,
  Store,
  Heart,
  Smartphone,
  User,
  MailPlus,
  CarFront,
} from "lucide-react";

const industries = [
  {
    icon: Home,
    title: "Real Estate Professionals",
    description:
      "Automate property follow-ups and nurture buyer/seller relationships.",
  },
  {
    icon: Terminal,
    title: "SaaS & Tech",
    description:
      "Book more demos and close enterprise deals with AI-powered sequences.",
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
    description: "Engage volunteers with personalized communication sequences.",
  },
  {
    icon: Smartphone,
    title: "Insurance Professionals",
    description:
      "Scale your outreach without losing the personal touch that builds trust.",
  },
  {
    icon: User,
    title: "Virtual Assistants",
    description:
      "Scale your VA services with AI-powered follow-ups and never lose a client.",
  },
  {
    icon: CarFront,
    title: "Auto Sales Teams",
    description:
      "Turn showroom visits into sales with persistent, personalized outreach.",
  },
  {
    icon: MailPlus,
    title: "Recruiting Agencies",
    description:
      "Fill roles faster with AI-powered campaigns and automated follow-ups.",
  },
];

export const Solutions = () => {
  return (
    <section
      className="flex items-center py-16 md:py-24 lg:py-32 bg-white"
      id="solutions"
    >
      <Container>
        <div className="text-center mb-10 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20 uppercase tracking-widest shadow-sm">
            Perfect For Sales Teams
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-serif tracking-tight leading-[1.1]">
            Who is <span className="italic text-gradient">Drip Pilot</span> for?
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-light leading-relaxed">
            Tailored solutions for industries that rely on high-volume,
            high-quality follow-ups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group bg-slate-50 rounded-2xl p-6 border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 mb-4 transition-colors duration-300 group-hover:border-primary group-hover:text-primary">
                <industry.icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {industry.title}
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                {industry.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <span className="text-primary font-semibold text-sm tracking-wide">
            ...and many more
          </span>
        </div>
      </Container>
    </section>
  );
};
