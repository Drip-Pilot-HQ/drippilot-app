"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Flame,
  CheckCircle2,
  ArrowLeftRight,
  TrendingUp,
} from "lucide-react";
import {
  useDashboardStatsQuery,
  useActivityInsightsQuery,
  useBenchmarksQuery,
  useLifecycleMetricsQuery,
} from "@/store/server/analytics.queries";
import type { AnalyticsScope } from "@/store/server/analytics.queries";
import { useMembersQuery } from "@/store/server/workspace.queries";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { useViewMode } from "@/lib/hooks/use-view-mode";
import { useAuthStore } from "@/store/client/useAuthStore";
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

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accent?: string;
}

function SectionHeader({
  title,
  subtitle,
  accent = "from-primary to-orange-300",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <div
        className={`w-1 h-7 rounded-full bg-linear-to-b ${accent}`}
        aria-hidden
      />
      <div>
        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function OverviewClient() {
  const [days, setDays] = useState<DaysFilter>(30);
  const [configOpen, setConfigOpen] = useState(false);
  const [viewAsMemberId, setViewAsMemberId] = useState<string | undefined>();
  const [memberChoseTeam, setMemberChoseTeam] = useState(false);

  const { isOwnerOrAdmin, isMember } = useWorkspaceRole();
  const { viewMode } = useViewMode();
  const currentUser = useAuthStore((s) => s.user);
  const memberViewEntry =
    isMember && !memberChoseTeam ? currentUser?.id : undefined;

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

  const scope: AnalyticsScope = isOwnerOrAdmin
    ? viewMode === "personal"
      ? "personal"
      : "team"
    : memberViewEntry
      ? "personal"
      : "team";

  const explicitViewAs =
    isOwnerOrAdmin && scope === "team" ? viewAsMemberId : undefined;

  const selfEntry =
    isMember && currentUser
      ? {
          userId: currentUser.id,
          name:
            (currentUser.user_metadata?.full_name as string | undefined) ||
            (currentUser.user_metadata?.name as string | undefined) ||
            currentUser.email ||
            "Me",
        }
      : undefined;

  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery(
    scope,
    explicitViewAs,
  );
  const { data: activity, isLoading: activityLoading } =
    useActivityInsightsQuery(days, scope, explicitViewAs);
  const { data: benchmarks, isLoading: benchmarksLoading } = useBenchmarksQuery(
    scope,
    explicitViewAs,
  );
  const { data: lifecycle, isLoading: lifecycleLoading } =
    useLifecycleMetricsQuery(days, scope, explicitViewAs);

  const isLoading =
    statsLoading || activityLoading || benchmarksLoading || lifecycleLoading;

  const scopeLabel = (() => {
    if (isOwnerOrAdmin && scope === "team" && viewAsMemberId) {
      const name = memberMap.get(viewAsMemberId);
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
          {name ? `${name}'s metrics` : "Member metrics"}
        </span>
      );
    }
    return null;
  })();

  const viewAsSelectorSlot = (() => {
    if (isOwnerOrAdmin && scope === "team") {
      return (
        <ViewAsMemberSelector
          members={members}
          value={viewAsMemberId}
          onChange={setViewAsMemberId}
        />
      );
    }
    if (isMember && selfEntry) {
      return (
        <ViewAsMemberSelector
          members={[]}
          value={memberViewEntry}
          onChange={(id) => setMemberChoseTeam(id === undefined)}
          selfEntry={selfEntry}
        />
      );
    }
    return undefined;
  })();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <OverviewHeader
        days={days}
        onDaysChange={setDays}
        onConfigureClick={
          isOwnerOrAdmin ? () => setConfigOpen(true) : undefined
        }
        scopeLabel={scopeLabel}
        viewAsSelectorSlot={viewAsSelectorSlot}
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
        <div className="space-y-12">
          {/* ── At a Glance ── */}
          <section className="space-y-5">
            <SectionHeader
              title="At a Glance"
              subtitle="Headline metrics for the selected scope"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
              <StatCard
                label="Total Leads"
                value={stats.leads.total.toLocaleString()}
                subValue={`${stats.leads.converted.toLocaleString()} converted`}
                icon={Users}
                iconColor="text-blue-500"
                iconBg="bg-blue-50"
                tooltip="All leads in your workspace, including active, converted, and unsubscribed contacts."
              />
              <StatCard
                label="Hot Leads"
                value={stats.leads.hot.toLocaleString()}
                subValue={`${stats.leads.warm.toLocaleString()} warm`}
                icon={Flame}
                iconColor="text-orange-500"
                iconBg="bg-orange-50"
                tooltip="Leads marked as hot — ready for immediate follow-up. Warm leads are showing interest but need nurturing."
              />
              <StatCard
                label="Conversions"
                value={stats.leads.converted.toLocaleString()}
                subValue={`of ${stats.leads.total.toLocaleString()} total leads`}
                icon={CheckCircle2}
                iconColor="text-emerald-500"
                iconBg="bg-emerald-50"
                tooltip="Total leads that have been marked as converted across all campaigns."
              />
              <StatCard
                label="Response Rate"
                value={`${stats.responseRate.toFixed(1)}%`}
                subValue={`${stats.messages.inbound.toLocaleString()} inbound`}
                icon={ArrowLeftRight}
                iconColor="text-violet-500"
                iconBg="bg-violet-50"
                trend={stats.responseRate >= 2.5 ? "up" : "down"}
                trendLabel={
                  stats.responseRate >= 2.5 ? "above avg" : "below avg"
                }
                tooltip="Percentage of outbound messages that received a genuine reply (excluding opt-outs). Industry average is ~2.5%."
              />
              <StatCard
                label="Conversion Rate"
                value={`${stats.conversionRate.toFixed(1)}%`}
                subValue={`${stats.leads.converted.toLocaleString()} of ${stats.conversionFunnel.historicallyEnrolledLeads.toLocaleString()} enrolled`}
                icon={TrendingUp}
                iconColor="text-emerald-500"
                iconBg="bg-emerald-50"
                tooltip="Campaign conversion rate: converted leads divided by all leads ever enrolled in a campaign."
                variant="accent"
              />
            </div>
          </section>

          {/* ── Lifecycle & Revenue ── */}
          <section className="space-y-5">
            <SectionHeader
              title="Lifecycle & Revenue"
              subtitle="Lead timing averages and financial projections"
              accent="from-violet-500 to-emerald-400"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lifecycle && <LifecycleMetrics data={lifecycle} />}
              <FinancialPanel data={stats.financialMetrics} />
            </div>
          </section>

          {/* ── Activity & Distribution ── */}
          <section className="space-y-5">
            <SectionHeader
              title="Activity & Distribution"
              subtitle="Daily message volume and lead status breakdown"
              accent="from-cyan-500 to-cyan-300"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {activity && <ActivityChart data={activity} />}
              </div>
              <LeadBreakdown leads={stats.leads} />
            </div>
          </section>

          {/* ── Pipeline Performance ── */}
          <section className="space-y-5">
            <SectionHeader
              title="Pipeline Performance"
              subtitle="Funnel progression and industry benchmarks"
              accent="from-blue-500 to-cyan-400"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConversionFunnel
                funnel={stats.conversionFunnel}
                converted={stats.leads.converted}
              />
              {benchmarks && <BenchmarksPanel data={benchmarks} />}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
