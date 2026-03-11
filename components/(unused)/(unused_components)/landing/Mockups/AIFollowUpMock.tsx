import { cn } from "@/lib/utils";
import { Bot, BotIcon } from "lucide-react";

export const AIFollowUpMock = ({ active }: { active: boolean }) => {
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
          <div className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/20">
            <Bot className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              AI Follow-Up Engine
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-0.5">
              Auto-Respond
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(var(--accent),0.8)]" />
          <span className="text-[10px] font-black text-accent uppercase tracking-widest">
            AI Active
          </span>
        </div>
      </div>

      {/* Lead context card */}
      <div className="flex gap-4 mb-5">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 flex-shrink-0 border border-white/10 shadow-lg">
          JR
        </div>
        <div className="flex-1 bg-white/[0.03] rounded-2xl p-4 border border-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-xl"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="text-xs font-bold text-white">James Rodriguez</div>
            <div className="px-1.5 py-0.5 bg-primary/20 text-primary border border-primary/20 rounded text-[9px] font-black uppercase ">
              Warm
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-medium leading-relaxed bg-black/40 rounded-xl p-3 border border-white/5 relative z-10">
            Hey, I&apos;m looking for real estate in LA. <br />
            Can you help me find a place?
          </div>
        </div>
      </div>

      {/* AI draft */}
      <div className="flex flex-row-reverse gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30 shadow-lg shadow-primary/20">
          <BotIcon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 bg-primary/[0.03] rounded-2xl p-4 border border-primary/20 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-50"></div>
          <div className="flex flex-row-reverse justify-between items-start mb-2 relative z-10">
            <div className="text-xs font-bold text-primary">Drip Bot</div>
            <div className="px-1.5 py-0.5 bg-accent/20 text-accent border border-accent/20 rounded text-[9px] font-black uppercase ">
              Personalize Response
            </div>
          </div>
          <div className="text-[10px] text-slate-200 font-medium leading-relaxed bg-black/40 rounded-xl p-3 border border-primary/10 relative z-10">
            Hey James, I can see you&apos;re interested in real estate in LA. I
            can help you find a place.
            <br />
            <span className="text-primary font-bold">
              Worth a quick 15-min call this week?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
