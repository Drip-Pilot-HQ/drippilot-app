"use client";

import { useEffect, useState } from "react";
import {
  MessageCircle,
  Building2,
  Mail,
  User,
  RefreshCw,
  Inbox,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/branding/Button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/client/useAuthStore";
import {
  useAccountStore,
  selectActiveWorkspace,
} from "@/store/client/useAccountStore";

export function CrispChatPanel() {
  const { user } = useAuthStore();
  const activeWorkspace = useAccountStore(selectActiveWorkspace);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
  const name =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    if (!window.$crisp) return;

    window.$crisp.push(["on", "chat:opened", () => setIsChatOpen(true)]);
    window.$crisp.push(["on", "chat:closed", () => setIsChatOpen(false)]);
    window.$crisp.push(["do", "chat:show"]);
    window.$crisp.push(["do", "chat:open"]);

    return () => {
      window.$crisp.push(["off", "chat:opened"]);
      window.$crisp.push(["off", "chat:closed"]);
      window.$crisp.push(["do", "chat:close"]);
      window.$crisp.push(["do", "chat:hide"]);
    };
  }, []);

  const reopenChat = () => {
    window.$crisp?.push(["do", "chat:show"]);
    window.$crisp?.push(["do", "chat:open"]);
  };

  if (!websiteId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-6 text-center bg-white border border-slate-100 rounded-[28px] shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-5">
          <MessageCircle className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-1">
          Chat unavailable
        </h3>
        <p className="text-slate-500 font-medium text-sm max-w-xs">
          Live chat is not configured yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status row */}
      <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <span
                className={cn(
                  "absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white",
                  isChatOpen ? "bg-emerald-500" : "bg-slate-300",
                )}
              />
            </div>
            <div>
              <p className="text-base font-black text-slate-900">
                {isChatOpen ? "Chat is open" : "Start a conversation"}
              </p>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                {isChatOpen
                  ? "See the chat bubble at the bottom-right of your screen"
                  : "Our team typically replies within a few hours"}
              </p>
            </div>
          </div>

          {isChatOpen ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                Live
              </span>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={reopenChat}
              className="rounded-xl shadow-md shadow-primary/10 w-full sm:w-auto"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Reopen Chat
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Identity card */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Chatting as
            </p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Shared with support automatically
            </p>
          </div>

          <div className="space-y-2.5">
            <IdentityRow icon={User} label="Name" value={name} />
            <IdentityRow icon={Mail} label="Email" value={user?.email ?? "—"} />
            <IdentityRow
              icon={Building2}
              label="Workspace"
              value={activeWorkspace?.name ?? "—"}
            />
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <p className="text-[11px] text-slate-400 font-medium">
              Identity verified via your account
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm flex flex-col gap-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            How it works
          </p>

          <div className="space-y-0">
            <Step
              number="1"
              icon={MessageCircle}
              title="Chat opens automatically"
              description="The chat window opens at the bottom-right corner as soon as you land on this tab."
              isLast={false}
            />
            <Step
              number="2"
              icon={Inbox}
              title="Browse past conversations"
              description="Tap the home icon inside the chat to see your full support history."
              isLast={false}
            />
            <Step
              number="3"
              icon={Clock}
              title="Get notified by email"
              description="If you close the page before we reply, you'll receive our response by email."
              isLast
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function IdentityRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          {label}
        </p>
        <p className="text-xs font-bold text-slate-800 truncate mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}

function Step({
  number,
  icon: Icon,
  title,
  description,
  isLast,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-8 h-8 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-black text-primary">{number}</span>
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-100 my-1.5" />}
      </div>
      <div className={cn("min-w-0", isLast ? "pb-0" : "pb-5")}>
        <div className="flex items-center gap-2 mb-1 h-8">
          <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <p className="text-sm font-black text-slate-800">{title}</p>
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
