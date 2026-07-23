"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import {
  useOutreachThreadsQuery,
  useLostThreadsQuery,
} from "@/store/server/outreach.queries";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { lostThreadToOutreach } from "@/types/outreach";
import { ThreadDetail } from "./ThreadDetail";
import { ThreadDetailSkeleton } from "./MessagesSkeleton";

/*
 * Resolves the thread for /dashboard/messages/[outreachId] from the cached
 * thread queries (shared with the shell's list — no extra fetch) and renders
 * the conversation pane. Shows a skeleton on first load and a friendly
 * not-found state for stale deep links.
 */
export function ThreadDetailRoute({ outreachId }: { outreachId: string }) {
  const router = useRouter();
  const { isOwnerOrAdmin } = useWorkspaceRole();

  const { data: threads = [], isLoading: isLoadingThreads } =
    useOutreachThreadsQuery();
  const { data: lostThreads = [], isLoading: isLoadingLost } =
    useLostThreadsQuery(isOwnerOrAdmin);

  const thread = useMemo(() => {
    const found = threads.find((t) => t.id === outreachId);
    if (found) return found;
    const lost = lostThreads.find((t) => t.id === outreachId);
    return lost ? lostThreadToOutreach(lost) : null;
  }, [outreachId, threads, lostThreads]);

  const goToList = useCallback(
    () => router.push("/dashboard/messages", { scroll: false }),
    [router],
  );

  if (!thread) {
    if (isLoadingThreads || isLoadingLost) {
      return (
        <div className="flex-1 px-5 py-5">
          <ThreadDetailSkeleton />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-slate-50/20">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-5">
          <MessageSquare className="w-8 h-8 text-slate-200" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1.5">
          Conversation not found
        </h3>
        <p className="text-sm text-slate-400 font-medium max-w-xs mb-4">
          This thread may have been deleted or you no longer have access to it
        </p>
        <button
          onClick={goToList}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          Back to conversations
        </button>
      </div>
    );
  }

  return (
    <ThreadDetail
      key={thread.id}
      thread={thread}
      onBack={goToList}
      onDeleted={goToList}
    />
  );
}
