"use client";

import {
  CheckCircle2,
  XCircle,
  SkipForward,
  User,
  Calendar,
} from "lucide-react";
import { ExecutionLog, ExecutionLogStatus } from "@/types/campaign";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ExecutionLogRowProps {
  log: ExecutionLog;
}

export function ExecutionLogRow({ log }: ExecutionLogRowProps) {
  const getStatusConfig = (status: ExecutionLogStatus) => {
    switch (status) {
      case ExecutionLogStatus.SUCCESS:
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          className: "bg-emerald-50 text-emerald-700 border-emerald-100",
          label: "Success",
        };
      case ExecutionLogStatus.FAILED:
        return {
          icon: <XCircle className="w-3.5 h-3.5" />,
          className: "bg-rose-50 text-rose-700 border-rose-100",
          label: "Failed",
        };
      case ExecutionLogStatus.SKIPPED:
        return {
          icon: <SkipForward className="w-3.5 h-3.5" />,
          className: "bg-slate-100 text-slate-600 border-slate-200",
          label: "Skipped",
        };
      default:
        return {
          icon: null,
          className: "bg-slate-50 text-slate-500",
          label: status,
        };
    }
  };

  const config = getStatusConfig(log.status);

  return (
    <div className="px-5 py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 hover:bg-slate-50/50 transition-colors group">
      {/* Mobile Top Row: Lead & Status */}
      <div className="flex items-center justify-between md:hidden w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
            <User className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-black text-slate-900 truncate max-w-[150px]">
            {log.leadName || "Unknown Lead"}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
            config.className,
          )}
        >
          {config.icon}
          {config.label}
        </span>
      </div>

      {/* Date/Time - Hidden on very small mobile, visible on tablet/md */}
      <div className="hidden sm:block md:w-32 shrink-0">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight">
            {format(new Date(log.executedAt), "MMM d, HH:mm")}
          </span>
        </div>
      </div>

      {/* Target Lead - Desktop view */}
      <div className="hidden md:flex w-48 shrink-0 items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-900 truncate">
            {log.leadName || "Unknown Lead"}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Lead</p>
        </div>
      </div>

      {/* Middle Row (Tablet/Mobile): Step & Status (Desktop: Step only) */}
      <div className="flex items-center justify-between md:w-24 shrink-0">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-100 text-[10px] font-black uppercase tracking-wider">
          Step {log.stepNumber}
        </span>

        {/* Date on tiny screens */}
        <div className="sm:hidden flex items-center gap-1 text-slate-400">
          <Calendar className="w-3 h-3" />
          <span className="text-[9px] font-bold uppercase">
            {format(new Date(log.executedAt), "MMM d")}
          </span>
        </div>
      </div>

      {/* Message/Log */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-600 font-medium md:truncate group-hover:text-slate-900 transition-colors">
          {log.logMessage || "No additional log available"}
        </p>
      </div>

      {/* Status Badge - Desktop only (already handled in top row for mobile) */}
      <div className="hidden md:flex w-24 shrink-0 justify-end">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
            config.className,
          )}
        >
          {config.icon}
          {config.label}
        </span>
      </div>
    </div>
  );
}
