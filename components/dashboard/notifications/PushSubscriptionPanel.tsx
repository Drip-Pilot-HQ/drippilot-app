"use client";

import {
  Bell,
  BellOff,
  Loader2,
  Send,
  AlertTriangle,
  Info,
} from "lucide-react";
import { usePushSubscription } from "@/lib/push/usePushSubscription";
import { useSendTestPushMutation } from "@/store/server/notification.queries";
import { useAccountStore } from "@/store/client/useAccountStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PushSubscriptionPanelProps {
  pushEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function PushSubscriptionPanel({
  pushEnabled,
  onToggle,
}: PushSubscriptionPanelProps) {
  const {
    status,
    isSubscribed,
    isUnsupported,
    isDenied,
    isBusy,
    subscribe,
    unsubscribe,
  } = usePushSubscription();
  const testMutation = useSendTestPushMutation();
  const workspaceName = useAccountStore((s) => s.activeWorkspace?.name);

  const handleToggle = async () => {
    if (isSubscribed || pushEnabled) {
      await unsubscribe();
      onToggle(false);
    } else {
      await subscribe();
      if (status !== "denied") onToggle(true);
    }
  };

  const handleTest = async () => {
    try {
      const result = await testMutation.mutateAsync();
      toast.success(`Test sent! ${result.sent} device(s) notified.`);
    } catch {
      toast.error("Test push failed");
    }
  };

  if (isUnsupported) {
    return (
      <div className="flex items-start gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-slate-700">
            Not supported in this browser
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Try Chrome, Firefox, or Edge to use push notifications.
          </p>
        </div>
      </div>
    );
  }

  if (isDenied) {
    return (
      <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-800">Permission blocked</p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">
            Enable notifications in your browser settings (lock icon in address
            bar), then refresh.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toggle row */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              isSubscribed
                ? "bg-primary/10 text-primary"
                : "bg-white text-slate-400 border border-slate-200",
            )}
          >
            {isBusy ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isSubscribed ? (
              <Bell className="w-3.5 h-3.5" />
            ) : (
              <BellOff className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800">
              {isBusy
                ? isSubscribed
                  ? "Disabling…"
                  : "Enabling…"
                : isSubscribed
                  ? "Push active"
                  : "Push disabled"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              {isSubscribed
                ? `This browser · ${workspaceName}`
                : "Click to enable for this browser"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={isBusy || status === "checking"}
          aria-checked={isSubscribed}
          role="switch"
          className={cn(
            "relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 disabled:opacity-50 shrink-0 ml-3",
            isSubscribed ? "bg-primary" : "bg-slate-200",
          )}
        >
          <span
            className={cn(
              "absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform will-change-transform",
              isSubscribed ? "translate-x-5" : "translate-x-0",
            )}
          />
        </button>
      </div>

      {/* Test button */}
      {isSubscribed && (
        <button
          type="button"
          onClick={handleTest}
          disabled={testMutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          {testMutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          Send test notification
        </button>
      )}

      {/* Info */}
      <div className="flex items-start gap-2 px-3 py-2.5 bg-primary/5 border border-primary/10 rounded-xl">
        <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
          Subscriptions are <strong>workspace-scoped</strong>. Switching
          workspaces doesn&apos;t cancel other subscriptions.
        </p>
      </div>
    </div>
  );
}
