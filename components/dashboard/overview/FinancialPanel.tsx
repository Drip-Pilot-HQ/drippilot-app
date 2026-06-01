"use client";

import type { FinancialMetrics } from "@/types/analytics";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { InfoTooltip } from "@/components/common/InfoTooltip";

interface FinancialPanelProps {
  data: FinancialMetrics;
}

interface MetricItemProps {
  label: string;
  value: string;
  accent?: boolean;
}

function MetricItem({ label, value, accent }: MetricItemProps) {
  return (
    <div
      className={`rounded-2xl p-2.5 sm:p-3.5 transition-all ${
        accent
          ? "bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15"
          : "bg-slate-50/70 border border-slate-100 hover:border-slate-200"
      }`}
    >
      <p
        className={`text-sm sm:text-lg font-black tracking-tight tabular-nums truncate ${
          accent ? "text-primary" : "text-slate-900"
        }`}
      >
        {value}
      </p>
      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] sm:tracking-[0.15em] mt-1 leading-tight">
        {label}
      </p>
    </div>
  );
}

export function FinancialPanel({ data }: FinancialPanelProps) {
  const roiPositive = data.roi >= 0;

  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-4 sm:p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Financial Metrics
            </h3>
            <InfoTooltip text="Calculated from your campaign costs, lead volume, and projected close rates. Configure assumptions via the settings button." />
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Revenue projections &amp; ROI analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 mb-1.5 sm:mb-2.5">
        <MetricItem
          label="Projected Revenue"
          value={`$${Math.round(data.projectedRevenue).toLocaleString()}`}
          accent
        />
        <MetricItem
          label="Rev. Per Closing"
          value={`$${Math.round(data.avgRevenuePerClosing).toLocaleString()}`}
        />
        <MetricItem
          label="Proj. Closings"
          value={data.projectedClosings.toFixed(1)}
        />
        <MetricItem
          label="Campaign Cost"
          value={`$${Math.round(data.totalCampaignCost).toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-4">
        <MetricItem
          label="Lead Acq. Cost"
          value={`$${Math.round(data.costPerLead).toLocaleString()}`}
        />
        <MetricItem
          label="Cost / Qualified"
          value={`$${Math.round(data.costPerQualifiedLead).toLocaleString()}`}
        />
        <MetricItem
          label="Cost / Closing"
          value={`$${Math.round(data.costPerClosing).toLocaleString()}`}
        />
      </div>

      <div
        className={`mt-auto flex items-center gap-3 rounded-2xl p-4 ${
          roiPositive
            ? "bg-linear-to-r from-emerald-50 via-emerald-50 to-emerald-100/40 border border-emerald-100"
            : "bg-linear-to-r from-red-50 to-red-100/40 border border-red-100"
        }`}
      >
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            roiPositive ? "bg-emerald-100" : "bg-red-100"
          }`}
        >
          {roiPositive ? (
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-2xl font-black tracking-tight leading-none tabular-nums ${
              roiPositive ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {data.roi.toFixed(0)}% ROI
          </p>
          <p
            className={`text-[10px] font-black uppercase tracking-[0.15em] mt-1.5 ${
              roiPositive ? "text-emerald-500" : "text-red-400"
            }`}
          >
            {data.roiMultiplier.toFixed(1)}x return on investment
          </p>
        </div>
        <div className="text-right shrink-0">
          <p
            className={`text-sm font-black tabular-nums ${
              roiPositive ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {data.industryComparison.performanceMultiplier.toFixed(1)}x
          </p>
          <p
            className={`text-[10px] font-bold uppercase tracking-wider ${
              roiPositive ? "text-emerald-500" : "text-red-400"
            }`}
          >
            vs industry
          </p>
        </div>
      </div>
    </div>
  );
}
