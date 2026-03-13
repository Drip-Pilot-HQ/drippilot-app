"use client";

import { useState, useMemo } from "react";
import { MessageSquare } from "lucide-react";
import {
  useOutreachThreadsQuery,
  useLostThreadsQuery,
} from "@/store/server/outreach.queries";
import { ThreadList } from "./ThreadList";
import { ThreadDetail, NoThreadSelected } from "./ThreadDetail";
import { cn } from "@/lib/utils";
import { OutreachThread } from "@/types/outreach";

type Tab = "all" | "lost";

export function MessagesClient() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetail, setShowDetail] = useState(false);

  const { data: threads = [], isLoading: isLoadingThreads } =
    useOutreachThreadsQuery();
  const { data: lostThreads = [], isLoading: isLoadingLost } =
    useLostThreadsQuery();

  const isLoading = isLoadingThreads || isLoadingLost;

  const selectedThread = useMemo(() => {
    if (!selectedThreadId) return null;

    // Search in regular threads
    const thread = threads.find((t) => t.id === selectedThreadId);
    if (thread) return thread;

    // Search in lost (unmatched) threads
    const lost = lostThreads.find((t) => t.id === selectedThreadId);
    if (lost) {
      return {
        id: lost.id,
        workspaceId: "",
        leadId: null,
        leadEmail: lost.leadEmail,
        leadPhone: lost.leadPhone,
        senderEmail: null,
        senderPhone: null,
        campaignId: null,
        aiResponseEnabled: false,
        isUnmatched: true,
        createdAt: lost.updatedAt,
        updatedAt: lost.updatedAt,
      } as OutreachThread;
    }

    return null;
  }, [selectedThreadId, threads, lostThreads]);

  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
  };

  const handleDeleted = () => {
    setSelectedThreadId(null);
    setShowDetail(false);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Messages
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            View and reply to lead conversations across all channels
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-black text-slate-700">
              {threads.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">threads</span>
          </div>
          {lostThreads.length > 0 && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-xl shadow-sm">
              <span className="text-xs font-black text-rose-600">
                {lostThreads.length}
              </span>
              <span className="text-xs text-rose-400 font-medium">
                unmatched
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Split panel */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden h-[calc(100svh-13rem)] lg:h-[calc(100svh-9rem)] flex">
        {/* Left: Thread list */}
        <div
          className={cn(
            "w-full lg:w-80 xl:w-96 shrink-0 border-r border-slate-100 flex flex-col",
            // On mobile: hide when detail is shown
            showDetail ? "hidden lg:flex" : "flex",
          )}
        >
          {/* List header */}
          <div className="px-4 pt-4 pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider">
              Conversations
            </h2>
          </div>

          <div className="flex-1 min-h-0 pt-3">
            <ThreadList
              threads={threads}
              lostThreads={lostThreads}
              isLoading={isLoading}
              selectedThreadId={selectedThreadId}
              activeTab={activeTab}
              searchQuery={searchQuery}
              onSelectThread={handleSelectThread}
              onTabChange={setActiveTab}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        {/* Right: Thread detail */}
        <div
          className={cn(
            "flex-1 min-w-0 flex flex-col",
            // On mobile: hide when no detail shown
            !showDetail ? "hidden lg:flex" : "flex",
          )}
        >
          {selectedThread ? (
            <ThreadDetail
              key={selectedThread.id}
              thread={selectedThread}
              onBack={handleBack}
              onDeleted={handleDeleted}
            />
          ) : (
            <NoThreadSelected />
          )}
        </div>
      </div>
    </div>
  );
}
