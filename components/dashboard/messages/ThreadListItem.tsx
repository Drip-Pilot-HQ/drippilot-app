"use client";

import { Mail, Phone, Bot, AlertCircle } from "lucide-react";
import { OutreachThread, getThreadChannels } from "@/types/outreach";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ThreadListItemProps {
  thread: OutreachThread;
  isSelected: boolean;
  onClick: () => void;
}

export function ThreadListItem({
  thread,
  isSelected,
  onClick,
}: ThreadListItemProps) {
  const { hasEmail, hasPhone } = getThreadChannels(thread);
  const identifier = thread.leadEmail || thread.leadPhone || "Unknown";
  const shortId = thread.id.slice(0, 8);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200",
        isSelected
          ? "bg-primary/5 ring-1 ring-primary/10"
          : "hover:bg-slate-50/50",
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold uppercase",
          isSelected
            ? "bg-primary/10 text-primary"
            : "bg-slate-100 text-slate-400",
        )}
      >
        {identifier !== "Unknown" ? identifier.slice(0, 2).toUpperCase() : "?"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span
            className={cn(
              "text-sm font-semibold truncate",
              isSelected ? "text-primary" : "text-slate-700",
            )}
          >
            {identifier !== "Unknown" ? identifier : `Thread ${shortId}`}
          </span>
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
}
