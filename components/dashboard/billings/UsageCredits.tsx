"use client";

import { useState } from "react";
import { Infinity, ChevronLeft, ChevronRight } from "lucide-react";
import { useCreditHistoryQuery } from "@/store/server/billing.queries";
import type {
  CreditBalance,
  CreditHistory,
  EffectiveLimits,
} from "@/types/billings";

interface UsageCreditsProps {
  creditBalance: CreditBalance | undefined;
  creditHistory: CreditHistory | undefined;
  limits: EffectiveLimits | undefined;
}

const PAGE_SIZE = 5;

function formatReason(reason: string): string {
  return reason.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UsageCredits({
  creditBalance,
  creditHistory,
  limits,
}: UsageCreditsProps) {
  const [page, setPage] = useState(0);

  const historyQuery = useCreditHistoryQuery(PAGE_SIZE, page * PAGE_SIZE);
  const entries = historyQuery.data?.entries ?? creditHistory?.entries ?? [];
  const total = historyQuery.data?.total ?? creditHistory?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const isUnlimited = creditBalance?.unlimited ?? false;
  const balance = creditBalance?.balance ?? 0;
  const maxCredits = limits?.maxMessageCredits ?? null;

  const usedCredits =
    maxCredits !== null ? Math.max(0, maxCredits - balance) : 0;
  const usagePercent =
    maxCredits && !isUnlimited
      ? Math.min(100, (usedCredits / maxCredits) * 100)
      : 0;

  const progressColor =
    usagePercent >= 90
      ? "bg-red-500"
      : usagePercent >= 70
        ? "bg-amber-500"
        : "bg-orange-500";

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-5 sm:p-8 shadow-sm flex flex-col gap-5">
      <h2 className="text-xl font-bold text-slate-900 font-heading">
        Usage & Credits
      </h2>

      {/* Credit balance */}
      <div className="bg-slate-50 rounded-2xl p-5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          Available Credits
        </p>
        <div className="flex items-end justify-between mb-3">
          <div>
            {isUnlimited ? (
              <div className="flex items-center gap-2">
                <Infinity className="w-6 h-6 text-slate-900" />
                <span className="text-lg font-black text-slate-900">
                  Unlimited
                </span>
              </div>
            ) : (
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {balance.toLocaleString()}
              </span>
            )}
          </div>
          {!isUnlimited && maxCredits !== null && (
            <span className="text-xs font-bold text-slate-400">
              of {maxCredits.toLocaleString()}
            </span>
          )}
        </div>

        {!isUnlimited && maxCredits !== null && (
          <div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5">
              {usedCredits.toLocaleString()} used · {usagePercent.toFixed(0)}%
            </p>
          </div>
        )}
      </div>

      {/* Resource limits */}
      {limits && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Seats", value: limits.maxSeats },
            { label: "Phone Numbers", value: limits.maxPhoneAliases },
            { label: "Email Aliases", value: limits.maxEmailAliases },
            { label: "KB Docs", value: limits.maxKnowledgeBases },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-2xl p-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                {label}
              </p>
              <p className="text-sm font-black text-slate-900">
                {value === null ? "∞" : value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Credit ledger — capped height */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          Credit History
        </p>

        {/* Fixed height + overflow-y-scroll so scrollbar gutter is always reserved — prevents layout shift */}
        <div className="max-h-[300px] overflow-y-scroll [scrollbar-gutter:stable]">
          {entries.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium py-6 text-center">
              No transactions yet.
            </p>
          ) : (
            <div
              className={`space-y-0.5 transition-opacity duration-150 ${historyQuery.isFetching ? "opacity-40" : "opacity-100"}`}
            >
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {formatReason(entry.reason)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-black shrink-0 ml-3 ${
                      entry.delta > 0 ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {entry.delta > 0 ? "+" : ""}
                    {entry.delta.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
            <span className="text-[10px] font-bold text-slate-400">
              {page + 1} / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-3 h-3 text-slate-600" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
