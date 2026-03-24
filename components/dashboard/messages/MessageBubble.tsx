"use client";

import { memo } from "react";
import { Bot, User, Zap } from "lucide-react";
import { OutreachMessage } from "@/types/outreach";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: OutreachMessage;
}

export const MessageBubble = memo(function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isInbound = message.direction === "inbound";
  const isAi = message.senderType === "ai";
  const isSystem = message.senderType === "system";

  if (isInbound) {
    return (
      <div className="flex items-end gap-2 justify-start">
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mb-1">
          <User className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="max-w-[75%]">
          {message.subject && (
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 ml-1">
              {message.subject}
            </p>
          )}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap wrap-break-word font-medium">
              {message.body}
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-1 ml-1">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              {message.channel}
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
            <p className="text-[10px] text-slate-400 font-medium">
              {format(new Date(message.createdAt), "h:mm a")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const bubbleColor = isSystem
    ? "bg-amber-100 text-amber-900"
    : isAi
      ? "bg-violet-100 text-violet-900"
      : "bg-orange-100 text-orange-900";

  const avatarColor = isSystem
    ? "bg-amber-50"
    : isAi
      ? "bg-violet-50"
      : "bg-orange-50";

  const avatarIcon = isSystem ? (
    <Zap className="w-3.5 h-3.5 text-amber-500" />
  ) : isAi ? (
    <Bot className="w-3.5 h-3.5 text-violet-500" />
  ) : (
    <User className="w-3.5 h-3.5 text-orange-400" />
  );

  const label = isSystem ? (
    <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
      <Zap className="w-2.5 h-2.5" />
      Drip · {message.channel}
    </span>
  ) : (
    <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
      {message.channel}
    </span>
  );

  return (
    <div className="flex items-end gap-2 justify-end">
      <div className="max-w-[75%]">
        {message.subject && (
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 mr-1 text-right">
            {message.subject}
          </p>
        )}
        <div
          className={cn(
            "rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm",
            bubbleColor,
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word font-medium">
            {message.body}
          </p>
        </div>
        <div className="flex items-center justify-end gap-1.5 mt-1 mr-1">
          {label}
          <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
          <p className="text-[10px] text-slate-400 font-medium">
            {format(new Date(message.createdAt), "h:mm a")}
          </p>
        </div>
      </div>
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-1",
          avatarColor,
        )}
      >
        {avatarIcon}
      </div>
    </div>
  );
});

export function MessageDateDivider({ date }: MessageDateDividerProps) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-slate-50" />
      <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest px-2">
        {format(date, "MMMM d, yyyy")}
      </span>
      <div className="flex-1 h-px bg-slate-50" />
    </div>
  );
}

interface MessageDateDividerProps {
  date: Date;
}
