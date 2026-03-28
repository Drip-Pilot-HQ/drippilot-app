"use client";

import { Clock, Settings2 } from "lucide-react";
import type { DaysFilter } from "@/types/analytics";

const DAY_OPTIONS: { label: string; value: DaysFilter }[] = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "60d", value: 60 },
  { label: "90d", value: 90 },
];

interface OverviewHeaderProps {
  days: DaysFilter;
  onDaysChange: (days: DaysFilter) => void;
  onConfigureClick: () => void;
}

export function OverviewHeader({
  days,
  onDaysChange,
  onConfigureClick,
}: OverviewHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
          Overview
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-slate-500 font-medium">
            Your workspace performance at a glance
          </p>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Updates every 10 min
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onConfigureClick}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all text-sm font-bold"
        >
          <Settings2 className="w-4 h-4" />
          Configure
        </button>

        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {DAY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onDaysChange(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                days === opt.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
