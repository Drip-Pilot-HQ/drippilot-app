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
}: StatCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-4 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4">
      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && trendLabel && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              trend === "up"
                ? "bg-emerald-50 text-emerald-600"
                : trend === "down"
                  ? "bg-red-50 text-red-500"
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
      <div>
        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </p>
        {subValue && (
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            {subValue}
          </p>
        )}
        <div className="flex items-center gap-1 mt-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {label}
          </p>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
      </div>
    </div>
  );
}
