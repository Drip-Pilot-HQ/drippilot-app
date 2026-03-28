"use client";

import type { BenchmarksResult } from "@/types/analytics";
import { Award, TrendingUp, TrendingDown } from "lucide-react";
import { InfoTooltip } from "@/components/common/InfoTooltip";

interface BenchmarksPanelProps {
  data: BenchmarksResult;
}

interface BenchmarkRowProps {
  label: string;
  yours: number;
  industry: number;
  multiplier: number;
  format: (v: number) => string;
  lowerIsBetter?: boolean;
}

function BenchmarkRow({
  label,
  yours,
  industry,
  multiplier,
  format,
  lowerIsBetter = false,
}: BenchmarkRowProps) {
  const isGood = lowerIsBetter ? multiplier <= 1 : multiplier >= 1;
  const pct = Math.round(Math.abs(multiplier - 1) * 100);

  return (
    <div className="flex items-center justify-between gap-2 py-4 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-700 truncate">{label}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Industry avg: {format(industry)}
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="text-right">
          <p className="text-base font-black text-slate-900">{format(yours)}</p>
          <p className="text-xs text-slate-400 font-medium">yours</p>
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full min-w-[56px] justify-center whitespace-nowrap ${
            isGood ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
          }`}
        >
          {isGood ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {pct > 0 ? `${isGood ? "+" : "-"}${pct}%` : "avg"}
        </div>
      </div>
    </div>
  );
}

export function BenchmarksPanel({ data }: BenchmarksPanelProps) {
  const { current, industry, comparison } = data;

  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
          <Award className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-black text-slate-900">
              Industry Benchmarks
            </h3>
            <InfoTooltip text="Compares your Response Rate, Close Rate, and Cost metrics against outreach industry averages." />
          </div>
          <p className="text-sm text-slate-400 font-medium">
            How you compare to the industry
          </p>
        </div>
      </div>

      <div>
        <BenchmarkRow
          label="Response Rate"
          yours={current.responseRate}
          industry={industry.responseRate}
          multiplier={comparison.responseRateMultiplier}
          format={(v) => `${v.toFixed(1)}%`}
        />
        <BenchmarkRow
          label="Close Rate"
          yours={current.projectedCloseRate}
          industry={industry.closeRate}
          multiplier={comparison.closeRateMultiplier}
          format={(v) => `${v.toFixed(1)}%`}
        />
        <BenchmarkRow
          label="Cost Per Lead"
          yours={current.costPerLead}
          industry={industry.costPerLead}
          multiplier={
            industry.costPerLead > 0
              ? current.costPerLead / industry.costPerLead
              : 1
          }
          format={(v) => `$${Math.round(v).toLocaleString()}`}
          lowerIsBetter
        />
        <BenchmarkRow
          label="Cost Per Closing"
          yours={current.costPerClosing}
          industry={industry.costPerClosing}
          multiplier={
            industry.costPerClosing > 0
              ? current.costPerClosing / industry.costPerClosing
              : 1
          }
          format={(v) => `$${Math.round(v).toLocaleString()}`}
          lowerIsBetter
        />
      </div>
    </div>
  );
}
