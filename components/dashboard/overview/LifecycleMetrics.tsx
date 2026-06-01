"use client";

import type { LifecycleMetricsResult } from "@/types/analytics";
import { Clock, MessageCircle, Flame, Trophy } from "lucide-react";
import { InfoTooltip } from "@/components/common/InfoTooltip";

interface LifecycleMetricsProps {
  data: LifecycleMetricsResult;
}

interface TimingCardProps {
  label: string;
  formatted: string | null;
  icon: React.ReactNode;
  iconBg: string;
  description: string;
}

function TimingCard({
  label,
  formatted,
  icon,
  iconBg,
  description,
}: TimingCardProps) {
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-slate-100 last:border-0">
      <div
        className={`w-9 h-9 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-slate-800 tracking-tight">
          {label}
        </p>
        <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
          {description}
        </p>
      </div>
      <div className="text-right shrink-0">
        {formatted ? (
          <p className="text-sm font-black text-slate-900 tabular-nums">
            {formatted}
          </p>
        ) : (
          <p className="text-sm font-bold text-slate-300">—</p>
        )}
      </div>
    </div>
  );
}

interface SummaryStatProps {
  label: string;
  value: number;
  divider?: boolean;
}

function SummaryStat({ label, value, divider }: SummaryStatProps) {
  return (
    <div
      className={`text-center ${divider ? "border-x border-slate-200/80" : ""}`}
    >
      <p className="text-xl font-black text-slate-900 tracking-tight tabular-nums">
        {value.toLocaleString()}
      </p>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-1">
        {label}
      </p>
    </div>
  );
}

export function LifecycleMetrics({ data }: LifecycleMetricsProps) {
  const { metrics, totals } = data;

  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-4 sm:p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-violet-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Lifecycle Timing
            </h3>
            <InfoTooltip text="Averages calculated only from leads that completed each stage. Leads with no activity are excluded from timing calculations." />
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Average time through each stage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 bg-linear-to-br from-slate-50 via-slate-50 to-violet-50/30 rounded-2xl p-4 border border-slate-100">
        <SummaryStat label="Messaged" value={totals.leadsWithFirstMessage} />
        <SummaryStat label="Replied" value={totals.leadsReplied} divider />
        <SummaryStat label="Converted" value={totals.convertedLeads} />
      </div>

      <div className="flex-1">
        <TimingCard
          label="First Message Sent"
          formatted={metrics.avgFirstMessageFormatted}
          icon={<MessageCircle className="w-4 h-4 text-blue-500" />}
          iconBg="bg-blue-50"
          description="Lead creation → first outreach"
        />
        <TimingCard
          label="First Reply Received"
          formatted={metrics.avgFirstReplyFormatted}
          icon={<MessageCircle className="w-4 h-4 text-cyan-500" />}
          iconBg="bg-cyan-50"
          description="First message → lead reply"
        />
        <TimingCard
          label="Time to Hot Lead"
          formatted={metrics.avgTimeToHotFormatted}
          icon={<Flame className="w-4 h-4 text-primary" />}
          iconBg="bg-orange-50"
          description="Creation → hot status"
        />
        <TimingCard
          label="Time to Convert"
          formatted={metrics.avgTimeToConvertFormatted}
          icon={<Trophy className="w-4 h-4 text-amber-500" />}
          iconBg="bg-amber-50"
          description="Creation → conversion"
        />
      </div>
    </div>
  );
}
