"use client";

import { ArrowRight } from "lucide-react";

export function CustomPlanCTA() {
  return (
    <div className="bg-background-dark rounded-[32px] p-5 sm:p-8 shadow-xl shadow-slate-200">
      <h2 className="text-xl font-bold text-white mb-2">Need a custom plan?</h2>
      <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
        For enterprise-grade volume and dedicated account management, let&apos;s
        talk.
      </p>
      <button className="text-orange-400 font-bold flex items-center gap-2 hover:text-orange-300 transition-colors group">
        Contact Enterprise Sales
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
