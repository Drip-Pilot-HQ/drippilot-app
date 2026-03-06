import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

export const LeadDetectionMock = ({ active }: { active: boolean }) => {
  const leads = [
    {
      initials: "SK",
      name: "Sarah Kim",
      company: "Acme Corp",
      score: 94,
      status: "Hot",
      statusCls: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    {
      initials: "MT",
      name: "Mike Torres",
      company: "TechFlow Inc.",
      score: 67,
      status: "Warm",
      statusCls: "bg-amber-500/20 text-amber-500 border-amber-500/30",
    },
    {
      initials: "ED",
      name: "Emma Davis",
      company: "Launchpad Co.",
      score: 28,
      status: "Cold",
      statusCls: "bg-white/10 text-slate-500 border-white/5",
    },
  ];

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
          <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
            <Flame className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Lead Intelligence
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-0.5">
              Real-time Detection
            </div>
          </div>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          127 analyzed
        </div>
      </div>

      <div className="space-y-3">
        {leads.map((lead, i) => (
          <div
            key={i}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-sm flex items-center gap-4 group/lead"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 flex-shrink-0 border border-white/5 shadow-inner">
              {lead.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-200">
                  {lead.name}
                </span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-black uppercase border",
                    lead.statusCls,
                  )}
                >
                  {lead.status}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {lead.company}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div
                className={cn(
                  "text-2xl font-bold font-mono",
                  i === 0
                    ? "text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    : i === 1
                      ? "text-amber-500"
                      : "text-slate-600",
                )}
              >
                {lead.score}
              </div>
              <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none">
                score
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
