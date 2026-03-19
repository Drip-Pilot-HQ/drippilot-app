"use client";

import type { ConversionFunnel as ConversionFunnelType } from "@/types/analytics";
import { InfoTooltip } from "@/components/common/InfoTooltip";

interface FunnelStep {
  label: string;
  value: number;
  color: string;
  bg: string;
}

interface ConversionFunnelProps {
  funnel: ConversionFunnelType;
  converted?: number;
}

export function ConversionFunnel({ funnel, converted }: ConversionFunnelProps) {
  const steps: FunnelStep[] = [
    {
      label: "Total Leads",
      value: funnel.totalLeads,
      color: "bg-slate-500",
      bg: "bg-slate-50",
    },
    {
      label: "Responding",
      value: funnel.respondingLeads,
      color: "bg-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Engaged",
      value: funnel.engagedLeads,
      color: "bg-secondary",
      bg: "bg-cyan-50",
    },
    {
      label: "Warm / Hot",
      value: funnel.qualifiedLeads,
      color: "bg-primary",
      bg: "bg-orange-50",
    },
    ...(converted !== undefined
      ? [
          {
            label: "Converted",
            value: converted,
            color: "bg-emerald-500",
            bg: "bg-emerald-50",
          },
        ]
      : []),
  ];

  const max = funnel.totalLeads || 1;

  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-1.5">
          <h3 className="text-lg font-black text-slate-900">
            Conversion Funnel
          </h3>
          <InfoTooltip text="Shows how many leads progress through each pipeline stage. Drop-off % is relative to the previous stage." />
        </div>
        <p className="text-sm text-slate-400 font-medium mt-0.5">
          Lead progression through pipeline stages
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const pct = Math.round((step.value / max) * 100);
          const dropOff =
            i > 0
              ? steps[i - 1].value > 0
                ? Math.round(
                    ((steps[i - 1].value - step.value) / steps[i - 1].value) *
                      100,
                  )
                : 0
              : null;

          return (
            <div key={step.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${step.color}`} />
                  <span className="text-sm font-bold text-slate-700">
                    {step.label}
                  </span>
                  {dropOff !== null && dropOff > 0 && (
                    <span className="text-xs font-bold text-red-400 bg-red-50 px-1.5 py-0.5 rounded-full">
                      {dropOff}% drop
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">
                    {step.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium w-8 text-right">
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${step.color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
