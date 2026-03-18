"use client";

import type { FinancialMetrics } from "@/types/analytics";
import { DollarSign, TrendingUp } from "lucide-react";

interface FinancialPanelProps {
  data: FinancialMetrics;
}

function MetricItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${accent ? "bg-primary/5 border border-primary/10" : "bg-slate-50"}`}
    >
      <p
        className={`text-lg font-black ${accent ? "text-primary" : "text-slate-900"}`}
      >
        {value}
      </p>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
}

export function FinancialPanel({ data }: FinancialPanelProps) {
  const roiPositive = data.roi >= 0;

  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">
            Financial Metrics
          </h3>
          <p className="text-sm text-slate-400 font-medium">
            Pipeline value &amp; ROI analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricItem
          label="Pipeline Value"
          value={`$${(data.pipelineValue / 1000).toFixed(0)}k`}
          accent
        />
        <MetricItem
          label="Projected Revenue"
          value={`$${(data.projectedRevenue / 1000).toFixed(0)}k`}
        />
        <MetricItem
          label="Proj. Closings"
          value={data.projectedClosings.toFixed(1)}
        />
        <MetricItem
          label="Campaign Cost"
          value={`$${data.totalCampaignCost.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <MetricItem
          label="Cost / Lead"
          value={`$${data.costPerLead.toFixed(0)}`}
        />
        <MetricItem
          label="Cost / Qualified"
          value={`$${data.costPerQualifiedLead.toFixed(0)}`}
        />
        <MetricItem
          label="Cost / Closing"
          value={`$${data.costPerClosing.toLocaleString()}`}
        />
      </div>

      <div
        className={`flex items-center gap-3 rounded-2xl p-4 ${roiPositive ? "bg-emerald-50" : "bg-red-50"}`}
      >
        <TrendingUp
          className={`w-8 h-8 ${roiPositive ? "text-emerald-500" : "text-red-400"} flex-shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-2xl font-black ${roiPositive ? "text-emerald-700" : "text-red-600"}`}
          >
            {data.roi.toFixed(0)}% ROI
          </p>
          <p
            className={`text-xs font-bold uppercase tracking-widest mt-0.5 ${roiPositive ? "text-emerald-500" : "text-red-400"}`}
          >
            {data.roiMultiplier.toFixed(1)}x return on investment
          </p>
        </div>
        <div className="text-right">
          <p
            className={`text-sm font-black ${roiPositive ? "text-emerald-700" : "text-red-600"}`}
          >
            {data.industryComparison.performanceMultiplier.toFixed(1)}x
          </p>
          <p
            className={`text-xs font-bold ${roiPositive ? "text-emerald-500" : "text-red-400"}`}
          >
            vs industry
          </p>
        </div>
      </div>
    </div>
  );
}
