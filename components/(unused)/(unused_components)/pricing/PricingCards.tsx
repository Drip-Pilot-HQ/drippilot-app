"use client";

import { useState } from "react";
import { Container } from "@/components/branding/Container";
import { Button } from "@/components/branding/Button";
import {
  PRICING_PLANS,
  YEARLY_DISCOUNT,
} from "@/components/(unused)/(unused_constants)/pricingData";
import {
  CheckCircle2,
  ShoppingCart,
  Users,
  Rocket,
  Building2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const planIcons = {
  Starter: ShoppingCart,
  Pro: Rocket,
  Teams: Users,
  Enterprise: Building2,
};

const accentStyles = {
  slate: {
    border: "border-slate-100",
    bg: "bg-slate-50",
    text: "text-slate-600",
    icon: "text-slate-400",
    shadow: "shadow-slate-200/50",
    badge: "bg-slate-100 text-slate-500",
  },
  accent: {
    border: "border-accent/10",
    bg: "bg-accent/[0.02]",
    text: "text-accent",
    icon: "text-accent",
    shadow: "shadow-accent/10",
    badge: "bg-accent/10 text-accent",
  },
  primary: {
    border: "border-primary/20",
    bg: "bg-primary/[0.03]",
    text: "text-primary",
    icon: "text-primary",
    shadow: "shadow-primary/10",
    badge: "bg-primary/10 text-primary",
  },
  secondary: {
    border: "border-secondary/20",
    bg: "bg-secondary/[0.03]",
    text: "text-secondary",
    icon: "text-secondary",
    shadow: "shadow-secondary/10",
    badge: "bg-secondary/10 text-secondary",
  },
};

export const PricingCards = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <section className="py-24 bg-white" id="pricing-plans">
      <Container>
        {/* Billing Switch */}
        <div className="flex flex-col items-center mb-16">
          <div className="relative flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "relative z-10 px-8 py-2.5 text-sm font-bold transition-all duration-300 rounded-xl",
                billingCycle === "monthly"
                  ? "text-slate-900 bg-white shadow-md shadow-slate-200"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "relative z-10 px-8 py-2.5 text-sm font-bold transition-all duration-300 rounded-xl",
                billingCycle === "yearly"
                  ? "text-slate-900 bg-white shadow-md shadow-slate-200"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              Yearly
            </button>
          </div>

          {YEARLY_DISCOUNT > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary fill-primary animate-pulse" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                Save {YEARLY_DISCOUNT}% with yearly
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRICING_PLANS.map((plan) => {
            const styles =
              accentStyles[plan.accent as keyof typeof accentStyles] ||
              accentStyles.slate;
            const Icon = planIcons[plan.name as keyof typeof planIcons];

            // Calculate price based on toggle
            const basePrice = plan.price;
            const finalPrice =
              billingCycle === "yearly" && YEARLY_DISCOUNT > 0
                ? Math.floor(basePrice * (1 - YEARLY_DISCOUNT / 100))
                : basePrice;

            return (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col p-8 rounded-[40px] border transition-all duration-500 hover:shadow-2xl overflow-hidden",
                  styles.border,
                  styles.bg,
                  plan.recommended
                    ? "scale-105 z-10 shadow-2xl shadow-primary/20 ring-4 ring-primary/10 bg-white"
                    : "hover:-translate-y-2",
                )}
              >
                {plan.badge && (
                  <div
                    className={cn(
                      "absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      styles.badge,
                    )}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="mb-10">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-300",
                      styles.border,
                      "bg-white shadow-sm",
                    )}
                  >
                    <Icon className={cn("w-6 h-6", styles.icon)} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">
                      {finalPrice > 0 ? `$${finalPrice}` : "Let's Talk"}
                    </span>

                    {finalPrice > 0 && (
                      <span className="text-sm text-slate-400 font-semibold uppercase">
                        /mo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                <ul className="flex-1 space-y-4 mb-10 pb-8 border-b border-slate-100">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2
                        className={cn(
                          "w-5 h-5 mt-0.5 shrink-0 transition-colors",
                          styles.icon,
                        )}
                      />
                      <span className="text-sm text-slate-700 font-semibold leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.buttonVariant}
                  size="md"
                  className={cn(
                    "w-full transition-all duration-300 shadow-xl",
                    plan.buttonVariant === "primary"
                      ? "shadow-primary/25"
                      : plan.buttonVariant === "accent"
                        ? "shadow-accent/25"
                        : "shadow-slate-950/10",
                  )}
                >
                  {plan.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
