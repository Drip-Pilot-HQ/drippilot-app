"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { LeadStatusCounts } from "@/types/analytics";
import { InfoTooltip } from "@/components/common/InfoTooltip";

interface LeadBreakdownProps {
  leads: LeadStatusCounts;
}

const SEGMENTS = [
  { key: "cold", label: "Cold", color: "#94a3b8" },
  { key: "warm", label: "Warm", color: "#22d3ee" },
  { key: "hot", label: "Hot", color: "#fb923c" },
  { key: "converted", label: "Converted", color: "#4ade80" },
  { key: "unsubscribed", label: "Unsub", color: "#f472b6" },
] as const;

export function LeadBreakdown({ leads }: LeadBreakdownProps) {
  const data = SEGMENTS.map((s) => ({
    name: s.label,
    value: leads[s.key],
    color: s.color,
  })).filter((d) => d.value > 0);

  return (
    <div className="flex flex-col h-full bg-white border border-slate-100 rounded-[28px] p-4 sm:p-6 shadow-sm">
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-lg font-black text-slate-900">Lead Breakdown</h3>
          <InfoTooltip text="Distribution of all your leads by current status: Cold, Warm, Hot, Converted, or Unsubscribed." />
        </div>
        <p className="text-sm text-slate-400 font-medium mt-0.5">
          {leads.total.toLocaleString()} total leads by status
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center flex-1 min-h-[200px] text-slate-300">
          <p className="text-sm font-bold uppercase tracking-widest">No data</p>
        </div>
      ) : (
        <div className="flex-1 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                }}
                formatter={(value, name) => [
                  typeof value === "number" ? value.toLocaleString() : value,
                  name,
                ]}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  fontWeight: 700,
                  paddingTop: "20px",
                }}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value, entry) => (
                  <span style={{ color: "#64748b" }}>
                    {value} (
                    {(
                      entry.payload as { value: number }
                    ).value?.toLocaleString()}
                    )
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
