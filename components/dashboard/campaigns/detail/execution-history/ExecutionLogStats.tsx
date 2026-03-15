"use client";

import { CheckCircle2, XCircle, SkipForward, AlertCircle } from "lucide-react";
import { ExecutionLogStatus } from "@/types/campaign";

interface ExecutionLogStatsProps {
  total: number;
}

export function ExecutionLogStats({ total }: ExecutionLogStatsProps) {
  const stats = [
    {
      status: "total",
      label: "Total Events",
      icon: <AlertCircle className="w-3.5 h-3.5 text-blue-500" />,
      count: total,
    },
    {
      status: ExecutionLogStatus.SUCCESS,
      label: "Deliveries",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
      count: null,
    },
    {
      status: ExecutionLogStatus.FAILED,
      label: "Issues",
      icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
      count: null,
    },
    {
      status: ExecutionLogStatus.SKIPPED,
      label: "Skipped",
      icon: <SkipForward className="w-3.5 h-3.5 text-slate-400" />,
      count: null,
    },
  ];

  return (
    <div className="flex items-center gap-2.5 flex-wrap pb-2 md:pb-0 no-scrollbar">
      {stats.map((stat) => (
        <div
          key={stat.status}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-100 bg-white shrink-0"
        >
          {stat.icon}
          {stat.count !== null && (
            <span className="text-xs font-semibold text-slate-700">
              {stat.count}
            </span>
          )}
          <span className="text-[10px] text-slate-400 font-medium">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
