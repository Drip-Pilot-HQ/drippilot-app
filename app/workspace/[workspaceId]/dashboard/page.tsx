"use client";

import {
  Users,
  Rocket,
  Coins,
  Search,
  Bell,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const stats = [
  {
    label: "Total Leads",
    value: "12,840",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Campaigns Active",
    value: "24",
    change: "stable",
    trend: "neutral",
    icon: Rocket,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    label: "Credits Remaining",
    value: "4,250",
    change: "-5.2%",
    trend: "down",
    icon: Coins,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
];

const campaigns = [
  {
    name: "Summer Outreach 2024",
    status: "Active",
    audience: "Enterprise Leads",
    openRate: "42.8%",
    clicks: "1,240",
    modified: "2h ago",
  },
  {
    name: "Q2 Retargeting Phase",
    status: "Paused",
    audience: "Churned Users",
    openRate: "18.5%",
    clicks: "452",
    modified: "1d ago",
  },
  {
    name: "Product Launch Teaser",
    status: "Active",
    audience: "Waiting List",
    openRate: "64.2%",
    clicks: "8,904",
    modified: "3d ago",
  },
];

export default function WorkspaceDashboard() {
  return (
    <div className="space-y-10">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Workspace Dashboard
            </h1>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />
            <p className="text-slate-400 font-medium hidden md:block">
              System overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search tasks, campaigns..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64 text-sm"
            />
          </div>
          <button className="relative w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary border-2 border-white" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">Alex Rivera</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Pro Plan
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 overflow-hidden">
              <Image
                src="https://i.pravatar.cc/150?u=alex"
                alt="Avatar"
                width={44}
                height={44}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  stat.iconBg,
                )}
              >
                <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                  stat.trend === "up"
                    ? "bg-emerald-50 text-emerald-600"
                    : stat.trend === "down"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-slate-50 text-slate-600",
                )}
              >
                {stat.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
                {stat.trend === "down" && (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6">
        {/* Engagement Chart Card */}
        <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-1">
                Engagement Over Time
              </h2>
              <p className="text-slate-400 text-sm font-medium">
                Measure interaction across all active drip campaigns
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200">
              <button className="px-5 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                7 Days
              </button>
              <button className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg shadow-sm">
                30 Days
              </button>
            </div>
          </div>

          {/* Mock Chart Visualization */}
          <div className="h-[300px] w-full relative group">
            <svg viewBox="0 0 1000 300" className="w-full h-full preserve-3d">
              {/* Reference Grid Lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 60}
                  x2="1000"
                  y2={i * 60}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
              ))}
              {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
                (i) => (
                  <line
                    key={i}
                    x1={i}
                    y1="0"
                    x2={i}
                    y2="300"
                    stroke="#F1F5F9"
                    strokeWidth="1"
                  />
                ),
              )}

              {/* Gradient Area under curve */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5e00" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#ff5e00" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,200 C150,220 250,150 400,180 C550,210 650,140 850,160 C950,165 1000,140 1000,140 L1000,300 L0,300 Z"
                fill="url(#chartGradient)"
              />

              {/* Main Curve */}
              <path
                d="M0,200 C150,220 250,150 400,180 C550,210 650,140 850,160 C950,165 1000,140"
                fill="none"
                stroke="#ff5e00"
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-[0_10px_10px_rgba(255,94,0,0.2)]"
              />

              {/* Interactive Points (Visual Only) */}
              <circle
                cx="400"
                cy="180"
                r="6"
                fill="white"
                stroke="#ff5e00"
                strokeWidth="3"
                className="hover:scale-150 transition-transform cursor-pointer"
              />
              <circle
                cx="850"
                cy="160"
                r="6"
                fill="white"
                stroke="#ff5e00"
                strokeWidth="3"
                className="hover:scale-150 transition-transform cursor-pointer"
              />
            </svg>

            {/* Legend/Labels */}
            <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between px-2">
              {[
                "01 May",
                "05 May",
                "10 May",
                "15 May",
                "20 May",
                "25 May",
                "30 May",
              ].map((date) => (
                <span
                  key={date}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  {date}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden">
          <div className="p-8 flex items-center justify-between border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-900">
              Recent Campaign Activity
            </h2>
            <button className="text-sm font-black text-primary hover:text-primary-hover flex items-center gap-1 transition-colors uppercase tracking-widest px-4">
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Campaign Name
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Audience
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Open Rate
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Clicks
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {campaigns.map((campaign, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                          <Rocket className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {campaign.name}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            Modified {campaign.modified}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                          campaign.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                      {campaign.audience}
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-900 text-sm">
                      {campaign.openRate}
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                      {campaign.clicks}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
