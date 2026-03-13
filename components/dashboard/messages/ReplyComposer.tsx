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
    <div className="px-4 py-2 border-t border-slate-100 bg-white">
      {/* Channel selector — only show if thread has both */}
      {hasEmail && hasPhone && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Send via
          </span>
          <button
            onClick={() => setChannel("email")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
              channel === "email"
                ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                : "text-slate-500 hover:bg-slate-100",
            )}
          >
            <Mail className="w-3 h-3" />
            Email
          </button>
          <button
            onClick={() => setChannel("sms")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
              channel === "sms"
                ? "bg-violet-50 text-violet-600 ring-1 ring-violet-200"
                : "text-slate-500 hover:bg-slate-100",
            )}
          >
            <Phone className="w-3 h-3" />
            SMS
          </button>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isSms ? "Type a message…" : "Type a reply…"}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium leading-relaxed"
      />

      {/* SMS credit info bar */}
      {isSms && charCount > 0 && (
        <div
          className={cn(
            "flex items-start gap-2 mt-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
            isMultiSegment
              ? "bg-amber-50 border border-amber-100 text-amber-700"
              : "bg-slate-50 border border-slate-100 text-slate-500",
          )}
        >
          <Info
            className={cn(
              "w-3.5 h-3.5 shrink-0 mt-px",
              isMultiSegment ? "text-amber-500" : "text-slate-400",
            )}
          />
          <span>
            {isMultiSegment ? (
              <>
                This message spans <strong>{credits} segments</strong> (
                {charCount} chars) and will cost{" "}
                <strong>{credits} credits</strong> to send.{" "}
                <span className="opacity-70">
                  {segmentRemaining} chars left before adding another credit.
                </span>
              </>
            ) : (
              <>
                This message will cost <strong>1 credit</strong> to send.{" "}
                <span className="opacity-70">
                  {segmentRemaining} chars remaining in this segment.
                </span>
              </>
            )}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {isSms && charCount > 0 && (
            <span className="text-[10px] font-bold text-slate-400">
              {charCount} chars · {credits}{" "}
              {credits === 1 ? "credit" : "credits"}
            </span>
          )}
          <span className="text-[10px] text-slate-400 hidden sm:block">
            ⌘+Enter to send
          </span>
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold transition-all",
            canSend
              ? "bg-primary text-white shadow-md shadow-primary/20 hover:brightness-110 cursor-pointer"
              : "bg-slate-100 text-slate-400 cursor-not-allowed",
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
