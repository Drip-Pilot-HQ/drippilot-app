"use client";

import { useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import {
  useOutreachThreadsQuery,
  useLostThreadsQuery,
} from "@/store/server/outreach.queries";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { useMessagesFilterStore } from "@/store/client/useMessagesFilterStore";
import { ThreadList } from "./ThreadList";
import { cn } from "@/lib/utils";

/*
 * Persistent shell for the messages section, rendered from the segment layout.
 *
 * The previous implementation rendered the whole messages UI from each page,
 * so navigating between /messages and /messages/[outreachId] remounted
 * everything: the thread list lost its scroll position, the search input lost
 * focus, and tab state had to be patched through a global store. Living in the
 * layout, this component mounts once — selecting a thread swaps only the
 * detail pane ({children}), and the list keeps its DOM, scroll, and focus.
 */
export function MessagesShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<{ outreachId?: string | string[] }>();
  const selectedThreadId =
    typeof params.outreachId === "string" ? params.outreachId : null;

  const { isOwnerOrAdmin } = useWorkspaceRole();
  const activeTab = useMessagesFilterStore((s) => s.activeTab);
  const setActiveTab = useMessagesFilterStore((s) => s.setActiveTab);
  const searchQuery = useMessagesFilterStore((s) => s.searchQuery);
  const setSearchQuery = useMessagesFilterStore((s) => s.setSearchQuery);

  const { data: threads = [], isLoading: isLoadingThreads } =
    useOutreachThreadsQuery();
  const { data: lostThreads = [], isLoading: isLoadingLost } =
    useLostThreadsQuery(isOwnerOrAdmin);

  const isLoading = isLoadingThreads || isLoadingLost;
  const showDetail = !!selectedThreadId;

  /*
   * Deep-linking into a lost thread reveals the Lost tab — but only once per
   * thread id. The ref guard (not state) plus the persistent layout mean a
   * user's manual switch back to "All" is never fought: this effect re-runs
   * only when the selected thread itself changes.
   */
  const autoSwitchedForId = useRef<string | null>(null);
  const isCurrentlyLost = selectedThreadId
    ? lostThreads.some((t) => t.id === selectedThreadId)
    : false;
  useEffect(() => {
    if (!selectedThreadId || !isCurrentlyLost) return;
    if (autoSwitchedForId.current === selectedThreadId) return;
    autoSwitchedForId.current = selectedThreadId;
    setActiveTab("lost");
  }, [selectedThreadId, isCurrentlyLost, setActiveTab]);

  const handleSelectThread = useCallback(
    (id: string) => {
      // scroll: false — keep the page (and thread list) exactly where it is.
      router.push(`/dashboard/messages/${id}`, { scroll: false });
    },
    [router],
  );

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
          {isOwnerOrAdmin && lostThreads.length > 0 && (
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
              showLostTab={isOwnerOrAdmin}
            />
          </div>
        </div>

        <div
          className={cn(
            "flex-1 min-w-0 flex flex-col",
            !showDetail ? "hidden lg:flex" : "flex",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
