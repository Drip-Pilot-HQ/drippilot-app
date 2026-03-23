"use client";

import { Trash2, Check, ExternalLink, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AppNotification, LeadStatusValue } from "@/types/notification";
import { cn } from "@/lib/utils";
import {
  useMarkReadMutation,
  useDeleteNotificationMutation,
} from "@/store/server/notification.queries";

const STATUS_CONFIG: Record<
  LeadStatusValue,
  { label: string; dot: string; bg: string; text: string }
> = {
  hot: {
    label: "Hot 🔥",
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
  warm: {
    label: "Warm ☀️",
    dot: "bg-amber-400",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  cold: {
    label: "Cold ❄️",
    dot: "bg-sky-400",
    bg: "bg-sky-50",
    text: "text-sky-700",
  },
  converted: {
    label: "Converted ✓",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  unsubscribed: {
    label: "Unsubscribed",
    dot: "bg-slate-400",
    bg: "bg-slate-100",
    text: "text-slate-500",
  },
};

interface NotificationItemProps {
  notification: AppNotification;
}

export function NotificationItem({ notification: n }: NotificationItemProps) {
  const markRead = useMarkReadMutation();
  const deleteOne = useDeleteNotificationMutation();
  const threadUrl = n.outreachId
    ? `/dashboard/messages/${n.outreachId}`
    : n.messageUrl;

  const status = STATUS_CONFIG[n.leadStatus] ?? STATUS_CONFIG.cold;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 sm:gap-4 px-4 sm:px-6 py-4 transition-colors group",
        !n.isRead
          ? "bg-primary/2.5 hover:bg-primary/4"
          : "bg-transparent hover:bg-slate-50",
      )}
    >
      {/* Unread left-border indicator */}
      {!n.isRead && (
        <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-r-full" />
      )}

      {/* Avatar */}
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
          status.bg,
        )}
      >
        <User className={cn("w-4 h-4", status.text)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <span
            className={cn(
              "text-sm font-bold",
              !n.isRead ? "text-slate-900" : "text-slate-700",
            )}
          >
            {n.leadName || "Unknown Lead"}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black shrink-0",
              status.bg,
              status.text,
            )}
          >
            <span
              className={cn("w-1.5 h-1.5 rounded-full shrink-0", status.dot)}
            />
            {status.label}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Status changed in{" "}
          <span className="font-bold text-slate-600">{n.workspaceName}</span>
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[11px] text-slate-400 font-medium">
            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
          </span>
          {threadUrl && (
            <a
              href={threadUrl}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
            >
              View message
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Actions: always visible on mobile, hover on desktop */}
      <div className="flex items-center gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
        {!n.isRead && (
          <button
            onClick={() => markRead.mutate(n.id)}
            disabled={markRead.isPending}
            title="Mark as read"
            className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => deleteOne.mutate(n.id)}
          disabled={deleteOne.isPending}
          title="Delete"
          className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 active:scale-95 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
