import { cn } from "@/lib/utils";
import { ChevronRight, Webhook } from "lucide-react";

export const SmartRoutingMock = ({ active }: { active: boolean }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col p-6 transition-all duration-700",
        active
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5 pointer-events-none",
      )}
    >
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
            <Webhook className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Incoming CRM Leads
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-0.5">
              Webhook Integration
            </div>
          </div>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Active
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">
            Rules Engine
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded-xl border border-white/5 shadow-inner">
              <span className="text-[10px] font-black text-slate-600 w-4 uppercase">
                If
              </span>
              <div className="px-2 py-0.5 bg-white/5 rounded-lg text-[10px] font-bold text-slate-400 border border-white/5">
                Tags
              </div>
              <span className="text-[10px] text-slate-600 font-bold uppercase">
                Contains
              </span>
              <div className="px-2 py-0.5 bg-secondary/20 text-secondary rounded-lg text-xs font-bold border border-secondary/20">
                &apos;Meta&apos;
              </div>
            </div>

            <div className="flex justify-center relative z-10 -my-2">
              <div className="flex p-0.5 bg-white/5 rounded-lg text-[9px] font-black border border-white/10 shadow-lg">
                <div className="px-2 py-0.5 bg-primary text-white rounded-md shadow-primary/20">
                  AND
                </div>
                <div className="px-2 py-0.5 text-slate-500">OR</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded-xl border border-white/5 shadow-inner">
              <span className="text-[10px] font-black text-slate-600 w-4 uppercase">
                If
              </span>
              <div className="px-2 py-0.5 bg-white/5 rounded-lg text-[10px] font-bold text-slate-400 border border-white/5">
                Lead Status
              </div>
              <span className="text-[10px] text-slate-600 font-bold uppercase">
                is
              </span>
              <div className="px-2 py-0.5 bg-primary/20 text-primary rounded-lg text-xs font-bold border border-primary/20">
                &apos;Hot&apos;
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-3">
            Action
          </p>
          <div className="flex items-center justify-between bg-black/40 p-3.5 rounded-xl border border-primary/20 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-black text-slate-600 uppercase">
                Then
              </span>
              <span className="text-xs font-bold text-slate-200">
                Enroll in Campaign
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-xs font-bold text-primary">
                Enterprise Outreach...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
