"use client";

import { Infinity } from "lucide-react";
import type { CreditBalance, EffectiveLimits } from "@/types/billings";

interface UsageCreditsProps {
  creditBalance: CreditBalance | undefined;
  limits: EffectiveLimits | undefined;
}

export function UsageCredits({ creditBalance, limits }: UsageCreditsProps) {
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
    </div>
  );
}
