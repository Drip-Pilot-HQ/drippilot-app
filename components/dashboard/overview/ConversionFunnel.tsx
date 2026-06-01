"use client";

import type { ConversionFunnel as ConversionFunnelType } from "@/types/analytics";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { GitBranch } from "lucide-react";

interface ConversionFunnelProps {
  funnel: ConversionFunnelType;
  converted?: number;
}

interface FunnelStep {
  key: string;
  label: string;
  value: number;
  dotColor: string;
  barColor: string;
  rate: { label: string; className: string } | null;
}

export function ConversionFunnel({ funnel, converted }: ConversionFunnelProps) {
  const base = Math.max(funnel.historicallyEnrolledLeads ?? 1, 1);
  const pctOfBase = (v: number) => ((v / base) * 100).toFixed(1);
  const barWidth = (v: number) => Math.max(8, Math.round((v / base) * 100));

  const convertedCount = converted ?? 0;
  const campaignConversionRate = pctOfBase(convertedCount);

  const steps: FunnelStep[] = [
    {
      key: "enrolled",
      label: "Enrolled",
      value: funnel.historicallyEnrolledLeads,
      dotColor: "bg-slate-400",
      barColor: "bg-linear-to-r from-slate-300 to-slate-400",
      rate: null,
    },
    {
      key: "genuine-replies",
      label: "Genuine Replies",
      value: funnel.genuineReplies,
      dotColor: "bg-blue-500",
      barColor: "bg-linear-to-r from-blue-400 to-blue-500",
      rate: {
        label: `${pctOfBase(funnel.genuineReplies)}% response rate`,
        className: "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
      },
    },
    {
      key: "warm",
      label: "Warm",
      value: funnel.warmLeads,
      dotColor: "bg-cyan-500",
      barColor: "bg-linear-to-r from-cyan-400 to-cyan-500",
      rate: {
        label: `${pctOfBase(funnel.warmLeads)}% warm rate`,
        className: "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100",
      },
    },
    {
      key: "hot",
      label: "Hot",
      value: funnel.hotLeads,
      dotColor: "bg-orange-500",
      barColor: "bg-linear-to-r from-orange-400 to-primary",
      rate: {
        label: `${pctOfBase(funnel.hotLeads)}% hot rate`,
        className: "bg-orange-50 text-orange-600 ring-1 ring-orange-100",
      },
    },
    ...(converted !== undefined
      ? [
          {
            key: "converted",
            label: "Converted",
            value: convertedCount,
            dotColor: "bg-emerald-500",
            barColor: "bg-linear-to-r from-emerald-400 to-emerald-500",
            rate: {
              label: `${campaignConversionRate}% campaign conversion rate`,
              className:
                "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
            },
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-4 sm:p-6 shadow-sm h-full">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <GitBranch className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Campaign Funnel
            </h3>
            <InfoTooltip text="Shows how leads progress through your campaign pipeline. Enrolled = all leads that have ever entered any campaign (including completed ones). Campaign Conversion Rate = converted ÷ historically enrolled." />
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Pipeline progression from campaign enrollment
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {steps.map((step, i) => {
          const width = barWidth(step.value);
          const pct = i === 0 ? 100 : pctOfBase(step.value);
          return (
            <div key={step.key}>
              {/* Rate badge connector */}
              {step.rate && (
                <div className="flex items-center gap-2 py-2">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap ${step.rate.className}`}
                  >
                    {step.rate.label}
                  </span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
              )}

              {/* Stage info row */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${step.dotColor}`} />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    {step.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black text-slate-900 tabular-nums">
                    {step.value.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums w-8 text-right">
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Thin centered bar — narrows for funnel shape */}
              <div className="flex items-center justify-center">
                <div
                  className={`h-1.5 rounded-full ${step.barColor} transition-all duration-700 ease-out`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
