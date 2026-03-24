"use client";

import { memo, useCallback, useMemo } from "react";
import { Mail, Phone, Bot, AlertCircle } from "lucide-react";
import { OutreachThread, getThreadChannels } from "@/types/outreach";
import { LeadStatus } from "@/types/lead";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const STATUS_BADGE: Record<string, string> = {
  [LeadStatus.HOT]: "bg-red-100 text-red-600 border-red-200",
  [LeadStatus.WARM]: "bg-yellow-100 text-yellow-700 border-yellow-200",
  [LeadStatus.COLD]: "bg-blue-100 text-blue-600 border-blue-200",
  [LeadStatus.CONVERTED]: "bg-green-100 text-green-700 border-green-200",
};

const STATUS_ACTIVE: Record<
  string,
  { wrapper: string; avatar: string; text: string }
> = {
  [LeadStatus.HOT]: {
    wrapper: "bg-red-50/70 ring-1 ring-red-200",
    avatar: "bg-red-100 text-red-600",
    text: "text-red-600",
  },
  [LeadStatus.WARM]: {
    wrapper: "bg-yellow-50/70 ring-1 ring-yellow-200",
    avatar: "bg-yellow-100 text-yellow-700",
    text: "text-yellow-700",
  },
  [LeadStatus.COLD]: {
    wrapper: "bg-blue-50/70 ring-1 ring-blue-200",
    avatar: "bg-blue-100 text-blue-600",
    text: "text-blue-600",
  },
  [LeadStatus.CONVERTED]: {
    wrapper: "bg-green-50/70 ring-1 ring-green-200",
    avatar: "bg-green-100 text-green-700",
    text: "text-green-700",
  },
};

const DEFAULT_ACTIVE = {
  wrapper: "bg-primary/5 ring-1 ring-primary/10",
  avatar: "bg-primary/10 text-primary",
  text: "text-primary",
};

interface ThreadListItemProps {
  thread: OutreachThread;
  isSelected: boolean;
  onSelectThread: (id: string) => void;
}

export const ThreadListItem = memo(function ThreadListItem({
  thread,
  isSelected,
  onSelectThread,
}: ThreadListItemProps) {
  const { hasEmail, hasPhone } = getThreadChannels(thread);

  const displayName = useMemo(() => {
    if (thread.lead) {
      const { name, firstName, lastName } = thread.lead;
      if (name?.trim()) return name;
      if (firstName?.trim() && lastName?.trim())
        return `${firstName} ${lastName}`;
      if (firstName?.trim()) return firstName;
    }
    return thread.leadEmail || thread.leadPhone || "Unknown";
  }, [thread.lead, thread.leadEmail, thread.leadPhone]);

  const handleClick = useCallback(
    () => onSelectThread(thread.id),
    [onSelectThread, thread.id],
  );

  const shortId = thread.id.slice(0, 8);
  const activeStyle =
    (thread.lead?.leadStatus && STATUS_ACTIVE[thread.lead.leadStatus]) ||
    DEFAULT_ACTIVE;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200",
        isSelected ? activeStyle.wrapper : "hover:bg-slate-50/50",
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold uppercase",
          isSelected ? activeStyle.avatar : "bg-slate-100 text-slate-400",
        )}
      >
        {displayName !== "Unknown"
          ? displayName.slice(0, 2).toUpperCase()
          : "?"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                "text-sm font-semibold truncate",
                isSelected ? activeStyle.text : "text-slate-700",
              )}
            >
              {displayName !== "Unknown" ? displayName : `Thread ${shortId}`}
            </span>
            {thread.lead?.leadStatus && (
              <span
                className={cn(
                  "shrink-0 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tight border",
                  STATUS_BADGE[thread.lead.leadStatus] ??
                    "bg-slate-100 text-slate-500 border-slate-200",
                )}
              >
                {thread.lead.leadStatus}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium shrink-0">
            {formatDistanceToNow(new Date(thread.updatedAt), {
              addSuffix: false,
            })}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {hasEmail && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-blue-50 text-blue-500">
              <Mail className="w-2.5 h-2.5" />
              Email
            </span>
          )}
          {hasPhone && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-violet-50 text-violet-500">
              <Phone className="w-2.5 h-2.5" />
              SMS
            </span>
          )}
          {thread.aiResponseEnabled && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-emerald-50 text-emerald-500">
              <Bot className="w-2.5 h-2.5" />
              AI
            </span>
          )}
          {thread.isUnmatched && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-rose-50 text-rose-500">
              <AlertCircle className="w-2.5 h-2.5" />
              Unmatched
            </span>
          )}
        </div>
      </div>
    </button>
  );
});
