import { Clock, Lock, CheckCircle2, XCircle, SkipForward } from "lucide-react";

interface ExecutionHistoryTabProps {
  campaignId: string;
}

const PREVIEW_ROWS = [
  {
    status: "success",
    label: "Sent",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
    bg: "bg-emerald-50 text-emerald-700",
  },
  {
    status: "failed",
    label: "Failed",
    icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
    bg: "bg-rose-50 text-rose-700",
  },
  {
    status: "skipped",
    label: "Skipped",
    icon: <SkipForward className="w-3.5 h-3.5 text-slate-400" />,
    bg: "bg-slate-100 text-slate-500",
  },
];

export function ExecutionHistoryTab({ campaignId }: ExecutionHistoryTabProps) {
  return (
    <div className="max-w-3xl" data-campaign-id={campaignId}>
      <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-black text-slate-700">
              Execution Log
            </span>
          </div>
          <div className="flex items-center gap-3">
            {PREVIEW_ROWS.map((row) => (
              <span
                key={row.status}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold"
              >
                {row.icon}
                {row.label}
              </span>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 opacity-30 pointer-events-none select-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-4">
              <div className="w-24 h-3.5 bg-slate-200 rounded" />
              <div className="w-32 h-3.5 bg-slate-200 rounded" />
              <div className="flex-1 h-3.5 bg-slate-200 rounded" />
              <div className="w-16 h-5 bg-slate-200 rounded-full" />
              <div className="w-20 h-3 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]">
          <div className="relative mb-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-slate-300" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
          </div>
          <h3 className="text-base font-black text-slate-900 mb-2">
            Execution History — Coming Soon
          </h3>
          <p className="text-sm text-slate-500 font-medium text-center max-w-xs leading-relaxed">
            A full audit trail of every message sent, skipped, or failed across
            this campaign will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
