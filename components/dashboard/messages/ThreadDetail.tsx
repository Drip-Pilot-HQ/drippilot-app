"use client";

import { useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  Bot,
  Trash2,
  ArrowLeft,
  MessageSquare,
  Loader2,
  PhoneCall,
} from "lucide-react";
import { OutreachThread, OutreachChannel } from "@/types/outreach";
import {
  useOutreachMessagesQuery,
  useSendReplyMutation,
  useToggleAiResponseMutation,
  useDeleteThreadMutation,
} from "@/store/server/outreach.queries";
import { MessageBubble, MessageDateDivider } from "./MessageBubble";
import { ReplyComposer } from "./ReplyComposer";
import { ThreadDetailSkeleton } from "./MessagesSkeleton";
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

  const isEmail = !!thread.leadEmail || !!thread.senderEmail;
  const identifier = thread.leadEmail || thread.leadPhone || "Unknown";
  const defaultChannel: OutreachChannel = isEmail ? "email" : "sms";

  // Auto-scroll to newest message
  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      description: `Are you sure you want to delete this message thread with ${identifier}? This cannot be undone.`,
      confirmLabel: "Delete Thread",
      variant: "danger",
    });
    if (confirmed) {
      await deleteMutation.mutateAsync(thread.id);
      onDeleted();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-white shrink-0">
        {/* Back button (mobile) */}
        <button
          onClick={onBack}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-black text-primary uppercase">
          {identifier !== "Unknown" ? identifier.slice(0, 2) : "?"}
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-slate-900 truncate">
              {identifier !== "Unknown"
                ? identifier
                : `Thread ${thread.id.slice(0, 8)}`}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider",
                isEmail
                  ? "bg-blue-50 text-blue-600"
                  : "bg-violet-50 text-violet-600",
              )}
            >
              {isEmail ? (
                <Mail className="w-2.5 h-2.5" />
              ) : (
                <Phone className="w-2.5 h-2.5" />
              )}
              {isEmail ? "Email" : "SMS"}
            </span>
            {thread.isUnmatched && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600">
                Unmatched
              </span>
            )}
          </div>
          {thread.campaignId && (
            <div className="flex items-center gap-1 mt-0.5">
              <PhoneCall className="w-2.5 h-2.5 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-medium">
                {formatNumber(thread.leadPhone || "")}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* AI toggle */}
          <button
            onClick={handleToggleAi}
            disabled={toggleAiMutation.isPending}
            title={
              thread.aiResponseEnabled
                ? "Disable AI replies"
                : "Enable AI replies"
            }
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all",
              thread.aiResponseEnabled
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200",
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

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            title="Delete thread"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4">
        {isLoading ? (
          <ThreadDetailSkeleton />
        ) : messages && messages.length > 0 ? (
          <div className="flex flex-col gap-3">
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
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-500">No messages yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Send the first reply below to start the conversation
            </p>
          </div>
        )}
      </div>

      {/* Reply composer */}
      <ReplyComposer
        defaultChannel={defaultChannel}
        hasEmail={!!thread.leadEmail || !!thread.senderEmail}
        hasPhone={!!thread.leadPhone || !!thread.senderPhone}
        isSending={sendMutation.isPending}
        onSend={handleSend}
      />
    </div>
  );
}

export function NoThreadSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
        <MessageSquare className="w-10 h-10 text-slate-200" />
      </div>
      <h3 className="text-lg font-black text-slate-800 mb-2">
        Select a conversation
      </h3>
      <p className="text-sm text-slate-400 font-medium max-w-xs">
        Choose a thread from the list to view messages and send replies
      </p>
    </div>
  );
}
