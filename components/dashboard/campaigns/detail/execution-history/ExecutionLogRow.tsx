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
          className: "bg-slate-50 text-slate-600 border-slate-200",
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
    <div className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-5 hover:bg-slate-50/50 transition-colors group">
      {/* Mobile Top Row: Lead & Status */}
      <div className="flex items-center justify-between md:hidden w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">
            {log.leadName || "Unknown Lead"}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
            config.className,
          )}
        >
          {config.icon}
          {config.label}
        </span>
      </div>

      {/* Date/Time */}
      <div className="hidden sm:block md:w-28 shrink-0">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">
            {format(new Date(log.executedAt), "MMM d, HH:mm")}
          </span>
        </div>
      </div>

      {/* Target Lead - Desktop view */}
      <div className="hidden md:flex w-44 shrink-0 items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {log.leadName || "Unknown Lead"}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Lead</p>
        </div>
      </div>

      {/* Step & mobile date */}
      <div className="flex items-center justify-between md:w-20 shrink-0">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-100 text-xs font-medium">
          Step {log.stepNumber}
        </span>

        {/* Date on tiny screens */}
        <div className="sm:hidden flex items-center gap-1 text-slate-400">
          <Calendar className="w-3 h-3" />
          <span className="text-[10px] font-medium">
            {format(new Date(log.executedAt), "MMM d")}
          </span>
        </div>
      </div>

      {/* Message/Log */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium md:truncate group-hover:text-slate-700 transition-colors">
          {log.logMessage || "No additional log available"}
        </p>
      </div>

      {/* Status Badge - Desktop only */}
      <div className="hidden md:flex w-24 shrink-0 justify-end">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
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
