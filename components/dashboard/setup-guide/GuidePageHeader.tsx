import { Clock, Timer, Zap } from "lucide-react";

export function GuidePageHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Setup Guides
        </h1>
        <p className="text-slate-500 font-medium">
          Everything you need to get up and running
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
          <Clock className="w-3 h-3 text-primary" />3 Guides
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
          <Timer className="w-3 h-3 text-secondary" />
          ~25 Min
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
          <Zap className="w-3 h-3 text-accent" />
          No Code
        </span>
      </div>
    </div>
  );
}
