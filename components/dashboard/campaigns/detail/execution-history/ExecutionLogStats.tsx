"use client";

import { CheckCircle2, XCircle, SkipForward, AlertCircle } from "lucide-react";
import { ExecutionLogStatus } from "@/types/campaign";
import { cn } from "@/lib/utils";

interface ExecutionLogStatsProps {
  total: number;
}

export function ExecutionLogStats({ total }: ExecutionLogStatsProps) {
  const stats = [
    {
      status: "total",
      label: "Total Events",
      icon: <AlertCircle className="w-3.5 h-3.5 text-blue-500" />,
      bg: "bg-blue-50 text-blue-700",
      count: total,
    },
    {
      status: ExecutionLogStatus.SUCCESS,
      label: "Deliveries",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
      bg: "bg-emerald-50 text-emerald-700",
      count: null, // We'll just show the labels for now as the API returns flat paginated list
    },
    {
      status: ExecutionLogStatus.FAILED,
      label: "Issues",
      icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
      bg: "bg-rose-50 text-rose-700",
      count: null,
    },
    {
      status: ExecutionLogStatus.SKIPPED,
      label: "Skipped",
      icon: <SkipForward className="w-3.5 h-3.5 text-slate-400" />,
      bg: "bg-slate-100 text-slate-500",
      count: null,
    },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap pb-2 md:pb-0 no-scrollbar">
      {stats.map((stat) => (
        <div
          key={stat.status}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-100 bg-white shadow-sm shrink-0",
          )}
        >
          {stat.icon}
          <span className="text-xs font-black text-slate-700">
            {stat.count !== null ? stat.count : ""}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
