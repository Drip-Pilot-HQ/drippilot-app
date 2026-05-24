"use client";

import { useState } from "react";
import { Users, ChevronDown, DollarSign } from "lucide-react";
import { formatDate, formatCents } from "./config";
import { ReferralSignup, ReferralCommission } from "@/types/account";
import { CommissionBadge } from "./CommissionBadge";
import { cn } from "@/lib/utils";

interface ReferredUsersTableProps {
  signups: ReferralSignup[];
  commissions: ReferralCommission[];
}

function UserAvatar({ name, email }: { name: string; email: string }) {
  const initial = (name || email)?.[0]?.toUpperCase() ?? "?";
  return (
    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-primary">{initial}</span>
    </div>
  );
}

function PlanBadge({ planId }: { planId: string | null }) {
  if (!planId || planId === "none") {
    return <span className="text-slate-300 text-sm">—</span>;
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
      {planId}
    </span>
  );
}

function AccountStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-slate-300 text-sm">—</span>;

  const styles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700",
    past_due: "bg-amber-50 text-amber-700",
    suspended_dunning: "bg-amber-50 text-amber-700",
    canceled_pending: "bg-red-50 text-red-600",
    terminated: "bg-red-50 text-red-600",
  };
  const cls = styles[status] ?? "bg-slate-100 text-slate-600";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap",
        cls,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function CommissionSubRow({ commission }: { commission: ReferralCommission }) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="pl-14 pr-3 py-2.5">
        <p className="text-xs font-semibold text-slate-700">
          Invoice · {formatCents(commission.invoiceAmountCents)}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {formatDate(commission.createdAt)}
        </p>
      </td>
      <td className="px-3 py-2.5" />
      <td className="px-3 py-2.5" />
      <td className="px-3 py-2.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          +{formatCents(commission.commissionAmountCents)}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <CommissionBadge status={commission.status} />
      </td>
      <td className="px-3 py-2.5" />
    </tr>
  );
}

function UserRow({
  signup,
  userCommissions,
  colCount,
}: {
  signup: ReferralSignup;
  userCommissions: ReferralCommission[];
  colCount: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasCommissions = userCommissions.length > 0;
  const totalEarned = userCommissions.reduce(
    (s, c) => s + c.commissionAmountCents,
    0,
  );

  return (
    <>
      <tr
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "border-b border-slate-100 cursor-pointer transition-colors",
          expanded ? "bg-slate-50" : "hover:bg-slate-50",
        )}
      >
        {/* Account */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <UserAvatar
              name={signup.referredName}
              email={signup.referredEmail}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate max-w-45">
                {signup.referredName || "—"}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-45">
                {signup.referredEmail}
              </p>
            </div>
          </div>
        </td>

        {/* Plan */}
        <td className="px-3 py-3">
          <PlanBadge planId={signup.planId} />
        </td>

        {/* MRR */}
        <td className="px-3 py-3">
          <span className="text-sm font-semibold text-slate-700">
            {signup.mrrCents != null ? formatCents(signup.mrrCents) : "—"}
          </span>
        </td>

        {/* Commissions earned */}
        <td className="px-3 py-3">
          {hasCommissions ? (
            <span className="text-sm font-semibold text-emerald-600">
              {formatCents(totalEarned)}
            </span>
          ) : (
            <span className="text-slate-300 text-sm">—</span>
          )}
        </td>

        {/* Status */}
        <td className="px-3 py-3">
          <AccountStatusBadge status={signup.accountStatus} />
        </td>

        {/* Joined + chevron */}
        <td className="px-3 py-3 text-right">
          <div className="flex items-center justify-end gap-3">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
              {formatDate(signup.createdAt)}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0",
                expanded && "rotate-180",
              )}
            />
          </div>
        </td>
      </tr>

      {/* Commission expansion — animated via grid trick inside colSpan td */}
      <tr>
        <td colSpan={colCount} className="p-0 border-0">
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-200 ease-in-out",
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <table className="w-full">
                <tbody>
                  {/* Sub-header */}
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <td colSpan={colCount} className="pl-14 pr-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Commission History
                          </span>
                          {hasCommissions && (
                            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-500 text-[9px] font-black">
                              {userCommissions.length}
                            </span>
                          )}
                        </div>
                        {hasCommissions && (
                          <span className="text-xs font-semibold text-slate-500">
                            Total:{" "}
                            <span className="text-emerald-600 font-bold">
                              {formatCents(totalEarned)}
                            </span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {hasCommissions ? (
                    userCommissions.map((c) => (
                      <CommissionSubRow key={c.id} commission={c} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={colCount} className="pl-14 pr-4 py-4">
                        <p className="text-xs text-slate-400 font-medium">
                          No commissions yet for this account.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

export function ReferredUsersTable({
  signups,
  commissions,
}: ReferredUsersTableProps) {
  const commissionsByUser = commissions.reduce<
    Record<string, ReferralCommission[]>
  >((acc, c) => {
    (acc[c.referralSignupId] ??= []).push(c);
    return acc;
  }, {});

  const COL_COUNT = 6;

  if (signups.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
          <Users className="w-5 h-5 text-slate-300" />
        </div>
        <p className="font-semibold text-slate-900 text-sm mb-1">
          No accounts yet
        </p>
        <p className="text-slate-400 text-xs max-w-xs mx-auto">
          New signups using your tracking link will appear here.
        </p>
      </div>
    );
  }

  const totalCommissions = commissions.length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-3">
        <p className="font-bold text-slate-900 text-sm">Managed Accounts</p>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider">
          {signups.length}
        </span>
        {totalCommissions > 0 && (
          <span className="text-xs text-slate-400 font-medium">
            · {totalCommissions} commissions — click row to expand
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-160">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                Account
              </th>
              <th className="px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                Plan
              </th>
              <th className="px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                MRR
              </th>
              <th className="px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                Earned
              </th>
              <th className="px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-slate-500 text-right">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {signups.map((signup) => (
              <UserRow
                key={signup.referredUserId}
                signup={signup}
                userCommissions={commissionsByUser[signup.id] ?? []}
                colCount={COL_COUNT}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
