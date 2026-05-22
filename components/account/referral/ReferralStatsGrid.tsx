import { Users, Clock, BadgeCheck, TrendingUp } from "lucide-react";
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

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        label="Closed Accounts"
        value={String(signups.length)}
        icon={Users}
        iconColor="text-primary"
        iconBg="bg-orange-50 border border-orange-100"
        sub="all time"
      />
      <StatCard
        label="Pending"
        value={formatCents(pending)}
        icon={Clock}
        iconColor="text-amber-500"
        iconBg="bg-amber-50 border border-amber-100"
        sub="awaiting payout"
      />
      <StatCard
        label="Paid Out"
        value={formatCents(paid)}
        icon={BadgeCheck}
        iconColor="text-green-500"
        iconBg="bg-green-50 border border-green-100"
        sub="total received"
      />
      <StatCard
        label="Total Earned"
        value={formatCents(pending + paid)}
        icon={TrendingUp}
        iconColor="text-primary"
        iconBg="bg-orange-50 border border-orange-100"
        sub="lifetime"
      />
    </div>
  );
}

export function ReferralStatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-24 sm:h-28 bg-slate-100 rounded-2xl sm:rounded-3xl"
        />
      ))}
    </div>
  );
}
