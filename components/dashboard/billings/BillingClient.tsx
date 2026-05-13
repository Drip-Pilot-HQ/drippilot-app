"use client";

import { CurrentPlan } from "./CurrentPlan";
import { PlanActions } from "./PlanActions";
import { AddonsList } from "./AddonsList";
import { UsageCredits } from "./UsageCredits";
import { OverageProtection } from "./OverageProtection";
import { CustomPlanCTA } from "./CustomPlanCTA";
import { NoSubscriptionState } from "./NoSubscriptionState";
import { AccessRestricted } from "@/components/branding/AccessRestricted";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import {
  useSubscriptionQuery,
  useAddonsQuery,
  useEffectiveLimitsQuery,
  useCreditBalanceQuery,
  useOverageStatusQuery,
} from "@/store/server/billing.queries";

function Pulse({ className }: { className: string }) {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-2xl ${className}`} />
  );
}

function BillingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
      <div className="lg:col-span-8 space-y-6 sm:space-y-8">
        <Pulse className="h-52 rounded-[32px]" />
        <Pulse className="h-64 rounded-[32px]" />
        <Pulse className="h-80 rounded-[32px]" />
      </div>
      <div className="lg:col-span-4 space-y-6 sm:space-y-8">
        <Pulse className="h-80 rounded-[32px]" />
        <Pulse className="h-56 rounded-[32px]" />
        <Pulse className="h-36 rounded-[32px]" />
      </div>
    </div>
  );
}

export function BillingClient() {
  const { isOwnerOrAdmin } = useWorkspaceRole();
  const subscriptionQuery = useSubscriptionQuery(isOwnerOrAdmin);
  const addonsQuery = useAddonsQuery(isOwnerOrAdmin);
  const limitsQuery = useEffectiveLimitsQuery(isOwnerOrAdmin);
  const creditBalanceQuery = useCreditBalanceQuery(isOwnerOrAdmin);
  const overageQuery = useOverageStatusQuery(isOwnerOrAdmin);

  if (!isOwnerOrAdmin) return <AccessRestricted />;

  const isLoading =
    subscriptionQuery.isLoading ||
    addonsQuery.isLoading ||
    limitsQuery.isLoading ||
    creditBalanceQuery.isLoading ||
    overageQuery.isLoading;

  const subscription = subscriptionQuery.data;
  const addons = addonsQuery.data ?? [];
  const limits = limitsQuery.data;
  const creditBalance = creditBalanceQuery.data;
  const overageStatus = overageQuery.data;

  const isTerminated = subscription?.accountStatus === "terminated";
  const isPastCancelDate =
    subscription?.cancelAtPeriodEnd === true &&
    subscription?.currentPeriodEnd !== null &&
    new Date(subscription.currentPeriodEnd) < new Date();
  const isLapsed = isTerminated || isPastCancelDate;

  const hasActiveSubscription =
    subscription &&
    subscription.stripeSubscriptionId !== null &&
    subscription.accountStatus !== "pending" &&
    !isLapsed;

  const isNoSubscription = !isLoading && !hasActiveSubscription;
  // True when the user previously had a plan that has now fully lapsed
  const isReactivating = !isLoading && isLapsed;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          {isReactivating
            ? "Reactivate Your Account"
            : isNoSubscription
              ? "Choose Your Plan"
              : "Billing & Subscription"}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
          {isReactivating
            ? "Your subscription has ended. Pick a plan to get back up and running."
            : isNoSubscription
              ? "Get started with Drip Pilot — upgrade or cancel anytime."
              : "Manage your plan, credits, add-ons, and payment settings."}
        </p>
      </div>

      {/* Content — skeleton or real data */}
      {isLoading ? (
        <BillingSkeleton />
      ) : isNoSubscription ? (
        <NoSubscriptionState
          reactivating={isReactivating}
          endedAt={
            isReactivating ? (subscription?.currentPeriodEnd ?? null) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <CurrentPlan subscription={subscription!} />
            <PlanActions subscription={subscription!} addons={addons} />
            <AddonsList subscription={subscription!} addons={addons} />
          </div>

          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            <UsageCredits creditBalance={creditBalance} limits={limits} />
            <OverageProtection
              subscription={subscription!}
              overageStatus={overageStatus}
            />
            <CustomPlanCTA />
          </div>
        </div>
      )}
    </div>
  );
}
