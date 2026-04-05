"use client";

import { useState } from "react";
import {
  CreditCard,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { Button } from "@/components/branding/Button";
import { ConfirmDialog } from "@/components/branding/ConfirmDialog";
import {
  useEnableOverageMutation,
  useDisableOverageMutation,
  usePayOverageMutation,
} from "@/store/server/billing.queries";
import type { SubscriptionStatus, OverageStatus } from "@/types/billings";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

interface OverageProtectionProps {
  subscription: SubscriptionStatus;
  overageStatus: OverageStatus | undefined;
}

export function OverageProtection({
  subscription,
  overageStatus,
}: OverageProtectionProps) {
  const [confirmDialog, setConfirmDialog] = useState<
    "enable" | "disable" | "pay" | null
  >(null);

  const enableMutation = useEnableOverageMutation();
  const disableMutation = useDisableOverageMutation();
  const payMutation = usePayOverageMutation();

  const isMutating =
    enableMutation.isPending ||
    disableMutation.isPending ||
    payMutation.isPending;

  const isRestricted = subscription.accountStatus === "restricted_overage";
  const isEnabled = overageStatus?.enabled ?? false;
  const pendingUsd = overageStatus?.pendingUsd ?? "0.00";
  const pendingCredits = overageStatus?.pendingCredits ?? 0;
  const threshold = overageStatus?.globalThresholdUsd ?? 5;
  const settlementInProgress = overageStatus?.settlementInProgress ?? false;

  const pendingFloat = parseFloat(pendingUsd);
  const progressPercent = Math.min(100, (pendingFloat / threshold) * 100);

  const canDisable = isEnabled && pendingCredits === 0;

  const handleToggle = () => {
    if (isEnabled) {
      if (!canDisable) return;
      setConfirmDialog("disable");
    } else {
      setConfirmDialog("enable");
    }
  };

  const handleConfirm = async () => {
    try {
      if (confirmDialog === "enable") {
        await enableMutation.mutateAsync();
        toast.success("Overage protection enabled.");
      } else if (confirmDialog === "disable") {
        await disableMutation.mutateAsync();
        toast.success("Overage protection disabled.");
      } else if (confirmDialog === "pay") {
        await payMutation.mutateAsync();
        toast.success("Payment queued. Your balance will clear shortly.");
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err as AxiosError<{ message: string }>)?.response?.data?.message
        : "Action failed. Please try again.";
      toast.error(message ?? "Action failed. Please try again.");
    } finally {
      setConfirmDialog(null);
    }
  };

  const dialogConfig = {
    enable: {
      title: "Enable Overage Protection",
      description: `By enabling overage protection, you authorize Drip Pilot to charge your active payment method on file whenever your accumulated overage balance reaches the $${threshold.toFixed(2)} threshold. Each credit consumed beyond your plan limit costs $0.06. You can disable this at any time while your balance is $0.`,
      confirmLabel: "Yes, Enable",
      variant: "primary" as const,
    },
    disable: {
      title: "Disable Overage Protection",
      description:
        "Overage protection will be turned off. Your service will be interrupted once you reach your plan's credit limit. You can re-enable at any time.",
      confirmLabel: "Yes, Disable",
      variant: "warning" as const,
    },
    pay: {
      title: "Pay Outstanding Balance",
      description: `Drip Pilot will immediately charge your active payment method on file $${pendingUsd} to clear your outstanding overage balance. This will restore your account access.`,
      confirmLabel: "Pay Now",
      variant: "primary" as const,
    },
  };

  const activeDialog = confirmDialog ? dialogConfig[confirmDialog] : null;

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-5 sm:p-8 shadow-sm space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Overage Protection
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Auto-charge at ${threshold.toFixed(2)} threshold
          </p>
        </div>

        {/* Toggle */}
        <button
          onClick={handleToggle}
          disabled={isMutating || (isEnabled && !canDisable)}
          title={
            isEnabled && !canDisable
              ? "Pay your outstanding balance before disabling"
              : undefined
          }
          className={`w-12 h-6 rounded-full transition-all relative shrink-0 disabled:opacity-60 disabled:cursor-not-allowed ${
            isEnabled ? "bg-orange-500" : "bg-slate-200"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
              isEnabled ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-slate-500 text-sm font-medium leading-relaxed">
        {isEnabled
          ? "Services continue uninterrupted past your plan limit. Overages are charged at $6 per 100 credits automatically when they reach the threshold."
          : "Enable to keep your outreach running when you hit your credit limit. You'll be billed at a rate of $6 per 100 overage credits."}
      </p>

      {/* Can't disable warning */}
      {isEnabled && !canDisable && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-2xl p-3.5">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 font-medium">
            You have an outstanding overage balance. Pay it first to disable
            overage protection.
          </p>
        </div>
      )}

      {/* Balance & progress */}
      {isEnabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              Overage Balance
            </span>
            <span
              className={`text-sm font-black ${
                isRestricted ? "text-red-500" : "text-orange-500"
              }`}
            >
              ${pendingUsd} / ${threshold.toFixed(2)}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isRestricted || progressPercent >= 100
                  ? "bg-red-500"
                  : progressPercent >= 80
                    ? "bg-amber-500"
                    : "bg-orange-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <p className="font-bold text-slate-400">
              {pendingCredits.toLocaleString()} overage credits used
            </p>
            <p className="font-bold text-slate-500">${pendingUsd} accrued</p>
          </div>
          {settlementInProgress && (
            <div className="flex items-center gap-1.5 mt-1">
              <Loader2 className="w-3.5 h-3.5 text-orange-400 animate-spin" />
              <p className="text-[10px] text-orange-500 font-bold">
                Settlement in progress…
              </p>
            </div>
          )}
        </div>
      )}

      {/* Status pill */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
          isEnabled
            ? "bg-orange-50 text-orange-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {isEnabled ? (
          <ShieldCheck className="w-3.5 h-3.5" />
        ) : (
          <ShieldOff className="w-3.5 h-3.5" />
        )}
        {isEnabled ? "Overages Enabled" : "Overages Disabled"}
      </div>

      {/* Pay outstanding button — only shown when restricted */}
      {isRestricted && (
        <Button
          onClick={() => setConfirmDialog("pay")}
          disabled={isMutating || settlementInProgress}
          className="w-full rounded-2xl h-12 bg-red-500 hover:bg-red-600 text-white font-bold border-none shadow-lg shadow-red-100"
        >
          {payMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          Pay ${pendingUsd} to Restore Access
        </Button>
      )}

      {activeDialog && (
        <ConfirmDialog
          isOpen={!!confirmDialog}
          onClose={() => setConfirmDialog(null)}
          onConfirm={handleConfirm}
          isLoading={isMutating}
          title={activeDialog.title}
          description={activeDialog.description}
          confirmLabel={activeDialog.confirmLabel}
          cancelLabel="Cancel"
          variant={activeDialog.variant}
        />
      )}
    </div>
  );
}
