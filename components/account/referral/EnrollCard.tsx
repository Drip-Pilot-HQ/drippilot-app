"use client";

import {
  Gift,
  TrendingUp,
  Users,
  DollarSign,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/branding/Button";
import { COMMISSION_RATE } from "./config";

interface EnrollCardProps {
  onEnroll: () => void;
  isLoading: boolean;
}

const PERKS = [
  { icon: TrendingUp, label: `${COMMISSION_RATE}% per invoice` },
  { icon: Users, label: "Unlimited referrals" },
  { icon: DollarSign, label: "Monthly payouts" },
];

export function EnrollCard({ onEnroll, isLoading }: EnrollCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-linear-to-br from-orange-50 via-white to-pink-50 p-6 sm:p-8 lg:p-12">
      {/* Decorative blobs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 sm:w-48 sm:h-48 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16">
        {/* Left: copy */}
        <div className="flex-1 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-orange-200 flex items-center justify-center shadow-sm shrink-0">
              <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-primary">
                Referral Program
              </p>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 leading-tight">
                Earn with every referral
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed max-w-xl">
            Join our referral program and earn{" "}
            <span className="text-primary font-black">
              {COMMISSION_RATE}% commission
            </span>{" "}
            on every invoice paid by users you refer — for as long as they stay
            subscribed.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-6 pt-1">
            {PERKS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-white border border-orange-100 flex items-center justify-center">
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="shrink-0 w-full lg:w-auto flex flex-col items-stretch lg:items-center gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onEnroll}
            isLoading={isLoading}
            className="w-full lg:w-auto shadow-2xl shadow-primary/30 group px-8 sm:px-10 rounded-xl"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Enroll Now
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-center text-xs font-semibold text-slate-400">
            Free to join · No minimums
          </p>
        </div>
      </div>
    </div>
  );
}
