"use client";

import { Bot, User, Zap } from "lucide-react";
import { OutreachMessage } from "@/types/outreach";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: OutreachMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isInbound = message.direction === "inbound";
  const isAi = message.senderType === "ai";
  const isSystem = message.senderType === "system";

  if (isInbound) {
    return (
      <div className="flex items-end gap-2 justify-start">
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mb-1">
          <User className="w-3.5 h-3.5 text-slate-500" />
        </div>
        <div className="max-w-[72%]">
          {message.subject && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
              {message.subject}
            </p>
          )}
          <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap wrap-break-word">
              {message.body}
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-1 ml-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              {message.channel}
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
            <p className="text-[10px] text-slate-400">
              {format(new Date(message.createdAt), "h:mm a")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Outbound — user, AI, or system (drip)
  const bubbleColor = isSystem
    ? "bg-amber-500 text-white"
    : isAi
      ? "bg-violet-600 text-white"
      : "bg-primary text-white";

  const avatarColor = isSystem
    ? "bg-amber-100"
    : isAi
      ? "bg-violet-100"
      : "bg-primary/10";

  const avatarIcon = isSystem ? (
    <Zap className="w-3.5 h-3.5 text-amber-600" />
  ) : isAi ? (
    <Bot className="w-3.5 h-3.5 text-violet-600" />
  ) : (
    <User className="w-3.5 h-3.5 text-primary" />
  );

  const label = isSystem ? (
    <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest flex items-center gap-1.5">
      <Zap className="w-2.5 h-2.5" />
      Drip · {message.channel}
    </span>
  ) : isAi ? (
    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
      {message.channel}
    </span>
  ) : (
    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
      {message.channel}
    </span>
  );

  return (
    <div className="flex items-end gap-2 justify-end">
      <div className="max-w-[72%]">
        {message.subject && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 mr-1 text-right">
            {message.subject}
          </p>
        )}
        <div
          className={cn(
            "rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm",
            bubbleColor,
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
            {message.body}
          </p>
        </div>
        <div className="flex items-center justify-end gap-1.5 mt-1 mr-1">
          {label}
          <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
          <p className="text-[10px] text-slate-400">
            {format(new Date(message.createdAt), "h:mm a")}
          </p>
        </div>
      </div>
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1",
          avatarColor,
        )}
      >
        {avatarIcon}
      </div>
    </div>
  );
}

interface MessageDateDividerProps {
  date: Date;
}

export function MessageDateDivider({ date }: MessageDateDividerProps) {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {format(date, "MMMM d, yyyy")}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}
