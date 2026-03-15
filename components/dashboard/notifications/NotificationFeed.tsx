"use client";

import { useState } from "react";
import { Bell, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  useNotificationsQuery,
  useDeleteAllNotificationsMutation,
} from "@/store/server/notification.queries";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import { NotificationItem } from "./NotificationItem";
import { NotificationFeedSkeleton } from "./NotificationSkeleton";

export function NotificationFeed() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotificationsQuery(page);
  const deleteAll = useDeleteAllNotificationsMutation();
  const confirm = useConfirm();
  const PAGE_SIZE = 20;

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;
  const unreadItems = data?.data.filter((n) => !n.isRead) ?? [];
  const unreadCount = unreadItems.length;

  const handleClearAll = async () => {
    if (!data?.data.length) return;
    const ok = await confirm({
      title: "Clear all notifications",
      description:
        "This will permanently delete all notifications in this workspace.",
      confirmLabel: "Clear All",
      variant: "danger",
    });
    if (ok) {
      await deleteAll.mutateAsync();
      setPage(1);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            Activity Feed
          </h3>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-primary text-white text-[10px] font-black rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClearAll}
            disabled={deleteAll.isPending || !data?.data.length}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            {deleteAll.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Clear all</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <NotificationFeedSkeleton />
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Bell className="w-7 h-7 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-700">
                No notifications yet
              </p>
              <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs leading-relaxed">
                You&apos;ll see lead status changes here once notifications are
                configured and leads start arriving.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.data.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/70">
          <p className="text-xs text-slate-500 font-medium">
            Page {page} of {totalPages}
            <span className="hidden sm:inline">
              {" "}
              · {data?.total ?? 0} total
            </span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-600 px-1">
              {page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
