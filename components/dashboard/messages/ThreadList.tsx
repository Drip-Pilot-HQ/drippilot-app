"use client";

import { useMemo } from "react";
import { Search, MessageSquare, AlertCircle } from "lucide-react";
import {
  OutreachThread,
  LostThread,
  lostThreadToOutreach,
} from "@/types/outreach";
import { LeadStatus } from "@/types/lead";
import { useMessagesFilterStore } from "@/store/client/useMessagesFilterStore";
import { ThreadListItem } from "./ThreadListItem";
import { ThreadListSkeleton } from "./MessagesSkeleton";
import { cn } from "@/lib/utils";

type Tab = "all" | "lost";

interface ThreadListProps {
  threads: OutreachThread[];
  lostThreads: LostThread[];
  isLoading: boolean;
  selectedThreadId: string | null;
  activeTab: Tab;
  searchQuery: string;
  onSelectThread: (id: string) => void;
  onTabChange: (tab: Tab) => void;
  onSearchChange: (q: string) => void;
  showLostTab?: boolean;
}

function matchesSearch(
  query: string,
  thread: {
    id: string;
    leadEmail?: string | null;
    leadPhone?: string | null;
    campaignName?: string | null;
    lead?: { name?: string; firstName?: string; lastName?: string } | null;
  },
) {
  if (!query) return true;
  const q = query.toLowerCase();
  const { lead } = thread;
  return !!(
    thread.leadEmail?.toLowerCase().includes(q) ||
    thread.leadPhone?.toLowerCase().includes(q) ||
    thread.id.toLowerCase().includes(q) ||
    thread.campaignName?.toLowerCase().includes(q) ||
    lead?.name?.toLowerCase().includes(q) ||
    lead?.firstName?.toLowerCase().includes(q) ||
    lead?.lastName?.toLowerCase().includes(q) ||
    (lead?.firstName &&
      lead?.lastName &&
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(q))
  );
}

function byMostRecentActivity(a: OutreachThread, b: OutreachThread) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

const STATUS_FILTERS = [
  {
    value: LeadStatus.HOT,
    label: "Hot",
    active: "bg-red-100 text-red-600 ring-1 ring-red-200",
    inactive: "bg-red-50 text-red-400 hover:bg-red-100",
  },
  {
    value: LeadStatus.WARM,
    label: "Warm",
    active: "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200",
    inactive: "bg-yellow-50 text-yellow-500 hover:bg-yellow-100",
  },
  {
    value: LeadStatus.COLD,
    label: "Cold",
    active: "bg-blue-100 text-blue-600 ring-1 ring-blue-200",
    inactive: "bg-blue-50 text-blue-400 hover:bg-blue-100",
  },
  {
    value: LeadStatus.CONVERTED,
    label: "Converted",
    active: "bg-green-100 text-green-700 ring-1 ring-green-200",
    inactive: "bg-green-50 text-green-500 hover:bg-green-100",
  },
] as const;

export function ThreadList({
  threads,
  lostThreads,
  isLoading,
  selectedThreadId,
  activeTab,
  searchQuery,
  onSelectThread,
  onTabChange,
  onSearchChange,
  showLostTab = false,
}: ThreadListProps) {
  const statusFilter = useMessagesFilterStore((s) => s.statusFilter);
  const setStatusFilter = useMessagesFilterStore((s) => s.setStatusFilter);

  const filteredThreads = useMemo(
    () =>
      threads
        .filter((t) => matchesSearch(searchQuery, t))
        .filter(
          (t) => statusFilter === "all" || t.lead?.leadStatus === statusFilter,
        )
        .sort(byMostRecentActivity),
    [threads, searchQuery, statusFilter],
  );

  const filteredLost = useMemo(
    () =>
      lostThreads
        .filter((t) => matchesSearch(searchQuery, t))
        .map(lostThreadToOutreach)
        .sort(byMostRecentActivity),
    [lostThreads, searchQuery],
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pb-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50/50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 px-4 pb-3">
        <button
          onClick={() => onTabChange("all")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
            activeTab === "all"
              ? "bg-primary text-white shadow-sm shadow-primary/10"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          All
          {threads.length > 0 && (
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                activeTab === "all"
                  ? "bg-white/20"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              {threads.length}
            </span>
          )}
        </button>
        {showLostTab && (
          <button
            onClick={() => onTabChange("lost")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              activeTab === "lost"
                ? "bg-rose-500 text-white shadow-sm shadow-rose-500/10"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
            )}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Lost
            {lostThreads.length > 0 && (
              <span
                className={cn(
                  "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                  activeTab === "lost"
                    ? "bg-white/20"
                    : "bg-rose-50 text-rose-500",
                )}
              >
                {lostThreads.length}
              </span>
            )}
          </button>
        )}
      </div>

      {activeTab === "all" && (
        <div className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all",
              statusFilter === "all"
                ? "bg-slate-700 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200",
            )}
          >
            All
          </button>
          {STATUS_FILTERS.map(({ value, label, active, inactive }) => (
            <button
              key={value}
              onClick={() =>
                setStatusFilter(statusFilter === value ? "all" : value)
              }
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all",
                statusFilter === value ? active : inactive,
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
        {isLoading ? (
          <ThreadListSkeleton />
        ) : activeTab === "all" ? (
          filteredThreads.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {filteredThreads.map((thread) => (
                <ThreadListItem
                  key={thread.id}
                  thread={thread}
                  isSelected={selectedThreadId === thread.id}
                  onSelectThread={onSelectThread}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-50/50 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-slate-200" />
              </div>
              <p className="text-sm font-semibold text-slate-400">
                {searchQuery ? "No threads found" : "No message threads yet"}
              </p>
            </div>
          )
        ) : filteredLost.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {filteredLost.map((thread) => (
              <ThreadListItem
                key={thread.id}
                thread={thread}
                isSelected={selectedThreadId === thread.id}
                onSelectThread={onSelectThread}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50/50 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-rose-200" />
            </div>
            <p className="text-sm font-semibold text-slate-400">
              No lost threads
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
