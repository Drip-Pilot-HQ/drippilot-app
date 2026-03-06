import React from "react";
import Image from "next/image";
import { Container } from "@/components/branding/Container";
import {
  Sparkles,
  Users,
  BarChart3,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export const Features = () => {
  return (
    <section className="flex items-center py-32 bg-slate-50" id="features">
      <Container>
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20 uppercase tracking-wider">
            All-In-One Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Everything you need to scale
          </h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-light">
            One platform to orchestrate your entire outbound strategy.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 sticky top-32">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="p-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2">
                <div className="flex gap-1.5 ml-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                </div>
                <div className="mx-auto bg-white rounded-md px-4 py-1 text-[10px] text-slate-400 font-medium w-1/2 text-center">
                  app.drippilot.io/campaigns
                </div>
              </div>
              <div className="relative aspect-16/10">
                <Image
                  alt="Feature Preview"
                  fill
                  className="object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5S1g4Yx3KF4uBVB7xzb6L0U8109B8nG2fj1Ii7CS5MIE4TaukrP6dP321E02KCByJaoRc9AM7H94985K-dTQPeYATmvzISQ0IIpUOSU2mK88vYLdnZw1IfYyKCQ4RM4uZkgEilZzEFMLED_kPwziL__yVC7LZ8s2aAsQcLnM6n79dJYIg3YQJ6QEmyEL78SbVCg7PrcFC64HoaMfJ7uadUjtOAoWxbeqSNN0qdrrTXP6Mo8pjQHOi_aPNsVe6EcZV0WKWX_pD2yM"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-white/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="group p-6 bg-white rounded-2xl border-2 border-primary transition-all">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Create drip sequences that convert
                </h3>
              </div>
              <p className="text-slate-500 leading-relaxed mb-4">
                Create personalized drip campaigns that nurture leads through
                every stage of their journey, set triggers, conditions, and
                schedules to deliver the right message.
              </p>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/3"></div>
              </div>
            </div>
            <div className="group p-6 bg-white/50 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-white transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Segment your leads for targeted messaging
                </h3>
                <ChevronDown className="ml-auto text-slate-400 group-hover:translate-y-1 transition-transform" />
              </div>
            </div>
            <div className="group p-6 bg-white/50 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-white transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Track performance with advanced analytics
                </h3>
                <ChevronDown className="ml-auto text-slate-400 group-hover:translate-y-1 transition-transform" />
              </div>
            </div>
            <div className="group p-6 bg-white/50 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-white transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900/10 flex items-center justify-center text-slate-900">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Stay consistent with your drip marketing
                </h3>
                <ChevronDown className="ml-auto text-slate-400 group-hover:translate-y-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
