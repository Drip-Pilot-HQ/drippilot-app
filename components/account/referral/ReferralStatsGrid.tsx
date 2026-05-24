import {
  Users,
  Clock,
  BadgeCheck,
  TrendingUp,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { formatCents } from "./config";
import { CommissionSummary, ReferralSignup } from "@/types/account";

interface ReferralStatsGridProps {
  signups: ReferralSignup[];
  summary: CommissionSummary | undefined;
}

export function ReferralStatsGrid({
  signups,
  summary,
}: ReferralStatsGridProps) {
  const pending = summary?.pendingCents ?? 0;
  const paid = summary?.paidCents ?? 0;
  const activeAccounts = summary?.activeAccounts ?? 0;
  const totalMrr = summary?.totalMrrCents ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      <StatCard
        label="Closed Accounts"
        value={String(signups.length)}
        icon={Users}
        iconColor="text-primary"
        iconBg="bg-primary/10"
        sub="all time"
      />
      <StatCard
        label="Active Accounts"
        value={String(activeAccounts)}
        icon={CheckCircle}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
        sub="currently active"
      />
      <StatCard
        label="Monthly Revenue"
        value={formatCents(totalMrr)}
        icon={DollarSign}
        iconColor="text-cyan-600"
        iconBg="bg-cyan-50"
        sub="combined MRR"
      />
      <StatCard
        label="Pending"
        value={formatCents(pending)}
        icon={Clock}
        iconColor="text-amber-600"
        iconBg="bg-amber-50"
        sub="awaiting payout"
      />
      <StatCard
        label="Paid Out"
        value={formatCents(paid)}
        icon={BadgeCheck}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
        sub="total received"
      />
      <StatCard
        label="Total Earned"
        value={formatCents(pending + paid)}
        icon={TrendingUp}
        iconColor="text-primary"
        iconBg="bg-primary/10"
        sub="lifetime"
      />
    </div>
  );
}

export function ReferralStatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-28 bg-slate-100 rounded-[28px]" />
      ))}
    </div>
  );
}
