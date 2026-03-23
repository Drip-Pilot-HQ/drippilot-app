"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import {
  useOutreachThreadsQuery,
  useLostThreadsQuery,
} from "@/store/server/outreach.queries";
import { ThreadList } from "./ThreadList";
import { ThreadDetail, NoThreadSelected } from "./ThreadDetail";
import { cn } from "@/lib/utils";
import { lostThreadToOutreach } from "@/types/outreach";

type Tab = "all" | "lost";

interface MessagesClientProps {
  initialOutreachId?: string | null;
}

export function MessagesClient({
  initialOutreachId,
}: MessagesClientProps = {}) {
  const router = useRouter();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    initialOutreachId ?? null,
  );
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetail, setShowDetail] = useState(!!initialOutreachId);

  const { data: threads = [], isLoading: isLoadingThreads } =
    useOutreachThreadsQuery();
  const { data: lostThreads = [], isLoading: isLoadingLost } =
    useLostThreadsQuery();

  const isLoading = isLoadingThreads || isLoadingLost;

  const [prevInitialOutreachId, setPrevInitialOutreachId] =
    useState(initialOutreachId);
  if (initialOutreachId !== prevInitialOutreachId) {
    setPrevInitialOutreachId(initialOutreachId);
    setSelectedThreadId(initialOutreachId ?? null);
    setShowDetail(!!initialOutreachId);
  }

  const [prevSelectedThreadId, setPrevSelectedThreadId] =
    useState(selectedThreadId);
  const [prevLostThreads, setPrevLostThreads] = useState(lostThreads);
  if (
    selectedThreadId !== prevSelectedThreadId ||
    lostThreads !== prevLostThreads
  ) {
    setPrevSelectedThreadId(selectedThreadId);
    setPrevLostThreads(lostThreads);
    if (selectedThreadId) {
      const isLost = lostThreads.some((t) => t.id === selectedThreadId);
      if (isLost && activeTab !== "lost") setActiveTab("lost");
    }
  }

  const selectedThread = useMemo(() => {
    if (!selectedThreadId) return null;
    const thread = threads.find((t) => t.id === selectedThreadId);
    if (thread) return thread;
    const lost = lostThreads.find((t) => t.id === selectedThreadId);
    return lost ? lostThreadToOutreach(lost) : null;
  }, [selectedThreadId, threads, lostThreads]);

  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id);
    setShowDetail(true);
    router.push(`/dashboard/messages/${id}`);
  };

  const handleBack = () => {
    setShowDetail(false);
    router.push("/dashboard/messages");
  };

  const handleDeleted = () => {
    setSelectedThreadId(null);
    setShowDetail(false);
    router.push("/dashboard/messages");
  };

  return (
    <div className="animate-in fade-in duration-500 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Messages
          </h1>
          <p className="hidden sm:block text-slate-500 font-medium">
            View and reply to lead conversations across all channels
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-slate-700">
              {threads.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">threads</span>
          </div>
          {lostThreads.length > 0 && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-rose-50/50 border border-rose-100 rounded-lg shadow-sm">
              <span className="text-xs font-semibold text-rose-600">
                {lostThreads.length}
              </span>
              <span className="text-xs text-rose-400 font-medium">
                unmatched
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        data-onboarding="messages-panel"
        className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden h-[calc(100svh-10rem)] lg:h-[calc(100svh-9.5rem)] flex"
      >
        <div
          className={cn(
            "w-full lg:w-80 xl:w-96 shrink-0 border-r border-slate-100 flex flex-col",
            showDetail ? "hidden lg:flex" : "flex",
          )}
        >
          <div className="px-5 pt-4 pb-3 border-b border-slate-50">
            <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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

        <div
          className={cn(
            "flex-1 min-w-0 flex flex-col",
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
