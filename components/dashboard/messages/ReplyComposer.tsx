"use client";

import { useState } from "react";
import { Send, Mail, Phone, Loader2, Info } from "lucide-react";
import { OutreachChannel } from "@/types/outreach";
import { cn } from "@/lib/utils";

const SMS_SEGMENT = 160;

function getSmsCredits(length: number): number {
  if (length === 0) return 1;
  return Math.ceil(length / SMS_SEGMENT);
}

interface ReplyComposerProps {
  defaultChannel: OutreachChannel;
  hasEmail: boolean;
  hasPhone: boolean;
  isSending: boolean;
  onSend: (channel: OutreachChannel, body: string) => void;
}

export function ReplyComposer({
  defaultChannel,
  hasEmail,
  hasPhone,
  isSending,
  onSend,
}: ReplyComposerProps) {
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<OutreachChannel>(defaultChannel);

  const isSms = channel === "sms";
  const charCount = body.length;
  const credits = getSmsCredits(charCount);
  const segmentUsed =
    charCount % SMS_SEGMENT === 0 && charCount > 0
      ? SMS_SEGMENT
      : charCount % SMS_SEGMENT;
  const segmentRemaining = SMS_SEGMENT - segmentUsed;
  const isMultiSegment = credits > 1;

  const canSend = body.trim().length > 0 && !isSending;

  const handleSend = () => {
    if (!canSend) return;
    onSend(channel, body.trim());
    setBody("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-5 py-3 border-t border-slate-100 bg-white">
      {hasEmail && hasPhone && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mr-1">
            Send via
          </span>
          <button
            onClick={() => setChannel("email")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border",
              channel === "email"
                ? "bg-blue-50 text-blue-500 border-blue-100"
                : "bg-white border-transparent text-slate-400 hover:text-slate-600",
            )}
          >
            <Mail className="w-3 h-3" />
            Email
          </button>
          <button
            onClick={() => setChannel("sms")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border",
              channel === "sms"
                ? "bg-violet-50 text-violet-500 border-violet-100"
                : "bg-white border-transparent text-slate-400 hover:text-slate-600",
            )}
          >
            <Phone className="w-3 h-3" />
            SMS
          </button>
        </div>
      )}

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isSms ? "Type a message…" : "Type a reply…"}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium leading-relaxed"
      />

      {isSms && charCount > 0 && (
        <div
          className={cn(
            "flex items-start gap-2 mt-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors",
            isMultiSegment
              ? "bg-amber-50/50 text-amber-600"
              : "bg-slate-50/50 text-slate-400",
          )}
        >
          <Info
            className={cn(
              "w-3.5 h-3.5 shrink-0 mt-px",
              isMultiSegment ? "text-amber-400" : "text-slate-300",
            )}
          />
          <span>
            {isMultiSegment ? (
              <>
                Spans{" "}
                <span className="font-semibold text-amber-700">
                  {credits} segments
                </span>{" "}
                ({charCount} chars). Costs{" "}
                <span className="font-semibold text-amber-700">
                  {credits} credits
                </span>
                .
              </>
            ) : (
              <>
                Costs{" "}
                <span className="font-semibold text-slate-600">1 credit</span>{" "}
                to send.{" "}
                <span className="opacity-70">
                  {segmentRemaining} chars left in segment.
                </span>
              </>
            )}
          </span>
        </div>
      )}

      {!isSms && charCount > 0 && (
        <div className="flex items-start gap-2 mt-2 px-3 py-2 rounded-lg text-[11px] font-medium bg-slate-50/50 text-slate-400">
          <Info className="w-3.5 h-3.5 shrink-0 mt-px text-slate-300" />
          <span>
            Costs{" "}
            <span className="font-semibold text-slate-600">0.2 credits</span> to
            send, regardless of length.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mt-2.5">
        <div className="flex items-center gap-3">
          {isSms && charCount > 0 && (
            <span className="text-[10px] font-semibold text-slate-300">
              {charCount} chars · {credits}{" "}
              {credits === 1 ? "credit" : "credits"}
            </span>
          )}
          <span className="text-[10px] text-slate-300 hidden sm:block font-medium">
            ⌘+Enter to send
          </span>
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all",
            canSend
              ? "bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] cursor-pointer"
              : "bg-slate-100 text-slate-300 cursor-not-allowed",
          )}
        >
          {isSending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          Send
        </button>
      </div>
    </div>
  );
}
