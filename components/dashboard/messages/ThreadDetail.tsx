"use client";

import { useEffect, useRef, useMemo } from "react";
import {
  Mail,
  Phone,
  Bot,
  Trash2,
  ArrowLeft,
  MessageSquare,
  Loader2,
  PhoneCall,
  Megaphone,
} from "lucide-react";
import {
  OutreachThread,
  OutreachChannel,
  getThreadChannels,
} from "@/types/outreach";
import {
  useOutreachMessagesQuery,
  useSendReplyMutation,
  useToggleAiResponseMutation,
  useDeleteThreadMutation,
} from "@/store/server/outreach.queries";
import { MessageBubble, MessageDateDivider } from "./MessageBubble";
import { ReplyComposer } from "./ReplyComposer";
import { ThreadDetailSkeleton } from "./MessagesSkeleton";
import { STATUS_BADGE } from "./ThreadListItem";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { formatNumber } from "@/lib/utils/format-number";

interface ThreadDetailProps {
  thread: OutreachThread;
  onBack: () => void;
  onDeleted: () => void;
}

export function ThreadDetail({ thread, onBack, onDeleted }: ThreadDetailProps) {
  const confirm = useConfirm();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useOutreachMessagesQuery(thread.id);
  const sendMutation = useSendReplyMutation(thread.id);
  const toggleAiMutation = useToggleAiResponseMutation();
  const deleteMutation = useDeleteThreadMutation();

  const { hasEmail, hasPhone, isEmailThread, defaultChannel } =
    getThreadChannels(thread);

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

  const isInitialScroll = useRef(true);
  useEffect(() => {
    if (messages && messages.length > 0) {
      const behavior = isInitialScroll.current ? "instant" : "smooth";
      isInitialScroll.current = false;
      messagesEndRef.current?.scrollIntoView({
        behavior,
      } as ScrollIntoViewOptions);
    }
  }, [messages]);

  const handleSend = (channel: OutreachChannel, body: string) => {
    sendMutation.mutate({ channel, body });
  };

  const handleToggleAi = async () => {
    await toggleAiMutation.mutateAsync({
      outreachId: thread.id,
      dto: { enabled: !thread.aiResponseEnabled },
    });
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Thread",
      description: `Are you sure you want to delete this message thread with ${displayName}? This cannot be undone.`,
      confirmLabel: "Delete Thread",
      variant: "danger",
    });
    if (confirmed) {
      await deleteMutation.mutateAsync(thread.id);
      onDeleted();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 shrink-0">
        <button
          onClick={onBack}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 text-xs font-semibold text-primary uppercase">
          {displayName !== "Unknown" ? displayName.slice(0, 2) : "?"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-sm font-semibold text-slate-900 truncate">
              {displayName !== "Unknown"
                ? displayName
                : `Thread ${thread.id.slice(0, 8)}`}
            </span>
            {thread.lead?.leadStatus && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tight border",
                  STATUS_BADGE[thread.lead.leadStatus] ??
                    "bg-slate-100 text-slate-500 border-slate-200",
                )}
              >
                {thread.lead.leadStatus}
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase",
                isEmailThread
                  ? "bg-blue-50 text-blue-500"
                  : "bg-violet-50 text-violet-500",
              )}
            >
              {isEmailThread ? (
                <Mail className="w-2.5 h-2.5" />
              ) : (
                <Phone className="w-2.5 h-2.5" />
              )}
              {isEmailThread ? "Email" : "SMS"}
            </span>
            {thread.isUnmatched && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-rose-50 text-rose-500">
                Unmatched
              </span>
            )}
          </div>
          {(thread.campaignName || thread.leadPhone) && (
            <div className="flex items-center gap-3 mt-0.5 min-w-0">
              {thread.campaignName && (
                <div className="flex items-center gap-1 min-w-0">
                  <Megaphone className="w-2.5 h-2.5 text-slate-300 shrink-0" />
                  <span className="text-[10px] text-slate-400 font-medium truncate">
                    {thread.campaignName}
                  </span>
                </div>
              )}
              {thread.leadPhone && (
                <div className="flex items-center gap-1 shrink-0">
                  <PhoneCall className="w-2.5 h-2.5 text-slate-300" />
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatNumber(thread.leadPhone)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleAi}
            disabled={toggleAiMutation.isPending}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
              thread.aiResponseEnabled
                ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100",
            )}
          >
            {toggleAiMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bot className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              AI {thread.aiResponseEnabled ? "On" : "Off"}
            </span>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-5">
        {isLoading ? (
          <ThreadDetailSkeleton />
        ) : messages && messages.length > 0 ? (
          <div className="flex flex-col gap-4">
            {messages.map((msg, idx) => {
              const showDivider =
                idx === 0 ||
                !isSameDay(
                  new Date(messages[idx - 1].createdAt),
                  new Date(msg.createdAt),
                );
              return (
                <div key={msg.id}>
                  {showDivider && (
                    <MessageDateDivider date={new Date(msg.createdAt)} />
                  )}
                  <MessageBubble message={msg} />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50/50 flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-slate-200" />
            </div>
            <p className="text-sm font-semibold text-slate-400">
              No messages yet
            </p>
          </div>
        )}
      </div>

      <ReplyComposer
        defaultChannel={defaultChannel}
        hasEmail={hasEmail}
        hasPhone={hasPhone}
        isSending={sendMutation.isPending}
        onSend={handleSend}
      />
    </div>
  );
}

export function NoThreadSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-slate-50/20">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-5">
        <MessageSquare className="w-8 h-8 text-slate-200" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1.5">
        Select a conversation
      </h3>
      <p className="text-sm text-slate-400 font-medium max-w-xs">
        Choose a thread from the list to view messages and send replies
      </p>
    </div>
  );
}
