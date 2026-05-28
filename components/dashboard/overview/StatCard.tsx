"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { InfoTooltip } from "@/components/common/InfoTooltip";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  tooltip?: string;
  variant?: "default" | "accent";
}

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  trend,
  trendLabel,
  tooltip,
  variant = "default",
}: StatCardProps) {
  const isAccent = variant === "accent";

  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] p-4 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4 hover:shadow-md transition-all duration-200 ${
        isAccent
          ? "bg-gradient-to-br from-white via-white to-emerald-50/40 border border-emerald-100/70 hover:border-emerald-200"
          : "bg-white border border-slate-100 hover:border-slate-200"
      }`}
    >
      {/* subtle decorative accent in corner */}
      <div
        className={`pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-50 transition-opacity duration-300 group-hover:opacity-70 ${
          isAccent ? "bg-emerald-100" : "bg-slate-50"
        }`}
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && trendLabel && (
          <div
            className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
              trend === "up"
                ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                : trend === "down"
                  ? "bg-red-50 text-red-500 ring-1 ring-red-100"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend === "down" ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {trendLabel}
          </div>
        )}
      </div>

      <div className="relative">
        <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-slate-400 font-medium mt-2">{subValue}</p>
        )}
        <div className="flex items-center gap-1 mt-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {label}
          </p>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
      </div>
    </div>
  );
}
