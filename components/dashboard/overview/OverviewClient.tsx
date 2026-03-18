"use client";

import { useState } from "react";
import {
  Users,
  Workflow,
  MessageSquare,
  ArrowLeftRight,
  Percent,
  TrendingUp,
} from "lucide-react";
import {
  useDashboardStatsQuery,
  useActivityInsightsQuery,
  useBenchmarksQuery,
  useLifecycleMetricsQuery,
} from "@/store/server/analytics.queries";
import type { DaysFilter } from "@/types/analytics";
import { OverviewHeader } from "./OverviewHeader";
import { StatCard } from "./StatCard";
import { ActivityChart } from "./ActivityChart";
import { ConversionFunnel } from "./ConversionFunnel";
import { BenchmarksPanel } from "./BenchmarksPanel";
import { LifecycleMetrics } from "./LifecycleMetrics";
import { FinancialPanel } from "./FinancialPanel";
import { LeadBreakdown } from "./LeadBreakdown";
import { OverviewSkeleton } from "./OverviewSkeleton";

export function OverviewClient() {
  const [days, setDays] = useState<DaysFilter>(30);

  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();
  const { data: activity, isLoading: activityLoading } =
    useActivityInsightsQuery(days);
  const { data: benchmarks, isLoading: benchmarksLoading } =
    useBenchmarksQuery();
  const { data: lifecycle, isLoading: lifecycleLoading } =
    useLifecycleMetricsQuery(days);

  const isLoading =
    statsLoading || activityLoading || benchmarksLoading || lifecycleLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <OverviewHeader days={days} onDaysChange={setDays} />

      {isLoading ? (
        <OverviewSkeleton />
      ) : !stats ? (
        <div className="bg-white border border-slate-100 rounded-[32px] py-24 text-center shadow-sm">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            No analytics data available yet
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Start a campaign to begin tracking performance
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              label="Total Leads"
              value={stats.leads.total.toLocaleString()}
              subValue={`${stats.leads.hot} hot · ${stats.leads.warm} warm`}
              icon={Users}
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
            />
            <StatCard
              label="Active Campaigns"
              value={stats.campaigns.active}
              subValue={`${stats.campaigns.total} total`}
              icon={Workflow}
              iconColor="text-primary"
              iconBg="bg-primary/10"
            />
            <StatCard
              label="Messages Today"
              value={stats.messages.today.toLocaleString()}
              subValue={`${stats.messages.outbound.toLocaleString()} outbound total`}
              icon={MessageSquare}
              iconColor="text-secondary"
              iconBg="bg-cyan-50"
            />
            <StatCard
              label="Response Rate"
              value={`${stats.responseRate.toFixed(1)}%`}
              subValue={`${stats.messages.inbound.toLocaleString()} inbound`}
              icon={ArrowLeftRight}
              iconColor="text-violet-500"
              iconBg="bg-violet-50"
              trend={stats.responseRate >= 2.5 ? "up" : "down"}
              trendLabel={stats.responseRate >= 2.5 ? "above avg" : "below avg"}
            />
            <StatCard
              label="Engagement Rate"
              value={`${stats.engagementRate.toFixed(1)}%`}
              subValue="engaged vs responded"
              icon={Percent}
              iconColor="text-accent"
              iconBg="bg-pink-50"
            />
            <StatCard
              label="Conversion Rate"
              value={`${stats.conversionRate.toFixed(1)}%`}
              subValue={`${stats.leads.converted} converted`}
              icon={TrendingUp}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activity && <ActivityChart data={activity} />}
            </div>
            <LeadBreakdown leads={stats.leads} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConversionFunnel funnel={stats.conversionFunnel} />
            {benchmarks && <BenchmarksPanel data={benchmarks} />}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lifecycle && <LifecycleMetrics data={lifecycle} />}
            <FinancialPanel data={stats.financialMetrics} />
          </div>
        </>
      )}
    </div>
  );
}
