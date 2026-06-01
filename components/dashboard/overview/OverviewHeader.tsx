"use client";

import { Clock, Settings2 } from "lucide-react";
import type { DaysFilter } from "@/types/analytics";
import { cn } from "@/lib/utils";

const DAY_OPTIONS: { label: string; value: DaysFilter }[] = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "60d", value: 60 },
  { label: "90d", value: 90 },
];

interface OverviewHeaderProps {
  days: DaysFilter;
  onDaysChange: (days: DaysFilter) => void;
  onConfigureClick?: () => void;
  scopeLabel?: React.ReactNode;
  viewAsSelectorSlot?: React.ReactNode;
}

export function OverviewHeader({
  days,
  onDaysChange,
  onConfigureClick,
  scopeLabel,
  viewAsSelectorSlot,
}: OverviewHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      {/* Title */}
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Overview
          </h1>
          {scopeLabel}
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <p className="text-sm text-slate-500 font-medium">
            Workspace performance at a glance
          </p>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-[11px] font-medium whitespace-nowrap">
            <Clock className="w-2.5 h-2.5" />
            10 min
          </span>
        </div>
      </div>

      {/* Controls — all in one flat row that wraps cleanly */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {viewAsSelectorSlot}

        {onConfigureClick && (
          <button
            onClick={onConfigureClick}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-bold whitespace-nowrap"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Configure
          </button>
        )}

        <div className="flex items-center bg-slate-100/80 border border-slate-200/60 rounded-xl p-1 gap-0.5">
          {DAY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onDaysChange(opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                days === opt.value
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
