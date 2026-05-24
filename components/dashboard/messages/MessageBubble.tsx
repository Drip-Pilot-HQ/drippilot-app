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
  const isLead = message.senderType === "lead";
  const isUser = message.senderType === "user";

  const bubbleColor = isSystem
    ? "bg-[#F6E7B0] text-slate-900 border border-[#DCCB82]"
    : isAi
      ? "bg-[#7C3AED] text-white"
      : isUser
        ? "bg-[#2563EB] text-white"
        : isLead
          ? "bg-white text-slate-900 border border-slate-200"
          : "bg-slate-100 text-slate-900 border border-slate-200";

  const avatarColor = isSystem
    ? "bg-[#F6E7B0]"
    : isAi
      ? "bg-violet-100"
      : isUser
        ? "bg-blue-100"
        : "bg-slate-100";

  const avatarIcon = isSystem ? (
    <Zap className="w-3.5 h-3.5 text-amber-600" />
  ) : isAi ? (
    <Bot className="w-3.5 h-3.5 text-violet-600" />
  ) : (
    <User
      className={cn("w-3.5 h-3.5", isUser ? "text-blue-600" : "text-slate-500")}
    />
  );

  const label = (
    <span
      className={cn(
        "text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1.5",
        isSystem
          ? "text-amber-600"
          : isAi
            ? "text-violet-400"
            : isUser
              ? "text-blue-300"
              : "text-slate-400",
      )}
    >
      {isSystem && <Zap className="w-2.5 h-2.5" />}
      {message.channel.toUpperCase()}
    </span>
  );

  if (isInbound) {
    return (
      <div className="flex items-end gap-2 justify-start">
        <div
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-1",
            avatarColor,
          )}
        >
          {avatarIcon}
        </div>
        <div className="max-w-[75%]">
          {message.subject && (
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 ml-1">
              {message.subject}
            </p>
          )}
          <div
            className={cn(
              "rounded-3xl px-4 py-3 shadow-sm",
              bubbleColor,
              isLead ? "rounded-tl-none" : "rounded-tl-3xl",
            )}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word font-medium">
              {message.body}
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-1 ml-1">
            {label}
            <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
            <p className="text-[10px] text-slate-400 font-medium">
              {format(new Date(message.createdAt), "h:mm a")}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            "rounded-3xl px-4 py-3 shadow-sm",
            bubbleColor,
            "rounded-br-none",
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
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2">
        {format(date, "MMMM d, yyyy")}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

interface MessageDateDividerProps {
  date: Date;
}
