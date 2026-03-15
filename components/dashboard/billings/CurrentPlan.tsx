"use client";

import {
  ExternalLink,
  AlertTriangle,
  AlertCircle,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/branding/Button";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import {
  useBillingPortalMutation,
  useCancelSubscriptionMutation,
  useResumeSubscriptionMutation,
} from "@/store/server/billing.queries";
import {
  getPlanConfig,
  getPlanPrice,
  ACCOUNT_STATUS_CONFIG,
  type AccountStatus,
} from "@/config/billing.config";
import type { SubscriptionStatus } from "@/types/billings";
import { toast } from "sonner";

interface CurrentPlanProps {
  subscription: SubscriptionStatus;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CurrentPlan({ subscription }: CurrentPlanProps) {
  const confirm = useConfirm();
  const plan = getPlanConfig(subscription.planId);
  const statusConfig =
    ACCOUNT_STATUS_CONFIG[subscription.accountStatus as AccountStatus] ??
    ACCOUNT_STATUS_CONFIG.pending;

  const billingPortalMutation = useBillingPortalMutation();
  const cancelMutation = useCancelSubscriptionMutation();
  const resumeMutation = useResumeSubscriptionMutation();

  const handleManagePayment = async () => {
    try {
      const { portalUrl } = await billingPortalMutation.mutateAsync();
      window.open(portalUrl, "_blank");
    } catch {
      toast.error("Could not open billing portal. Please try again.");
    }
  };

  const handleCancel = async () => {
    const ok = await confirm({
      title: "Cancel Subscription",
      description:
        "Your subscription stays active until the end of the current billing period. You can resume anytime before it expires.",
      confirmLabel: "Yes, Cancel",
      cancelLabel: "Keep Subscription",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await cancelMutation.mutateAsync();
      toast.success("Subscription will cancel at period end.");
    } catch {
      toast.error("Failed to cancel subscription.");
    }
  };

  const handleResume = async () => {
    try {
      await resumeMutation.mutateAsync();
      toast.success("Subscription resumed.");
    } catch {
      toast.error("Failed to resume subscription.");
    }
  };

  const isCanceling = subscription.cancelAtPeriodEnd;
  const isRestricted = subscription.accountStatus === "restricted_overage";
  const isPastDue = subscription.accountStatus === "past_due";
  const isSuspended = subscription.accountStatus === "suspended_dunning";

  const price = plan
    ? getPlanPrice(plan.id, subscription.billingInterval ?? "monthly")
    : null;

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-5 sm:p-8 shadow-sm space-y-5">
      {/* Alert banners */}
      {isRestricted && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">Account Restricted</p>
            <p className="text-xs text-red-600 font-medium mt-0.5">
              You have an unpaid overage balance. Pay below to restore full
              access.
            </p>
          </div>
        </div>
      )}
      {isPastDue && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700">Payment Past Due</p>
            <p className="text-xs text-amber-600 font-medium mt-0.5">
              Update your payment method to avoid service interruption.
            </p>
          </div>
        </div>
      )}
      {isSuspended && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">Account Suspended</p>
            <p className="text-xs text-red-600 font-medium mt-0.5">
              Repeated payment failures. Update your payment method via the
              billing portal.
            </p>
          </div>
        </div>
      )}
      {isCanceling && !isRestricted && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-orange-700">
              Subscription Canceling
            </p>
            <p className="text-xs text-orange-600 font-medium mt-0.5">
              Active until{" "}
              <span className="font-bold">
                {formatDate(subscription.currentPeriodEnd)}
              </span>
              . Resume before this date to keep your plan.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Current Plan
          </p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              {plan?.displayName ?? subscription.planId}
            </h2>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold capitalize">
              {subscription.billingInterval ?? "—"}
            </span>
          </div>
          {price !== null && (
            <p className="text-sm font-medium text-slate-500 mt-1">
              <span className="text-slate-900 font-black">${price}</span>/mo
              {subscription.billingInterval === "yearly" && (
                <span className="text-slate-400"> · billed annually</span>
              )}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusConfig.bgColor} ${statusConfig.color}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Info tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="bg-slate-50 rounded-2xl p-3.5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            {isCanceling ? "Expires" : "Renews"}
          </p>
          <p className="text-sm font-black text-slate-900">
            {formatDate(subscription.currentPeriodEnd)}
          </p>
        </div>
        {subscription.currentPeriodStart && (
          <div className="bg-slate-50 rounded-2xl p-3.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Period Start
            </p>
            <p className="text-sm font-black text-slate-900">
              {formatDate(subscription.currentPeriodStart)}
            </p>
          </div>
        )}
        {plan?.limits.whitelabelEnabled && (
          <div className="bg-slate-50 rounded-2xl p-3.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Whitelabel
            </p>
            <p className="text-sm font-black text-emerald-600">Enabled</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button
          onClick={handleManagePayment}
          disabled={billingPortalMutation.isPending}
          className="rounded-xl h-10 px-5 font-bold text-sm shadow-sm shadow-primary/10"
        >
          {billingPortalMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ExternalLink className="w-4 h-4 mr-2" />
          )}
          Manage Payment Method
        </Button>

        {isCanceling ? (
          <Button
            onClick={handleResume}
            disabled={resumeMutation.isPending}
            variant="outline"
            className="rounded-xl h-10 px-5 font-bold text-sm border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
          >
            {resumeMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RotateCcw className="w-4 h-4 mr-2" />
            )}
            Resume Subscription
          </Button>
        ) : (
          subscription.accountStatus === "active" && (
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 text-sm font-bold transition-colors disabled:opacity-50"
            >
              {cancelMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              Cancel
            </button>
          )
        )}
      </div>
    </div>
  );
}
