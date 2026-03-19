"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import type { ActivityInsights } from "@/types/analytics";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { InfoTooltip } from "@/components/common/InfoTooltip";

interface ActivityChartProps {
  data: ActivityInsights;
}

export function ActivityChart({ data }: ActivityChartProps) {
  const chartData = data.dailyActivity.map((entry) => ({
    date: entry.date,
    Outbound: entry.outboundCount,
    Inbound: entry.inboundCount,
    Total: entry.messageCount,
  }));

  const { trends } = data;

  const TrendIcon =
    trends.engagementTrend === "increasing"
      ? TrendingUp
      : trends.engagementTrend === "decreasing"
        ? TrendingDown
        : Minus;

  const trendColor =
    trends.engagementTrend === "increasing"
      ? "text-emerald-600"
      : trends.engagementTrend === "decreasing"
        ? "text-red-500"
        : "text-slate-500";

  const growthPositive = trends.messageGrowth >= 0;

  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
        <div className="flex items-start justify-between sm:block gap-2 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-black text-slate-900">
                Message Activity
              </h3>
              <InfoTooltip text="Daily volume of outbound messages sent and inbound replies received across all campaigns in the selected period." />
            </div>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              Daily inbound &amp; outbound volume
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap justify-end">
          <div className="text-right">
            <div
              className={`flex items-center gap-1 justify-end text-sm font-bold ${growthPositive ? "text-emerald-600" : "text-red-500"}`}
            >
              {growthPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {growthPositive ? "+" : ""}
              {trends.messageGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-400 font-medium">growth</p>
          </div>
          <div className="text-right">
            <div
              className={`flex items-center gap-1 justify-end text-sm font-bold ${trendColor}`}
            >
              <TrendIcon className="w-4 h-4" />
              {trends.engagementTrend}
            </div>
            <p className="text-xs text-slate-400 font-medium">trend</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb923c" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(val) => {
              try {
                return format(parseISO(val), "MMM d");
              } catch {
                return val;
              }
            }}
            tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
            }}
            labelFormatter={(val) => {
              try {
                return format(parseISO(val as string), "MMM d, yyyy");
              } catch {
                return val;
              }
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: 12 }}
          />
          <Area
            type="monotone"
            dataKey="Outbound"
            stroke="#fb923c"
            strokeWidth={2}
            fill="url(#colorOutbound)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="Inbound"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#colorInbound)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {trends.peakActivityDay && (
        <p className="text-xs text-slate-400 font-medium mt-3 text-center">
          Peak activity:{" "}
          <span className="text-slate-600 font-bold">
            {(() => {
              try {
                return format(parseISO(trends.peakActivityDay), "MMMM d, yyyy");
              } catch {
                return trends.peakActivityDay;
              }
            })()}
          </span>
        </p>
      )}
    </div>
  );
}
