import React from "react";
import { Container } from "@/components/branding/Container";
import Image from "next/image";

export const AboutStory = () => {
  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image/Visual */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[48px] blur-2xl group-hover:bg-primary/10 transition-all duration-700"></div>
            <div className="relative bg-slate-50 border border-white/40 shadow-2xl rounded-[40px] overflow-hidden p-4 backdrop-blur-xl">
              <Image
                src="/assets/about_story_abstract_visual.png"
                alt="Story Illustration"
                width={800}
                height={800}
                className="w-full h-full object-cover rounded-[32px] group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>

          {/* Right: Text */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif leading-tight">
              The genesis of <br />
              <span className="italic text-primary">a new standard.</span>
            </h2>

            <div className="space-y-6 text-slate-500 font-medium text-base leading-relaxed">
              <p>
                In 2024, our founders looked at the landscape of sales
                engagement platforms and saw a sea of complexity. Teams were
                drowning in clunky interfaces, unpredictable automation, and
                robotic outreach that damaged brand reputation.
              </p>
              <p>
                They envisioned something different: an orchestration engine
                that was as powerful as it was elegant. A tool that didn&apos;t
                just automate emails, but intelligently navigated the nuances of
                B2B communication.
              </p>
              <p>
                Drip Pilot was born from this frustration. Built from the ground
                up with a proprietary AI architecture, we stripped away the
                noise to focus on what matters: predictable, high-quality
                conversations at scale.
              </p>

              {/* Founder Signature */}
              <div className="pt-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs ring-4 ring-white shadow-lg shadow-slate-200/50">
                  JD
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Jane Doe
                  </div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    CEO & Co-Founder
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
