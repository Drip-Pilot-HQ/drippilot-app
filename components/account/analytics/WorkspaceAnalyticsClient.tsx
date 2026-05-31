"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Flame,
  TrendingUp,
  ArrowRight,
  BrainCircuit,
  ArrowLeftRight,
  CheckCircle2,
  UserCheck,
  MessageSquare,
  Workflow,
  Medal,
} from "lucide-react";
import { useOwnedWorkspacesAnalyticsQuery } from "@/store/server/analytics.queries";
import { useAccountStore } from "@/store/client/useAccountStore";
import { WorkspaceRole } from "@/types/account";
import type { WorkspaceSummary } from "@/types/analytics";
import { StatCard } from "@/components/dashboard/overview/StatCard";

// ── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 rounded w-2/3" />
          <div className="h-3 bg-slate-100 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
      </div>
      <div className="h-2 bg-slate-100 rounded-full" />
      <div className="h-9 bg-slate-100 rounded-xl" />
    </div>
  );
}

// ── Lead status bar ───────────────────────────────────────────────────────────

function LeadStatusBar({ ws }: { ws: WorkspaceSummary }) {
  const { totalLeads, hotLeads, warmLeads, convertedLeads } = ws;
  if (totalLeads === 0)
    return <div className="h-1.5 rounded-full bg-slate-100" />;
  const cold = Math.max(totalLeads - hotLeads - warmLeads - convertedLeads, 0);
  const segments = [
    { value: cold, color: "bg-slate-200" },
    { value: warmLeads, color: "bg-cyan-400" },
    { value: hotLeads, color: "bg-orange-400" },
    { value: convertedLeads, color: "bg-emerald-500" },
  ].filter((s) => s.value > 0);
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
      {segments.map((s, i) => (
        <div
          key={i}
          className={`${s.color} rounded-full`}
          style={{ flex: s.value }}
        />
      ))}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-emerald-400" />
      <div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Comparison table (desktop) ────────────────────────────────────────────────

function ComparisonTable({
  ranked,
  onOpen,
}: {
  ranked: WorkspaceSummary[];
  onOpen: (ws: WorkspaceSummary) => void;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-[28px] shadow-sm overflow-hidden">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <span>Workspace</span>
        <span className="text-right">Members</span>
        <span className="text-right">Leads</span>
        <span className="text-right">Hot</span>
        <span className="text-right">Warm</span>
        <span className="text-right">Converted</span>
        <span className="text-right">Response</span>
        <span />
      </div>

      {ranked.map((ws, i) => {
        const isTop = i === 0 && ws.responseRate > 0;
        const responseGood = ws.responseRate >= 2.5;
        return (
          <div
            key={ws.workspaceId}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
          >
            {/* Workspace + rank */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[11px] font-black text-slate-300 tabular-nums w-4 shrink-0">
                #{i + 1}
              </span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-slate-900 truncate">
                    {ws.workspaceName}
                  </span>
                  {isTop && (
                    <span className="shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest">
                      Top
                    </span>
                  )}
                </div>
                <div className="mt-1 w-full max-w-[140px]">
                  <LeadStatusBar ws={ws} />
                </div>
              </div>
            </div>

            <div className="text-right text-sm font-black text-slate-700 tabular-nums">
              {ws.memberCount.toLocaleString()}
            </div>
            <div className="text-right text-sm font-black text-slate-700 tabular-nums">
              {ws.totalLeads.toLocaleString()}
            </div>
            <div className="text-right text-sm font-black text-orange-500 tabular-nums">
              {ws.hotLeads.toLocaleString()}
            </div>
            <div className="text-right text-sm font-black text-cyan-600 tabular-nums">
              {ws.warmLeads.toLocaleString()}
            </div>
            <div className="text-right text-sm font-black text-emerald-600 tabular-nums">
              {ws.convertedLeads.toLocaleString()}
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-black tabular-nums ${responseGood ? "text-emerald-600" : "text-red-500"}`}
              >
                {ws.responseRate.toFixed(1)}%
              </span>
            </div>
            <button
              onClick={() => onOpen(ws)}
              className="flex items-center gap-1 text-[11px] font-black text-slate-400 hover:text-primary transition-colors whitespace-nowrap"
            >
              Open <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Workspace card ────────────────────────────────────────────────────────────

function WorkspaceCard({
  ws,
  rank,
  onOpen,
}: {
  ws: WorkspaceSummary;
  rank: number;
  onOpen: () => void;
}) {
  const isTop = rank === 0 && ws.responseRate > 0;
  const responseGood = ws.responseRate >= 2.5;

  return (
    <div className="group bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900 tracking-tight truncate">
              {ws.workspaceName}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {ws.memberCount} {ws.memberCount === 1 ? "member" : "members"} ·{" "}
              {ws.totalLeads.toLocaleString()} leads
            </p>
          </div>
        </div>
        {isTop && (
          <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest whitespace-nowrap">
            Top
          </span>
        )}
      </div>

      {/* Lead breakdown */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-orange-50 rounded-2xl p-3">
          <p className="text-lg font-black text-orange-600 tabular-nums">
            {ws.hotLeads}
          </p>
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-wider mt-0.5">
            Hot
          </p>
        </div>
        <div className="bg-cyan-50 rounded-2xl p-3">
          <p className="text-lg font-black text-cyan-600 tabular-nums">
            {ws.warmLeads}
          </p>
          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-wider mt-0.5">
            Warm
          </p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-3">
          <p className="text-lg font-black text-emerald-600 tabular-nums">
            {ws.convertedLeads}
          </p>
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mt-0.5">
            Converted
          </p>
        </div>
      </div>

      {/* Rates */}
      <div className="flex items-center gap-2">
        <div
          className={`flex-1 flex items-center gap-1.5 rounded-xl px-3 py-2 ${responseGood ? "bg-emerald-50" : "bg-red-50"}`}
        >
          <ArrowLeftRight
            className={`w-3.5 h-3.5 shrink-0 ${responseGood ? "text-emerald-500" : "text-red-400"}`}
          />
          <div>
            <p
              className={`text-sm font-black tabular-nums ${responseGood ? "text-emerald-700" : "text-red-600"}`}
            >
              {ws.responseRate.toFixed(1)}%
            </p>
            <p
              className={`text-[10px] font-black uppercase tracking-wider ${responseGood ? "text-emerald-500" : "text-red-400"}`}
            >
              response rate
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-1.5 rounded-xl px-3 py-2 bg-violet-50">
          <TrendingUp className="w-3.5 h-3.5 text-violet-500 shrink-0" />
          <div>
            <p className="text-sm font-black text-violet-700 tabular-nums">
              {ws.conversionRate.toFixed(1)}%
            </p>
            <p className="text-[10px] font-black uppercase tracking-wider text-violet-500">
              conversion
            </p>
          </div>
        </div>
      </div>

      {/* Lead status bar */}
      <div className="space-y-1.5">
        <LeadStatusBar ws={ws} />
        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-200 inline-block" />
            Cold
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            Warm
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            Hot
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Converted
          </span>
        </div>
      </div>

      {/* Active conversations */}
      {ws.enrolledLeads > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] font-black text-slate-500">
            {ws.enrolledLeads.toLocaleString()} active conversations
          </span>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onOpen}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black transition-colors mt-auto"
      >
        Open Workspace
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main client ───────────────────────────────────────────────────────────────

export function WorkspaceAnalyticsClient() {
  const { data: workspaces, isLoading } = useOwnedWorkspacesAnalyticsQuery();
  const { setActiveWorkspace } = useAccountStore();
  const router = useRouter();

  const aggregate = useMemo(() => {
    if (!workspaces?.length) return null;
    const totalOut = workspaces.reduce((s, w) => s + w.outboundMessages, 0);
    const totalIn = workspaces.reduce((s, w) => s + w.inboundMessages, 0);
    return {
      totalWorkspaces: workspaces.length,
      totalMembers: workspaces.reduce((s, w) => s + w.memberCount, 0),
      totalLeads: workspaces.reduce((s, w) => s + w.totalLeads, 0),
      totalHot: workspaces.reduce((s, w) => s + w.hotLeads, 0),
      totalWarm: workspaces.reduce((s, w) => s + w.warmLeads, 0),
      totalConverted: workspaces.reduce((s, w) => s + w.convertedLeads, 0),
      totalActiveConversations: workspaces.reduce(
        (s, w) => s + w.enrolledLeads,
        0,
      ),
      avgResponseRate: totalOut > 0 ? (totalIn / totalOut) * 100 : 0,
    };
  }, [workspaces]);

  const ranked = useMemo(
    () =>
      workspaces
        ? [...workspaces].sort((a, b) => b.responseRate - a.responseRate)
        : [],
    [workspaces],
  );

  const handleOpen = (ws: WorkspaceSummary) => {
    setActiveWorkspace({
      id: ws.workspaceId,
      name: ws.workspaceName,
      role: WorkspaceRole.OWNER,
    });
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-100 rounded-[28px] h-32 animate-pulse"
            />
          ))}
        </div>
        <div className="bg-slate-100 rounded-[28px] h-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!workspaces || workspaces.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white border border-slate-100 rounded-[40px] shadow-sm">
        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
          <BrainCircuit className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Multi-Workspace View
        </h2>
        <p className="text-slate-500 max-w-sm font-medium">
          Create more workspaces to compare performance across teams. This view
          shows aggregate analytics for all workspaces you own.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ── Enterprise Overview ── */}
      {aggregate && (
        <section>
          <SectionHeader
            title="Enterprise Overview"
            subtitle="Aggregate totals across all your workspaces"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Workspaces"
              value={aggregate.totalWorkspaces}
              subValue="you own"
              icon={Workflow}
              iconColor="text-primary"
              iconBg="bg-primary/10"
            />
            <StatCard
              label="Total Members"
              value={aggregate.totalMembers.toLocaleString()}
              subValue="across all workspaces"
              icon={UserCheck}
              iconColor="text-violet-500"
              iconBg="bg-violet-50"
            />
            <StatCard
              label="Total Leads"
              value={aggregate.totalLeads.toLocaleString()}
              subValue={`${aggregate.totalConverted.toLocaleString()} converted`}
              icon={Users}
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
            />
            <StatCard
              label="Active Conversations"
              value={aggregate.totalActiveConversations.toLocaleString()}
              subValue="currently in campaigns"
              icon={MessageSquare}
              iconColor="text-cyan-500"
              iconBg="bg-cyan-50"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <StatCard
              label="Hot Leads"
              value={aggregate.totalHot.toLocaleString()}
              subValue="ready for follow-up"
              icon={Flame}
              iconColor="text-orange-500"
              iconBg="bg-orange-50"
            />
            <StatCard
              label="Warm Leads"
              value={aggregate.totalWarm.toLocaleString()}
              subValue="showing interest"
              icon={TrendingUp}
              iconColor="text-cyan-500"
              iconBg="bg-cyan-50"
            />
            <StatCard
              label="Conversions"
              value={aggregate.totalConverted.toLocaleString()}
              subValue={`of ${aggregate.totalLeads.toLocaleString()} total`}
              icon={CheckCircle2}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-50"
            />
            <StatCard
              label="Avg Response Rate"
              value={`${aggregate.avgResponseRate.toFixed(1)}%`}
              subValue={
                aggregate.avgResponseRate >= 2.5
                  ? "above industry avg"
                  : "below industry avg"
              }
              icon={ArrowLeftRight}
              iconColor={
                aggregate.avgResponseRate >= 2.5
                  ? "text-emerald-500"
                  : "text-red-400"
              }
              iconBg={
                aggregate.avgResponseRate >= 2.5 ? "bg-emerald-50" : "bg-red-50"
              }
              trend={aggregate.avgResponseRate >= 2.5 ? "up" : "down"}
              trendLabel={
                aggregate.avgResponseRate >= 2.5 ? "above avg" : "below avg"
              }
            />
          </div>
        </section>
      )}

      {/* ── Performance Comparison ── */}
      <section>
        <SectionHeader
          title="Performance Comparison"
          subtitle="Workspaces ranked by response rate — see who's leading"
        />
        {/* Desktop table */}
        <div className="hidden md:block">
          <ComparisonTable ranked={ranked} onOpen={handleOpen} />
        </div>
        {/* Mobile: label only, cards below serve as comparison */}
        <div className="md:hidden flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
          <Medal className="w-3.5 h-3.5" />
          Ranked by response rate — see workspace cards below
        </div>
      </section>

      {/* ── Workspace Detail Cards ── */}
      <section>
        <SectionHeader
          title="Workspace Details"
          subtitle="In-depth breakdown for each workspace"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ranked.map((ws, i) => (
            <WorkspaceCard
              key={ws.workspaceId}
              ws={ws}
              rank={i}
              onOpen={() => handleOpen(ws)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
