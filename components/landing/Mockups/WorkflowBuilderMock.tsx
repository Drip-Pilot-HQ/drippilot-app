import { cn } from "@/lib/utils";
import {
  Workflow,
  Mail,
  ChevronRight,
  Clock,
  MessageSquare,
  Plus,
} from "lucide-react";

export const WorkflowBuilderMock = ({ active }: { active: boolean }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col p-6 transition-all duration-700",
        active
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5 pointer-events-none",
      )}
    >
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
            <Workflow className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Realtor Follow-up Campaign
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-0.5">
              Workflow Builder
            </div>
          </div>
        </div>
        <div className="px-3 py-1 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/20">
          Activate
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Step 1: Email */}
        <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/20">
              <Mail className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Send Email</div>
              <div className="flex flex-wrap gap-2">
                <div className="text-[9px] text-slate-500 font-bold uppercase ">
                  Initial Pitch
                </div>
                <div className="text-[9px] text-slate-700">•</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase ">
                  09:15 - 09:30
                </div>
                <div className="text-[9px] text-slate-500 font-bold uppercase ">
                  America/New_York
                </div>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </div>

        {/* Delay chip */}
        <div className="flex flex-col items-center">
          <div className="h-4 w-px bg-white/5" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <Clock className="w-2.5 h-2.5 text-primary" /> 3 Day Delay
          </div>
          <div className="h-6 w-px white/20" />
        </div>

        {/* Step 2: SMS */}
        <div className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-between opacity-60 backdrop-blur-sm text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/20">
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-300">Send SMS</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase">
                Quick Reminder
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-700" />
        </div>
        <div className="h-6 w-px bg-white/20" />

        {/* Add step */}
        <button className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
          <Plus className="w-3 h-3 text-primary" />
          Add Next Step
        </button>
      </div>
    </div>
  );
};
