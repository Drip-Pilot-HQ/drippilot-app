import { Container } from "@/components/branding/Container";
import { Button } from "@/components/branding/Button";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";

export const CTA = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <Container>
        <div className="relative overflow-hidden bg-slate-950 rounded-[40px] p-8 md:p-16 lg:p-20 shadow-2xl">
          {/* Authentic Patterns & Glows from the Overage Banner */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            {/* Left Content: Structured like the Overage Banner */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-8 border border-primary/30">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen Outreach
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-serif leading-tight">
                Ready to scale your <br className="hidden md:block" />
                outreach <span className="text-primary italic">engine?</span>
              </h2>

              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-10">
                Join 2,000+ high-performance teams using Drip Pilot to turn
                standard sequences into intelligent, revenue-driving
                conversations.
              </p>

              {/* Mini Features List */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3">
                {["7-day free trial", "Setup < 10 mins", "Cancel anytime"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-widest">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Right Content: Buttons and Trust Visuals */}
            <div className="flex flex-col items-center lg:items-end gap-8 min-w-[320px]">
              <div className="flex flex-col gap-4 w-full">
                <Button
                  variant="primary"
                  size="md"
                  className="shadow-2xl shadow-primary/25 group/btn text-xl h-auto"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>

                <Button
                  variant="dark"
                  size="md"
                  className="bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md text-xl h-auto"
                >
                  Request Demo
                </Button>
              </div>

              {/* Credibility Visual */}
              <div className="flex flex-col items-center lg:items-end gap-4 w-full pt-8 border-t border-white/10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden"
                    >
                      <Image
                        src={`https://i.pravatar.cc/100?img=${i + 20}`}
                        alt="User"
                        className="w-full h-full object-cover grayscale opacity-70"
                        height={50}
                        width={50}
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                    +2k
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center lg:text-right">
                  Empowering teams <br /> worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
