"use client";

import {
  TrendingUp,
  Users,
  DollarSign,
  ChevronRight,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/branding/Button";
import { COMMISSION_RATE } from "./config";

interface EnrollCardProps {
  onEnroll: () => void;
  isLoading: boolean;
}

const PERKS = [
  { icon: TrendingUp, label: "Recurring commissions" },
  { icon: Users, label: "Unlimited accounts" },
  { icon: DollarSign, label: "Monthly payouts" },
];

export function EnrollCard({ onEnroll, isLoading }: EnrollCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
          {/* Left */}
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-2">
                Sales Program
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Activate your sales account
              </h2>
              <p className="text-slate-500 font-medium mt-2 leading-relaxed max-w-lg">
                Join as an account executive and earn {COMMISSION_RATE}%
                recurring commissions on every invoice paid by accounts you
                refer — for as long as they stay subscribed.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {PERKS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                >
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="shrink-0 flex flex-col items-stretch lg:items-start gap-2 lg:min-w-48">
            <Button
              variant="primary"
              size="lg"
              onClick={onEnroll}
              isLoading={isLoading}
              className="group rounded-xl"
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Activate Account
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <p className="text-center lg:text-left text-xs text-slate-400 font-medium px-1">
              No minimums · Monthly payouts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
