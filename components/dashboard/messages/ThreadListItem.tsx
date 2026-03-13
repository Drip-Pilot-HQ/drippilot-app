"use client";

import { Mail, Phone, Bot, AlertCircle } from "lucide-react";
import { OutreachThread } from "@/types/outreach";
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
  const hasEmail = !!thread.leadEmail || !!thread.senderEmail;
  const hasPhone = !!thread.leadPhone || !!thread.senderPhone;
  const identifier = thread.leadEmail || thread.leadPhone || "Unknown";
  const shortId = thread.id.slice(0, 8);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200",
        isSelected
          ? "bg-primary/8 ring-1 ring-primary/20"
          : "hover:bg-slate-50",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-black uppercase",
          isSelected
            ? "bg-primary/15 text-primary"
            : "bg-slate-100 text-slate-500",
        )}
      >
        {identifier !== "Unknown" ? identifier.slice(0, 2).toUpperCase() : "?"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span
            className={cn(
              "text-sm font-bold truncate",
              isSelected ? "text-primary" : "text-slate-800",
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

        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Email badge */}
          {hasEmail && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600">
              <Mail className="w-2.5 h-2.5" />
              Email
            </span>
          )}

          {/* SMS badge */}
          {hasPhone && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-violet-50 text-violet-600">
              <Phone className="w-2.5 h-2.5" />
              SMS
            </span>
          )}

          {/* AI badge */}
          {thread.aiResponseEnabled && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600">
              <Bot className="w-2.5 h-2.5" />
              AI
            </span>
          )}

          {/* Unmatched badge */}
          {thread.isUnmatched && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600">
              <AlertCircle className="w-2.5 h-2.5" />
              Unmatched
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
