"use client";

import { Search, MessageSquare, AlertCircle } from "lucide-react";
import { OutreachThread, LostThread } from "@/types/outreach";
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
}

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
}: ThreadListProps) {
  const filteredThreads = threads.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.leadEmail?.toLowerCase().includes(q) ||
      t.leadPhone?.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  });

  const filteredLost = lostThreads.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.leadEmail?.toLowerCase().includes(q) ||
      t.leadPhone?.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 pb-3">
        <button
          onClick={() => onTabChange("all")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all",
            activeTab === "all"
              ? "bg-primary text-white shadow-sm shadow-primary/20"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          All
          {threads.length > 0 && (
            <span
              className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-full",
                activeTab === "all"
                  ? "bg-white/20"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              {threads.length}
            </span>
          )}
        </button>
        <button
          onClick={() => onTabChange("lost")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all",
            activeTab === "lost"
              ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
          )}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          Lost
          {lostThreads.length > 0 && (
            <span
              className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-full",
                activeTab === "lost"
                  ? "bg-white/20"
                  : "bg-rose-50 text-rose-600",
              )}
            >
              {lostThreads.length}
            </span>
          )}
        </button>
      </div>

      {/* Thread items */}
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
                  onClick={() => onSelectThread(thread.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-500">
                {searchQuery ? "No threads found" : "No message threads yet"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "Threads will appear when leads reply to campaigns"}
              </p>
            </div>
          )
        ) : filteredLost.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {filteredLost.map((thread) => (
              <ThreadListItem
                key={thread.id}
                thread={{
                  id: thread.id,
                  workspaceId: "",
                  leadId: null,
                  leadEmail: thread.leadEmail,
                  leadPhone: thread.leadPhone,
                  senderEmail: null,
                  senderPhone: null,
                  campaignId: null,
                  aiResponseEnabled: false,
                  isUnmatched: true,
                  createdAt: thread.updatedAt,
                  updatedAt: thread.updatedAt,
                }}
                isSelected={selectedThreadId === thread.id}
                onClick={() => onSelectThread(thread.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-rose-300" />
            </div>
            <p className="text-sm font-bold text-slate-500">No lost threads</p>
            <p className="text-xs text-slate-400 mt-1">
              Unmatched inbound messages will show here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
