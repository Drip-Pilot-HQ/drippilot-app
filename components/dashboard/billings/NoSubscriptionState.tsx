"use client";

import { useState } from "react";
import {
  Check,
  ArrowRight,
  Loader2,
  MessageSquare,
  Phone,
  Users,
  Mail,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/branding/Button";
import {
  PLAN_ORDER,
  PLAN_CONFIGS,
  type BillingInterval,
  type PlanId,
  type PlanDisplayConfig,
} from "@/config/billing.config";
import { useSubscribeMutation } from "@/store/server/billing.queries";
import { toast } from "sonner";

const PRICING_PLANS = PLAN_ORDER.filter((id) => id !== "enterprise");

function LimitRow({
  icon: Icon,
  label,
  value,
  popular,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  popular?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
          popular
            ? "bg-orange-100 text-orange-500"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <Icon className="w-2.5 h-2.5" strokeWidth={2.5} />
      </div>
      <span className="text-xs font-medium text-slate-600 leading-snug">
        <span className="font-bold text-slate-800">{value}</span> {label}
      </span>
    </div>
  );
}

function PlanLimits({
  plan,
  interval,
}: {
  plan: PlanDisplayConfig;
  interval: BillingInterval;
}) {
  const lim = plan.limits;
  const isYearly = interval === "yearly";
  const fmt = (v: number | null) =>
    v === null ? "Unlimited" : v.toLocaleString();

  // For yearly plans, credits are granted all at once upfront (monthly × 12)
  const creditsValue =
    lim.messageCredits === null
      ? "Unlimited"
      : isYearly
        ? (lim.messageCredits * 12).toLocaleString()
        : lim.messageCredits.toLocaleString();
  const creditsLabel =
    lim.messageCredits === null
      ? "Shared Credits"
      : isYearly
        ? "Shared Credits / year (paid upfront)"
        : "Shared Credits / mo";

  return (
    <div className="flex-1 space-y-2.5 mb-7">
      <LimitRow
        icon={MessageSquare}
        label={creditsLabel}
        value={creditsValue}
        popular={plan.popular}
      />
      <LimitRow
        icon={Phone}
        label="phone number(s)"
        value={fmt(lim.phoneNumbers)}
        popular={plan.popular}
      />
      <LimitRow
        icon={Users}
        label="team seat(s)"
        value={fmt(lim.teamMembers)}
        popular={plan.popular}
      />
      <LimitRow
        icon={Mail}
        label="email alias(es)"
        value={fmt(lim.emailAliases)}
        popular={plan.popular}
      />
      <LimitRow
        icon={BookOpen}
        label="KB docs"
        value={fmt(lim.kbDocs)}
        popular={plan.popular}
      />
      {lim.whitelabelEnabled && (
        <div className="flex items-center gap-2.5">
          <div className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center bg-orange-100 text-orange-500">
            <Check className="w-2.5 h-2.5" strokeWidth={3} />
          </div>
          <span className="text-xs font-bold text-orange-600">
            White-label enabled
          </span>
        </div>
      )}
    </div>
  );
}

export function NoSubscriptionState() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const subscribeMutation = useSubscribeMutation();

  const handleSubscribe = async (planId: PlanId) => {
    try {
      const result = await subscribeMutation.mutateAsync({ planId, interval });
      window.location.assign(result.checkoutUrl);
    } catch {
      toast.error("Could not start checkout. Please try again.");
    }
  };

  const yearlyDiscount =
    PLAN_CONFIGS.pro.yearlyPrice > 0
      ? Math.round(
          ((PLAN_CONFIGS.pro.monthlyPrice - PLAN_CONFIGS.pro.yearlyPrice) /
            PLAN_CONFIGS.pro.monthlyPrice) *
            100,
        )
      : 0;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Billing interval toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setInterval("monthly")}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              interval === "monthly"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("yearly")}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              interval === "yearly"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Yearly
            {yearlyDiscount > 0 && (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                -{yearlyDiscount}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Plan grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {PRICING_PLANS.map((planId) => {
          const plan = PLAN_CONFIGS[planId];
          const price =
            interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const isThisPending =
            subscribeMutation.isPending &&
            subscribeMutation.variables?.planId === planId;

          return (
            <div
              key={planId}
              className={`relative flex flex-col bg-white rounded-[28px] border-2 p-5 sm:p-7 transition-all duration-200 ${
                plan.popular
                  ? "border-orange-400 shadow-lg shadow-orange-100/60"
                  : "border-slate-100 hover:border-slate-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                  Most Popular
                </span>
              )}

              {/* Plan name & price */}
              <div className="mb-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  {plan.displayName}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    ${price}
                  </span>
                  <span className="text-sm font-bold text-slate-400">/mo</span>
                </div>
                {interval === "yearly" && plan.yearlyTotal > 0 && (
                  <p className="text-xs text-slate-400 font-medium">
                    ${plan.yearlyTotal} billed yearly
                  </p>
                )}
                <p className="text-xs text-slate-500 font-medium mt-2">
                  {plan.tagline}
                </p>
              </div>

              {/* What you get — credits & limits only */}
              <PlanLimits plan={plan} interval={interval} />

              <Button
                onClick={() => handleSubscribe(planId)}
                disabled={subscribeMutation.isPending}
                className={`w-full rounded-xl h-11 font-bold text-sm border-none transition-all ${
                  plan.popular
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-200"
                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                }`}
              >
                {isThisPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  `Start with ${plan.displayName}`
                )}
              </Button>
            </div>
          );
        })}

        {/* Enterprise contact card */}
        <div className="flex flex-col bg-slate-900 rounded-[28px] border-2 border-slate-800 p-5 sm:p-7 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">
              Enterprise
            </p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-black text-white">Custom</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-2">
              Tailored for large teams with advanced needs
            </p>
          </div>

          <div className="flex-1 space-y-2.5 mb-7">
            {[
              "Custom Shared Credits",
              "Custom phone numbers",
              "Custom team seats",
              "White-label enabled",
              "Custom integrations",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2.5">
                <div className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center bg-slate-700 text-orange-400">
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                </div>
                <span className="text-xs font-medium text-slate-300 leading-snug">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button className="flex items-center justify-center gap-2 w-full rounded-xl h-11 font-bold text-sm text-orange-400 hover:text-orange-300 border border-slate-700 hover:border-slate-600 transition-all group">
            Contact Sales
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
        <p className="text-xs text-slate-400 font-medium text-center sm:text-left">
          Cancel anytime. By subscribing you authorize Drip Pilot to charge your
          payment method on file.
        </p>
        <a
          href="https://www.drippilot.com/pricing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 whitespace-nowrap transition-colors shrink-0"
        >
          Full feature comparison
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
