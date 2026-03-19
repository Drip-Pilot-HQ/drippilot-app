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
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
      <div
        className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 font-medium">{description}</p>
      </div>
      <div className="text-right flex-shrink-0">
        {formatted ? (
          <p className="text-sm font-black text-slate-900">{formatted}</p>
        ) : (
          <p className="text-sm font-bold text-slate-300">—</p>
        )}
      </div>
    </div>
  );
}

export function LifecycleMetrics({ data }: LifecycleMetricsProps) {
  const { metrics, totals } = data;

  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
          <Clock className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-black text-slate-900">
              Lead Lifecycle Timing
            </h3>
            <InfoTooltip text="Averages calculated only from leads that completed each stage. Leads with no activity are excluded from timing calculations." />
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Average time through each stage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 bg-slate-50 rounded-2xl p-4">
        <div className="text-center">
          <p className="text-xl font-black text-slate-900">
            {totals.leadsWithFirstMessage.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Messaged
          </p>
        </div>
        <div className="text-center border-x border-slate-200">
          <p className="text-xl font-black text-slate-900">
            {totals.leadsReplied.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Replied
          </p>
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-slate-900">
            {totals.convertedLeads.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Converted
          </p>
        </div>
      </div>

      <div>
        <TimingCard
          label="First Message Sent"
          formatted={metrics.avgFirstMessageFormatted}
          icon={<MessageCircle className="w-4.5 h-4.5 text-blue-500" />}
          iconBg="bg-blue-50"
          description="Avg time from lead creation to first outreach"
        />
        <TimingCard
          label="First Reply Received"
          formatted={metrics.avgFirstReplyFormatted}
          icon={<MessageCircle className="w-4.5 h-4.5 text-secondary" />}
          iconBg="bg-cyan-50"
          description="Avg time from first message to lead reply"
        />
        <TimingCard
          label="Time to Hot Lead"
          formatted={metrics.avgTimeToHotFormatted}
          icon={<Flame className="w-4.5 h-4.5 text-primary" />}
          iconBg="bg-orange-50"
          description="Avg time from creation to hot status"
        />
        <TimingCard
          label="Time to Convert"
          formatted={metrics.avgTimeToConvertFormatted}
          icon={<Trophy className="w-4.5 h-4.5 text-amber-500" />}
          iconBg="bg-amber-50"
          description="Avg time from creation to conversion"
        />
      </div>
    </div>
  );
}
