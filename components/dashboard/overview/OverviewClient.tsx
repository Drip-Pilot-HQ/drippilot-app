"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Workflow,
  MessageSquare,
  ArrowLeftRight,
  TrendingUp,
} from "lucide-react";
import {
  useDashboardStatsQuery,
  useActivityInsightsQuery,
  useBenchmarksQuery,
  useLifecycleMetricsQuery,
} from "@/store/server/analytics.queries";
import { useMembersQuery } from "@/store/server/workspace.queries";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import type { DaysFilter } from "@/types/analytics";
import { OverviewHeader } from "./OverviewHeader";
import { ViewAsMemberSelector } from "./ViewAsMemberSelector";
import { StatCard } from "./StatCard";
import { ActivityChart } from "./ActivityChart";
import { ConversionFunnel } from "./ConversionFunnel";
import { BenchmarksPanel } from "./BenchmarksPanel";
import { LifecycleMetrics } from "./LifecycleMetrics";
import { FinancialPanel } from "./FinancialPanel";
import { LeadBreakdown } from "./LeadBreakdown";
import { AnalyticsConfigPanel } from "./AnalyticsConfigPanel";
import { OverviewSkeleton } from "./OverviewSkeleton";

export function OverviewClient() {
  const [days, setDays] = useState<DaysFilter>(30);
  const [configOpen, setConfigOpen] = useState(false);
  const [viewAsMemberId, setViewAsMemberId] = useState<string | undefined>();

  const { isOwnerOrAdmin, isMember } = useWorkspaceRole();
  const { data: membersData } = useMembersQuery(isOwnerOrAdmin);
  const members = useMemo(() => membersData ?? [], [membersData]);

  const memberMap = useMemo(
    () =>
      new Map(
        members
          .filter((m) => m.userId !== null)
          .map((m) => [
            m.userId as string,
            m.memberName || m.inviteEmail || "Unknown",
          ]),
      ),
    [members],
  );

  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery(
    isOwnerOrAdmin ? viewAsMemberId : undefined,
  );
  const { data: activity, isLoading: activityLoading } =
    useActivityInsightsQuery(days, isOwnerOrAdmin ? viewAsMemberId : undefined);
  const { data: benchmarks, isLoading: benchmarksLoading } = useBenchmarksQuery(
    isOwnerOrAdmin ? viewAsMemberId : undefined,
  );
  const { data: lifecycle, isLoading: lifecycleLoading } =
    useLifecycleMetricsQuery(days, isOwnerOrAdmin ? viewAsMemberId : undefined);

  const isLoading =
    statsLoading || activityLoading || benchmarksLoading || lifecycleLoading;

  const scopeLabel = (() => {
    if (isOwnerOrAdmin && viewAsMemberId) {
      const name = memberMap.get(viewAsMemberId);
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
          {name ? `${name}'s metrics` : "Member metrics"}
        </span>
      );
    }
    if (isOwnerOrAdmin) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
          Team metrics
        </span>
      );
    }
    if (isMember) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
          Your metrics
        </span>
      );
    }
    return null;
  })();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <OverviewHeader
        days={days}
        onDaysChange={setDays}
        onConfigureClick={
          isOwnerOrAdmin ? () => setConfigOpen(true) : undefined
        }
        scopeLabel={scopeLabel}
        viewAsSelectorSlot={
          isOwnerOrAdmin ? (
            <ViewAsMemberSelector
              members={members}
              value={viewAsMemberId}
              onChange={setViewAsMemberId}
            />
          ) : undefined
        }
      />

      {isOwnerOrAdmin && (
        <AnalyticsConfigPanel
          isOpen={configOpen}
          onClose={() => setConfigOpen(false)}
        />
      )}

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
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard
              label="Total Leads"
              value={stats.leads.total.toLocaleString()}
              subValue={`${stats.leads.hot} hot · ${stats.leads.warm} warm`}
              icon={Users}
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
              tooltip="All leads in your workspace, including active, converted, and unsubscribed contacts."
            />
            <StatCard
              label="Active Campaigns"
              value={stats.campaigns.active}
              subValue={`${stats.campaigns.total} total`}
              icon={Workflow}
              iconColor="text-primary"
              iconBg="bg-primary/10"
              tooltip="Campaigns currently running and actively sending messages to leads."
            />
            <StatCard
              label="Messages Today"
              value={stats.messages.today.toLocaleString()}
              subValue={`${stats.messages.outbound.toLocaleString()} outbound total`}
              icon={MessageSquare}
              iconColor="text-secondary"
              iconBg="bg-cyan-50"
              tooltip="Total outbound messages sent today across all active campaigns."
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
              tooltip="Percentage of outbound messages that received any reply, including opt-outs and negative responses. Industry average is ~2.5%."
            />
            <StatCard
              label="Conversion Rate"
              value={`${stats.conversionRate.toFixed(1)}%`}
              subValue={`${stats.leads.converted} converted`}
              icon={TrendingUp}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-50"
              tooltip="Percentage of total leads that have been marked as converted across your workspace."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lifecycle && <LifecycleMetrics data={lifecycle} />}
            <FinancialPanel data={stats.financialMetrics} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activity && <ActivityChart data={activity} />}
            </div>
            <LeadBreakdown leads={stats.leads} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConversionFunnel
              funnel={stats.conversionFunnel}
              converted={stats.leads.converted}
            />
            {benchmarks && <BenchmarksPanel data={benchmarks} />}
          </div>
        </>
      )}
    </div>
  );
}
