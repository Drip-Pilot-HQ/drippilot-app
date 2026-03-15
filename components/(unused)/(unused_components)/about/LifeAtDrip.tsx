import { Container } from "@/components/branding/Container";
import { CheckCircle2 } from "lucide-react";

export const LifeAtDrip = () => {
  return (
    <section className="bg-slate-50 py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-white/80 to-transparent"></div>

      <Container className="relative z-10 text-center mb-16">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-serif tracking-tight leading-[1.1]">
          Life at <span className="italic text-primary">Drip Pilot</span>
        </h2>
        <p className="max-w-xl mx-auto text-slate-500 font-light text-lg md:text-xl leading-relaxed">
          We are a remote-first collective of engineers, designers, and growth
          experts dedicated to building premium software.
        </p>
      </Container>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-white border border-slate-200 rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500 group">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif">
              Craftsmanship Matters
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
              We believe software is a craft. From the architecture of our
              backend to the padding of a button, we sweat the details because
              premium products require premium care.
            </p>
            <div className="space-y-4">
              {[
                "High-fidelity design culture",
                "Zero-defect mentality",
                "Continuous feedback loop",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 tracking-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 bg-white border border-slate-200 rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500 group">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif">
              Asynchronous Flow
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
              We respect deep work. Our culture is built around async
              communication, allowing our team to find their flow state and
              produce their best work without constant interruption.
            </p>
            <div className="space-y-4">
              {[
                "Minimal meetings",
                "Written-first documentation",
                "Flexible deep work hours",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 tracking-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
