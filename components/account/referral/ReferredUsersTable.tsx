import { Users } from "lucide-react";
import { formatDate, formatCents } from "./config";
import { ReferralSignup } from "@/types/account";

interface ReferredUsersTableProps {
  signups: ReferralSignup[];
}

function UserAvatar({ name, email }: { name: string; email: string }) {
  const initial = (name || email)?.[0]?.toUpperCase() ?? "?";
  return (
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-br from-primary/20 to-pink-400/20 flex items-center justify-center shrink-0">
      <span className="text-xs sm:text-sm font-black text-primary">
        {initial}
      </span>
    </div>
  );
}

function PlanBadge({ planId }: { planId: string | null }) {
  if (!planId || planId === "none") {
    return <span className="text-slate-400 font-bold text-[11px]">—</span>;
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
      {planId}
    </span>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status)
    return <span className="text-slate-400 font-bold text-[11px]">—</span>;

  const styles: Record<string, string> = {
    active: "bg-green-50 text-green-600 border border-green-100",
    past_due: "bg-amber-50 text-amber-600 border border-amber-100",
    suspended_dunning: "bg-amber-50 text-amber-600 border border-amber-100",
    canceled_pending: "bg-red-50 text-red-500 border border-red-100",
    terminated: "bg-red-50 text-red-500 border border-red-100",
  };

  const className =
    styles[status] ?? "bg-slate-50 text-slate-500 border border-slate-100";

  const label = status.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
}

export function ReferredUsersTable({ signups }: ReferredUsersTableProps) {
  if (signups.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
        </div>
        <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
          No accounts yet
        </h4>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
          New signups using your tracking link will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Users className="w-4 h-4 text-primary shrink-0" />
        <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg">
          Managed Accounts
        </h3>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider shrink-0">
          {signups.length} total
        </span>
      </div>

      {/* Desktop column headers */}
      <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] px-6 py-2.5 bg-slate-50 border-b border-slate-100 gap-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Account
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-20 text-center">
          Plan
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-20 text-right">
          MRR
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-28 text-center">
          Status
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-20 text-right">
          Date Joined
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {signups.map((signup) => (
          <div
            key={signup.referredUserId}
            className="px-5 sm:px-6 py-3.5 sm:py-4 hover:bg-slate-50/60 transition-colors"
          >
            {/* Desktop row */}
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-6">
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar
                  name={signup.referredName}
                  email={signup.referredEmail}
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {signup.referredName || "—"}
                  </p>
                  <p className="text-xs font-semibold text-slate-400 truncate">
                    {signup.referredEmail}
                  </p>
                </div>
              </div>
              <div className="w-20 flex justify-center">
                <PlanBadge planId={signup.planId} />
              </div>
              <p className="w-20 text-right text-[11px] font-bold text-slate-700">
                {signup.mrrCents != null ? formatCents(signup.mrrCents) : "—"}
              </p>
              <div className="w-28 flex justify-center">
                <StatusBadge status={signup.accountStatus} />
              </div>
              <p className="w-20 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {formatDate(signup.createdAt)}
              </p>
            </div>

            {/* Mobile row */}
            <div className="flex sm:hidden items-center gap-3">
              <UserAvatar
                name={signup.referredName}
                email={signup.referredEmail}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {signup.referredName || "—"}
                </p>
                <p className="text-[11px] font-semibold text-slate-400 truncate">
                  {signup.referredEmail}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <PlanBadge planId={signup.planId} />
                  <StatusBadge status={signup.accountStatus} />
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[11px] font-bold text-slate-700">
                  {signup.mrrCents != null ? formatCents(signup.mrrCents) : "—"}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  {formatDate(signup.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
