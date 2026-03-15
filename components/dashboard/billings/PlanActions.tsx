"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, RefreshCw, Info } from "lucide-react";
import { ConfirmDialog } from "@/components/branding/ConfirmDialog";
import {
  PLAN_ORDER,
  PLAN_CONFIGS,
  getPlanTier,
  getPlanPrice,
  type PlanId,
  type BillingInterval,
} from "@/config/billing.config";
import {
  useUpgradeSubscriptionMutation,
  useDowngradeSubscriptionMutation,
} from "@/store/server/billing.queries";
import type { SubscriptionStatus, Addon } from "@/types/billings";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

interface PlanActionsProps {
  subscription: SubscriptionStatus;
  addons: Addon[];
}

interface PlanChangeTarget {
  planId: PlanId;
  interval: BillingInterval;
  direction: "upgrade" | "downgrade";
}

export function PlanActions({ subscription, addons }: PlanActionsProps) {
  const [pendingChange, setPendingChange] = useState<PlanChangeTarget | null>(
    null,
  );

  const upgradeMutation = useUpgradeSubscriptionMutation();
  const downgradeMutation = useDowngradeSubscriptionMutation();

  const currentPlanId = subscription.planId as PlanId;
  const currentInterval = subscription.billingInterval as BillingInterval;
  const currentTier = getPlanTier(currentPlanId);
  const hasAddons = addons.length > 0;

  const availableChanges: PlanChangeTarget[] = [];

  for (const planId of PLAN_ORDER) {
    if (planId === currentPlanId) continue;
    if (planId === "enterprise") continue;
    const tier = getPlanTier(planId);
    const direction = tier > currentTier ? "upgrade" : "downgrade";

    if (hasAddons) {
      availableChanges.push({ planId, interval: currentInterval, direction });
    } else {
      availableChanges.push({ planId, interval: "monthly", direction });
      availableChanges.push({ planId, interval: "yearly", direction });
    }
  }

  // Also allow same-plan interval switch if no addons
  if (!hasAddons && currentInterval) {
    const otherInterval: BillingInterval =
      currentInterval === "monthly" ? "yearly" : "monthly";
    availableChanges.push({
      planId: currentPlanId,
      interval: otherInterval,
      direction: otherInterval === "yearly" ? "upgrade" : "downgrade",
    });
  }

  const handleConfirmChange = async () => {
    if (!pendingChange) return;
    const { planId, interval, direction } = pendingChange;

    try {
      if (planId === currentPlanId) {
        // Interval-only switch — treat as upgrade to yearly, downgrade to monthly
        if (interval === "yearly") {
          await upgradeMutation.mutateAsync({ newPlanId: planId, interval });
        } else {
          await downgradeMutation.mutateAsync({ newPlanId: planId, interval });
        }
      } else if (direction === "upgrade") {
        await upgradeMutation.mutateAsync({ newPlanId: planId, interval });
      } else {
        await downgradeMutation.mutateAsync({ newPlanId: planId, interval });
      }
      toast.success("Plan updated successfully.");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err as AxiosError<{ message: string }>)?.response?.data?.message
        : "Failed to change plan.";
      toast.error(message ?? "Failed to change plan.");
    } finally {
      setPendingChange(null);
    }
  };

  const isMutating = upgradeMutation.isPending || downgradeMutation.isPending;
  const currentPlan = PLAN_CONFIGS[currentPlanId];

  // Group into upgrades / downgrades / interval switch
  const upgrades = availableChanges.filter((c) => c.direction === "upgrade");
  const downgrades = availableChanges.filter(
    (c) => c.direction === "downgrade",
  );

  if (upgrades.length === 0 && downgrades.length === 0) return null;

  const buildConfirmDescription = (change: PlanChangeTarget) => {
    const plan = PLAN_CONFIGS[change.planId];
    const price = getPlanPrice(change.planId, change.interval);
    const intervalLabel = change.interval === "yearly" ? "annually" : "monthly";

    if (change.planId === currentPlanId) {
      return `You're switching billing from ${currentInterval} to ${change.interval}. Drip Pilot will charge your active payment method on file $${price}/mo billed ${intervalLabel}. Changes take effect at the next billing cycle.`;
    }

    return `You're ${change.direction === "upgrade" ? "upgrading" : "downgrading"} to the ${plan.displayName} plan (${change.interval}). Drip Pilot will charge your active payment method on file $${price}/mo billed ${intervalLabel}. Changes take effect immediately (upgrades) or at next cycle (downgrades).`;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-5 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-heading mb-1">
          Change Plan
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Currently on{" "}
          <span className="text-slate-900 font-bold">
            {currentPlan?.displayName} ({currentInterval})
          </span>
          .{" "}
          {hasAddons && (
            <span className="inline-flex items-center gap-1 text-amber-600">
              <Info className="w-3.5 h-3.5" />
              Add-ons lock your billing interval — remove them to switch
              intervals.
            </span>
          )}
        </p>
      </div>

      {/* Upgrades */}
      {upgrades.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Upgrades
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upgrades.map((change) => {
              const plan = PLAN_CONFIGS[change.planId];
              const price = getPlanPrice(change.planId, change.interval);
              const currentPrice = getPlanPrice(currentPlanId, currentInterval);
              const diff = price - currentPrice;
              const isSameIntervalSwitch = change.planId === currentPlanId;

              return (
                <button
                  key={`${change.planId}-${change.interval}`}
                  onClick={() => setPendingChange(change)}
                  disabled={isMutating}
                  className="group flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all text-left disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      {isSameIntervalSwitch ? (
                        <RefreshCw className="w-4 h-4" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {isSameIntervalSwitch
                          ? `Switch to ${change.interval}`
                          : `${plan.displayName}`}
                      </p>
                      <p className="text-xs text-slate-400 font-medium capitalize">
                        {change.interval} billing
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-900">
                      ${price}/mo
                    </p>
                    {diff !== 0 && (
                      <p className="text-xs font-bold text-orange-500">
                        +${diff.toFixed(0)}/mo
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Downgrades */}
      {downgrades.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Downgrades
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {downgrades.map((change) => {
              const plan = PLAN_CONFIGS[change.planId];
              const price = getPlanPrice(change.planId, change.interval);
              const currentPrice = getPlanPrice(currentPlanId, currentInterval);
              const diff = price - currentPrice;
              const isSameIntervalSwitch = change.planId === currentPlanId;

              return (
                <button
                  key={`${change.planId}-${change.interval}`}
                  onClick={() => setPendingChange(change)}
                  disabled={isMutating}
                  className="group flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all text-left disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      {isSameIntervalSwitch ? (
                        <RefreshCw className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {isSameIntervalSwitch
                          ? `Switch to ${change.interval}`
                          : `${plan.displayName}`}
                      </p>
                      <p className="text-xs text-slate-400 font-medium capitalize">
                        {change.interval} billing · takes effect next cycle
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-900">
                      ${price}/mo
                    </p>
                    {diff !== 0 && (
                      <p className="text-xs font-bold text-slate-400">
                        {diff > 0 ? "+" : ""}${diff.toFixed(0)}/mo
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation dialog */}
      {pendingChange && (
        <ConfirmDialog
          isOpen={!!pendingChange}
          onClose={() => setPendingChange(null)}
          onConfirm={handleConfirmChange}
          isLoading={isMutating}
          title={
            pendingChange.planId === currentPlanId
              ? `Switch to ${pendingChange.interval} billing`
              : `${pendingChange.direction === "upgrade" ? "Upgrade" : "Downgrade"} to ${PLAN_CONFIGS[pendingChange.planId].displayName}`
          }
          description={buildConfirmDescription(pendingChange)}
          confirmLabel="Confirm Change"
          cancelLabel="Cancel"
          variant={
            pendingChange.direction === "upgrade" ? "primary" : "warning"
          }
        />
      )}
    </div>
  );
}
