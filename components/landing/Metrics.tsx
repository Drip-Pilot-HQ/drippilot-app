import React from "react";
import { Container } from "@/components/branding/Container";
import { TrendingUp } from "lucide-react";

export const Metrics = () => {
  return (
    <section className="flex items-center py-24 bg-white" id="metrics">
      <Container>
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20 uppercase tracking-wider">
            Industry Success Data
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Numbers that define your growth.
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
            We help thousands of sales professionals quantify their impact with
            real-time performance tracking and industry benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="grid grid-cols-2 gap-6">
              <div className="metric-card p-6 rounded-2xl">
                <p className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wider">
                  Emails Sent
                </p>
                <h3 className="text-3xl font-bold text-slate-900">761,264+</h3>
                <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-3/4"></div>
                </div>
              </div>
              <div className="metric-card p-6 rounded-2xl">
                <p className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wider">
                  Leads Nurtured
                </p>
                <h3 className="text-3xl font-bold text-slate-900">347,641</h3>
                <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-6 bg-slate-900 rounded-3xl text-white flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1 uppercase font-semibold">
                  Total Revenue Generated
                </p>
                <h3 className="text-4xl font-bold">$150M+</h3>
              </div>
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-tr from-secondary/5 to-primary/5 rounded-[40px] blur-2xl"></div>
            <div className="relative glass-card p-8 rounded-[40px] border border-slate-200/60 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-bold text-slate-900">
                  Performance Snapshot
                </h4>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-end gap-2 h-40">
                  <div className="flex-1 bg-slate-100 rounded-t-lg h-[40%]"></div>
                  <div className="flex-1 bg-secondary rounded-t-lg h-[70%]"></div>
                  <div className="flex-1 bg-slate-100 rounded-t-lg h-[30%]"></div>
                  <div className="flex-1 bg-primary rounded-t-lg h-[90%]"></div>
                  <div className="flex-1 bg-accent rounded-t-lg h-[55%]"></div>
                  <div className="flex-1 bg-slate-100 rounded-t-lg h-[80%]"></div>
                  <div className="flex-1 bg-slate-200 rounded-t-lg h-[45%]"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Open Rate</p>
                    <p className="font-bold text-slate-900">66.7%</p>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">Click Rate</p>
                    <p className="font-bold text-slate-900">12.4%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Reply Rate</p>
                    <p className="font-bold text-slate-900">8.9%</p>
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
